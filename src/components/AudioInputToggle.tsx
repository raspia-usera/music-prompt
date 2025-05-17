
import { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from '@/components/ui/tabs';
import AudioUploader from '@/components/AudioUploader';
import AudioUrlInput from '@/components/AudioUrlInput';

interface AudioInputToggleProps {
  onUpload: (file: File) => void;
  onUrlSubmit: (url: string) => void;
  isLoading: boolean;
}

const AudioInputToggle = ({ onUpload, onUrlSubmit, isLoading }: AudioInputToggleProps) => {
  const [inputType, setInputType] = useState<'file' | 'url'>('file');
  
  return (
    <div className="space-y-4">
      <Tabs 
        defaultValue="file" 
        value={inputType} 
        onValueChange={(value) => setInputType(value as 'file' | 'url')}
        className="w-full"
      >
        <TabsList className="grid w-full grid-cols-2 mb-4">
          <TabsTrigger value="file">
            Upload File
          </TabsTrigger>
          <TabsTrigger value="url">
            Enter URL
          </TabsTrigger>
        </TabsList>
        
        {inputType === 'file' ? (
          <AudioUploader onUpload={onUpload} isLoading={isLoading} />
        ) : (
          <AudioUrlInput onSubmit={onUrlSubmit} isLoading={isLoading} />
        )}
      </Tabs>
    </div>
  );
};

export default AudioInputToggle;
