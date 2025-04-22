
import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Check, Sparkles, RefreshCw, Music, Settings } from 'lucide-react';
import { AnalysisData } from '@/components/AnalysisResults';
import { toast } from '@/components/ui/use-toast';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Label } from '@/components/ui/label';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';

interface PromptGeneratorProps {
  analysisData: AnalysisData | null;
}

const PromptGenerator = ({ analysisData }: PromptGeneratorProps) => {
  const [prompt, setPrompt] = useState<string>('');
  const [copied, setCopied] = useState<boolean>(false);
  const [promptType, setPromptType] = useState<string>('accompaniment');
  const [instrumentType, setInstrumentType] = useState<string>('piano');
  const [complexity, setComplexity] = useState<number>(50);
  const [includeKey, setIncludeKey] = useState<boolean>(true);
  const [includeBpm, setIncludeBpm] = useState<boolean>(true);
  const [includeStyle, setIncludeStyle] = useState<boolean>(true);

  const instrumentOptions = {
    "melodic": ["piano", "guitar", "violin", "flute", "synth lead"],
    "harmonic": ["strings", "pad", "organ", "choir", "ensemble"],
    "rhythmic": ["drums", "percussion", "bass", "beat", "rhythm section"],
    "textural": ["ambient", "atmospheric", "texture", "soundscape", "drones"]
  };

  // Generate a prompt based on analysis data and user preferences
  const generatePrompt = () => {
    if (!analysisData) return '';

    let basePrompt = '';
    const keyPhrase = includeKey ? `in ${analysisData.key} ${analysisData.scale}` : '';
    const bpmPhrase = includeBpm ? `at ${analysisData.bpm} BPM` : '';
    
    // Common elements for all prompt types
    const rhythmDescription = analysisData.rhythm.toLowerCase();
    const moodDescription = analysisData.mood.toLowerCase();
    
    // Generate different prompt types
    if (promptType === 'accompaniment') {
      basePrompt = `Create a ${moodDescription} ${instrumentType} ${promptType} sample ${keyPhrase} ${bpmPhrase} that complements the original track with ${rhythmDescription} patterns`;
    } else if (promptType === 'countermelody') {
      basePrompt = `Compose a ${moodDescription} ${instrumentType} countermelody ${keyPhrase} ${bpmPhrase} that weaves around the original melody with ${rhythmDescription} patterns`;
    } else if (promptType === 'bassline') {
      basePrompt = `Generate a ${moodDescription} bass line ${keyPhrase} ${bpmPhrase} with ${rhythmDescription} groove to support the original track`;
    } else if (promptType === 'percussion') {
      basePrompt = `Create ${moodDescription} percussion elements ${bpmPhrase} featuring ${rhythmDescription} patterns to enhance the existing rhythm`;
    } else if (promptType === 'atmosphere') {
      basePrompt = `Design ${moodDescription} atmospheric ${instrumentType} textures ${keyPhrase} that create depth and space around the original audio`;
    }
    
    // Add style based on complexity and user preferences
    if (includeStyle) {
      let styleNote = '';
      if (complexity < 30) {
        styleNote = "Keep it simple and minimal with sparse notes and plenty of space.";
      } else if (complexity < 70) {
        styleNote = "Balance complexity with clarity, using moderate ornamentation and expression.";
      } else {
        styleNote = "Create an intricate arrangement with detailed articulation and dynamic expression.";
      }
      basePrompt += `. ${styleNote}`;
    }

    // Add suno-specific instruction
    basePrompt += ` This is for use with Suno.com as a complementary sample to an existing track, not a standalone piece.`;
    
    return basePrompt;
  };

  useEffect(() => {
    if (analysisData) {
      setPrompt(generatePrompt());
    }
  }, [analysisData, promptType, instrumentType, complexity, includeKey, includeBpm, includeStyle]);

  const regeneratePrompt = () => {
    if (analysisData) {
      setPrompt(generatePrompt());
      toast({
        title: "Prompt Regenerated",
        description: "Created a new variation based on your settings."
      });
    }
  };

  const copyToClipboard = async () => {
    if (prompt) {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: "Prompt is ready to paste into Suno.com"
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
            <Sparkles className="h-5 w-5 text-accent" />
            <h3 className="text-lg font-medium">Suno Sample Creator</h3>
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
      
      <Tabs defaultValue="prompt" className="w-full">
        <TabsList className="grid grid-cols-2 m-4">
          <TabsTrigger value="prompt">Prompt</TabsTrigger>
          <TabsTrigger value="settings">Settings</TabsTrigger>
        </TabsList>
        
        <TabsContent value="prompt" className="p-4 pt-0">
          <Textarea
            value={prompt}
            onChange={(e) => setPrompt(e.target.value)}
            className="min-h-[120px] text-md focus-visible:ring-primary"
            placeholder="Your AI music prompt will appear here..."
          />
          
          <div className="mt-3 space-y-3">
            <p className="text-xs text-muted-foreground">
              This prompt is optimized for creating complementary samples with Suno.com
            </p>
            
            <Button 
              onClick={copyToClipboard} 
              className="w-full border-accent"
              variant="outline"
            >
              {copied ? (
                <>
                  <Check className="mr-2 h-4 w-4 text-primary" />
                  Copied!
                </>
              ) : (
                <>
                  <Copy className="mr-2 h-4 w-4 text-primary" />
                  Copy to Clipboard
                </>
              )}
            </Button>
          </div>
        </TabsContent>
        
        <TabsContent value="settings" className="p-4 pt-0 space-y-4">
          <div className="space-y-2">
            <Label htmlFor="promptType">Sample Type</Label>
            <Select
              value={promptType}
              onValueChange={setPromptType}
            >
              <SelectTrigger id="promptType" className="w-full">
                <SelectValue placeholder="Select sample type" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="accompaniment">Accompaniment</SelectItem>
                <SelectItem value="countermelody">Countermelody</SelectItem>
                <SelectItem value="bassline">Bass Line</SelectItem>
                <SelectItem value="percussion">Percussion</SelectItem>
                <SelectItem value="atmosphere">Atmosphere</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <Label htmlFor="instrumentType">Instrument</Label>
            <Select
              value={instrumentType}
              onValueChange={setInstrumentType}
            >
              <SelectTrigger id="instrumentType" className="w-full">
                <SelectValue placeholder="Select instrument" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="piano">Piano</SelectItem>
                <SelectItem value="guitar">Guitar</SelectItem>
                <SelectItem value="strings">Strings</SelectItem>
                <SelectItem value="synth">Synth</SelectItem>
                <SelectItem value="bass">Bass</SelectItem>
                <SelectItem value="drums">Drums</SelectItem>
                <SelectItem value="brass">Brass</SelectItem>
                <SelectItem value="woodwinds">Woodwinds</SelectItem>
                <SelectItem value="choir">Choir</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="complexity">Complexity</Label>
              <span className="text-sm text-muted-foreground">{complexity}%</span>
            </div>
            <Slider
              id="complexity"
              min={0}
              max={100}
              step={5}
              value={[complexity]}
              onValueChange={(value) => setComplexity(value[0])}
              className="accent-primary"
            />
          </div>
          
          <div className="space-y-4 pt-2">
            <h4 className="text-sm font-medium">Prompt Elements</h4>
            <div className="flex items-center justify-between">
              <Label htmlFor="includeKey" className="cursor-pointer">Include Key/Scale</Label>
              <Switch
                id="includeKey"
                checked={includeKey}
                onCheckedChange={setIncludeKey}
                className="data-[state=checked]:bg-primary"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="includeBpm" className="cursor-pointer">Include BPM</Label>
              <Switch
                id="includeBpm"
                checked={includeBpm}
                onCheckedChange={setIncludeBpm}
                className="data-[state=checked]:bg-primary"
              />
            </div>
            
            <div className="flex items-center justify-between">
              <Label htmlFor="includeStyle" className="cursor-pointer">Include Style Notes</Label>
              <Switch
                id="includeStyle"
                checked={includeStyle}
                onCheckedChange={setIncludeStyle}
                className="data-[state=checked]:bg-primary"
              />
            </div>
          </div>
          
          <Button 
            onClick={regeneratePrompt} 
            className="w-full mt-4 bg-primary hover:bg-primary/90"
          >
            <RefreshCw className="mr-2 h-4 w-4" />
            Update Prompt
          </Button>
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default PromptGenerator;
