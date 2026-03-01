import { useEffect } from "react";
import { useBlackjack } from "@/hooks/use-blackjack";
import { useSound } from "@/hooks/use-sound";
import { useAuth } from "@/contexts/AuthContext";
import { RequireAuth } from "@/components/RequireAuth";
import { PlayingCard } from "@/components/PlayingCard";
import { ActionButton } from "@/components/ActionButton";
import { GameOverlay } from "@/components/GameOverlay";
import { ChipSelector } from "@/components/ChipSelector";
import { AnimatePresence, motion } from "framer-motion";
import { Hand, StopCircle, PlayCircle, Trophy, Home, RotateCcw, Volume2, VolumeX, User } from "lucide-react";
import { Link } from "wouter";

import casinoBgImg from "@assets/casino-background_1769865411534.jpg";
import dealerAvatarImg from "@assets/dealer-avatar_1769865411537.png";
import playerAvatarImg from "@assets/player-avatar_1769865411539.png";

function GameContent() {
  const { user } = useAuth();
  const { 
    dealerHand, 
    playerHand, 
    status, 
    deal, 
    hit, 
    stand, 
    result,
    playerScore,
    dealerScore,
    balance,
    currentBet,
    updateBet,
    resetBalance
  } = useBlackjack();

  const { playGameMusic, stopMusic, toggleMute, isMuted, playSFX } = useSound();

  // Start game music when entering game page
  useEffect(() => {
    playGameMusic();
  }, [playGameMusic]);

  const canDeal = status === 'idle' || status === 'game-over';
  const isPlaying = status === 'playing';

  const handleDeal = () => {
    playSFX('buttonClick');
    deal();
  };

  const handleHit = () => {
    playSFX('buttonClick');
    hit();
  };

  const handleStand = () => {
    playSFX('buttonClick');
    stand();
  };

  return (
    <div className="min-h-screen text-foreground flex flex-col relative overflow-hidden">
      {/* Casino Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${casinoBgImg})` }}
      >
        <div className="absolute inset-0 bg-black/30" />
      </div>
      
      {/* Navbar / Header */}
      <header className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-10">
        <Link href="/">
          <button
            data-testid="button-home"
            className="text-white/70 hover:text-white transition-colors flex items-center gap-2 font-medium bg-black/30 px-3 py-2 rounded-full hover:bg-black/40"
          >
            <Home className="w-4 h-4" />
            <span className="hidden sm:inline">Home</span>
          </button>
        </Link>
        <div className="flex items-center gap-2">
          <button
            onClick={toggleMute}
            data-testid="button-toggle-mute"
            className="text-white/70 hover:text-white transition-colors flex items-center gap-2 font-medium bg-black/30 px-3 py-2 rounded-full hover:bg-black/40"
          >
            {isMuted ? <VolumeX className="w-4 h-4" /> : <Volume2 className="w-4 h-4" />}
          </button>
          {balance <= 0 && (
            <button
              onClick={resetBalance}
              data-testid="button-reset-balance"
              className="text-white/70 hover:text-white transition-colors flex items-center gap-2 font-medium bg-destructive/30 px-3 py-2 rounded-full hover:bg-destructive/40"
            >
              <RotateCcw className="w-4 h-4" />
              <span className="hidden sm:inline">Reset</span>
            </button>
          )}
          <Link href="/profile">
            <button
              data-testid="button-profile-nav"
              className="text-white/70 hover:text-white transition-colors flex items-center gap-2 font-medium bg-black/30 px-3 py-2 rounded-full hover:bg-black/40"
            >
              <img 
                src={user?.avatarUrl || playerAvatarImg} 
                alt="Profile"
                className="w-5 h-5 rounded-full object-cover"
              />
            </button>
          </Link>
          <Link href="/stats">
            <button
              data-testid="button-stats-nav"
              className="text-white/70 hover:text-white transition-colors flex items-center gap-2 font-medium bg-black/30 px-3 py-2 rounded-full hover:bg-black/40"
            >
              <Trophy className="w-4 h-4" />
              <span className="hidden sm:inline">Stats</span>
            </button>
          </Link>
        </div>
      </header>

      {/* Decorative Table Elements */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[800px] h-[400px] border-4 border-white/5 rounded-[200px] opacity-30" />
        <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[200px] h-[200px] border-4 border-white/5 rounded-full opacity-20" />
      </div>

      <GameOverlay result={result} onRestart={handleDeal} currentBet={currentBet} />

      {/* Main Game Area */}
      <main className="flex-1 flex flex-col max-w-5xl mx-auto w-full p-4 pt-16 relative z-0">
        
        {/* Dealer Section (Top) */}
        <div className="flex-1 flex flex-col justify-center items-center relative min-h-[180px]">
          <div className="mb-4 flex items-center gap-3">
            <img 
              src={dealerAvatarImg} 
              alt="Dealer"
              className="w-10 h-10 rounded-full border-2 border-white/20"
            />
            <div className="text-white/50 font-mono text-sm uppercase tracking-widest flex items-center gap-2">
              <span>Dealer</span>
              {status !== 'idle' && (
                <span className="bg-black/40 px-2 py-0.5 rounded text-white font-bold">
                  {status === 'playing' ? '?' : dealerScore}
                </span>
              )}
            </div>
          </div>
          
          <div className="relative h-36 md:h-48 w-full flex justify-center">
            <AnimatePresence>
              {dealerHand.map((card, i) => (
                <PlayingCard key={card.id} card={card} index={i} total={dealerHand.length} />
              ))}
              {dealerHand.length === 0 && (
                 <div className="w-24 h-36 md:w-32 md:h-48 border-2 border-dashed border-white/10 rounded-xl flex items-center justify-center">
                   <span className="text-white/20 font-display font-bold text-xs">DEALER</span>
                 </div>
              )}
            </AnimatePresence>
          </div>
        </div>

        {/* Center Info / Game Status Message */}
        <div className="h-16 flex items-center justify-center">
           {status === 'idle' && currentBet === 0 && (
             <motion.p 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }}
               className="text-white/40 italic font-mono text-sm text-center"
             >
               Place your bet to start
             </motion.p>
           )}
           {status === 'idle' && currentBet > 0 && (
             <motion.p 
               initial={{ opacity: 0 }} 
               animate={{ opacity: 1 }}
               className="text-secondary font-bold font-display tracking-wider"
             >
               TAP DEAL TO START
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
           {status === 'dealer-turn' && (
             <motion.p
               initial={{ opacity: 0, y: 10 }}
               animate={{ opacity: 1, y: 0 }}
               className="text-white/60 font-bold font-display tracking-wider"
             >
               DEALER'S TURN...
             </motion.p>
           )}
        </div>

        {/* Player Section (Bottom) */}
        <div className="flex-1 flex flex-col justify-center items-center relative min-h-[180px]">
          <div className="relative h-36 md:h-48 w-full flex justify-center mb-4">
            <AnimatePresence>
              {playerHand.map((card, i) => (
                <PlayingCard key={card.id} card={card} index={i} total={playerHand.length} />
              ))}
              {playerHand.length === 0 && (
                 <div className="w-24 h-36 md:w-32 md:h-48 border-2 border-dashed border-white/10 rounded-xl flex items-center justify-center">
                   <span className="text-white/20 font-display font-bold text-xs">PLAYER</span>
                 </div>
              )}
            </AnimatePresence>
          </div>
          
          <div className="flex items-center gap-3">
            <img 
              src={user?.avatarUrl || playerAvatarImg} 
              alt="Player"
              className="w-10 h-10 rounded-full border-2 border-secondary/40 object-cover"
            />
            <div className="text-white/50 font-mono text-sm uppercase tracking-widest flex items-center gap-2">
              <span>{user?.username || 'You'}</span>
              {status !== 'idle' && (
                <span className="bg-secondary/20 text-secondary px-2 py-0.5 rounded font-bold border border-secondary/20">
                  {playerScore}
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Betting / Controls Area */}
        <div className="mt-auto pt-4 pb-4">
          {/* Chip Selector (only when not actively playing) */}
          {canDeal && (
            <div className="mb-6">
              <ChipSelector
                balance={balance}
                currentBet={currentBet}
                onBetChange={updateBet}
                disabled={!canDeal}
              />
            </div>
          )}

          {/* Action Buttons */}
          <div className="grid grid-cols-2 gap-4 max-w-md mx-auto w-full">
            {canDeal ? (
              <div className="col-span-2 flex justify-center">
                <ActionButton 
                  onClick={handleDeal} 
                  className="w-full max-w-xs"
                  variant="primary"
                  disabled={currentBet <= 0 || balance < 0}
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
                  onClick={handleHit} 
                  disabled={!isPlaying}
                  variant="primary"
                >
                  <div className="flex flex-col items-center gap-1">
                    <Hand className="w-6 h-6" />
                    <span>HIT</span>
                  </div>
                </ActionButton>
                
                <ActionButton 
                  onClick={handleStand} 
                  disabled={!isPlaying}
                  variant="destructive"
                >
                  <div className="flex flex-col items-center gap-1">
                    <StopCircle className="w-6 h-6" />
                    <span>STAND</span>
                  </div>
                </ActionButton>
              </>
            )}
          </div>
        </div>
      </main>
    </div>
  );
}

export default function Game() {
  return (
    <RequireAuth>
      <GameContent />
    </RequireAuth>
  );
}
