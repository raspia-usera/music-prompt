
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Upload, FileAudio } from 'lucide-react';
import { Card, CardContent } from '@/components/ui/card';

interface AudioUploaderProps {
  onUpload: (file: File) => void;
  isLoading: boolean;
}

export default function AudioUploader({ onUpload, isLoading }: AudioUploaderProps) {
  const [dragActive, setDragActive] = useState(false);
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  // Handle drag events
  const handleDrag = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  // Handle drop event
  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const file = e.dataTransfer.files[0];
      if (isAudioFile(file)) {
        setSelectedFile(file);
        onUpload(file);
      } else {
        alert('Please upload an audio file (MP3, WAV, etc.)');
      }
    }
  };

  // Handle file input change
  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    e.preventDefault();
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0];
      if (isAudioFile(file)) {
        setSelectedFile(file);
        onUpload(file);
      } else {
        alert('Please upload an audio file (MP3, WAV, etc.)');
      }
    }
  };

  // Check if file is an audio file
  const isAudioFile = (file: File) => {
    return file.type.startsWith('audio/');
  };

  return (
    <Card className="w-full">
      <CardContent className="pt-6">
        <div
          className={`flex flex-col items-center justify-center border-2 border-dashed rounded-lg p-8 transition-colors ${
            dragActive ? 'border-primary bg-primary/10' : 'border-muted'
          }`}
          onDragEnter={handleDrag}
          onDragOver={handleDrag}
          onDragLeave={handleDrag}
          onDrop={handleDrop}
        >
          {selectedFile ? (
            <div className="text-center">
              <FileAudio className="h-16 w-16 text-primary mx-auto mb-4" />
              <p className="text-lg font-medium mb-2">{selectedFile.name}</p>
              <p className="text-sm text-muted-foreground mb-4">
                {(selectedFile.size / (1024 * 1024)).toFixed(2)} MB
              </p>
              {isLoading ? (
                <div className="flex items-center justify-center gap-2">
                  <div className="h-4 w-4 rounded-full animate-bounce bg-primary"></div>
                  <div className="h-4 w-4 rounded-full animate-bounce bg-primary" style={{ animationDelay: '0.2s' }}></div>
                  <div className="h-4 w-4 rounded-full animate-bounce bg-primary" style={{ animationDelay: '0.4s' }}></div>
                </div>
              ) : (
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedFile(null);
                  }}
                >
                  Choose another file
                </Button>
              )}
            </div>
          ) : (
            <>
              <Upload className="h-12 w-12 text-muted-foreground mb-4" />
              <h3 className="text-lg font-medium mb-1">Drag and drop your audio file</h3>
              <p className="text-sm text-muted-foreground mb-4">or click to browse files</p>
              <Button disabled={isLoading} asChild>
                <label className="cursor-pointer">
                  Upload Audio File
                  <input
                    type="file"
                    accept="audio/*"
                    className="hidden"
                    onChange={handleChange}
                    disabled={isLoading}
                  />
                </label>
              </Button>
              <p className="text-xs text-muted-foreground mt-4">Supports MP3, WAV, and other audio formats</p>
            </>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
