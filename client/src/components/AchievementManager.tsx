import { motion, AnimatePresence } from "framer-motion";
import { useEffect, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { useAuth } from "@/contexts/AuthContext";
import { useSound } from "@/hooks/use-sound";
import { useLocation } from "wouter";
import type { GameResult } from "@shared/schema";

interface Achievement {
  id: string;
  name: string;
  description: string;
  image: string;
  unlocked: boolean;
}

import firstWinImg from "@assets/first-win_1769865411538.png";
import luckyStreakImg from "@assets/lucky-streak_1769865411538.png";
import highRollerImg from "@assets/high-roller_1769865411538.png";
import comebackKingImg from "@assets/comeback-king_1769865411537.png";
import blackjackMasterImg from "@assets/blackjack-master_1769865411534.png";

export function AchievementManager() {
  const { user } = useAuth();
  const { playSFX } = useSound();
  const [, setLocation] = useLocation();
  const [newAchievement, setNewAchievement] = useState<Achievement | null>(null);
  const [shownAchievements, setShownAchievements] = useState<Set<string>>(() => {
    const saved = localStorage.getItem('blackjack-shown-achievements');
    return saved ? new Set(JSON.parse(saved)) : new Set();
  });

  const { data: results } = useQuery<GameResult[]>({
    queryKey: ['/api/results/user', user?.id],
    queryFn: async () => {
      const res = await fetch(`/api/results/user/${user?.id}`);
      if (!res.ok) throw new Error('Failed');
      return res.json();
    },
    enabled: !!user?.id,
    refetchInterval: 5000, // Check periodically for new results
  });

  useEffect(() => {
    if (!results) return;

    const stats = {
      total: results.length,
      wins: results.filter(r => r.result === 'win' || r.result === 'blackjack').length,
      blackjacks: results.filter(r => r.result === 'blackjack').length,
    };

    const achievements: Achievement[] = [
      { id: 'first-win', name: 'First Win', description: 'Win your first game', image: firstWinImg, unlocked: stats.wins >= 1 },
      { id: 'lucky-streak', name: 'Lucky Streak', description: 'Win 5 games', image: luckyStreakImg, unlocked: stats.wins >= 5 },
      { id: 'high-roller', name: 'High Roller', description: 'Play 25 games', image: highRollerImg, unlocked: stats.total >= 25 },
      { id: 'comeback-king', name: 'Comeback King', description: 'Win 10 games', image: comebackKingImg, unlocked: stats.wins >= 10 },
      { id: 'blackjack-master', name: 'Blackjack Master', description: 'Get 3 natural blackjacks', image: blackjackMasterImg, unlocked: stats.blackjacks >= 3 }
    ];

    const unlocked = achievements.filter(a => a.unlocked && !shownAchievements.has(a.id));
    if (unlocked.length > 0) {
      const latest = unlocked[0];
      setNewAchievement(latest);
      const nextShown = new Set([...shownAchievements, latest.id]);
      setShownAchievements(nextShown);
      localStorage.setItem('blackjack-shown-achievements', JSON.stringify(Array.from(nextShown)));
      playSFX('win');
      
      const timer = setTimeout(() => setNewAchievement(null), 5000);
      return () => clearTimeout(timer);
    }
  }, [results, shownAchievements, playSFX]);

  const handleClick = () => {
    setNewAchievement(null);
    setLocation("/stats");
  };

  return (
    <AnimatePresence>
      {newAchievement && (
        <motion.div
          initial={{ opacity: 0, y: -100 }}
          animate={{ opacity: 1, y: 20 }}
          exit={{ opacity: 0, y: -100 }}
          drag="y"
          dragConstraints={{ top: 0, bottom: 0 }}
          onDragEnd={(_, info) => {
            if (info.offset.y < -50) setNewAchievement(null);
          }}
          onClick={handleClick}
          className="fixed top-0 left-1/2 -translate-x-1/2 z-[200] w-full max-w-sm px-4 cursor-pointer"
        >
          <div className="bg-secondary/90 backdrop-blur-md border border-secondary text-black p-4 rounded-2xl shadow-2xl flex items-center gap-4">
            <div className="w-12 h-12 bg-white/20 rounded-xl p-1 shrink-0">
              <img src={newAchievement.image} alt="" className="w-full h-full object-contain" />
            </div>
            <div className="flex-1">
              <p className="text-xs uppercase tracking-widest font-black opacity-60">Achievement Unlocked!</p>
              <h4 className="text-lg font-bold leading-tight">{newAchievement.name}</h4>
              <p className="text-sm opacity-80">{newAchievement.description}</p>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
