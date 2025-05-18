
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
  const [promptType, setPromptType] = useState<string>('melodic');
  const [instrumentType, setInstrumentType] = useState<string>('piano');
  const [complexity, setComplexity] = useState<number>(50);
  const [includeKey, setIncludeKey] = useState<boolean>(true);
  const [includeBpm, setIncludeBpm] = useState<boolean>(true);
  const [includeStyle, setIncludeStyle] = useState<boolean>(true);

  // Generate a prompt based on analysis data and user preferences
  const generatePrompt = () => {
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
        description: "Created a new sample prompt variation."
      });
    }
  };

  const copyToClipboard = async () => {
    if (prompt) {
      await navigator.clipboard.writeText(prompt);
      setCopied(true);
      toast({
        title: "Copied to clipboard",
        description: "Sample prompt is ready to use"
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
            <h3 className="text-lg font-medium">Sample Creator</h3>
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
            placeholder="Your sample prompt will appear here..."
          />
          
          <div className="mt-3 space-y-3">
            <p className="text-xs text-muted-foreground">
              This prompt is optimized for creating single-instrument samples that complement your original audio
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
                <SelectItem value="melodic">Melodic Sample</SelectItem>
                <SelectItem value="harmonic">Harmonic Sample</SelectItem>
                <SelectItem value="bass">Bass Sample</SelectItem>
                <SelectItem value="percussive">Percussive Sample</SelectItem>
                <SelectItem value="texture">Textural Sample</SelectItem>
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
                <SelectItem value="woodwind">Woodwind</SelectItem>
                <SelectItem value="choir">Choir</SelectItem>
                <SelectItem value="custom">Custom</SelectItem>
              </SelectContent>
            </Select>
          </div>
          
          <div className="space-y-2">
            <div className="flex justify-between">
              <Label htmlFor="complexity">Detail Level</Label>
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
              <Label htmlFor="includeStyle" className="cursor-pointer">Include Detail Notes</Label>
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
