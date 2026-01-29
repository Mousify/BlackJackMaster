import { useState, useCallback, useEffect } from 'react';
import { Card, createDeck, calculateScore, GameStatus, GameResult } from '@/lib/blackjack-engine';
import { useCreateGameResult } from './use-game-results';
import confetti from 'canvas-confetti';

export function useBlackjack() {
  const [deck, setDeck] = useState<Card[]>([]);
  const [playerHand, setPlayerHand] = useState<Card[]>([]);
  const [dealerHand, setDealerHand] = useState<Card[]>([]);
  const [status, setStatus] = useState<GameStatus>('idle');
  const [result, setResult] = useState<GameResult>(null);
  
  const createResult = useCreateGameResult();

  // Initialize deck on mount
  useEffect(() => {
    setDeck(createDeck());
  }, []);

  const deal = useCallback(() => {
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
      // Need to check if dealer also has blackjack, but typically dealer peaks.
      // For simplicity in this version, we'll process dealer turn immediately if player has BJ.
      // Or just instant win/push logic. Let's trigger dealer reveal flow.
      setTimeout(() => stand(), 500); 
    }
  }, [deck]);

  const hit = useCallback(() => {
    if (status !== 'playing') return;

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
      
      createResult.mutate({
        result: 'loss',
        playerScore: score,
        dealerScore: calculateScore(dealerHand), // count only visible
      });
    }
  }, [deck, playerHand, status, dealerHand, createResult]);

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
    
    // Save to DB
    createResult.mutate({
      result: finalResult === 'blackjack' || finalResult === 'win' ? 'win' : 
              finalResult === 'push' ? 'push' : 'loss',
      playerScore: pScore,
      dealerScore: dScore
    });

    if (finalResult === 'win' || finalResult === 'blackjack') {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 }
      });
    }
  }, [playerHand, createResult]);

  const dealerPlay = useCallback(async () => {
    setStatus('dealer-turn');
    
    // Reveal hidden card
    let currentDealerHand = dealerHand.map(c => ({ ...c, isHidden: false }));
    setDealerHand(currentDealerHand);

    let dScore = calculateScore(currentDealerHand);
    let currentDeck = [...deck];

    // Simple delay loop for dealer hits
    const playLoop = async () => {
      // Dealer hits on soft 17 (logic simplified to hit < 17)
      while (dScore < 17) {
        await new Promise(r => setTimeout(r, 800)); // Delay for dramatic effect
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
    dealerPlay();
  }, [status, dealerPlay]);

  return {
    deck,
    playerHand,
    dealerHand,
    status,
    result,
    deal,
    hit,
    stand,
    playerScore: calculateScore(playerHand),
    dealerScore: calculateScore(dealerHand)
  };
}
