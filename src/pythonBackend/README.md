
# Python Backend for Audio Muse Generator

This folder contains instructions for setting up the Python backend for audio analysis. In a production environment, you would need to set up a separate server running this code.

## Required Dependencies

```bash
pip install fastapi uvicorn python-multipart numpy librosa soundfile
```

## Example FastAPI Backend

Create a file named `main.py` with the following content:

```python
from fastapi import FastAPI, File, UploadFile, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import librosa
import numpy as np
import soundfile as sf
import tempfile
import os
import json

app = FastAPI()

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, replace with your frontend URL
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

def detect_key(y, sr):
    # Use librosa to detect key
    chroma = librosa.feature.chroma_cqt(y=y, sr=sr)
    key_corrs = []
    
    # Major and minor keys
    keys = ['C', 'C#', 'D', 'D#', 'E', 'F', 'F#', 'G', 'G#', 'A', 'A#', 'B']
    
    # Simplified key detection - in a real app this would be more sophisticated
    chroma_sum = np.sum(chroma, axis=1)
    key_index = np.argmax(chroma_sum)
    
    return keys[key_index]

def detect_scale(y, sr):
    # Simplified scale detection - in a real app this would be more sophisticated
    # This is just an example and not accurate
    
    # Extract chroma features
    chroma = librosa.feature.chroma_cqt(y=y, sr=sr)
    
    # Major scale pattern: [1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1]
    # Minor scale pattern: [1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0]
    
    # Calculate the average chroma values
    avg_chroma = np.mean(chroma, axis=1)
    
    # Normalize
    avg_chroma = avg_chroma / np.sum(avg_chroma)
    
    # Create simplified major and minor patterns
    major_pattern = np.array([1, 0, 1, 0, 1, 1, 0, 1, 0, 1, 0, 1], dtype=float)
    minor_pattern = np.array([1, 0, 1, 1, 0, 1, 0, 1, 1, 0, 1, 0], dtype=float)
    
    # Normalize patterns
    major_pattern = major_pattern / np.sum(major_pattern)
    minor_pattern = minor_pattern / np.sum(minor_pattern)
    
    # Calculate correlations with each pattern
    major_corr = np.correlate(avg_chroma, major_pattern)
    minor_corr = np.correlate(avg_chroma, minor_pattern)
    
    return "Major" if major_corr > minor_corr else "Minor"

def detect_rhythm(y, sr):
    # Simplified rhythm detection
    tempo, _ = librosa.beat.beat_track(y=y, sr=sr)
    
    # Onset detection
    onset_env = librosa.onset.onset_strength(y=y, sr=sr)
    onset_frames = librosa.onset.onset_detect(onset_envelope=onset_env, sr=sr)
    
    # Calculate rhythm pattern
    if len(onset_frames) > 0:
        onset_times = librosa.frames_to_time(onset_frames, sr=sr)
        if len(onset_times) >= 4:
            # Check for simple patterns
            diffs = np.diff(onset_times[:8] if len(onset_times) > 8 else onset_times)
            std_diff = np.std(diffs)
            
            if std_diff < 0.01:
                return "Steady rhythm"
            elif tempo < 100:
                return "Slow and steady"
            elif tempo > 160:
                return "Fast-paced"
            else:
                return "Moderate tempo with varied patterns"
        else:
            return "Minimal rhythmic elements"
    else:
        return "No clear rhythmic pattern detected"

def detect_mood(y, sr, tempo):
    # Extract features for mood detection
    spectral_centroid = librosa.feature.spectral_centroid(y=y, sr=sr).mean()
    spectral_rolloff = librosa.feature.spectral_rolloff(y=y, sr=sr).mean()
    mfccs = librosa.feature.mfcc(y=y, sr=sr)
    mfcc_mean = np.mean(mfccs)
    
    # Simple mood classification based on tempo and spectral features
    # This is a very simplified approach - real mood detection is much more complex
    
    if tempo < 80:
        if spectral_centroid < 2000:
            return "Melancholic"
        else:
            return "Calm"
    elif 80 <= tempo < 120:
        if spectral_rolloff > 5000:
            return "Upbeat"
        else:
            return "Thoughtful"
    else:  # tempo >= 120
        if spectral_centroid > 4000:
            return "Energetic"
        else:
            return "Dramatic"

@app.post("/analyze")
async def analyze_audio(file: UploadFile = File(...)):
    # Check if file is an audio file
    if not file.filename.endswith(('.mp3', '.wav', '.ogg', '.flac', '.m4a')):
        raise HTTPException(400, detail="File must be an audio file")
    
    # Save the uploaded file temporarily
    with tempfile.NamedTemporaryFile(delete=False, suffix=os.path.splitext(file.filename)[1]) as temp:
        content = await file.read()
        temp.write(content)
        temp_path = temp.name
    
    try:
        # Load audio file with librosa
        y, sr = librosa.load(temp_path, sr=None)
        
        # Get BPM (tempo)
        tempo, _ = librosa.beat.beat_track(y=y, sr=sr)
        bpm = round(tempo)
        
        # Detect key
        key = detect_key(y, sr)
        
        # Detect scale (major/minor)
        scale = detect_scale(y, sr)
        
        # Detect rhythm pattern
        rhythm = detect_rhythm(y, sr)
        
        # Detect mood
        mood = detect_mood(y, sr, tempo)
        
        # Clean up temp file
        os.unlink(temp_path)
        
        # Return analysis results
        return {
            "filename": file.filename,
            "key": key,
            "scale": scale,
            "bpm": bpm,
            "rhythm": rhythm,
            "mood": mood,
            "id": os.path.splitext(file.filename)[0],
            "created_at": json.dumps(os.path.getctime(temp_path))
        }
    except Exception as e:
        # Clean up temp file in case of error
        os.unlink(temp_path)
        raise HTTPException(500, detail=f"Error analyzing audio: {str(e)}")

@app.get("/health")
async def health_check():
    return {"status": "ok"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
```

## Running the Server

```bash
uvicorn main:app --reload
```

This will start the server on port 8000.

## Connecting to the Frontend

Update the `src/lib/api.ts` file in your frontend project to point to this Python backend instead of using the mock data.

Example:

```typescript
// In src/lib/api.ts

export async function analyzeAudio(file: File): Promise<AudioAnalysisResult> {
  const formData = new FormData();
  formData.append('file', file);

  const response = await fetch('http://localhost:8000/analyze', {
    method: 'POST',
    body: formData,
  });

  if (!response.ok) {
    throw new Error('Failed to analyze audio');
  }

  const result = await response.json();
  await storeAnalysisResult(result);
  return result;
}
```

## Notes

- This is a simplified implementation. A production system would need more robust error handling, validation, and advanced audio analysis.
- The key and scale detection algorithms here are very basic - production systems would use more sophisticated algorithms.
- Consider using a cloud service like AWS Lambda or Google Cloud Functions to host your Python backend if you don't want to maintain your own server.
