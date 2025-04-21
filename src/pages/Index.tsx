
import { useState } from 'react';
import Header from '@/components/Header';
import AudioUploader from '@/components/AudioUploader';
import AnalysisResults, { AnalysisData } from '@/components/AnalysisResults';
import PromptGenerator from '@/components/PromptGenerator';
import { analyzeAudio } from '@/lib/api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Card } from '@/components/ui/card';

const Index = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<AnalysisData | null>(null);

  const handleFileUpload = async (file: File) => {
    setIsAnalyzing(true);
    setAnalysisResults(null);
    
    try {
      const result = await analyzeAudio(file);
      setAnalysisResults({
        key: result.key,
        scale: result.scale,
        bpm: result.bpm,
        rhythm: result.rhythm,
        mood: result.mood,
        filename: result.filename,
        id: result.id,
        created_at: result.created_at,
      });
    } catch (error) {
      console.error('Error analyzing audio:', error);
      // Handle error
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-6 px-4 md:px-6">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <div className="md:col-span-1">
            <h2 className="text-xl font-semibold mb-4">Upload Audio</h2>
            <AudioUploader onUpload={handleFileUpload} isLoading={isAnalyzing} />
            <p className="text-sm text-muted-foreground mt-4 text-center">
              Upload an audio file to extract musical characteristics and generate creative AI prompts.
            </p>
          </div>
          
          <div className="md:col-span-2">
            <Tabs defaultValue="analysis" className="w-full">
              <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="analysis">Analysis Results</TabsTrigger>
                <TabsTrigger value="prompt" disabled={!analysisResults}>Prompt Generator</TabsTrigger>
              </TabsList>
              <TabsContent value="analysis">
                {!analysisResults && !isAnalyzing ? (
                  <Card className="p-6 text-center text-muted-foreground">
                    <p>Upload an audio file to see analysis results here.</p>
                  </Card>
                ) : (
                  <AnalysisResults data={analysisResults} isLoading={isAnalyzing} />
                )}
              </TabsContent>
              <TabsContent value="prompt">
                <PromptGenerator analysisData={analysisResults} />
              </TabsContent>
            </Tabs>
          </div>
        </div>
        
        <div className="mt-12 text-sm text-muted-foreground">
          <h3 className="font-medium mb-2">How it works:</h3>
          <ol className="list-decimal pl-5 space-y-1">
            <li>Upload an audio file (MP3, WAV, etc.)</li>
            <li>Our backend analyzes the audio to extract musical features</li>
            <li>Results are stored in Supabase database</li>
            <li>Generate a creative prompt for AI music generation tools like Suno</li>
          </ol>
        </div>
      </main>
    </div>
  );
};

export default Index;
