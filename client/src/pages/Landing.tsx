import { motion } from "framer-motion";
import { Link } from "wouter";
import { PlayCircle, Trophy, Spade, Heart, Diamond, Club } from "lucide-react";

export default function Landing() {
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden">
      {/* Floating Card Suits Background */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <motion.div
          animate={{ y: [0, -20, 0], rotate: [0, 5, 0] }}
          transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
          className="absolute top-[10%] left-[10%] text-white/5"
        >
          <Spade className="w-32 h-32" />
        </motion.div>
        <motion.div
          animate={{ y: [0, 20, 0], rotate: [0, -5, 0] }}
          transition={{ duration: 5, repeat: Infinity, ease: "easeInOut", delay: 0.5 }}
          className="absolute top-[20%] right-[15%] text-red-500/10"
        >
          <Heart className="w-24 h-24" />
        </motion.div>
        <motion.div
          animate={{ y: [0, -15, 0], rotate: [0, -3, 0] }}
          transition={{ duration: 7, repeat: Infinity, ease: "easeInOut", delay: 1 }}
          className="absolute bottom-[30%] left-[20%] text-red-500/10"
        >
          <Diamond className="w-28 h-28" />
        </motion.div>
        <motion.div
          animate={{ y: [0, 15, 0], rotate: [0, 4, 0] }}
          transition={{ duration: 5.5, repeat: Infinity, ease: "easeInOut", delay: 1.5 }}
          className="absolute bottom-[20%] right-[10%] text-white/5"
        >
          <Club className="w-36 h-36" />
        </motion.div>
      </div>

      {/* Decorative Table Ring */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[600px] h-[300px] border-4 border-white/5 rounded-[150px]" />
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        {/* Logo / Title */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-12"
        >
          <div className="inline-flex items-center justify-center gap-4 mb-4">
            <div className="bg-primary/20 p-4 rounded-2xl border border-primary/30">
              <span className="font-display font-bold text-primary text-5xl tracking-wider">21</span>
            </div>
          </div>
          <h1 className="font-display font-bold text-4xl md:text-6xl text-white mb-3">
            BLACKJACK PRO
          </h1>
          <p className="text-white/50 text-lg md:text-xl max-w-md mx-auto">
            Classic casino blackjack with betting chips. Beat the dealer to 21!
          </p>
        </motion.div>

        {/* Chip Display */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="flex gap-3 mb-12"
        >
          {[
            { value: 5, color: "bg-red-600" },
            { value: 10, color: "bg-blue-600" },
            { value: 25, color: "bg-green-600" },
            { value: 100, color: "bg-black" },
          ].map((chip, i) => (
            <motion.div
              key={chip.value}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className={`${chip.color} w-14 h-14 md:w-16 md:h-16 rounded-full border-4 border-white/30 flex items-center justify-center shadow-lg`}
            >
              <span className="text-white font-bold text-sm md:text-base">${chip.value}</span>
            </motion.div>
          ))}
        </motion.div>

        {/* Action Buttons */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="flex flex-col gap-4 w-full max-w-xs"
        >
          <Link href="/game">
            <button
              data-testid="button-play"
              className="w-full bg-primary hover:bg-primary/90 text-primary-foreground font-bold py-4 px-8 rounded-2xl text-xl flex items-center justify-center gap-3 transition-all shadow-lg shadow-primary/30"
            >
              <PlayCircle className="w-7 h-7" />
              PLAY NOW
            </button>
          </Link>
          <Link href="/stats">
            <button
              data-testid="button-stats"
              className="w-full bg-white/10 hover:bg-white/20 text-white font-semibold py-3 px-8 rounded-2xl text-lg flex items-center justify-center gap-3 transition-all border border-white/10"
            >
              <Trophy className="w-5 h-5" />
              View Stats
            </button>
          </Link>
        </motion.div>

        {/* Game Rules Quick View */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
          className="mt-12 text-center text-white/40 text-sm max-w-sm"
        >
          <p className="mb-2 font-semibold text-white/60">Quick Rules</p>
          <p>Get closer to 21 than the dealer without going over. Aces count as 1 or 11. Face cards are worth 10.</p>
        </motion.div>
      </main>

      {/* Footer */}
      <footer className="p-4 text-center text-white/30 text-xs">
        Blackjack pays 3:2
      </footer>
    </div>
  );
}
