
import { useState, useRef } from 'react';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { toast } from '@/components/ui/use-toast';
import { Upload, Music2, Loader2 } from 'lucide-react';

interface AudioUploaderProps {
  onUpload: (file: File) => void;
  isLoading: boolean;
}

const AudioUploader = ({ onUpload, isLoading }: AudioUploaderProps) => {
  const [dragActive, setDragActive] = useState(false);
  const inputRef = useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);
    
    const files = e.dataTransfer.files;
    handleFiles(files);
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files) {
      handleFiles(e.target.files);
    }
  };

  const handleFiles = (files: FileList) => {
    if (files.length === 0) return;
    
    const file = files[0];
    const fileType = file.type;
    
    if (!fileType.startsWith('audio/')) {
      toast({
        title: "Invalid file type",
        description: "Please upload an audio file (MP3, WAV, etc.)",
        variant: "destructive",
      });
      return;
    }
    
    onUpload(file);
  };

  const handleButtonClick = () => {
    inputRef.current?.click();
  };

  return (
    <Card
      className={`relative border-2 border-dashed rounded-xl transition-all duration-200 p-6 ${
        dragActive 
          ? 'border-primary bg-primary/5' 
          : 'border-border hover:border-primary/50 hover:bg-secondary/50'
      } card-hover`}
      onDragEnter={handleDrag}
      onDragOver={handleDrag}
      onDragLeave={handleDrag}
      onDrop={handleDrop}
    >
      <input
        ref={inputRef}
        type="file"
        id="audio-upload"
        accept="audio/*"
        onChange={handleChange}
        className="hidden"
      />
      
      <div className="flex flex-col items-center justify-center gap-4 py-4">
        <div className="h-16 w-16 rounded-full bg-secondary flex items-center justify-center">
          {isLoading ? (
            <Loader2 className="h-8 w-8 text-primary animate-spin" />
          ) : (
            <Music2 className="h-8 w-8 text-primary" />
          )}
        </div>

        <div className="space-y-1 text-center">
          <h3 className="text-lg font-medium">Upload Audio File</h3>
          <p className="text-sm text-muted-foreground">
            Drag and drop an audio file or click to browse
          </p>
          <p className="text-xs text-muted-foreground/70">
            Supports MP3, WAV, FLAC, and more
          </p>
        </div>
        
        {!isLoading ? (
          <Button 
            onClick={handleButtonClick}
            className="relative group overflow-hidden"
            disabled={isLoading}
          >
            <div className="absolute inset-0 w-full h-full bg-primary transition-transform duration-300 transform translate-y-full group-hover:translate-y-0"></div>
            <div className="relative flex items-center gap-2 transition-colors group-hover:text-primary-foreground">
              <Upload className="w-4 h-4" />
              Browse Files
            </div>
          </Button>
        ) : (
          <div className="waveform">
            {[...Array(8)].map((_, i) => (
              <div key={i} className="waveform-bar"></div>
            ))}
          </div>
        )}
        
        {isLoading && <p className="text-sm animate-pulse">Analyzing audio...</p>}
      </div>
    </Card>
  );
};

export default AudioUploader;
