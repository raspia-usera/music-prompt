
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { Music, Clock3, BarChart3, PieChart, FileMusic } from "lucide-react";

export interface AnalysisData {
  id: string;
  filename: string;
  key: string;
  scale: string;
  bpm: number;
  rhythm: string;
  mood: string;
  created_at: string;
}

interface AnalysisResultsProps {
  data: AnalysisData | null;
  isLoading: boolean;
}

const AnalysisResults = ({ data, isLoading }: AnalysisResultsProps) => {
  if (isLoading) {
    return <AnalysisLoadingSkeleton />;
  }

  if (!data) {
    return (
      <Card className="border shadow-sm">
        <CardHeader className="pb-2">
          <CardTitle className="text-xl">Analysis Results</CardTitle>
        </CardHeader>
        <CardContent className="text-center py-8">
          <p className="text-muted-foreground">Upload an audio file to view analysis results.</p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="border shadow-sm overflow-hidden">
      <CardHeader className="bg-gradient-to-r from-secondary to-accent/40 pb-2">
        <div className="flex items-center justify-between">
          <CardTitle className="text-xl">Analysis Results</CardTitle>
          <span className="text-sm text-muted-foreground flex items-center">
            <FileMusic className="w-4 h-4 mr-1" />
            {data.filename}
          </span>
        </div>
      </CardHeader>
      <CardContent className="pt-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <AnalysisItem 
            icon={<Music className="w-5 h-5 text-primary" />}
            label="Musical Key"
            value={`${data.key} ${data.scale}`}
          />
          <AnalysisItem 
            icon={<Clock3 className="w-5 h-5 text-primary" />}
            label="Tempo (BPM)"
            value={data.bpm.toString()}
          />
          <AnalysisItem 
            icon={<BarChart3 className="w-5 h-5 text-primary" />}
            label="Rhythm Pattern"
            value={data.rhythm}
          />
          <AnalysisItem 
            icon={<PieChart className="w-5 h-5 text-primary" />}
            label="Mood"
            value={data.mood}
          />
        </div>
      </CardContent>
    </Card>
  );
};

const AnalysisItem = ({ 
  icon, 
  label, 
  value 
}: { 
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <div className="p-3 border rounded-lg bg-card/50">
    <div className="flex items-center gap-2 mb-1">
      {icon}
      <span className="text-sm font-medium text-muted-foreground">{label}</span>
    </div>
    <p className="text-lg font-semibold pl-7">{value}</p>
  </div>
);

const AnalysisLoadingSkeleton = () => (
  <Card className="border shadow-sm">
    <CardHeader className="pb-2">
      <CardTitle className="text-xl">Analyzing Audio...</CardTitle>
    </CardHeader>
    <CardContent className="pt-6">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {[1, 2, 3, 4].map((index) => (
          <div key={index} className="p-3 border rounded-lg">
            <div className="flex items-center gap-2 mb-1">
              <Skeleton className="h-5 w-5 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-7 w-36 ml-7 mt-1" />
          </div>
        ))}
      </div>
    </CardContent>
  </Card>
);

export default AnalysisResults;
