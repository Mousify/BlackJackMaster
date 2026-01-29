import { motion, AnimatePresence } from "framer-motion";
import { GameResult } from "@/lib/blackjack-engine";
import { ActionButton } from "./ActionButton";

interface GameOverlayProps {
  result: GameResult;
  onRestart: () => void;
  currentBet?: number;
}

export function GameOverlay({ result, onRestart, currentBet = 0 }: GameOverlayProps) {
  const getMessage = (res: GameResult) => {
    switch (res) {
      case 'win': return { 
        title: "YOU WIN!", 
        color: "text-secondary",
        payout: `+$${currentBet * 2}`
      };
      case 'blackjack': return { 
        title: "BLACKJACK!", 
        color: "text-secondary",
        payout: `+$${currentBet + Math.floor(currentBet * 1.5)}`
      };
      case 'loss': return { 
        title: "DEALER WINS", 
        color: "text-red-400",
        payout: `-$${currentBet}`
      };
      case 'bust': return { 
        title: "BUST!", 
        color: "text-red-400",
        payout: `-$${currentBet}`
      };
      case 'push': return { 
        title: "PUSH", 
        color: "text-blue-300",
        payout: `$0`
      };
      default: return { title: "", color: "", payout: "" };
    }
  };

  const { title, color, payout } = getMessage(result);

  return (
    <AnimatePresence>
      {result && (
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0 }}
          className="absolute inset-0 z-50 flex items-center justify-center pointer-events-none"
        >
          <div className="bg-black/70 backdrop-blur-md p-8 md:p-12 rounded-3xl text-center shadow-2xl border border-white/10 pointer-events-auto">
            <motion.h2 
              initial={{ y: 20, opacity: 0 }}
              animate={{ y: 0, opacity: 1 }}
              className={`text-4xl md:text-6xl font-display font-black mb-2 drop-shadow-lg ${color}`}
            >
              {title}
            </motion.h2>
            
            {currentBet > 0 && (
              <motion.p
                initial={{ y: 10, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className={`text-2xl md:text-3xl font-bold mb-6 ${
                  result === 'win' || result === 'blackjack' 
                    ? 'text-green-400' 
                    : result === 'push' 
                      ? 'text-blue-300' 
                      : 'text-red-400'
                }`}
              >
                {payout}
              </motion.p>
            )}
            
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
