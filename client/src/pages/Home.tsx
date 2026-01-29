import { useBlackjack } from "@/hooks/use-blackjack";
import { PlayingCard } from "@/components/PlayingCard";
import { ActionButton } from "@/components/ActionButton";
import { GameOverlay } from "@/components/GameOverlay";
import { AnimatePresence, motion } from "framer-motion";
import { Hand, StopCircle, PlayCircle, Trophy } from "lucide-react";
import { Link } from "wouter";

export default function Home() {
  const { 
    dealerHand, 
    playerHand, 
    status, 
    deal, 
    hit, 
    stand, 
    result,
    playerScore,
    dealerScore
  } = useBlackjack();

  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden">
      
      {/* Navbar / Header */}
      <header className="absolute top-0 left-0 right-0 p-4 md:p-6 flex justify-between items-center z-10">
        <div className="flex items-center gap-2">
          <div className="bg-primary/20 p-2 rounded-lg border border-primary/20">
            <span className="font-display font-bold text-primary tracking-widest text-lg">21</span>
          </div>
          <h1 className="font-display font-bold text-xl hidden md:block">BLACKJACK PRO</h1>
        </div>
        <Link href="/stats" className="text-white/70 hover:text-white transition-colors flex items-center gap-2 font-medium bg-black/20 px-4 py-2 rounded-full hover:bg-black/30">
          <Trophy className="w-4 h-4" />
          <span>Stats</span>
        </Link>
      </header>

      {/* Decorative Table Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] border-4 border-white/5 rounded-[200px] opacity-30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] border-4 border-white/5 rounded-full opacity-20" />
      </div>

      <GameOverlay result={result} onRestart={deal} />

      {/* Main Game Area */}
      <main className="flex-1 flex flex-col max-w-5xl mx-auto w-full p-4 relative z-0">
        
        {/* Dealer Section (Top) */}
        <div className="flex-1 flex flex-col justify-center items-center relative">
          <div className="mb-4 md:mb-8 text-white/50 font-mono text-sm uppercase tracking-widest flex items-center gap-2">
            <span>Dealer</span>
            {status !== 'idle' && (
              <span className="bg-black/30 px-2 py-0.5 rounded text-white font-bold">
                {dealerScore}
              </span>
            )}
          </div>
          
          <div className="relative h-36 md:h-48 w-full flex justify-center">
            <AnimatePresence>
              {dealerHand.map((card, i) => (
                <PlayingCard key={card.id} card={card} index={i} />
              ))}
              {dealerHand.length === 0 && (
                 <div className="w-24 h-36 md:w-32 md:h-48 border-2 border-dashed border-white/10 rounded-xl flex items-center justify-center">
                   <span className="text-white/20 font-display font-bold">DEALER</span>
                 </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Center Info / Game Status Message */}
        <div className="h-20 flex items-center justify-center">
           {status === 'idle' && (
             <motion.p 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }}
               className="text-white/40 italic font-mono"
             >
               Tap DEAL to start
             </motion.p>
           )}
           {status === 'playing' && (
             <motion.p
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="text-secondary font-bold font-display tracking-wider"
             >
               YOUR TURN
             </motion.p>
           )}
        </div>

        {/* Player Section (Bottom) */}
        <div className="flex-1 flex flex-col justify-center items-center relative">
          <div className="relative h-36 md:h-48 w-full flex justify-center mb-4 md:mb-8">
            <AnimatePresence>
              {playerHand.map((card, i) => (
                <PlayingCard key={card.id} card={card} index={i} />
              ))}
              {playerHand.length === 0 && (
                 <div className="w-24 h-36 md:w-32 md:h-48 border-2 border-dashed border-white/10 rounded-xl flex items-center justify-center">
                   <span className="text-white/20 font-display font-bold">PLAYER</span>
                 </div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="mt-4 text-white/50 font-mono text-sm uppercase tracking-widest flex items-center gap-2">
            <span>You</span>
            {status !== 'idle' && (
              <span className="bg-secondary/20 text-secondary px-2 py-0.5 rounded font-bold border border-secondary/20">
                {playerScore}
              </span>
            )}
          </div>
        </div>

        {/* Controls (Bottom Bar) */}
        <div className="mt-auto pt-8 pb-4 grid grid-cols-2 md:grid-cols-3 gap-4 md:gap-8 max-w-2xl mx-auto w-full">
          {status === 'idle' || status === 'game-over' ? (
            <div className="col-span-2 md:col-span-3 flex justify-center">
              <ActionButton 
                onClick={deal} 
                className="w-full md:w-auto min-w-[200px]"
                variant="primary"
              >
                <div className="flex items-center justify-center gap-2">
                  <PlayCircle className="w-6 h-6" />
                  Deal Cards
                </div>
              </ActionButton>
            </div>
          ) : (
            <>
              <ActionButton 
                onClick={hit} 
                disabled={status !== 'playing'}
                variant="primary"
                className="col-span-1"
              >
                <div className="flex flex-col items-center gap-1">
                  <Hand className="w-6 h-6" />
                  <span>HIT</span>
                </div>
              </ActionButton>
              
              <ActionButton 
                onClick={stand} 
                disabled={status !== 'playing'}
                variant="destructive"
                className="col-span-1"
              >
                <div className="flex flex-col items-center gap-1">
                  <StopCircle className="w-6 h-6" />
                  <span>STAND</span>
                </div>
              </ActionButton>

              <div className="hidden md:block">
                 {/* Spacer or additional controls like Double/Split in future */}
                 <div className="w-full h-full rounded-2xl border-2 border-white/5 bg-white/5 flex items-center justify-center text-white/20 font-bold">
                    PAYS 3:2
                 </div>
              </div>
            </>
          )}
        </div>
      </main>
    </div>
  );
}
