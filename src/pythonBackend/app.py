
from fastapi import FastAPI, UploadFile, File, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import os
import librosa
import numpy as np
from typing import Optional
import uuid
from datetime import datetime
import requests
import io

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # For development; restrict in production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class UrlRequest(BaseModel):
    url: str

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

@app.post("/analyze")
async def analyze_audio(file: UploadFile = File(...)):
    try:
        # Save uploaded file temporarily
        file_location = f"/tmp/{file.filename}"
        with open(file_location, "wb") as f:
            f.write(await file.read())
        
        # Analyze using librosa
        analysis = analyze_audio_file(file_location)
        
        # Clean up
        os.remove(file_location)
        
        return analysis
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing audio: {str(e)}")

@app.post("/analyze-url")
async def analyze_audio_from_url(request: UrlRequest):
    try:
        # Download file from URL
        response = requests.get(request.url, stream=True)
        response.raise_for_status()
        
        # Extract filename from URL or use a default name
        filename = request.url.split('/')[-1].split('?')[0]
        if not filename:
            filename = f"audio_from_url_{uuid.uuid4()}"
        
        # Save downloaded file temporarily
        file_location = f"/tmp/{filename}"
        with open(file_location, "wb") as f:
            for chunk in response.iter_content(chunk_size=8192):
                f.write(chunk)
        
        # Analyze using librosa
        analysis = analyze_audio_file(file_location)
        analysis["filename"] = filename
        
        # Clean up
        os.remove(file_location)
        
        return analysis
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Error analyzing audio from URL: {str(e)}")

def analyze_audio_file(file_path):
    # Load the audio file
    y, sr = librosa.load(file_path)
    
    # Extract BPM
    onset_env = librosa.onset.onset_strength(y=y, sr=sr)
    tempo = librosa.beat.tempo(onset_envelope=onset_env, sr=sr)[0]
    
    # Key extraction
    chroma = librosa.feature.chroma_cqt(y=y, sr=sr)
    key_features = np.mean(chroma, axis=1)
    key_index = np.argmax(key_features)
    keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
    key = keys[key_index]
    
    # Determine if it's major or minor
    y_harmonic = librosa.effects.harmonic(y)
    tonnetz = librosa.feature.tonnetz(y=y_harmonic, sr=sr)
    tonnetz_mean = np.mean(tonnetz, axis=1)
    
    # Basic heuristic for major/minor
    is_minor = tonnetz_mean[0] < 0
    scale = "Minor" if is_minor else "Major"
    
    # Extract rhythm features
    # This is a simplified approach
    percussive = librosa.effects.percussive(y)
    onset_env = librosa.onset.onset_strength(y=percussive, sr=sr)
    rhythm_patterns = ['Four on the floor', 'Syncopated', 'Trap', 'Breakbeat', 'Hip hop', 'Swing']
    rhythm = rhythm_patterns[int(np.sum(onset_env) % len(rhythm_patterns))]
    
    # Extract mood
    # Using simplified approach based on tempo and spectral features
    spectral_contrast = librosa.feature.spectral_contrast(y=y, sr=sr)
    contrast_mean = np.mean(spectral_contrast)
    
    moods = ['Melancholic', 'Upbeat', 'Dramatic', 'Chill', 'Energetic', 'Dreamy', 'Nostalgic', 'Aggressive']
    mood_index = int((tempo / 200 * 4 + contrast_mean * 4) % len(moods))
    mood = moods[mood_index]
    
    filename = os.path.basename(file_path)
    
    return {
        "id": str(uuid.uuid4()),
        "filename": filename,
        "key": key,
        "scale": scale,
        "bpm": round(tempo),
        "rhythm": rhythm,
        "mood": mood,
        "created_at": datetime.now().isoformat(),
    }

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
