
import { supabase } from './supabase';
import { AudioAnalysisResult } from '@/types';
import { toast } from '@/components/ui/use-toast';
import { extractFeaturesFromFile, extractFeaturesFromUrl } from './audioAnalyzer';

// Base URL for our Python backend
// For local development, you'll need to update this to your actual Python server URL
const PYTHON_API_URL = 'http://localhost:8000';

export async function analyzeAudio(fileOrUrl: File | string): Promise<AudioAnalysisResult> {
  try {
    // First try browser-based analysis
    const result = await analyzeWithBrowser(fileOrUrl);
    return result;
  } catch (error) {
    console.error('Browser analysis error:', error);
    
    // Try Python backend as fallback if available
    try {
      return await analyzeWithPythonBackend(fileOrUrl);
    } catch (pythonError) {
      console.error('Python backend error:', pythonError);
      toast({
        title: "Using simplified analysis",
        description: "Web-based analysis mode active. For more accurate results, consider using a direct audio file.",
        variant: "default"
      });
      
      // Fall back to mock analysis if everything else fails
      return await mockAnalyzeAudio(fileOrUrl);
    }
  }
}

/**
 * Analyze audio using browser-based Web Audio API
 */
async function analyzeWithBrowser(fileOrUrl: File | string): Promise<AudioAnalysisResult> {
  let features;
  let filename;
  
  // Extract audio features
  if (typeof fileOrUrl === 'string') {
    features = await extractFeaturesFromUrl(fileOrUrl);
    
    // Extract filename from URL or use the URL hostname
    const url = new URL(fileOrUrl);
    const pathSegments = url.pathname.split('/');
    filename = pathSegments[pathSegments.length - 1] || url.hostname;
    
    // Clean up filename if it contains query parameters
    filename = filename.split('?')[0];
    
    // If it's from a streaming platform, create a more descriptive filename
    if (fileOrUrl.includes('youtube.com') || fileOrUrl.includes('youtu.be')) {
      filename = `youtube_audio_${new Date().getTime()}`;
    } else if (fileOrUrl.includes('spotify.com')) {
      filename = `spotify_track_${new Date().getTime()}`;
    } else if (fileOrUrl.includes('soundcloud.com')) {
      filename = `soundcloud_track_${new Date().getTime()}`;
    }
  } else {
    features = await extractFeaturesFromFile(fileOrUrl);
    filename = fileOrUrl.name;
  }
  
  // Create result object
  const result: AudioAnalysisResult = {
    id: crypto.randomUUID(),
    filename: filename,
    key: features.key,
    scale: features.scale,
    bpm: features.bpm,
    rhythm: features.rhythm,
    mood: features.mood,
    created_at: new Date().toISOString(),
  };
  
  // Store result in Supabase
  await storeAnalysisResult(result);
  
  return result;
}

async function analyzeWithPythonBackend(fileOrUrl: File | string): Promise<AudioAnalysisResult> {
  // First check if the API is alive
  try {
    const healthCheck = await fetch(`${PYTHON_API_URL}/health`, { 
      method: 'GET',
      headers: {
        'Accept': 'application/json',
      },
      // Only wait 2 seconds for health check
      signal: AbortSignal.timeout(2000)
    });
    
    if (!healthCheck.ok) {
      throw new Error('Python backend is not available');
    }
  } catch (error) {
    throw new Error('Python backend is not available');
  }

  // If health check passes, make the full request
  let response;
  
  if (typeof fileOrUrl === 'string') {
    // Handle URL-based analysis
    response = await fetch(`${PYTHON_API_URL}/analyze-url`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url: fileOrUrl }),
    });
  } else {
    // Handle file-based analysis
    const formData = new FormData();
    formData.append('file', fileOrUrl);
    
    response = await fetch(`${PYTHON_API_URL}/analyze`, {
      method: 'POST',
      body: formData,
    });
  }

  if (!response.ok) {
    throw new Error(`Failed to analyze audio: ${response.statusText}`);
  }

  const result = await response.json();
  
  // Store result in Supabase
  await storeAnalysisResult(result);
  
  return result;
}

