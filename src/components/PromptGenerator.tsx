
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Check, Sparkles, RefreshCw } from 'lucide-react';
import { AnalysisData } from '@/components/AnalysisResults';
import { toast } from '@/components/ui/use-toast';

interface PromptGeneratorProps {
  analysisData: AnalysisData | null;
}

const PromptGenerator = ({ analysisData }: PromptGeneratorProps) => {
  const [prompt, setPrompt] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);

  // Generate a prompt based on analysis data
  const generatePrompt = () => {
    if (!analysisData) return '';

    // Modifiers to make the prompt more varied and interesting
    const tempoModifiers = ['steady', 'driving', 'relaxed', 'pulsing', 'dynamic'];
    const moodEnhancers = {
      'Melancholic': ['nostalgic', 'wistful', 'introspective', 'somber', 'emotional'],
      'Upbeat': ['energetic', 'cheerful', 'lively', 'bright', 'optimistic'],
      'Dramatic': ['intense', 'powerful', 'epic', 'cinematic', 'bold'],
      'Chill': ['relaxed', 'calm', 'laid-back', 'smooth', 'gentle'],
      'Energetic': ['vibrant', 'pulsating', 'dynamic', 'exciting', 'powerful']
    };
    
    // Get random modifiers
    const getRandomItem = (array: string[]) => array[Math.floor(Math.random() * array.length)];
    const tempoModifier = getRandomItem(tempoModifiers);
    const moodEnhancer = analysisData.mood in moodEnhancers 
      ? getRandomItem(moodEnhancers[analysisData.mood as keyof typeof moodEnhancers])
      : getRandomItem(['emotional', 'expressive', 'textured', 'nuanced']);
    
    // Structure the prompt
    const basePrompt = `Generate a ${moodEnhancer} ${analysisData.mood.toLowerCase()} track in ${analysisData.key} ${analysisData.scale} with a ${tempoModifier} ${analysisData.bpm} BPM rhythm`;
    
    // Add rhythmic detail
    const rhythmDetail = `featuring ${analysisData.rhythm.toLowerCase()} patterns`;
    
    // Music style suggestions based on mood and bpm
    let styleSuggestion = '';
    
    if (analysisData.mood === 'Melancholic') {
      styleSuggestion = 'with ambient textures and gentle piano melodies';
    } else if (analysisData.mood === 'Upbeat' && analysisData.bpm > 100) {
      styleSuggestion = 'with bright synths and catchy hooks';
    } else if (analysisData.mood === 'Dramatic') {
      styleSuggestion = 'with orchestral elements and dynamic percussion';
    } else if (analysisData.mood === 'Chill') {
      styleSuggestion = 'with lo-fi beats and smooth atmospheric pads';
    } else if (analysisData.mood === 'Energetic' && analysisData.bpm > 120) {
      styleSuggestion = 'with driving bass and energetic electronic elements';
    } else {
      const elements = ['warm pads', 'melodic phrases', 'subtle percussion', 'organic textures', 'spatial effects'];
      styleSuggestion = `with ${getRandomItem(elements)}`;
    }
    
    return `${basePrompt} ${rhythmDetail} ${styleSuggestion}.`;
  };

  useEffect(() => {
    if (analysisData) {
      setPrompt(generatePrompt());
    }
  }, [analysisData]);

  const regeneratePrompt = () => {
    if (analysisData) {
      setPrompt(generatePrompt());
      toast({
        title: "Prompt Regenerated",
        description: "Created a new variation based on the analysis data."
      });
    }
  };

  const copyToClipboard = async () => {
    if (prompt) {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: "Prompt is ready to paste into your AI music generator."
      });
      
      setTimeout(() => setCopied(false), 2000);
    }
  };

  if (!analysisData) {
    return (
      <Card className="p-6 text-center">
        <p className="text-muted-foreground">Upload and analyze an audio file first to generate a prompt.</p>
      </Card>
    );
  }

  return (
    <Card className="overflow-hidden border shadow-md">
      <div className="p-4 bg-gradient-to-r from-primary/20 to-accent/30 border-b">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <Sparkles className="h-5 w-5 text-primary" />
            <h3 className="text-lg font-medium">AI Music Prompt</h3>
          </div>
          <Button 
            variant="ghost" 
            size="icon"
            onClick={regeneratePrompt}
            title="Generate new variation"
          >
            <RefreshCw className="h-4 w-4" />
          </Button>
        </div>
      </div>
      
      <div className="p-4">
        <Textarea
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          className="min-h-[120px] text-md focus-visible:ring-primary"
          placeholder="Your AI music prompt will appear here..."
        />
        
        <div className="mt-3 space-y-3">
          <p className="text-xs text-muted-foreground">
            This prompt is ready to use with AI music generators like Suno, Udio, or Stable Audio.
          </p>
          
          <Button 
            onClick={copyToClipboard} 
            className="w-full"
            variant="outline"
          >
            {copied ? (
              <>
                <Check className="mr-2 h-4 w-4" />
                Copied!
              </>
            ) : (
              <>
                <Copy className="mr-2 h-4 w-4" />
                Copy to Clipboard
              </>
            )}
          </Button>
        </div>
      </div>
    </Card>
  );
};

export default PromptGenerator;
