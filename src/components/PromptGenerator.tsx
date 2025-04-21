
import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Textarea } from "@/components/ui/textarea";
import { Copy, Save, Share } from "lucide-react";
import { toast } from "@/components/ui/use-toast";
import { AnalysisData } from "./AnalysisResults";

interface PromptGeneratorProps {
  analysisData: AnalysisData | null;
}

export default function PromptGenerator({ analysisData }: PromptGeneratorProps) {
  const [generatedPrompt, setGeneratedPrompt] = useState<string>("");

  const generatePrompt = () => {
    if (!analysisData) return;

    // Generate a prompt based on analysis data
    const prompt = `Generate a ${analysisData.mood} melody in ${analysisData.key} ${analysisData.scale} at ${analysisData.bpm} BPM with ${analysisData.rhythm}.`;
    setGeneratedPrompt(prompt);
  };

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPrompt);
    toast({
      title: "Copied to clipboard",
      description: "The prompt has been copied to your clipboard.",
    });
  };

  if (!analysisData) return null;

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">AI Music Generation Prompt</CardTitle>
      </CardHeader>
      <CardContent>
        {generatedPrompt ? (
          <Textarea
            className="min-h-[100px] text-lg"
            value={generatedPrompt}
            onChange={(e) => setGeneratedPrompt(e.target.value)}
          />
        ) : (
          <div className="text-center p-8">
            <p className="text-muted-foreground mb-4">
              Generate a prompt based on the audio analysis to use with music generation tools like Suno.
            </p>
            <Button onClick={generatePrompt}>Generate Prompt</Button>
          </div>
        )}
      </CardContent>
      {generatedPrompt && (
        <CardFooter className="flex justify-between">
          <Button variant="outline" onClick={() => setGeneratedPrompt("")}>
            Reset
          </Button>
          <div className="flex gap-2">
            <Button variant="secondary" onClick={copyToClipboard}>
              <Copy className="mr-2 h-4 w-4" /> Copy
            </Button>
            <Button>
              <Share className="mr-2 h-4 w-4" /> Send to Suno
            </Button>
          </div>
        </CardFooter>
      )}
    </Card>
  );
}
