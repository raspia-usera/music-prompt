
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { Input } from '@/components/ui/input';
import { LinkIcon, ArrowRightIcon, Loader2 } from 'lucide-react';

interface AudioUrlInputProps {
  onSubmit: (url: string) => void;
  isLoading: boolean;
}

const AudioUrlInput = ({ onSubmit, isLoading }: AudioUrlInputProps) => {
  const [url, setUrl] = useState('');
  
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    
    // Basic URL validation
    if (!url.trim()) {
      toast({
        title: "URL is required",
        description: "Please enter a valid audio URL",
        variant: "destructive",
      });
      return;
    }
    
    // Check if URL has a common audio file extension
    const isDirectAudioFile = /\.(mp3|wav|ogg|flac|m4a|aac)$/i.test(url);
    
    // Check if URL is from a common streaming platform
    const isStreamingPlatform = /spotify\.com|youtube\.com|youtu\.be|soundcloud\.com/i.test(url);
    
    if (!isDirectAudioFile && !isStreamingPlatform) {
      toast({
        title: "URL may not be supported",
        description: "Please ensure the URL links to an audio file or a supported streaming platform",
        variant: "default", // Changed from "warning" to "default"
      });
    }
    
    onSubmit(url);
  };

  return (
    <Card className="border-2 border-dashed rounded-xl transition-all duration-200 p-6 border-border hover:border-primary/50 hover:bg-secondary/50 card-hover">
      <form onSubmit={handleSubmit} className="flex flex-col items-center gap-4">
        <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center">
          <LinkIcon className="h-8 w-8 text-primary" />
        </div>
        
        <div className="space-y-1 text-center">
          <h3 className="text-lg font-medium">Enter Audio URL</h3>
          <p className="text-sm text-muted-foreground">
            Provide a link to an audio file or streaming platform
          </p>
          <p className="text-xs text-muted-foreground/70">
            Supports direct audio files or links from YouTube, Spotify, SoundCloud
          </p>
        </div>
        
        <div className="w-full space-y-2">
          <Input
            type="url"
            placeholder="https://example.com/audio.mp3"
            value={url}
            onChange={(e) => setUrl(e.target.value)}
            className="w-full"
            disabled={isLoading}
          />
          
          <Button 
            type="submit" 
            className="w-full relative group overflow-hidden"
            disabled={isLoading}
          >
            {isLoading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <>
                <div className="absolute inset-0 w-full h-full bg-primary transition-transform duration-300 transform translate-y-full group-hover:translate-y-0"></div>
                <div className="relative flex items-center justify-center gap-2 transition-colors group-hover:text-primary-foreground">
                  <ArrowRightIcon className="w-4 h-4" />
                  Analyze Audio
                </div>
              </>
            )}
          </Button>
        </div>
        
        {isLoading && <p className="text-sm animate-pulse">Analyzing audio from URL...</p>}
      </form>
    </Card>
  );
};

export default AudioUrlInput;
