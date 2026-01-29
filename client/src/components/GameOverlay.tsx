import { motion, AnimatePresence } from "framer-motion";
import { GameResult } from "@/lib/blackjack-engine";
import { ActionButton } from "./ActionButton";

interface GameOverlayProps {
  result: GameResult;
  onRestart: () => void;
}

export function GameOverlay({ result, onRestart }: GameOverlayProps) {
  const getMessage = (res: GameResult) => {
    switch (res) {
      case 'win': return { title: "YOU WIN!", color: "text-secondary" };
      case 'blackjack': return { title: "BLACKJACK!", color: "text-secondary" };
      case 'loss': return { title: "DEALER WINS", color: "text-red-400" };
      case 'bust': return { title: "BUST!", color: "text-red-400" };
      case 'push': return { title: "PUSH", color: "text-blue-300" };
      default: return { title: "", color: "" };
    }
  };

  const { title, color } = getMessage(result);

  return (
    <AnimatePresence>
      {result && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"
        >
          <div className="bg-black/60 backdrop-blur-md p-8 md:p-12 rounded-3xl text-center shadow-2xl border border-white/10 pointer-events-auto">
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className={`text-5xl md:text-7xl font-display font-black mb-6 drop-shadow-lg ${color}`}
            >
              {title}
            </motion.h2>
            
            <ActionButton 
              onClick={onRestart} 
              variant="primary"
              className="w-full"
            >
              Play Again
            </ActionButton>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
