import { useQuery } from "@tanstack/react-query";
import { Link } from "wouter";
import { ArrowLeft, Trophy, XCircle, MinusCircle, AlertCircle } from "lucide-react";
import { motion } from "framer-motion";
import { useAuth } from "@/contexts/AuthContext";
import { RequireAuth } from "@/components/RequireAuth";
import type { GameResult } from "@shared/schema";

import casinoBgImg from "@assets/casino-background_1769865411534.jpg";
import firstWinImg from "@assets/first-win_1769865411538.png";
import luckyStreakImg from "@assets/lucky-streak_1769865411538.png";
import highRollerImg from "@assets/high-roller_1769865411538.png";
import comebackKingImg from "@assets/comeback-king_1769865411537.png";
import blackjackMasterImg from "@assets/blackjack-master_1769865411534.png";

interface Achievement {
  id: string;
  name: string;
  description: string;
  image: string;
  unlocked: boolean;
}

function StatsContent() {
  const { user } = useAuth();
  const { playMainTheme, playSFX } = useSound();
  
  useEffect(() => {
    playMainTheme();
  }, [playMainTheme]);
  
  const { data: results, isLoading } = useQuery<GameResult[]>({
    queryKey: ['/api/results/user', user?.id],
    queryFn: async () => {
      const res = await fetch(`/api/results/user/${user?.id}`);
      if (!res.ok) throw new Error('Failed to fetch results');
      return res.json();
    },
    enabled: !!user?.id,
  });

  const stats = results ? {
    total: results.length,
    wins: results.filter(r => r.result === 'win' || r.result === 'blackjack').length,
    losses: results.filter(r => r.result === 'loss' || r.result === 'bust').length,
    pushes: results.filter(r => r.result === 'push').length,
    blackjacks: results.filter(r => r.result === 'blackjack').length,
    winRate: results.length > 0 
      ? Math.round((results.filter(r => r.result === 'win' || r.result === 'blackjack').length / results.length) * 100) 
      : 0
  } : { total: 0, wins: 0, losses: 0, pushes: 0, blackjacks: 0, winRate: 0 };

  // Calculate achievements
  const achievements: Achievement[] = [
    {
      id: 'first-win',
      name: 'First Win',
      description: 'Win your first game',
      image: firstWinImg,
      unlocked: stats.wins >= 1
    },
    {
      id: 'lucky-streak',
      name: 'Lucky Streak',
      description: 'Win 5 games',
      image: luckyStreakImg,
      unlocked: stats.wins >= 5
    },
    {
      id: 'high-roller',
      name: 'High Roller',
      description: 'Play 25 games',
      image: highRollerImg,
      unlocked: stats.total >= 25
    },
    {
      id: 'comeback-king',
      name: 'Comeback King',
      description: 'Win 10 games',
      image: comebackKingImg,
      unlocked: stats.wins >= 10
    },
    {
      id: 'blackjack-master',
      name: 'Blackjack Master',
      description: 'Get 3 natural blackjacks',
      image: blackjackMasterImg,
      unlocked: stats.blackjacks >= 3
    }
  ];

  return (
    <div className="min-h-screen text-foreground relative overflow-hidden">
      {/* Casino Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${casinoBgImg})` }}
      >
        <div className="absolute inset-0 bg-black/60" />
      </div>

      <div className="relative z-10 p-4 md:p-8">
        <div className="max-w-4xl mx-auto">
          <header className="flex items-center gap-4 mb-8 md:mb-12">
            <Link href="/" className="p-3 rounded-full bg-white/10 hover:bg-white/20 transition-colors" onClick={() => playSFX('buttonClick')}>
              <ArrowLeft className="w-6 h-6" />
            </Link>
            <div>
              <h1 className="text-3xl md:text-4xl font-display font-bold">Your Stats</h1>
              <p className="text-white/50 text-sm">{user?.username}'s game history</p>
            </div>
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
                  className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center gap-2"
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
                  className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center gap-2"
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
                  className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center gap-2"
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
                  className="bg-black/40 backdrop-blur-sm border border-white/10 rounded-2xl p-6 flex flex-col items-center justify-center gap-2"
                >
                  <div className="p-3 bg-purple-500/20 rounded-full text-purple-400 mb-2">
                    <AlertCircle className="w-6 h-6" />
                  </div>
                  <span className="text-4xl font-bold font-display text-white">{stats.winRate}%</span>
                  <span className="text-xs uppercase tracking-widest text-white/50">Win Rate</span>
                </motion.div>
              </div>

              {/* Achievements Section */}
              <h3 className="text-xl font-display font-bold mb-6 flex items-center gap-2">
                <span className="w-2 h-8 bg-secondary rounded-full"></span>
                Achievements
              </h3>
              
              <div className="grid grid-cols-2 md:grid-cols-5 gap-4 mb-12">
                {achievements.map((achievement, i) => (
                  <motion.div
                    key={achievement.id}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ delay: i * 0.1 }}
                    className={`bg-black/40 backdrop-blur-sm border rounded-2xl p-4 flex flex-col items-center text-center gap-2 ${
                      achievement.unlocked 
                        ? 'border-secondary/50' 
                        : 'border-white/10 opacity-50 grayscale'
                    }`}
                  >
                    <img 
                      src={achievement.image} 
                      alt={achievement.name}
                      className="w-12 h-12 md:w-16 md:h-16 object-contain"
                    />
                    <span className="text-sm font-bold text-white">{achievement.name}</span>
                    <span className="text-xs text-white/50">{achievement.description}</span>
                  </motion.div>
                ))}
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
                  results?.slice().reverse().slice(0, 10).map((game, i) => (
                    <motion.div 
                      key={game.id}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: i * 0.05 }}
                      className="bg-black/40 backdrop-blur-sm hover:bg-black/50 transition-colors border border-white/10 rounded-xl p-4 flex items-center justify-between"
                    >
                      <div className="flex items-center gap-4">
                        <div className={`w-10 h-10 rounded-full flex items-center justify-center font-bold
                          ${game.result === 'win' || game.result === 'blackjack' ? 'bg-secondary text-black' : 
                            game.result === 'push' ? 'bg-blue-500/30 text-blue-300' : 'bg-red-500/30 text-red-400'}
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
    </div>
  );
}

export default function Stats() {
  return (
    <RequireAuth>
      <StatsContent />
    </RequireAuth>
  );
}
