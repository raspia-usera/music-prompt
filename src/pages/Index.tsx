
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
      // Toast notification is handled in the API function
    } finally {
      setIsAnalyzing(false);
    }
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-12 px-4 md:px-6 relative z-20">
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="md:col-span-1">
              <div className="space-y-2 mb-4">
                <h2 className="text-2xl font-bold text-foreground">Create AI Music</h2>
                <p className="text-muted-foreground">Upload your audio and get AI-ready prompts</p>
              </div>
              
              <AudioUploader onUpload={handleFileUpload} isLoading={isAnalyzing} />
              
              <div className="mt-6 p-4 bg-secondary/50 rounded-lg border border-border">
                <h3 className="font-medium mb-2">How it works</h3>
                <ol className="list-decimal pl-5 space-y-1 text-sm text-muted-foreground">
                  <li>Upload any audio file (MP3, WAV, etc.)</li>
                  <li>Our AI analyzes musical characteristics</li>
                  <li>Results are stored for later reference</li>
                  <li>Generate AI music prompts from the analysis</li>
                </ol>
              </div>
            </div>
            
            <div className="md:col-span-2">
              <Tabs defaultValue="analysis" className="w-full">
                <TabsList className="grid w-full grid-cols-2 mb-6">
                  <TabsTrigger value="analysis" className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    Analysis Results
                  </TabsTrigger>
                  <TabsTrigger value="prompt" disabled={!analysisResults} className="data-[state=active]:bg-primary data-[state=active]:text-primary-foreground">
                    AI Prompt Generator
                  </TabsTrigger>
                </TabsList>
                <TabsContent value="analysis" className="mt-0">
                  <AnalysisResults data={analysisResults} isLoading={isAnalyzing} />
                </TabsContent>
                <TabsContent value="prompt" className="mt-0">
                  <PromptGenerator analysisData={analysisResults} />
                </TabsContent>
              </Tabs>
              
              {!isAnalyzing && analysisResults && (
                <div className="mt-6 text-center">
                  <p className="text-xs text-muted-foreground">
                    Analysis ID: {analysisResults.id} • Processed on {new Date(analysisResults.created_at).toLocaleString()}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </main>
    </div>
  );
};

export default Index;
