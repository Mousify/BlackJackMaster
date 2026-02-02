import { useAuth } from "@/contexts/AuthContext";
import { Link } from "wouter";
import { motion } from "framer-motion";
import { LogIn, UserPlus } from "lucide-react";

import casinoBgImg from "@assets/casino-background_1769865411534.jpg";
import logoImg from "@assets/logo_1769865411538.png";

interface RequireAuthProps {
  children: React.ReactNode;
}

export function RequireAuth({ children }: RequireAuthProps) {
  const { user, isLoading } = useAuth();

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-background">
        <div className="w-8 h-8 border-2 border-secondary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  if (!user) {
    return (
      <div className="min-h-screen text-foreground flex flex-col relative overflow-hidden">
        {/* Background */}
        <div 
          className="absolute inset-0 bg-cover bg-center bg-no-repeat"
          style={{ backgroundImage: `url(${casinoBgImg})` }}
        >
          <div className="absolute inset-0 bg-black/60" />
        </div>

        {/* Content */}
        <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
          <motion.div
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center"
          >
            <img 
              src={logoImg} 
              alt="Blackjack Royal"
              className="h-12 mx-auto mb-6"
            />
            <h1 className="text-2xl font-bold text-white font-display mb-2">
              Account Required
            </h1>
            <p className="text-white/60 mb-8 max-w-sm">
              Please log in or create an account to play Blackjack and track your stats.
            </p>

            <div className="flex flex-col gap-3 w-full max-w-xs mx-auto">
              <Link href="/login">
                <button
                  data-testid="button-login-prompt"
                  className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-3 px-6 rounded-xl text-lg flex items-center justify-center gap-2 transition-all"
                >
                  <LogIn className="w-5 h-5" />
                  Log In
                </button>
              </Link>
              <Link href="/signup">
                <button
                  data-testid="button-signup-prompt"
                  className="w-full bg-secondary hover:bg-secondary/90 text-black font-bold py-3 px-6 rounded-xl text-lg flex items-center justify-center gap-2 transition-all"
                >
                  <UserPlus className="w-5 h-5" />
                  Create Account
                </button>
              </Link>
              <Link href="/">
                <button
                  data-testid="button-back-home"
                  className="w-full text-white/60 hover:text-white py-2 transition-colors"
                >
                  Back to Home
                </button>
              </Link>
            </div>
          </motion.div>
        </main>
      </div>
    );
  }

  return <>{children}</>;
}
