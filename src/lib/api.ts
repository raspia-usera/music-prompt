
import { supabase } from './supabase';
import { AudioAnalysisResult } from '@/types';

// For now, we'll mock the Python backend analysis
// In a real implementation, this would call your Python API
export async function analyzeAudio(file: File): Promise<AudioAnalysisResult> {
  // This is a mock function that simulates audio analysis
  // In a real implementation, you would upload the file to your Python backend
  // and receive the analysis results

  // Simulate API call delay
  await new Promise(resolve => setTimeout(resolve, 2000));
  
  // Mock analysis result
  const mockResult: AudioAnalysisResult = {
    id: Math.random().toString(36).substring(7),
    filename: file.name,
    key: ['C', 'G', 'D', 'A', 'E', 'B', 'F#', 'C#', 'F', 'Bb', 'Eb', 'Ab'][Math.floor(Math.random() * 12)],
    scale: Math.random() > 0.5 ? 'Major' : 'Minor',
    bpm: Math.floor(Math.random() * 60) + 80, // Random BPM between 80-140
    rhythm: ['Four on the floor', 'Syncopated', 'Trap', 'Waltz', 'Breakbeat'][Math.floor(Math.random() * 5)],
    mood: ['Melancholic', 'Upbeat', 'Dramatic', 'Chill', 'Energetic'][Math.floor(Math.random() * 5)],
    created_at: new Date().toISOString(),
  };

  // Store result in Supabase
  await storeAnalysisResult(mockResult);
  
  return mockResult;
}

export async function storeAnalysisResult(result: AudioAnalysisResult) {
  // Store the analysis result in Supabase
  const { data, error } = await supabase
    .from('audio_analysis')
    .insert([result])
    .select();
  
  if (error) {
    console.error('Error storing analysis result:', error);
    throw error;
  }
  
  return data;
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
