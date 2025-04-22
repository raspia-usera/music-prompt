
import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Header from '@/components/Header';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { getRecentAnalyses } from '@/lib/api';
import { AudioAnalysisResult } from '@/types';
import { FileMusic, MusicIcon, Clock, Calendar } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Skeleton } from '@/components/ui/skeleton';

const RecentAnalyses = () => {
  const [analyses, setAnalyses] = useState<AudioAnalysisResult[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchAnalyses = async () => {
      try {
        setLoading(true);
        const data = await getRecentAnalyses(20);
        setAnalyses(data || []);
        setError(null);
      } catch (err) {
        console.error('Error fetching analyses:', err);
        setError('Failed to load analysis history');
      } finally {
        setLoading(false);
      }
    };

    fetchAnalyses();
  }, []);

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return new Intl.DateTimeFormat('en-US', { 
      month: 'short', 
      day: 'numeric', 
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    }).format(date);
  };

  return (
    <div className="min-h-screen bg-background">
      <Header />
      <main className="container mx-auto py-12 px-4 md:px-6 relative z-20">
        <div className="max-w-4xl mx-auto">
          <div className="flex items-center justify-between mb-6">
            <div>
              <h1 className="text-3xl font-bold">Analysis History</h1>
              <p className="text-muted-foreground">View your past audio analyses</p>
            </div>
            <Button asChild>
              <Link to="/">New Analysis</Link>
            </Button>
          </div>

          <Card className="border shadow-sm">
            <CardHeader className="bg-gradient-to-r from-secondary to-accent/40 pb-4">
              <CardTitle>Recent Analyses</CardTitle>
            </CardHeader>
            <CardContent className="p-0">
              {loading ? (
                <div className="p-4">
                  <HistorySkeleton />
                </div>
              ) : error ? (
                <div className="p-8 text-center">
                  <p className="text-destructive">{error}</p>
                  <Button 
                    variant="outline" 
                    onClick={() => window.location.reload()}
                    className="mt-4"
                  >
                    Try Again
                  </Button>
                </div>
              ) : analyses.length === 0 ? (
                <div className="p-8 text-center">
                  <p className="text-muted-foreground">No analysis history found</p>
                  <Button 
                    asChild
                    className="mt-4"
                  >
                    <Link to="/">Analyze Your First Track</Link>
                  </Button>
                </div>
              ) : (
                <div className="divide-y divide-border">
                  {analyses.map((analysis) => (
                    <div key={analysis.id} className="p-4 hover:bg-secondary/30 transition-colors">
                      <div className="flex justify-between items-start">
                        <div className="flex items-start gap-3">
                          <div className="bg-primary/20 p-2 rounded-md">
                            <FileMusic className="h-6 w-6 text-primary" />
                          </div>
                          <div>
                            <h3 className="font-medium">{analysis.filename}</h3>
                            <div className="flex items-center gap-4 text-sm text-muted-foreground mt-1">
                              <div className="flex items-center">
                                <MusicIcon className="h-3 w-3 mr-1" />
                                {analysis.key} {analysis.scale}
                              </div>
                              <div className="flex items-center">
                                <Clock className="h-3 w-3 mr-1" />
                                {analysis.bpm} BPM
                              </div>
                              <div className="hidden md:flex items-center">
                                <Calendar className="h-3 w-3 mr-1" />
                                {formatDate(analysis.created_at)}
                              </div>
                            </div>
                          </div>
                        </div>
                        
                        <div className="hidden md:block">
                          <span className="inline-block px-2 py-1 text-xs rounded-full bg-secondary">
                            {analysis.mood}
                          </span>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          <div className="mt-12">
            <h2 className="text-xl font-bold mb-4">Python Backend Setup</h2>
            <Card className="border shadow-sm">
              <CardContent className="p-4">
                <p className="mb-4">
                  To enable accurate audio analysis, you'll need to set up the Python backend. Here's how:
                </p>
                
                <ol className="list-decimal pl-5 space-y-2 text-sm">
                  <li>
                    <strong>Install Python dependencies:</strong>
                    <pre className="bg-muted p-2 rounded mt-1 overflow-x-auto">
                      <code>pip install fastapi uvicorn python-multipart librosa numpy soundfile</code>
                    </pre>
                  </li>
                  <li>
                    <strong>Create an API server file (main.py):</strong> 
                    <p className="text-muted-foreground mt-1">
                      The Python code is available in the project's <code>src/pythonBackend/README.md</code> file.
                    </p>
                  </li>
                  <li>
                    <strong>Run the server:</strong>
                    <pre className="bg-muted p-2 rounded mt-1 overflow-x-auto">
                      <code>uvicorn main:app --reload</code>
                    </pre>
                  </li>
                  <li>
                    <strong>Connect the frontend:</strong>
                    <p className="text-muted-foreground mt-1">
                      The app is already configured to use the Python backend when available, falling back to mock data when not.
                    </p>
                  </li>
                </ol>
                
                <p className="mt-4 text-sm text-muted-foreground">
                  Note: Until the Python backend is running, the app will use mock data for analysis.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>
    </div>
  );
};

const HistorySkeleton = () => (
  <div className="space-y-4">
    {[1, 2, 3].map((i) => (
      <div key={i} className="flex justify-between items-start">
        <div className="flex items-start gap-3">
          <Skeleton className="h-10 w-10 rounded-md" />
          <div>
            <Skeleton className="h-5 w-40 mb-2" />
            <div className="flex gap-3">
              <Skeleton className="h-4 w-20" />
              <Skeleton className="h-4 w-20" />
            </div>
          </div>
        </div>
        <Skeleton className="h-6 w-16 rounded-full" />
      </div>
    ))}
  </div>
);

export default RecentAnalyses;
