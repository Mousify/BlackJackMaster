import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useMemo } from "react";

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

// Convert a bet amount to optimal chip breakdown (rounds up smaller chips to bigger ones)
function getChipBreakdown(amount: number): { value: number; count: number; image: string }[] {
  const breakdown: { value: number; count: number; image: string }[] = [];
  let remaining = amount;
  
  // Start from highest denomination
  const sortedChips = [...CHIP_VALUES].sort((a, b) => b.value - a.value);
  
  for (const chip of sortedChips) {
    const count = Math.floor(remaining / chip.value);
    if (count > 0) {
      breakdown.push({ value: chip.value, count, image: chip.image });
      remaining -= count * chip.value;
    }
  }
  
  return breakdown;
}

// Flatten breakdown into individual chips for stacking display
function getStackedChips(amount: number): { value: number; image: string; id: number }[] {
  const breakdown = getChipBreakdown(amount);
  const chips: { value: number; image: string; id: number }[] = [];
  let id = 0;
  
  for (const { value, count, image } of breakdown) {
    for (let i = 0; i < Math.min(count, 5); i++) { // Max 5 of each type shown
      chips.push({ value, image, id: id++ });
    }
  }
  
  return chips;
}

export function ChipSelector({ balance, currentBet, onBetChange, disabled }: ChipSelectorProps) {
  const stackedChips = useMemo(() => getStackedChips(currentBet), [currentBet]);
  const chipBreakdown = useMemo(() => getChipBreakdown(currentBet), [currentBet]);
  
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
    <div className="flex flex-col md:flex-row items-center gap-6">
      {/* Betting Circle Area (Left side on desktop) */}
      <div className="relative order-2 md:order-1">
        <div 
          className={cn(
            "w-28 h-28 md:w-32 md:h-32 rounded-full border-4 border-dashed transition-all duration-300",
            "flex items-center justify-center relative",
            currentBet > 0 
              ? "border-secondary/60 bg-secondary/10" 
              : "border-white/20 bg-white/5"
          )}
        >
          {/* Stacked chips in the circle */}
          <div className="relative w-16 h-16 md:w-20 md:h-20">
            <AnimatePresence>
              {stackedChips.map((chip, index) => (
                <motion.img
                  key={`${chip.value}-${chip.id}`}
                  src={chip.image}
                  alt={`$${chip.value} chip`}
                  initial={{ scale: 0, y: 50, opacity: 0 }}
                  animate={{ 
                    scale: 1, 
                    y: -index * 4, // Stack offset
                    opacity: 1,
                    rotate: (index * 15) % 30 - 15 // Slight rotation variation
                  }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 400, 
                    damping: 25,
                    delay: index * 0.02
                  }}
                  className="absolute w-full h-full object-contain drop-shadow-lg"
                  style={{ zIndex: index }}
                />
              ))}
            </AnimatePresence>
            
            {/* Empty state */}
            {currentBet === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white/30 text-xs font-mono uppercase">BET</span>
              </div>
            )}
          </div>
          
          {/* Bet amount badge */}
          {currentBet > 0 && (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -bottom-2 left-1/2 -translate-x-1/2 bg-secondary text-black font-bold text-sm px-3 py-1 rounded-full shadow-lg"
            >
              ${currentBet}
            </motion.div>
          )}
        </div>
        
        {/* Chip breakdown summary */}
        {chipBreakdown.length > 0 && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="absolute -top-6 left-1/2 -translate-x-1/2 flex gap-1 text-xs text-white/50"
          >
            {chipBreakdown.map(({ value, count }) => (
              <span key={value}>{count}x${value}</span>
            ))}
          </motion.div>
        )}
      </div>

      {/* Balance and Controls (Right side on desktop) */}
      <div className="flex flex-col items-center gap-4 order-1 md:order-2">
        {/* Balance Display */}
        <div className="flex items-center gap-6 text-white/80">
          <div className="text-center">
            <p className="text-xs uppercase tracking-wider text-white/50">Balance</p>
            <p className="font-bold text-xl font-display text-secondary">${balance}</p>
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
                "w-12 h-12 md:w-14 md:h-14 transition-all",
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
    </div>
  );
}