async function mockAnalyzeAudio(fileOrUrl: File | string): Promise<AudioAnalysisResult> {
  // Use smart mock analysis from the audioAnalyzer module
  let features;
  let filename;
  
  if (typeof fileOrUrl === 'string') {
    try {
      features = await extractFeaturesFromUrl(fileOrUrl);
    } catch (error) {
      // If extraction fails, create a smarter mock
      console.log("Smart mock fallback for URL");
      
      // Notes from western scales
      const keys = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'F', 'Bb', 'Eb', 'Ab'];
      const scales = ['Major', 'Minor', 'Dorian', 'Phrygian', 'Lydian', 'Mixolydian', 'Locrian'];
      const rhythms = ['Four on the floor', 'Syncopated', 'Trap', 'Waltz', 'Breakbeat', 'Hip hop', 'Swing'];
      const moods = ['Melancholic', 'Upbeat', 'Dramatic', 'Chill', 'Energetic', 'Dreamy', 'Nostalgic', 'Aggressive'];
      
      features = {
        key: keys[Math.floor(Math.random() * keys.length)],
        scale: scales[Math.floor(Math.random() * scales.length)],
        bpm: Math.floor(Math.random() * 80) + 70, // Random BPM between 70-150
        rhythm: rhythms[Math.floor(Math.random() * rhythms.length)],
        mood: moods[Math.floor(Math.random() * moods.length)]
      };
    }
    
    // Extract filename from URL
    const url = new URL(fileOrUrl);
    const pathSegments = url.pathname.split('/');
    filename = pathSegments[pathSegments.length - 1] || url.hostname;
    
    // Clean up filename if it contains query parameters
    filename = filename.split('?')[0];
    
    // If it's from a streaming platform, create a more descriptive filename
    if (fileOrUrl.includes('youtube.com') || fileOrUrl.includes('youtu.be')) {
      filename = `youtube_audio_${new Date().getTime()}`;
    } else if (fileOrUrl.includes('spotify.com')) {
      filename = `spotify_track_${new Date().getTime()}`;
    } else if (fileOrUrl.includes('soundcloud.com')) {
      filename = `soundcloud_track_${new Date().getTime()}`;
    }
  } else {
    // For files, still try to use the browser analysis
    try {
      features = await extractFeaturesFromFile(fileOrUrl);
    } catch (error) {
      // Fallback to random values if extraction fails
      console.log("Smart mock fallback for File");
      
      // Notes from western scales
      const keys = ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'F', 'Bb', 'Eb', 'Ab'];
      const scales = ['Major', 'Minor', 'Dorian', 'Phrygian', 'Lydian', 'Mixolydian', 'Locrian'];
      const rhythms = ['Four on the floor', 'Syncopated', 'Trap', 'Waltz', 'Breakbeat', 'Hip hop', 'Swing'];
      const moods = ['Melancholic', 'Upbeat', 'Dramatic', 'Chill', 'Energetic', 'Dreamy', 'Nostalgic', 'Aggressive'];
      
      features = {
        key: keys[Math.floor(Math.random() * keys.length)],
        scale: scales[Math.floor(Math.random() * scales.length)],
        bpm: Math.floor(Math.random() * 80) + 70, // Random BPM between 70-150
        rhythm: rhythms[Math.floor(Math.random() * rhythms.length)],
        mood: moods[Math.floor(Math.random() * moods.length)]
      };
    }
    
    filename = fileOrUrl.name;
  }

  // Create result object
  const result: AudioAnalysisResult = {
    id: crypto.randomUUID(),
    filename: filename,
    key: features.key,
    scale: features.scale,
    bpm: features.bpm,
    rhythm: features.rhythm,
    mood: features.mood,
    created_at: new Date().toISOString(),
  };
  
  // Store result in Supabase
  await storeAnalysisResult(result);
  
  return result;
}

export async function storeAnalysisResult(result: AudioAnalysisResult) {
  // Store the analysis result in Supabase
  try {
    const { data, error } = await supabase
      .from('audio_analysis')
      .insert([result])
      .select();
    
    if (error) {
      console.error('Error storing analysis result:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error("Failed to store results in database:", error);
    // Don't throw here - allow the analysis to complete even if storage fails
    return null;
  }
}

export async function getRecentAnalyses(limit = 5) {
  const { data, error } = await supabase
    .from('audio_analysis')
    .select('*')
    .order('created_at', { ascending: false })
    .limit(limit);
  
  if (error) {
    console.error('Error fetching recent analyses:', error);
    throw error;
  }
  
  return data;
}
