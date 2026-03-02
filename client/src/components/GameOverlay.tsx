import { motion, AnimatePresence } from "framer-motion";
import { GameResult } from "@/lib/blackjack-engine";
import { ActionButton } from "./ActionButton";
import { X } from "lucide-react";
import { useSound } from "@/hooks/use-sound";

interface GameOverlayProps {
  result: GameResult;
  onRestart: () => void;
  onClose: () => void;
  currentBet?: number;
}

export function GameOverlay({ result, onRestart, onClose, currentBet = 0 }: GameOverlayProps) {
  const { playSFX } = useSound();
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

  const handleRestart = () => {
    playSFX('buttonClick');
    onRestart();
  };

  const handleClose = () => {
    playSFX('buttonClick');
    onClose();
  };

  return (
    <AnimatePresence>
      {result && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[100] flex items-center justify-center bg-black/40 backdrop-blur-sm"
        >
          <motion.div
            initial={{ scale: 0.8, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            className="bg-black/80 backdrop-blur-md p-8 md:p-12 rounded-3xl text-center shadow-2xl border border-white/10 relative max-w-sm w-full mx-4"
          >
            <button 
              onClick={handleClose}
              className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

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
              onClick={handleRestart} 
              variant="primary"
              className="w-full"
            >
              Play Again
            </ActionButton>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
