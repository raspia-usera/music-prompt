
import { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Sparkles, RefreshCw } from 'lucide-react';
import { AnalysisData } from '@/components/AnalysisResults';
import { toast } from '@/components/ui/use-toast';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import PromptDisplay from './prompt-generator/PromptDisplay';
import PromptSettings from './prompt-generator/PromptSettings';
import { generatePrompt } from './prompt-generator/promptUtils';

interface PromptGeneratorProps {
  analysisData: AnalysisData | null;
}

const PromptGenerator = ({ analysisData }: PromptGeneratorProps) => {
  const [prompt, setPrompt] = useState<string>('');
  const [promptType, setPromptType] = useState<string>('melodic');
  const [instrumentType, setInstrumentType] = useState<string>('piano');
  const [complexity, setComplexity] = useState<number>(50);
  const [includeKey, setIncludeKey] = useState<boolean>(true);
  const [includeBpm, setIncludeBpm] = useState<boolean>(true);
  const [includeStyle, setIncludeStyle] = useState<boolean>(true);

  const regeneratePrompt = () => {
    if (analysisData) {
      const newPrompt = generatePrompt({
        analysisData,
        promptType,
        instrumentType,
        complexity,
        includeKey,
        includeBpm,
        includeStyle
      });
      
      setPrompt(newPrompt);
      
      toast({
        title: "Prompt Regenerated",
        description: "Created a new sample prompt variation."
      });
    }
  };

  useEffect(() => {
    if (analysisData) {
      const initialPrompt = generatePrompt({
        analysisData,
        promptType,
        instrumentType,
        complexity,
        includeKey,
        includeBpm,
        includeStyle
      });
      setPrompt(initialPrompt);
    }
  }, [analysisData, promptType, instrumentType, complexity, includeKey, includeBpm, includeStyle]);

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
          <PromptDisplay prompt={prompt} setPrompt={setPrompt} />
        </TabsContent>
        
        <TabsContent value="settings" className="p-4 pt-0">
          <PromptSettings 
            promptType={promptType}
            setPromptType={setPromptType}
            instrumentType={instrumentType}
            setInstrumentType={setInstrumentType}
            complexity={complexity}
            setComplexity={setComplexity}
            includeKey={includeKey}
            setIncludeKey={setIncludeKey}
            includeBpm={includeBpm}
            setIncludeBpm={setIncludeBpm}
            includeStyle={includeStyle}
            setIncludeStyle={setIncludeStyle}
            regeneratePrompt={regeneratePrompt}
          />
        </TabsContent>
      </Tabs>
    </Card>
  );
};

export default PromptGenerator;
