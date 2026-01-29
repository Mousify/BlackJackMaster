import { motion } from "framer-motion";
import { Card, Suit } from "@/lib/blackjack-engine";
import { cn } from "@/lib/utils";
import { Heart, Diamond, Club, Spade } from "lucide-react";

interface PlayingCardProps {
  card: Card;
  index: number;
}

const SuitIcon = ({ suit, className }: { suit: Suit; className?: string }) => {
  switch (suit) {
    case 'hearts': return <Heart className={cn("fill-current", className)} />;
    case 'diamonds': return <Diamond className={cn("fill-current", className)} />;
    case 'clubs': return <Club className={cn("fill-current", className)} />;
    case 'spades': return <Spade className={cn("fill-current", className)} />;
  }
};

export function PlayingCard({ card, index }: PlayingCardProps) {
  const isRed = card.suit === 'hearts' || card.suit === 'diamonds';
  
  return (
    <motion.div
      initial={{ 
        opacity: 0, 
        y: -100, 
        x: -50,
        rotateY: card.isHidden ? 180 : 0 
      }}
      animate={{ 
        opacity: 1, 
        y: 0, 
        x: index * 30, // Stack cards slightly offset
        rotateY: card.isHidden ? 180 : 0 
      }}
      transition={{ 
        type: "spring", 
        stiffness: 260, 
        damping: 20, 
        delay: index * 0.1 
      }}
      className={cn(
        "absolute w-24 h-36 md:w-32 md:h-48 rounded-xl shadow-xl",
        "border border-black/10 select-none perspective-1000",
        // Center the stack by offsetting based on index logic in parent, 
        // but here we just handle absolute positioning relative to container center
      )}
      style={{
        zIndex: index,
        marginLeft: -48 // Half width to center first card
      }}
    >
      <div className={cn(
        "relative w-full h-full transition-transform duration-500 transform-style-3d",
        card.isHidden ? "rotate-y-180" : ""
      )}>
        {/* FRONT */}
        <div className={cn(
          "absolute inset-0 backface-hidden bg-card rounded-xl flex flex-col justify-between p-2 md:p-3",
          isRed ? "text-red-500" : "text-black"
        )}>
          {/* Top Corner */}
          <div className="flex flex-col items-center w-6">
            <span className="text-xl md:text-2xl font-bold font-display leading-none">{card.rank}</span>
            <SuitIcon suit={card.suit} className="w-4 h-4 md:w-5 md:h-5" />
          </div>

          {/* Center */}
          <div className="absolute inset-0 flex items-center justify-center opacity-20">
            <SuitIcon suit={card.suit} className="w-16 h-16 md:w-20 md:h-20" />
          </div>

          {/* Bottom Corner (Rotated) */}
          <div className="flex flex-col items-center w-6 self-end rotate-180">
            <span className="text-xl md:text-2xl font-bold font-display leading-none">{card.rank}</span>
            <SuitIcon suit={card.suit} className="w-4 h-4 md:w-5 md:h-5" />
          </div>
        </div>

        {/* BACK */}
        <div className={cn(
          "absolute inset-0 backface-hidden rotate-y-180 rounded-xl",
          "bg-gradient-to-br from-blue-800 to-blue-900 border-2 border-white/20",
          "flex items-center justify-center"
        )}>
          <div className="w-full h-full opacity-30 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')]"></div>
          <div className="absolute w-12 h-12 rounded-full border-2 border-white/30" />
        </div>
      </div>
    </motion.div>
  );
}
