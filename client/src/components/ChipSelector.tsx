import { motion } from "framer-motion";
import { cn } from "@/lib/utils";

interface ChipSelectorProps {
  balance: number;
  currentBet: number;
  onBetChange: (amount: number) => void;
  disabled?: boolean;
}

const CHIP_VALUES = [
  { value: 5, color: "bg-red-600", border: "border-red-400" },
  { value: 10, color: "bg-blue-600", border: "border-blue-400" },
  { value: 25, color: "bg-green-600", border: "border-green-400" },
  { value: 100, color: "bg-black", border: "border-gray-400" },
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
      <div className="flex gap-3 flex-wrap justify-center">
        {CHIP_VALUES.map((chip) => (
          <motion.button
            key={chip.value}
            whileHover={{ scale: disabled ? 1 : 1.1, y: disabled ? 0 : -5 }}
            whileTap={{ scale: disabled ? 1 : 0.95 }}
            onClick={() => addToBet(chip.value)}
            disabled={disabled || currentBet + chip.value > balance}
            data-testid={`chip-${chip.value}`}
            className={cn(
              chip.color,
              "w-14 h-14 md:w-16 md:h-16 rounded-full border-4",
              chip.border,
              "flex items-center justify-center shadow-lg transition-all",
              "relative overflow-hidden",
              disabled || currentBet + chip.value > balance
                ? "opacity-40 cursor-not-allowed"
                : "cursor-pointer hover:shadow-xl"
            )}
          >
            {/* Chip pattern */}
            <div className="absolute inset-2 rounded-full border-2 border-white/20 border-dashed" />
            <span className="text-white font-bold text-sm md:text-base relative z-10">
              ${chip.value}
            </span>
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
