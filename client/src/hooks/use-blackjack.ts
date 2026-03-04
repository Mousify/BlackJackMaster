import { useState, useCallback, useEffect } from 'react';
import { Card, createDeck, calculateScore, GameStatus, GameResult } from '@/lib/blackjack-engine';
import { soundManager } from './use-sound';
import { useAuth } from '@/contexts/AuthContext';
import { apiRequest, queryClient } from '@/lib/queryClient';
import confetti from 'canvas-confetti';

const STARTING_BALANCE = 1000;

export function useBlackjack() {
  const { user, updateUser } = useAuth();
  const [deck, setDeck] = useState<Card[]>([]);
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [status, setStatus] = useState<GameStatus>('idle');
  const [result, setResult] = useState<GameResult>(null);
  const [balance, setBalance] = useState<number>(user?.balance ?? STARTING_BALANCE);
  const [currentBet, setCurrentBet] = useState<number>(0);
  const [displayBalance, setDisplayBalance] = useState<number>(user?.balance ?? STARTING_BALANCE);

  // Sync balance with user from server
  useEffect(() => {
    if (user?.balance !== undefined) {
      setBalance(user.balance);
      setDisplayBalance(user.balance);
    }
  }, [user?.balance]);

  // Update display balance when current bet or actual balance changes
  useEffect(() => {
    if (status === 'idle' || status === 'game-over') {
      setDisplayBalance(balance - currentBet);
    } else {
      setDisplayBalance(balance);
    }
  }, [balance, currentBet, status]);

  // Initialize deck on mount
  useEffect(() => {
    setDeck(createDeck());
  }, []);

  // Save balance to server when it changes (debounced)
  const saveBalance = useCallback(async (newBalance: number) => {
    if (user?.id) {
      try {
        await apiRequest('PATCH', `/api/users/${user.id}`, { balance: newBalance });
        updateUser({ balance: newBalance });
      } catch (err) {
        // Ignore errors
      }
    }
  }, [user?.id, updateUser]);

  const saveGameResult = useCallback(async (gameResult: 'win' | 'loss' | 'push', pScore: number, dScore: number) => {
    if (user?.id) {
      try {
        await apiRequest('POST', '/api/results', {
          userId: user.id,
          result: gameResult,
          playerScore: pScore,
          dealerScore: dScore,
          betAmount: currentBet,
        });
        // Invalidate results query to trigger achievement check
        queryClient.invalidateQueries({ queryKey: ['/api/results/user', user.id] });
      } catch (err) {
        // Ignore
      }
    }
  }, [user?.id, currentBet]);

  const updateBet = useCallback((amount: number) => {
    if (status === 'idle' || status === 'game-over') {
      if (amount > balance) return;
      // Play chip sound based on change
      if (amount > currentBet) {
        soundManager.playSFX('chipSingle');
      }
      setCurrentBet(amount);
    }
  }, [status, currentBet, balance]);

  const clearBet = useCallback(() => {
    if (status === 'idle' || status === 'game-over') {
      setCurrentBet(0);
      soundManager.playSFX('buttonClick');
    }
  }, [status]);

  const resetBalance = useCallback(() => {
    setBalance(STARTING_BALANCE);
    setCurrentBet(0);
    saveBalance(STARTING_BALANCE);
    soundManager.playSFX('buttonClick');
  }, [saveBalance]);

  const processWinnings = useCallback((finalResult: GameResult): number => {
    let newBalance = balance;
    
    if (finalResult === 'blackjack') {
      // Blackjack pays 3:2
      newBalance = balance + currentBet + Math.floor(currentBet * 1.5);
    } else if (finalResult === 'win') {
      // Regular win pays 1:1
      newBalance = balance + currentBet * 2;
    } else if (finalResult === 'push') {
      // Push returns the bet
      newBalance = balance + currentBet;
    }
    // Loss: bet was already deducted
    
    setBalance(newBalance);
    return newBalance;
  }, [currentBet, balance]);

  const determineWinner = useCallback((pScore: number, dScore: number) => {
    let finalResult: GameResult = 'loss';
    
    if (pScore > 21) finalResult = 'bust';
    else if (dScore > 21) finalResult = 'win';
    else if (pScore > dScore) {
      if (pScore === 21 && playerHand.length === 2) finalResult = 'blackjack';
      else finalResult = 'win';
    }
    else if (dScore > pScore) finalResult = 'loss';
    else finalResult = 'push';

    setResult(finalResult);
    const newBalance = processWinnings(finalResult);
    
    // Play result sounds
    if (finalResult === 'blackjack') {
      soundManager.playSFX('victoryTheme');
    } else if (finalResult === 'win') {
      soundManager.playSFX('win');
    } else if (finalResult === 'push') {
      soundManager.playSFX('push');
    } else {
      soundManager.playSFX('lose');
    }
    
    // Save to server
    saveBalance(newBalance);
    saveGameResult(
      finalResult === 'blackjack' || finalResult === 'win' ? 'win' : 
      finalResult === 'push' ? 'push' : 'loss',
      pScore,
      dScore
    );

    if (finalResult === 'win' || finalResult === 'blackjack') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [playerHand, processWinnings, saveBalance, saveGameResult]);

  const dealerPlay = useCallback(async () => {
    setStatus('dealer-turn');
    
    // Reveal hidden card
    soundManager.playSFX('cardFlip');
    let currentDealerHand = dealerHand.map(c => ({ ...c, isHidden: false }));
    setDealerHand(currentDealerHand);

    let dScore = calculateScore(currentDealerHand);
    let currentDeck = [...deck];

    // Simple delay loop for dealer hits
    const playLoop = async () => {
      // Dealer hits on soft 17 (logic simplified to hit < 17)
      while (dScore < 17) {
        await new Promise(r => setTimeout(r, 800)); // Delay for dramatic effect
        soundManager.playSFX('dealerHit');
        const card = currentDeck.pop()!;
        currentDealerHand = [...currentDealerHand, card];
        setDealerHand(currentDealerHand);
        setDeck(currentDeck);
        dScore = calculateScore(currentDealerHand);
      }
      
      setStatus('game-over');
      determineWinner(calculateScore(playerHand), dScore);
    };

    playLoop();
  }, [deck, dealerHand, playerHand, determineWinner]);

  const stand = useCallback(() => {
    if (status !== 'playing') return;
    soundManager.playSFX('dealerStand');
    dealerPlay();
  }, [status, dealerPlay]);

  const deal = useCallback(() => {
    if (currentBet <= 0) return; // Must place a bet

    // Play deal sound
    soundManager.playSFX('cardDeal');

    // Deduct bet from balance
    const newBalance = balance - currentBet;
    setBalance(newBalance);

    // If deck is running low (penetration < 20 cards), reshuffle
    let currentDeck = [...deck];
    if (currentDeck.length < 20) {
      currentDeck = createDeck();
    }

    const pCard1 = currentDeck.pop()!;
    const dCard1 = currentDeck.pop()!;
    const pCard2 = currentDeck.pop()!;
    const dCard2 = { ...currentDeck.pop()!, isHidden: true }; // Hide dealer's second card

    setDeck(currentDeck);
    setPlayerHand([pCard1, pCard2]);
    setDealerHand([dCard1, dCard2]);
    setStatus('playing');
    setResult(null);

    // Check for natural Blackjack immediately
    const pScore = calculateScore([pCard1, pCard2]);
    if (pScore === 21) {
      setTimeout(() => {
        stand();
      }, 1000);
    }
  }, [deck, currentBet, balance, stand]);

  const forfeit = useCallback(() => {
    if (status !== 'playing') return;
    
    setStatus('game-over');
    setResult('loss');
    setDealerHand(prev => prev.map(c => ({ ...c, isHidden: false })));
    
    soundManager.playSFX('lose');
    saveBalance(balance);
    saveGameResult('loss', calculateScore(playerHand), calculateScore(dealerHand));
  }, [status, balance, saveBalance, saveGameResult, playerHand, dealerHand]);

  const hit = useCallback(() => {
    if (status !== 'playing') return;

    soundManager.playSFX('cardDeal');

    const newDeck = [...deck];
    const card = newDeck.pop()!;
    const newHand = [...playerHand, card];

    setDeck(newDeck);
    setPlayerHand(newHand);

    const score = calculateScore(newHand);
    if (score > 21) {
      setStatus('game-over');
      setResult('bust');
      // Reveal dealer card for visual completeness
      setDealerHand(prev => prev.map(c => ({ ...c, isHidden: false })));
      
      soundManager.playSFX('lose');
      
      // Save balance (bet was already deducted)
      saveBalance(balance);
      saveGameResult('loss', score, calculateScore(dealerHand));
    }
  }, [deck, playerHand, status, dealerHand, balance, saveBalance, saveGameResult]);

  return {
    deck,
    playerHand,
    dealerHand,
    status,
    result,
    deal,
    hit,
    stand,
    forfeit,
    clearBet,
    playerScore: calculateScore(playerHand),
    dealerScore: calculateScore(dealerHand),
    balance,
    displayBalance,
    currentBet,
    updateBet,
    resetBalance,
    setResult
  };
}
