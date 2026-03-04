import { motion, AnimatePresence } from "framer-motion";
import { X, Volume2, Music, Zap, Settings2 } from "lucide-react";
import { useSound } from "@/hooks/use-sound";
import { Slider } from "@/components/ui/slider";
import { ActionButton } from "./ActionButton";

interface SettingsModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export function SettingsModal({ isOpen, onClose }: SettingsModalProps) {
  const { 
    musicVolume, 
    sfxVolume, 
    setMusicVolume, 
    setSfxVolume, 
    isMuted, 
    toggleMute,
    playSFX 
  } = useSound();

  const handleClose = () => {
    playSFX('buttonClick');
    onClose();
  };

  return (
    <AnimatePresence>
      {isOpen && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[110] flex items-center justify-center bg-black/60 backdrop-blur-md px-4"
        >
          <motion.div
            initial={{ scale: 0.9, opacity: 0, y: 20 }}
            animate={{ scale: 1, opacity: 1, y: 0 }}
            exit={{ scale: 0.9, opacity: 0, y: 20 }}
            className="bg-zinc-900 border border-white/10 p-6 md:p-8 rounded-3xl max-w-sm w-full shadow-2xl relative"
          >
            <button 
              onClick={handleClose}
              className="absolute top-4 right-4 text-white/40 hover:text-white transition-colors"
            >
              <X className="w-6 h-6" />
            </button>

            <div className="flex items-center gap-3 mb-8">
              <div className="p-2 bg-secondary/20 rounded-xl text-secondary">
                <Settings2 className="w-6 h-6" />
              </div>
              <h2 className="text-2xl font-bold font-display text-white">Settings</h2>
            </div>

            <div className="space-y-8">
              {/* Music Volume */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-white/70">
                    <Music className="w-4 h-4" />
                    <span className="text-sm font-semibold uppercase tracking-wider">Music Volume</span>
                  </div>
                  <span className="text-secondary font-mono font-bold">{Math.round(musicVolume * 100)}%</span>
                </div>
                <Slider
                  value={[musicVolume * 100]}
                  max={100}
                  step={1}
                  onValueChange={(vals) => setMusicVolume(vals[0] / 100)}
                  className="py-4"
                />
              </div>

              {/* SFX Volume */}
              <div className="space-y-4">
                <div className="flex justify-between items-center">
                  <div className="flex items-center gap-2 text-white/70">
                    <Zap className="w-4 h-4" />
                    <span className="text-sm font-semibold uppercase tracking-wider">SFX Volume</span>
                  </div>
                  <span className="text-secondary font-mono font-bold">{Math.round(sfxVolume * 100)}%</span>
                </div>
                <Slider
                  value={[sfxVolume * 100]}
                  max={100}
                  step={1}
                  onValueChange={(vals) => setSfxVolume(vals[0] / 100)}
                  className="py-4"
                />
              </div>

              {/* Mute Toggle */}
              <div className="flex items-center justify-between p-4 bg-white/5 rounded-2xl border border-white/5">
                <div className="flex items-center gap-3">
                  <div className={`p-2 rounded-lg ${isMuted ? 'bg-red-500/20 text-red-400' : 'bg-green-500/20 text-green-400'}`}>
                    <Volume2 className="w-5 h-5" />
                  </div>
                  <span className="font-bold text-white/80">{isMuted ? 'Sounds Muted' : 'Sounds On'}</span>
                </div>
                <button
                  onClick={() => {
                    playSFX('buttonClick');
                    toggleMute();
                  }}
                  className={`w-12 h-6 rounded-full transition-colors relative ${isMuted ? 'bg-zinc-700' : 'bg-secondary'}`}
                >
                  <motion.div 
                    animate={{ x: isMuted ? 4 : 28 }}
                    className="absolute top-1 left-0 w-4 h-4 bg-white rounded-full shadow-sm"
                  />
                </button>
              </div>
            </div>

            <div className="mt-10">
              <ActionButton onClick={handleClose} variant="primary" className="w-full">
                Close
              </ActionButton>
            </div>
          </motion.div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
