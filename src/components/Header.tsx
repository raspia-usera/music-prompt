
import { Link } from "react-router-dom";
import { MusicIcon, HistoryIcon } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-primary/20 to-accent/20 py-4 border-b border-border relative">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="rounded-full w-10 h-10 overflow-hidden shadow-lg border border-accent/50">
            <img 
              src="/lovable-uploads/cf79c493-70ca-49b2-bf41-0eff9861f563.png" 
              alt="Music Prompt Logo" 
              className="w-full h-full object-cover"
            />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-wide text-foreground">Music Prompt</h1>
            <p className="text-xs text-muted-foreground">Audio analysis for AI music generation</p>
          </div>
        </Link>
        
        <nav className="hidden md:flex space-x-4">
          <Link 
            to="/" 
            className="px-3 py-1 rounded-md hover:bg-primary/10 transition-colors text-foreground"
          >
            Analyze
          </Link>
          <Link 
            to="/history" 
            className="px-3 py-1 rounded-md hover:bg-primary/10 transition-colors text-foreground flex items-center gap-1"
          >
            <HistoryIcon className="w-4 h-4" />
            History
          </Link>
        </nav>
        
        <Link 
          to="/history" 
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-full hover:bg-primary/10"
        >
          <HistoryIcon className="w-5 h-5" />
        </Link>
      </div>
      <div className="wave-divider absolute -bottom-14 left-0 right-0 z-10"></div>
    </header>
  );
};

export default Header;
