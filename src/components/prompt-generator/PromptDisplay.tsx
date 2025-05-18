
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Copy, Check } from 'lucide-react';
import { toast } from '@/components/ui/use-toast';

interface PromptDisplayProps {
  prompt: string;
  setPrompt: (prompt: string) => void;
}

const PromptDisplay = ({ prompt, setPrompt }: PromptDisplayProps) => {
  const [copied, setCopied] = useState<boolean>(false);

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

  return (
    <div className="space-y-3">
      <Textarea
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        className="min-h-[120px] text-md focus-visible:ring-primary"
        placeholder="Your sample prompt will appear here..."
      />
      
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
  );
};

export default PromptDisplay;
