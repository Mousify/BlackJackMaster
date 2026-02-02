import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { useMemo } from "react";
import { soundManager } from "@/hooks/use-sound";

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

const CHIP_MAP: Record<number, string> = {
  1: chip1Img,
  5: chip5Img,
  25: chip25Img,
  100: chip100Img,
  500: chip500Img,
};

// Convert a bet amount to optimal chip breakdown (rounds up smaller chips to bigger ones)
function getChipBreakdown(amount: number): { value: number; count: number }[] {
  const breakdown: { value: number; count: number }[] = [];
  let remaining = amount;
  
  // Start from highest denomination
  const sortedValues = [500, 100, 25, 5, 1];
  
  for (const value of sortedValues) {
    const count = Math.floor(remaining / value);
    if (count > 0) {
      breakdown.push({ value, count });
      remaining -= count * value;
    }
  }
  
  return breakdown;
}

// Generate scattered positions for chips of the same value (they stack)
function getScatteredChipsWithPositions(amount: number): { 
  value: number; 
  image: string; 
  id: string;
  x: number;
  y: number;
  rotation: number;
  stackIndex: number;
}[] {
  const breakdown = getChipBreakdown(amount);
  const chips: { 
    value: number; 
    image: string; 
    id: string;
    x: number;
    y: number;
    rotation: number;
    stackIndex: number;
  }[] = [];
  
  // Define scatter positions for different chip types (each type gets its own area)
  const scatterPositions = [
    { x: -20, y: -15 },  // Top left area
    { x: 20, y: -10 },   // Top right area
    { x: -15, y: 20 },   // Bottom left area
    { x: 25, y: 15 },    // Bottom right area
    { x: 0, y: 0 },      // Center
  ];
  
  breakdown.forEach((item, typeIndex) => {
    const basePos = scatterPositions[typeIndex % scatterPositions.length];
    const maxStack = Math.min(item.count, 5); // Max 5 shown per type
    
    for (let i = 0; i < maxStack; i++) {
      chips.push({
        value: item.value,
        image: CHIP_MAP[item.value],
        id: `${item.value}-${i}`,
        x: basePos.x + (Math.random() * 6 - 3), // Small random offset
        y: basePos.y + (Math.random() * 6 - 3),
        rotation: Math.random() * 20 - 10,
        stackIndex: i,
      });
    }
  });
  
  return chips;
}

export function ChipSelector({ balance, currentBet, onBetChange, disabled }: ChipSelectorProps) {
  const scatteredChips = useMemo(() => getScatteredChipsWithPositions(currentBet), [currentBet]);
  
  const addToBet = (amount: number) => {
    if (disabled) return;
    if (currentBet + amount <= balance) {
      onBetChange(currentBet + amount);
    }
  };

  const removeFromBet = (chipValue: number) => {
    if (disabled) return;
    soundManager.playSFX('chipSingle');
    onBetChange(Math.max(0, currentBet - chipValue));
  };

  return (
    <div className="flex flex-col items-center gap-6">
      {/* Balance Display - Centered */}
      <div className="text-center">
        <p className="text-xs uppercase tracking-wider text-white/50">Balance</p>
        <p className="font-bold text-xl font-display text-secondary">${balance}</p>
      </div>

      {/* Chips Row - Centered */}
      <div className="flex gap-2 justify-center">
        {CHIP_VALUES.map((chip) => (
          <motion.button
            key={chip.value}
            whileHover={{ scale: disabled ? 1 : 1.1, y: disabled ? 0 : -5 }}
            whileTap={{ scale: disabled ? 1 : 0.95 }}
            onClick={() => addToBet(chip.value)}
            disabled={disabled || currentBet + chip.value > balance}
            data-testid={`chip-${chip.value}`}
            className={cn(
              "w-10 h-10 md:w-12 md:h-12 transition-all",
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

      {/* Betting Circle Area */}
      <div className="relative">
        <div 
          className={cn(
            "w-40 h-40 md:w-48 md:h-48 rounded-full border-4 border-dashed transition-all duration-300",
            "flex items-center justify-center relative",
            currentBet > 0 
              ? "border-secondary/60 bg-secondary/10" 
              : "border-white/20 bg-white/5"
          )}
        >
          {/* Scattered chips in the circle - clickable to remove */}
          <div className="relative w-32 h-32 md:w-40 md:h-40">
            <AnimatePresence>
              {scatteredChips.map((chip) => (
                <motion.button
                  key={chip.id}
                  onClick={() => removeFromBet(chip.value)}
                  initial={{ scale: 0, opacity: 0 }}
                  animate={{ 
                    scale: 1, 
                    opacity: 1,
                    x: chip.x,
                    y: chip.y - (chip.stackIndex * 3), // Stack same chips vertically
                    rotate: chip.rotation,
                  }}
                  exit={{ scale: 0, opacity: 0 }}
                  transition={{ 
                    type: "spring", 
                    stiffness: 400, 
                    damping: 25,
                  }}
                  whileHover={{ scale: 1.15, zIndex: 100 }}
                  className="absolute left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 md:w-10 md:h-10 cursor-pointer"
                  style={{ zIndex: chip.stackIndex }}
                  data-testid={`betting-chip-${chip.value}`}
                >
                  <img 
                    src={chip.image}
                    alt={`$${chip.value} chip`}
                    className="w-full h-full object-contain drop-shadow-lg hover:brightness-125 transition-all"
                  />
                </motion.button>
              ))}
            </AnimatePresence>
            
            {/* Empty state */}
            {currentBet === 0 && (
              <div className="absolute inset-0 flex items-center justify-center">
                <span className="text-white/30 text-sm font-mono uppercase">PLACE BET</span>
              </div>
            )}
          </div>
          
          {/* Bet amount badge */}
          {currentBet > 0 && (
            <motion.div 
              initial={{ scale: 0 }}
              animate={{ scale: 1 }}
              className="absolute -bottom-3 left-1/2 -translate-x-1/2 bg-secondary text-black font-bold text-base px-4 py-1.5 rounded-full shadow-lg"
            >
              ${currentBet}
            </motion.div>
          )}
        </div>
      </div>
    </div>
  );
}
