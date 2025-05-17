
# Audio Analysis Python Backend

This directory contains the Python backend code needed for accurate audio analysis in Music Prompt.

## Setup Instructions

1. Install Python 3.8 or higher if you haven't already
2. Install required packages:

```
pip install -r requirements.txt
```

3. Run the FastAPI server:

```
python app.py
```

The server will start on `http://localhost:8000`.

## API Endpoints

- `GET /health` - Health check endpoint
- `POST /analyze` - Analyze uploaded audio file
- `POST /analyze-url` - Analyze audio from URL

## Notes for Production

- In production, you should host this on a server with proper security measures
- Consider using a container solution like Docker for easier deployment
- Update the CORS settings to only allow requests from your frontend domain
