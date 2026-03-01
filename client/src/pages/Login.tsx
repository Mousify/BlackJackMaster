import { useState } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";
import { LogIn, UserPlus, ArrowLeft } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useSound } from "@/hooks/use-sound";

import logoImg from "@assets/logo_1769865411538.png";
import casinoBgImg from "@assets/casino-background_1769865411534.jpg";

export default function Login() {
  const [username, setUsername] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const { login } = useAuth();
  const { playSFX } = useSound();
  const [, setLocation] = useLocation();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!username.trim()) {
      setError("Please enter a username");
      return;
    }

    setIsLoading(true);
    setError("");
    playSFX('buttonClick');

    const result = await login(username.trim());
    setIsLoading(false);

    if (result.success) {
      playSFX('dealerWelcome');
      setLocation("/");
    } else {
      setError(result.error || "Login failed");
    }
  };

  return (
    <div className="min-h-screen text-foreground flex flex-col relative overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${casinoBgImg})` }}
      >
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Back Button */}
      <div className="absolute top-4 left-4 z-20">
        <Link href="/">
          <button
            onClick={() => playSFX('buttonClick')}
            data-testid="button-back"
            className="text-white/70 hover:text-white transition-colors flex items-center gap-2 font-medium bg-black/30 px-3 py-2 rounded-full hover:bg-black/40"
          >
            <ArrowLeft className="w-4 h-4" />
            Back
          </button>
        </Link>
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          {/* Logo */}
          <div className="text-center mb-8">
            <img 
              src={logoImg} 
              alt="Blackjack Royal"
              className="h-12 mx-auto mb-4"
            />
            <h1 className="text-2xl font-bold text-white font-display">Welcome Back</h1>
            <p className="text-white/60 mt-2">Enter your username to continue</p>
          </div>

          {/* Form */}
          <form onSubmit={handleSubmit} className="space-y-4">
            <div>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Username"
                data-testid="input-username"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-secondary/60 transition-colors"
                maxLength={20}
              />
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 text-sm text-center"
              >
                {error}
              </motion.p>
            )}

            <button
              type="submit"
              disabled={isLoading}
              data-testid="button-login"
              className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground font-bold py-3 px-6 rounded-xl text-lg flex items-center justify-center gap-2 transition-all"
            >
              <LogIn className="w-5 h-5" />
              {isLoading ? "Logging in..." : "Log In"}
            </button>
          </form>

          {/* Signup Link */}
          <div className="mt-6 text-center">
            <p className="text-white/50 text-sm">
              Don't have an account?{" "}
              <Link href="/signup">
                <span className="text-secondary hover:underline cursor-pointer">
                  Create one
                </span>
              </Link>
            </p>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
