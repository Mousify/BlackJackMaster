import { motion } from "framer-motion";
import { Link } from "wouter";
import { PlayCircle, Trophy } from "lucide-react";

import logoImg from "@assets/logo_1769865411538.png";
import casinoBgImg from "@assets/casino-background_1769865411534.jpg";
import chip1Img from "@assets/chip-1_1769865411535.png";
import chip5Img from "@assets/chip-5_1769865411535.png";
import chip25Img from "@assets/chip-25_1769865411536.png";
import chip100Img from "@assets/chip-100_1769865411536.png";

export default function Landing() {
  const chips = [
    { value: 1, image: chip1Img },
    { value: 5, image: chip5Img },
    { value: 25, image: chip25Img },
    { value: 100, image: chip100Img },
  ];

  return (
    <div className="min-h-screen text-foreground flex flex-col relative overflow-hidden">
      {/* Casino Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${casinoBgImg})` }}
      >
        <div className="absolute inset-0 bg-black/40" />
      </div>

      {/* Decorative Table Ring */}
      <div className="absolute inset-0 pointer-events-none flex items-center justify-center">
        <div className="w-[600px] h-[300px] border-4 border-white/5 rounded-[150px]" />
      </div>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 relative z-10">
        {/* Logo */}
        <motion.div
          initial={{ opacity: 0, y: -30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="text-center mb-8"
        >
          <img 
            src={logoImg} 
            alt="Blackjack Royal"
            className="h-16 md:h-20 mx-auto mb-4 drop-shadow-2xl"
          />
          <p className="text-white/60 text-lg md:text-xl max-w-md mx-auto">
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
          {chips.map((chip, i) => (
            <motion.div
              key={chip.value}
              initial={{ y: 50, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              transition={{ delay: 0.3 + i * 0.1 }}
              className="w-14 h-14 md:w-16 md:h-16"
            >
              <img 
                src={chip.image} 
                alt={`$${chip.value} chip`}
                className="w-full h-full object-contain drop-shadow-lg"
              />
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
      <footer className="p-4 text-center text-white/30 text-xs relative z-10">
        Blackjack pays 3:2
      </footer>
    </div>
  );
}
