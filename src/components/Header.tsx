
import { Separator } from "@/components/ui/separator";

export default function Header() {
  return (
    <header className="container mx-auto py-6">
      <div className="flex flex-col items-center text-center">
        <h1 className="text-4xl font-bold tracking-tight">Audio Muse Generator</h1>
        <p className="mt-2 text-lg text-muted-foreground max-w-2xl">
          Upload your audio files, analyze their musical characteristics, and generate creative prompts for AI music tools.
        </p>
      </div>
      <Separator className="mt-6" />
    </header>
  );
}
