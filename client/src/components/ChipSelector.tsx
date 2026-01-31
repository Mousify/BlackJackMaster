import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

import chip1Img from "@assets/chip-1_1769865411535.png";
import chip5Img from "@assets/chip-5_1769865411535.png";
import chip25Img from "@assets/chip-25_1769865411536.png";
import chip100Img from "@assets/chip-100_1769865411536.png";
import chip500Img from "@assets/chip-500_1769865411536.png";

interface ChipSelectorProps {
  balance: number;
  currentBet: number;
  onBetChange: (amount: number) => void;
  disabled?: boolean;
}

const CHIP_VALUES = [
  { value: 1, image: chip1Img },
  { value: 5, image: chip5Img },
  { value: 25, image: chip25Img },
  { value: 100, image: chip100Img },
  { value: 500, image: chip500Img },
];

export function ChipSelector({ balance, currentBet, onBetChange, disabled }: ChipSelectorProps) {
  const addToBet = (amount: number) => {
    if (disabled) return;
    if (currentBet + amount <= balance) {
      onBetChange(currentBet + amount);
    }
  };

  const clearBet = () => {
    if (disabled) return;
    onBetChange(0);
  };

  return (
    <div className="flex flex-col items-center gap-4">
      {/* Balance Display */}
      <div className="flex items-center gap-6 text-white/80">
        <div className="text-center">
          <p className="text-xs uppercase tracking-wider text-white/50">Balance</p>
          <p className="font-bold text-xl font-display text-secondary">${balance}</p>
        </div>
        <div className="w-px h-8 bg-white/20" />
        <div className="text-center">
          <p className="text-xs uppercase tracking-wider text-white/50">Bet</p>
          <p className="font-bold text-xl font-display text-white">${currentBet}</p>
        </div>
      </div>

      {/* Chips */}
      <div className="flex gap-2 flex-wrap justify-center">
        {CHIP_VALUES.map((chip) => (
          <motion.button
            key={chip.value}
            whileHover={{ scale: disabled ? 1 : 1.1, y: disabled ? 0 : -5 }}
            whileTap={{ scale: disabled ? 1 : 0.95 }}
            onClick={() => addToBet(chip.value)}
            disabled={disabled || currentBet + chip.value > balance}
            data-testid={`chip-${chip.value}`}
            className={cn(
              "w-14 h-14 md:w-16 md:h-16 transition-all",
              disabled || currentBet + chip.value > balance
                ? "opacity-40 cursor-not-allowed grayscale"
                : "cursor-pointer hover:brightness-110"
            )}
          >
            <img 
              src={chip.image} 
              alt={`$${chip.value} chip`}
              className="w-full h-full object-contain drop-shadow-lg"
            />
          </motion.button>
        ))}
      </div>

      {/* Clear Bet Button */}
      {currentBet > 0 && !disabled && (
        <motion.button
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          onClick={clearBet}
          data-testid="button-clear-bet"
          className="text-white/60 hover:text-white text-sm underline transition-colors"
        >
          Clear Bet
        </motion.button>
      )}
    </div>
  );
}
