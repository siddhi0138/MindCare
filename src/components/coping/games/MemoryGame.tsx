
import React, { useState, useEffect, useCallback } from "react";
import { Button } from "@/components/ui/button";
import { Card } from "@/components/ui/card";
import { Gamepad2, RefreshCcw } from "lucide-react";
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from "@/hooks/use-toast";
import { recordActivity } from "@/hooks/use-toast";

interface Card {
  id: number;
  emoji: string;
  isFlipped: boolean;
  isMatched: boolean;
}

const emojis = ["🌟", "🌈", "🌺", "🦋", "🌙", "🌞", "🌍", "🌸"];

const MemoryGame: React.FC<GameProps> = ({ onBack }) => {
  const [cards, setCards] = useState<Card[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const { currentUser } = useAuth();
  const { toast } = useToast();
  const [moves, setMoves] = useState(0);
  const [matches, setMatches] = useState(0);

  const initializeGame = (): void => {
    const shuffledEmojis = [...emojis, ...emojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        isFlipped: false,
        isMatched: false,
      }));
    setCards(shuffledEmojis);
    setFlippedCards([]);
    setMoves(0);
    setMatches(0);
  };

  useEffect(() => {
    initializeGame();
  }, []);

  const handleCardClick = (cardId: number) => {
    if (
      flippedCards.length === 2 ||
      flippedCards.includes(cardId) ||
      cards[cardId].isMatched
    )
      return;

    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);

    if (newFlippedCards.length === 2) {
      setMoves((prev) => prev + 1);
      const [firstCard, secondCard] = newFlippedCards;
      
      if (cards[firstCard].emoji === cards[secondCard].emoji) {
        setCards((prev) =>
          prev.map((card) =>
            card.id === firstCard || card.id === secondCard
              ? { ...card, isMatched: true }
              : card
          )
        );
        setMatches((prev) => prev + 1);
        setFlippedCards([]);
      } else {
        setTimeout(() => setFlippedCards([]), 1000);
      }
    }
  };

  const handleGameCompletion = useCallback(async () => {
    if (matches === emojis.length) {
      toast({title:`Congratulations! You completed the game in ${moves} moves!`});
      if (currentUser) {
          await recordActivity("game-completed", "Memory Game", "MemoryGamePage");
      }
    }
  }, [matches, emojis.length, moves, currentUser, toast]);

  useEffect(() => {
    handleGameCompletion();
  }, [handleGameCompletion]);

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div className="space-y-1">
          <h2 className="text-2xl font-semibold">Memory Match</h2>
          <p className="text-muted-foreground">Match pairs of cards to win!</p>
        </div>
        <Button variant="outline" onClick={initializeGame} >
          <RefreshCcw className="mr-2 h-4 w-4" />
          Restart Memory Game
        </Button>
      </div>

      <div className="flex justify-between items-center">
        <span>Moves: {moves}</span>
        <span>Matches: {matches}/{emojis.length}</span>
      </div>

      <div className="grid grid-cols-4 gap-4">
        {cards.map((card) => (
          <button
            key={card.id}
            onClick={() => handleCardClick(card.id)}
            className={`aspect-square text-3xl p-4 rounded-lg transition-all transform ${
              card.isFlipped || card.isMatched || flippedCards.includes(card.id)
                ? "bg-primary/10 rotate-0"
                : "bg-primary rotate-180"
            }`}
            disabled={card.isMatched}
          >
            <span
              className={`block transition-all ${
                card.isFlipped || card.isMatched || flippedCards.includes(card.id)
                  ? "rotate-0 opacity-100"
                  : "rotate-180 opacity-0"
              }`}
            >
              {card.emoji}
            </span>
          </button>
        ))}
      </div>

      {matches === emojis.length && (
        <div className="text-center p-4 bg-primary/10 rounded-lg">
           <h3 className="text-xl font-semibold">Congratulations! 🎉</h3>
          <p>You completed the game in {moves} moves!</p>
          <Button onClick={initializeGame} className="mt-4">
            <Gamepad2 className="mr-2 h-4 w-4" />
            Play Again
          </Button>
        </div>
      )}
    </div>
  );
};

export type GameProps = {
  onBack: () => void;
};

export default MemoryGame;
