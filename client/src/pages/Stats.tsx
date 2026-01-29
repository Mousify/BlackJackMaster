import { useGameResults } from "@/hooks/use-game-results";
import { Link } from "wouter";
import { ArrowLeft, Trophy, XCircle, MinusCircle, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";

export default function Stats() {
  const { data: results, isLoading } = useGameResults();

  const stats = results ? {
    total: results.length,
    wins: results.filter(r => r.result === 'win' || r.result === 'blackjack').length,
    losses: results.filter(r => r.result === 'loss' || r.result === 'bust').length,
    pushes: results.filter(r => r.result === 'push').length,
    winRate: results.length > 0 
      ? Math.round((results.filter(r => r.result === 'win' || r.result === 'blackjack').length / results.length) * 100) 
      : 0
  } : { total: 0, wins: 0, losses: 0, pushes: 0, winRate: 0 };

  return (
    <div className="min-h-screen bg-background text-foreground p-4 md:p-8">
      <div className="max-w-4xl mx-auto">
        <header className="flex items-center gap-4 mb-8 md:mb-12">
          <Link href="/" className="p-3 rounded-full bg-white/5 hover:bg-white/10 transition-colors">
            <ArrowLeft className="w-6 h-6" />
          </Link>
          <h1 className="text-3xl md:text-4xl font-display font-bold">Game History</h1>
        </header>

        {isLoading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
             {[1,2,3,4].map(i => (
               <div key={i} className="h-32 bg-white/5 rounded-2xl animate-pulse" />
             ))}
          </div>
        ) : (
          <>
            {/* Stats Overview */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-12">
              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                className="bg-card/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center gap-2"
              >
                <div className="p-3 bg-secondary/20 rounded-full text-secondary mb-2">
                  <Trophy className="w-6 h-6" />
                </div>
                <span className="text-4xl font-bold font-display text-white">{stats.wins}</span>
                <span className="text-xs uppercase tracking-widest text-white/50">Wins</span>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
                className="bg-card/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center gap-2"
              >
                <div className="p-3 bg-red-500/20 rounded-full text-red-400 mb-2">
                  <XCircle className="w-6 h-6" />
                </div>
                <span className="text-4xl font-bold font-display text-white">{stats.losses}</span>
                <span className="text-xs uppercase tracking-widest text-white/50">Losses</span>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
                className="bg-card/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center gap-2"
              >
                <div className="p-3 bg-blue-500/20 rounded-full text-blue-400 mb-2">
                  <MinusCircle className="w-6 h-6" />
                </div>
                <span className="text-4xl font-bold font-display text-white">{stats.pushes}</span>
                <span className="text-xs uppercase tracking-widest text-white/50">Pushes</span>
              </motion.div>

              <motion.div 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
                className="bg-card/5 border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center gap-2"
              >
                <div className="p-3 bg-purple-500/20 rounded-full text-purple-400 mb-2">
                  <AlertCircle className="w-6 h-6" />
                </div>
                <span className="text-4xl font-bold font-display text-white">{stats.winRate}%</span>
                <span className="text-xs uppercase tracking-widest text-white/50">Win Rate</span>
              </motion.div>
            </div>

            {/* Recent History List */}
            <h3 className="text-xl font-display font-bold mb-6 flex items-center gap-2">
              <span className="w-2 h-8 bg-primary rounded-full"></span>
              Recent Matches
            </h3>
            
            <div className="space-y-3">
              {results?.length === 0 ? (
                <div className="text-center py-12 text-white/30 italic">No games played yet</div>
              ) : (
                results?.slice().reverse().map((game, i) => (
                  <motion.div 
                    key={game.id}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: i * 0.05 }}
                    className="bg-white/5 hover:bg-white/10 transition-colors border border-white/5 rounded-xl p-4 flex items-center justify-between"
                  >
                    <div className="flex items-center gap-4">
                      <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold
                        ${game.result === 'win' || game.result === 'blackjack' ? 'bg-secondary text-black' : 
                          game.result === 'push' ? 'bg-blue-500/20 text-blue-300' : 'bg-red-500/20 text-red-400'}
                      `}>
                        {game.result === 'win' || game.result === 'blackjack' ? 'W' : game.result === 'push' ? 'P' : 'L'}
                      </div>
                      <div>
                        <div className="font-bold capitalize">{game.result}</div>
                        <div className="text-xs text-white/40">{new Date(game.createdAt || '').toLocaleString()}</div>
                      </div>
                    </div>
                    
                    <div className="flex gap-8 text-sm font-mono">
                       <div className="flex flex-col items-end">
                         <span className="text-white/40 text-xs">YOU</span>
                         <span className="font-bold">{game.playerScore}</span>
                       </div>
                       <div className="flex flex-col items-end">
                         <span className="text-white/40 text-xs">DLR</span>
                         <span className="font-bold">{game.dealerScore}</span>
                       </div>
                    </div>
                  </motion.div>
                ))
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
