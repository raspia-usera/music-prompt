
import { Link } from "react-router-dom";
import { MusicIcon, HistoryIcon } from "lucide-react";

const Header = () => {
  return (
    <header className="bg-gradient-to-r from-secondary to-accent py-4 border-b border-border relative">
      <div className="container mx-auto px-4 flex justify-between items-center">
        <Link to="/" className="flex items-center gap-2">
          <div className="bg-primary rounded-full p-2 shadow-lg">
            <MusicIcon className="h-6 w-6 text-primary-foreground" />
          </div>
          <div>
            <h1 className="text-2xl font-bold tracking-wide text-foreground">Music Prompt</h1>
            <p className="text-xs text-muted-foreground">Audio analysis for AI music generation</p>
          </div>
        </Link>
        
        <nav className="hidden md:flex space-x-4">
          <Link 
            to="/" 
            className="px-3 py-1 rounded-md hover:bg-secondary-foreground/10 transition-colors text-foreground"
          >
            Analyze
          </Link>
          <Link 
            to="/history" 
            className="px-3 py-1 rounded-md hover:bg-secondary-foreground/10 transition-colors text-foreground flex items-center gap-1"
          >
            <HistoryIcon className="w-4 h-4" />
            History
          </Link>
        </nav>
        
        <Link 
          to="/history" 
          className="md:hidden flex items-center justify-center w-10 h-10 rounded-full hover:bg-secondary-foreground/10"
        >
          <HistoryIcon className="w-5 h-5" />
        </Link>
      </div>
      <div className="wave-divider absolute -bottom-14 left-0 right-0 z-10"></div>
    </header>
  );
};

export default Header;
