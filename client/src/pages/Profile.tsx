import { useState, useRef } from "react";
import { motion } from "framer-motion";
import { Link, useLocation } from "wouter";
import { ArrowLeft, Camera, Save, LogOut, User } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { useSound } from "@/hooks/use-sound";
import { apiRequest } from "@/lib/queryClient";

import casinoBgImg from "@assets/casino-background_1769865411534.jpg";
import playerAvatarImg from "@assets/player-avatar_1769865411539.png";

export default function Profile() {
  const { user, updateUser, logout, refreshUser } = useAuth();
  const { playMainTheme, playSFX } = useSound();
  const [, setLocation] = useLocation();
  const fileInputRef = useRef<HTMLInputElement>(null);

  useState(() => {
    playMainTheme();
  });

  useEffect(() => {
    playMainTheme();
  }, [playMainTheme]);

  const [username, setUsername] = useState(user?.username || "");
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [isUploading, setIsUploading] = useState(false);

  if (!user) {
    setLocation("/login");
    return null;
  }

  const handleSave = async () => {
    if (!username.trim()) {
      setError("Username cannot be empty");
      return;
    }

    if (username.trim() === user.username) {
      setError("");
      setSuccess("No changes made");
      return;
    }

    setIsLoading(true);
    setError("");
    setSuccess("");
    playSFX('buttonClick');

    try {
      const response = await apiRequest('PATCH', `/api/users/${user.id}`, { 
        username: username.trim() 
      });
      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to update profile");
      } else {
        updateUser(data);
        setSuccess("Profile updated successfully!");
        playSFX('win');
      }
    } catch (err) {
      setError("Failed to update profile");
    } finally {
      setIsLoading(false);
    }
  };

  const handleAvatarClick = () => {
    fileInputRef.current?.click();
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (!file.type.startsWith('image/')) {
      setError("Please select an image file");
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      setError("Image must be less than 5MB");
      return;
    }

    setIsUploading(true);
    setError("");
    playSFX('buttonClick');

    try {
      const formData = new FormData();
      formData.append('avatar', file);

      const response = await fetch(`/api/users/${user.id}/avatar`, {
        method: 'POST',
        body: formData,
      });

      const data = await response.json();

      if (!response.ok) {
        setError(data.message || "Failed to upload avatar");
      } else {
        updateUser(data);
        setSuccess("Avatar updated!");
        playSFX('chipStack');
      }
    } catch (err) {
      setError("Failed to upload avatar");
    } finally {
      setIsUploading(false);
    }
  };

  const handleLogout = () => {
    playSFX('buttonClick');
    logout();
    setLocation("/");
  };

  const handleBack = () => {
    playSFX('buttonClick');
    if (window.history.length > 1) {
      window.history.back();
    } else {
      setLocation("/");
    }
  };

  return (
    <div className="min-h-screen text-foreground flex flex-col relative overflow-hidden">
      {/* Background */}
      <div 
        className="absolute inset-0 bg-cover bg-center bg-no-repeat"
        style={{ backgroundImage: `url(${casinoBgImg})` }}
      >
        <div className="absolute inset-0 bg-black/50" />
      </div>

      {/* Header */}
      <header className="absolute top-0 left-0 right-0 p-4 flex justify-between items-center z-20">
        <button
          onClick={handleBack}
          data-testid="button-back"
          className="text-white/70 hover:text-white transition-colors flex items-center gap-2 font-medium bg-black/30 px-3 py-2 rounded-full hover:bg-black/40"
        >
          <ArrowLeft className="w-4 h-4" />
          Back
        </button>
        <button
          onClick={handleLogout}
          data-testid="button-logout"
          className="text-white/70 hover:text-white transition-colors flex items-center gap-2 font-medium bg-red-500/20 px-3 py-2 rounded-full hover:bg-red-500/30"
        >
          <LogOut className="w-4 h-4" />
          <span className="hidden sm:inline">Logout</span>
        </button>
      </header>

      {/* Main Content */}
      <main className="flex-1 flex flex-col items-center justify-center p-6 pt-20 relative z-10">
        <motion.div
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          className="w-full max-w-sm"
        >
          <h1 className="text-2xl font-bold text-white font-display text-center mb-8">
            Your Profile
          </h1>

          {/* Avatar */}
          <div className="flex justify-center mb-6">
            <div className="relative">
              <button
                onClick={handleAvatarClick}
                disabled={isUploading}
                data-testid="button-change-avatar"
                className="relative w-24 h-24 rounded-full overflow-hidden border-4 border-secondary/40 hover:border-secondary transition-colors"
              >
                <img
                  src={user.avatarUrl || playerAvatarImg}
                  alt="Avatar"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 hover:opacity-100 transition-opacity">
                  <Camera className="w-6 h-6 text-white" />
                </div>
              </button>
              {isUploading && (
                <div className="absolute inset-0 flex items-center justify-center bg-black/60 rounded-full">
                  <div className="w-6 h-6 border-2 border-white border-t-transparent rounded-full animate-spin" />
                </div>
              )}
              <input
                ref={fileInputRef}
                type="file"
                accept="image/*"
                onChange={handleFileChange}
                className="hidden"
              />
            </div>
          </div>

          {/* Username */}
          <div className="space-y-4">
            <div>
              <label className="block text-white/60 text-sm mb-2">Username</label>
              <input
                type="text"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                data-testid="input-username"
                className="w-full px-4 py-3 rounded-xl bg-white/10 border border-white/20 text-white placeholder:text-white/40 focus:outline-none focus:border-secondary/60 transition-colors"
                maxLength={20}
              />
            </div>

            {/* Stats Display */}
            <div className="bg-white/5 rounded-xl p-4 border border-white/10">
              <div className="flex justify-between text-sm">
                <span className="text-white/60">Balance</span>
                <span className="text-secondary font-bold">${user.balance}</span>
              </div>
              <div className="flex justify-between text-sm mt-2">
                <span className="text-white/60">Member Since</span>
                <span className="text-white/80">
                  {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : 'N/A'}
                </span>
              </div>
            </div>

            {error && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-red-400 text-sm text-center"
              >
                {error}
              </motion.p>
            )}

            {success && (
              <motion.p
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-green-400 text-sm text-center"
              >
                {success}
              </motion.p>
            )}

            <button
              onClick={handleSave}
              disabled={isLoading}
              data-testid="button-save"
              className="w-full bg-primary hover:bg-primary/90 disabled:opacity-50 text-primary-foreground font-bold py-3 px-6 rounded-xl text-lg flex items-center justify-center gap-2 transition-all"
            >
              <Save className="w-5 h-5" />
              {isLoading ? "Saving..." : "Save Changes"}
            </button>
          </div>
        </motion.div>
      </main>
    </div>
  );
}
