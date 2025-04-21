
# Audio Muse Generator

A full-stack web application that analyzes audio files and generates creative prompts for AI music tools.

## Features

- Upload audio files (MP3, WAV, etc.) for analysis
- Extract musical characteristics including:
  - Key (e.g., A minor, C major)
  - Scale (major/minor)
  - BPM (Tempo)
  - Rhythm patterns
  - General mood
- Store analysis results in Supabase
- Generate creative prompts for AI music generation tools like Suno.com

## Tech Stack

### Frontend
- React with TypeScript
- Tailwind CSS for styling
- shadcn/ui component library
- Supabase client for database integration

### Backend (Required Setup)
- Python with FastAPI
- Libraries: librosa, numpy, soundfile
- See `/src/pythonBackend/README.md` for setup instructions

## Getting Started

1. Clone this repository
2. Install dependencies:
```
npm install
```
3. Start the development server:
```
npm run dev
```
4. Set up the Python backend (see `/src/pythonBackend/README.md`)

## Supabase Setup

This project uses Supabase for data storage. You'll need to create a table called `audio_analysis` with the following schema:

```sql
create table audio_analysis (
  id text primary key,
  filename text not null,
  key text not null,
  scale text not null,
  bpm integer not null,
  rhythm text not null,
  mood text not null,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null
);
```

## How It Works

1. User uploads an audio file through the web interface
2. The file is sent to the Python backend for analysis
3. The Python backend uses librosa/essentia to extract musical features
4. Results are stored in the Supabase database
5. The frontend displays the analysis results and generates a creative prompt
6. The user can copy the prompt or send it directly to music generation tools

## Next Steps

- Implement user authentication to save analysis history
- Improve audio analysis algorithms for better accuracy
- Add direct integration with music generation APIs
- Create a user library of analyzed tracks
- Add visualization of audio features (waveforms, spectrograms)
