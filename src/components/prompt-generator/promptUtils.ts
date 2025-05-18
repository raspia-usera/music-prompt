
import { AnalysisData } from '@/components/AnalysisResults';

interface PromptConfig {
  analysisData: AnalysisData;
  promptType: string;
  instrumentType: string;
  complexity: number;
  includeKey: boolean;
  includeBpm: boolean;
  includeStyle: boolean;
}

export const generatePrompt = (config: PromptConfig): string => {
  const { 
    analysisData, 
    promptType, 
    instrumentType, 
    complexity,
    includeKey,
    includeBpm,
    includeStyle
  } = config;

  if (!analysisData) return '';

  let basePrompt = '';
  const keyPhrase = includeKey ? `in ${analysisData.key} ${analysisData.scale}` : '';
  const bpmPhrase = includeBpm ? `at ${analysisData.bpm} BPM` : '';
  
  // Common elements for all prompt types
  const rhythmDescription = analysisData.rhythm.toLowerCase();
  const moodDescription = analysisData.mood.toLowerCase();
  
  // Generate different prompt types focused on single instrument samples
  if (promptType === 'melodic') {
    basePrompt = `Create a ${moodDescription} ${instrumentType} melody ${keyPhrase} ${bpmPhrase} that complements the original audio`;
  } else if (promptType === 'harmonic') {
    basePrompt = `Create a ${moodDescription} ${instrumentType} harmonic sample ${keyPhrase} ${bpmPhrase} to enhance the existing audio`;
  } else if (promptType === 'bass') {
    basePrompt = `Create a ${moodDescription} bass sample ${keyPhrase} ${bpmPhrase} that supports the rhythm of the original audio`;
  } else if (promptType === 'percussive') {
    basePrompt = `Create a ${moodDescription} percussive ${instrumentType} sample ${bpmPhrase} to complement the original audio`;
  } else if (promptType === 'texture') {
    basePrompt = `Create a ${moodDescription} atmospheric ${instrumentType} texture ${keyPhrase} to add dimension to the original audio`;
  }
  
  // Add style based on complexity - simplified for sample creation
  if (includeStyle) {
    let styleNote = '';
    if (complexity < 30) {
      styleNote = "Keep it simple with minimal notes and plenty of space.";
    } else if (complexity < 70) {
      styleNote = "Use moderate embellishment while maintaining clarity.";
    } else {
      styleNote = "Add detailed articulation and expression.";
    }
    basePrompt += `. ${styleNote}`;
  }
  
  // Add rhythm pattern reference when appropriate
  if (['melodic', 'bass', 'percussive'].includes(promptType)) {
    basePrompt += ` with ${rhythmDescription} patterns`;
  }
  
  // Add instruction about purpose - just once, no redundancy
  basePrompt += ` for use as a complementary single-instrument sample.`;
  
  return basePrompt;
};
