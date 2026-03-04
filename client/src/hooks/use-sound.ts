import { useCallback, useEffect, useRef, useState } from 'react';

// Sound effect imports
import buttonClickSound from "@assets/button-click_1769865891914.mp3";
import cardDealSound from "@assets/card-deal_1769865891915.mp3";
import cardFlipSound from "@assets/card-flip_1769865891915.mp3";
import chipSingleSound from "@assets/chip-single_1769865891916.mp3";
import chipStackSound from "@assets/chip-stack_1769865891916.mp3";
import dealerBlackjackSound from "@assets/dealer-blackjack_1769865891916.mp3";
import dealerBustSound from "@assets/dealer-bust_1769865891917.mp3";
import dealerHitSound from "@assets/dealer-hit_1769865891917.mp3";
import dealerStandSound from "@assets/dealer-stand_1769865891917.mp3";
import dealerWelcomeSound from "@assets/dealer-welcome_1769865891917.mp3";
import highStakesSound from "@assets/high-stakes_1769865891918.mp3";
import loseSound from "@assets/lose_1769865891918.mp3";
import pushSound from "@assets/push_1769865891919.mp3";
import victoryThemeSound from "@assets/victory-theme_1769865891919.mp3";
import winSound from "@assets/win_1769865891919.mp3";

// Music imports
import mainThemeMusic from "@assets/main-theme_1769865891918.mp3";
import gameMusic1 from "@assets/game-music-1_1769865891918.mp3";
import gameMusic2 from "@assets/game-music-2_1769865891918.mp3";

export const SoundEffects = {
  buttonClick: buttonClickSound,
  cardDeal: cardDealSound,
  cardFlip: cardFlipSound,
  chipSingle: chipSingleSound,
  chipStack: chipStackSound,
  dealerBlackjack: dealerBlackjackSound,
  dealerBust: dealerBustSound,
  dealerHit: dealerHitSound,
  dealerStand: dealerStandSound,
  dealerWelcome: dealerWelcomeSound,
  highStakes: highStakesSound,
  lose: loseSound,
  push: pushSound,
  victoryTheme: victoryThemeSound,
  win: winSound,
} as const;

export type SoundEffectKey = keyof typeof SoundEffects;

const MUSIC_VOLUME = 0.3;
const SFX_VOLUME = 0.5;

class SoundManager {
  private static instance: SoundManager;
  private musicAudio: HTMLAudioElement | null = null;
  private currentMusicType: 'main' | 'game' | null = null;
  private gameMusicTracks = [gameMusic1, gameMusic2];
  private isMuted = false;
  private musicVolume = MUSIC_VOLUME;
  private sfxVolume = SFX_VOLUME;
  private hasInteracted = false;

  static getInstance(): SoundManager {
    if (!SoundManager.instance) {
      SoundManager.instance = new SoundManager();
    }
    return SoundManager.instance;
  }

  private constructor() {
    // Load preferences from localStorage
    const savedMuted = localStorage.getItem('blackjack-muted');
    this.isMuted = savedMuted === 'true';
    
    const savedMusicVol = localStorage.getItem('blackjack-music-volume');
    this.musicVolume = savedMusicVol ? parseFloat(savedMusicVol) : MUSIC_VOLUME;
    
    const savedSFXVol = localStorage.getItem('blackjack-sfx-volume');
    this.sfxVolume = savedSFXVol ? parseFloat(savedSFXVol) : SFX_VOLUME;

    // Track first interaction to resume audio context if needed
    const handleInteraction = () => {
      this.hasInteracted = true;
      if (this.musicAudio && this.musicAudio.paused && this.currentMusicType) {
        this.musicAudio.play().catch(() => {});
      }
      window.removeEventListener('click', handleInteraction);
      window.removeEventListener('keydown', handleInteraction);
    };
    window.addEventListener('click', handleInteraction);
    window.addEventListener('keydown', handleInteraction);
  }

  getMuted(): boolean {
    return this.isMuted;
  }

  setMuted(muted: boolean): void {
    this.isMuted = muted;
    localStorage.setItem('blackjack-muted', muted.toString());
    if (this.musicAudio) {
      this.musicAudio.muted = muted;
    }
  }

  getMusicVolume(): number {
    return this.musicVolume;
  }

