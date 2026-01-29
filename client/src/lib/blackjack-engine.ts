export type Suit = 'spades' | 'hearts' | 'diamonds' | 'clubs';
export type Rank = 'A' | '2' | '3' | '4' | '5' | '6' | '7' | '8' | '9' | '10' | 'J' | 'Q' | 'K';

export interface Card {
  id: string; // Unique ID for React keys
  suit: Suit;
  rank: Rank;
  value: number; // Base value (1 for Ace initially)
  isHidden: boolean;
}

export const SUITS: Suit[] = ['spades', 'hearts', 'diamonds', 'clubs'];
export const RANKS: Rank[] = ['A', '2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K'];

export function createDeck(): Card[] {
  const deck: Card[] = [];
  for (const suit of SUITS) {
    for (const rank of RANKS) {
      let value = 0;
      if (['J', 'Q', 'K'].includes(rank)) value = 10;
      else if (rank === 'A') value = 11; // Default to 11, handled in score calc
      else value = parseInt(rank);

      deck.push({
        id: `${rank}-${suit}-${Math.random().toString(36).substr(2, 9)}`,
        suit,
        rank,
        value,
        isHidden: false,
      });
    }
  }
  return shuffle(deck);
}

function shuffle(deck: Card[]): Card[] {
  const newDeck = [...deck];
  for (let i = newDeck.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [newDeck[i], newDeck[j]] = [newDeck[j], newDeck[i]];
  }
  return newDeck;
}

export function calculateScore(hand: Card[]): number {
  let score = 0;
  let aces = 0;

  for (const card of hand) {
    if (card.isHidden) continue; // Don't count hidden cards
    score += card.value;
    if (card.rank === 'A') aces += 1;
  }

  // Adjust for aces
  while (score > 21 && aces > 0) {
    score -= 10;
    aces -= 1;
  }

  return score;
}

export type GameStatus = 'idle' | 'playing' | 'dealer-turn' | 'game-over';
export type GameResult = 'win' | 'loss' | 'push' | 'blackjack' | 'bust' | null;
