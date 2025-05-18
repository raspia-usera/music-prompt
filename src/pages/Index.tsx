
import { useState } from 'react';
import Header from '@/components/Header';
import AnalysisResults, { AnalysisData } from '@/components/AnalysisResults';
import PromptGenerator from '@/components/PromptGenerator';
import { analyzeAudio } from '@/lib/api';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Music } from 'lucide-react';
import AudioInputToggle from '@/components/AudioInputToggle';
import { toast } from '@/components/ui/use-toast';

const Index = () => {
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [analysisResults, setAnalysisResults] = useState<AnalysisData | null>(null);
  const [analysisStep, setAnalysisStep] = useState<string>('');

  const handleFileUpload = async (file: File) => {
    setIsAnalyzing(true);
    setAnalysisResults(null);
    
    try {
      setAnalysisStep('Reading audio file...');
      
      setTimeout(() => setAnalysisStep('Extracting audio features...'), 1000);
      setTimeout(() => setAnalysisStep('Analyzing key and scale...'), 3000);
      setTimeout(() => setAnalysisStep('Detecting rhythm patterns...'), 5000);
      setTimeout(() => setAnalysisStep('Analyzing mood characteristics...'), 7000);
      
      const result = await analyzeAudio(file);
      
      setAnalysisStep('Saving results...');
      
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
      
      toast({
        title: "Analysis Complete",
        description: `Analyzed ${file.name} successfully!`,
      });
    } catch (error) {
      console.error('Error analyzing audio:', error);
      toast({
        title: "Analysis Error",
        description: "There was a problem analyzing your audio file. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
      setAnalysisStep('');
    }
  };
  
  const handleUrlSubmit = async (url: string) => {
    setIsAnalyzing(true);
    setAnalysisResults(null);
    
    try {
      setAnalysisStep('Fetching audio from URL...');
      
      setTimeout(() => setAnalysisStep('Extracting audio features...'), 2000);
      setTimeout(() => setAnalysisStep('Analyzing key and scale...'), 4000);
      setTimeout(() => setAnalysisStep('Detecting rhythm patterns...'), 6000);
      setTimeout(() => setAnalysisStep('Analyzing mood characteristics...'), 8000);
      
      const result = await analyzeAudio(url);
      
      setAnalysisStep('Saving results...');
      
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
      
      toast({
        title: "Analysis Complete",
        description: `Analyzed audio from URL successfully!`,
      });
    } catch (error) {
      console.error('Error analyzing audio from URL:', error);
      toast({
        title: "Analysis Error",
        description: "There was a problem analyzing the audio from the provided URL. Please try again with a different URL.",
        variant: "destructive",
      });
    } finally {
      setIsAnalyzing(false);
      setAnalysisStep('');
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
                <h2 className="text-2xl font-bold text-foreground">Create AI Samples</h2>
                <p className="text-muted-foreground">Upload audio or enter URL to generate Suno-ready prompts</p>
              </div>
              
              <AudioInputToggle 
                onUpload={handleFileUpload} 
                onUrlSubmit={handleUrlSubmit}
                isLoading={isAnalyzing} 
              />
              
              {isAnalyzing && analysisStep && (
                <div className="mt-4 p-3 border border-primary/20 rounded-lg bg-primary/5">
                  <p className="text-sm font-medium text-foreground">{analysisStep}</p>
                  <div className="w-full h-1 bg-secondary mt-2 overflow-hidden rounded-full">
                    <div className="h-full bg-primary animate-progress rounded-full"></div>
                  </div>
                </div>
              )}
              
              <div className="mt-6 p-4 bg-primary/5 rounded-lg border border-primary/20">
                <h3 className="font-medium mb-2 flex items-center">
                  <Music className="w-4 h-4 mr-2 text-primary" />
                  How it works
                </h3>
                <ol className="list-decimal pl-5 space-y-1 text-sm text-muted-foreground">
                  <li>Upload your audio file or enter URL</li>
                  <li>Our AI analyzes the musical characteristics</li>
                  <li>Customize your prompt settings</li>
                  <li>Generate complementary sample prompts for Suno</li>
                  <li>Copy and paste into Suno.com</li>
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
                    Suno Prompt Creator
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
