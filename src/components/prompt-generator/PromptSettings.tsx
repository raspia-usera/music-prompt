
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Slider } from '@/components/ui/slider';
import { Switch } from '@/components/ui/switch';
import { RefreshCw } from 'lucide-react';

interface PromptSettingsProps {
  promptType: string;
  setPromptType: (value: string) => void;
  instrumentType: string;
  setInstrumentType: (value: string) => void;
  complexity: number;
  setComplexity: (value: number) => void;
  includeKey: boolean;
  setIncludeKey: (value: boolean) => void;
  includeBpm: boolean;
  setIncludeBpm: (value: boolean) => void;
  includeStyle: boolean;
  setIncludeStyle: (value: boolean) => void;
  regeneratePrompt: () => void;
}

const PromptSettings = ({
  promptType, 
  setPromptType,
  instrumentType,
  setInstrumentType,
  complexity,
  setComplexity,
  includeKey,
  setIncludeKey,
  includeBpm,
  setIncludeBpm,
  includeStyle,
  setIncludeStyle,
  regeneratePrompt
}: PromptSettingsProps) => {
  return (
    <div className="space-y-4">
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
    </div>
  );
};

export default PromptSettings;
