import { Link } from "wouter";
import { AlertCircle } from "lucide-react";

export default function NotFound() {
  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-background text-foreground">
      <div className="flex flex-col items-center gap-6 p-8 border border-white/10 bg-black/20 rounded-3xl backdrop-blur-sm shadow-2xl">
        <div className="p-4 bg-red-500/20 rounded-full text-red-400">
          <AlertCircle className="w-16 h-16" />
        </div>
        <h1 className="text-5xl font-display font-bold">404</h1>
        <p className="text-lg text-white/60 font-mono">You've gone bust looking for this page.</p>
        
        <Link href="/" className="px-8 py-3 bg-primary text-primary-foreground font-bold rounded-xl hover:bg-primary/90 transition-colors">
          Return to Table
        </Link>
      </div>
    </div>
  );
}