  setMusicVolume(volume: number): void {
    this.musicVolume = volume;
    localStorage.setItem('blackjack-music-volume', volume.toString());
    if (this.musicAudio) {
      this.musicAudio.volume = volume;
    }
  }

  getSFXVolume(): number {
    return this.sfxVolume;
  }

  setSFXVolume(volume: number): void {
    this.sfxVolume = volume;
    localStorage.setItem('blackjack-sfx-volume', volume.toString());
  }

  toggleMute(): boolean {
    this.setMuted(!this.isMuted);
    return this.isMuted;
  }

  playSFX(key: SoundEffectKey): void {
    if (this.isMuted) return;
    
    const sound = SoundEffects[key];
    if (sound) {
      const audio = new Audio(sound);
      audio.volume = this.sfxVolume;
      audio.play().catch(() => {
        // Ignore autoplay errors
      });
    }
  }

  playMainTheme(): void {
    if (this.currentMusicType === 'main' && this.musicAudio && !this.musicAudio.paused) {
      return; // Already playing
    }
    
    // If it's already main but paused (maybe due to autoplay block), try playing again
    if (this.currentMusicType === 'main' && this.musicAudio && this.musicAudio.paused) {
       this.musicAudio.play().catch(() => {});
       return;
    }

    this.stopMusic();
    this.musicAudio = new Audio(mainThemeMusic);
    this.musicAudio.volume = this.musicVolume;
    this.musicAudio.loop = true;
    this.musicAudio.muted = this.isMuted;
    this.currentMusicType = 'main';
    
    this.musicAudio.play().catch(() => {
      // Ignore autoplay errors - user needs to interact first
    });
  }

  playGameMusic(): void {
    if (this.currentMusicType === 'game' && this.musicAudio && !this.musicAudio.paused) {
      return; // Already playing game music
    }
    
    if (this.currentMusicType === 'game' && this.musicAudio && this.musicAudio.paused) {
       this.musicAudio.play().catch(() => {});
       return;
    }

    this.stopMusic();
    this.playRandomGameTrack();
  }

  private playRandomGameTrack(): void {
    const randomTrack = this.gameMusicTracks[Math.floor(Math.random() * this.gameMusicTracks.length)];
    this.musicAudio = new Audio(randomTrack);
    this.musicAudio.volume = this.musicVolume;
    this.musicAudio.muted = this.isMuted;
    this.currentMusicType = 'game';
    
    // When track ends, play another random track
    this.musicAudio.addEventListener('ended', () => {
      if (this.currentMusicType === 'game') {
        this.playRandomGameTrack();
      }
    });
    
    this.musicAudio.play().catch(() => {
      // Ignore autoplay errors
    });
  }

  stopMusic(): void {
    if (this.musicAudio) {
      this.musicAudio.pause();
      this.musicAudio.currentTime = 0;
      this.musicAudio = null;
      this.currentMusicType = null;
    }
  }
}

export const soundManager = SoundManager.getInstance();

export function useSound() {
  const [isMuted, setIsMuted] = useState(() => soundManager.getMuted());
  const [musicVolume, setMusicVolumeState] = useState(() => soundManager.getMusicVolume());
  const [sfxVolume, setSfxVolumeState] = useState(() => soundManager.getSFXVolume());

  const playSFX = useCallback((key: SoundEffectKey) => {
    soundManager.playSFX(key);
  }, []);

  const playMainTheme = useCallback(() => {
    soundManager.playMainTheme();
  }, []);

  const playGameMusic = useCallback(() => {
    soundManager.playGameMusic();
  }, []);

  const stopMusic = useCallback(() => {
    soundManager.stopMusic();
  }, []);

  const toggleMute = useCallback(() => {
    const newMuted = soundManager.toggleMute();
    setIsMuted(newMuted);
    return newMuted;
  }, []);

  const setMusicVolume = useCallback((vol: number) => {
    soundManager.setMusicVolume(vol);
    setMusicVolumeState(vol);
  }, []);

  const setSfxVolume = useCallback((vol: number) => {
    soundManager.setSFXVolume(vol);
    setSfxVolumeState(vol);
  }, []);

  return {
    playSFX,
    playMainTheme,
    playGameMusic,
    stopMusic,
    toggleMute,
    isMuted,
    musicVolume,
    sfxVolume,
    setMusicVolume,
    setSfxVolume,
  };
}
