
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";

export interface AnalysisData {
  key: string;
  scale: string;
  bpm: number;
  rhythm: string;
  mood: string;
  id?: string;
  filename?: string;
  created_at?: string;
}

interface AnalysisResultsProps {
  data: AnalysisData | null;
  isLoading: boolean;
}

export default function AnalysisResults({ data, isLoading }: AnalysisResultsProps) {
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle className="text-center">Analyzing Audio...</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex flex-col items-center justify-center p-8">
            <div className="flex space-x-2">
              <div className="h-4 w-4 rounded-full bg-primary animate-pulse"></div>
              <div className="h-4 w-4 rounded-full bg-primary animate-pulse" style={{ animationDelay: "0.2s" }}></div>
              <div className="h-4 w-4 rounded-full bg-primary animate-pulse" style={{ animationDelay: "0.4s" }}></div>
            </div>
            <p className="mt-4 text-sm text-muted-foreground">
              Extracting musical features from your audio file...
            </p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (!data) {
    return null;
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-center">Audio Analysis Results</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-2 gap-4">
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Musical Key</span>
            <span className="text-2xl font-bold">{data.key}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Scale</span>
            <span className="text-2xl font-bold">{data.scale}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">BPM (Tempo)</span>
            <span className="text-2xl font-bold">{data.bpm}</span>
          </div>
          <div className="flex flex-col">
            <span className="text-sm text-muted-foreground">Mood</span>
            <span className="text-2xl font-bold">{data.mood}</span>
          </div>
        </div>
        
        <Separator className="my-4" />
        
        <div>
          <span className="text-sm text-muted-foreground">Rhythm Description</span>
          <p className="text-lg mt-1">{data.rhythm}</p>
        </div>
      </CardContent>
    </Card>
  );
}
