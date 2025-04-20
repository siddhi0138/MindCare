
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Gamepad2 } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import confetti from "canvas-confetti";

interface MemoryCard {
  id: number;
  emoji: string;
  matched: boolean;
  flipped: boolean;
}

const MemoryGame = ({ onBack }: { onBack: () => void }) => {
  const [cards, setCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [isAnimating, setIsAnimating] = useState(false);

  const memoryEmojis = ['😊', '🌟', '🌈', '🎉', '🌻', '🦋', '🐬', '🌺'];

  const initGame = () => {
    const cardSet = [...memoryEmojis, ...memoryEmojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        matched: false,
        flipped: false
      }));
    setCards(cardSet);
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
  };

  useEffect(() => {
    initGame();
  }, []);

  const handleCardFlip = (cardId: number) => {
    if (isAnimating || flippedCards.length >= 2 || cards[cardId].matched || flippedCards.includes(cardId)) {
      return;
    }

    const updatedCards = [...cards];
    updatedCards[cardId].flipped = true;
    setCards(updatedCards);
    
    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);
    
    if (newFlippedCards.length === 2) {
      setIsAnimating(true);
      setMoves(m => m + 1);
      
      const [firstCardId, secondCardId] = newFlippedCards;
      
      if (cards[firstCardId].emoji === cards[secondCardId].emoji) {
        updatedCards[firstCardId].matched = true;
        updatedCards[secondCardId].matched = true;
        setCards(updatedCards);
        setMatchedPairs(prev => prev + 1);
        setFlippedCards([]);
        setIsAnimating(false);
        
        if (matchedPairs + 1 === memoryEmojis.length) {
          confetti({
            particleCount: 100,
            spread: 70,
            origin: { y: 0.6 }
          });
          toast.success("Congratulations! 🎉", {
            description: `You've completed the game in ${moves + 1} moves!`
          });
        } else {
          toast.success("Found a match! 🌟", {
            duration: 1000
          });
        }
      } else {
        setTimeout(() => {
          updatedCards[firstCardId].flipped = false;
          updatedCards[secondCardId].flipped = false;
          setCards(updatedCards);
          setFlippedCards([]);
          setIsAnimating(false);
        }, 1000);
      }
    }
  };

  return (
    <Card>
      <CardHeader>
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <CardTitle>Memory Match</CardTitle>
            <div className="text-sm text-muted-foreground">Moves: {moves}</div>
          </div>
          <Button variant="outline" size="sm" onClick={onBack}>Back to Games</Button>
        </div>
        <CardDescription>Match pairs of cards to win. Train your memory and focus!</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="grid grid-cols-4 gap-3">
          {cards.map((card) => (
            <div 
              key={card.id}
              onClick={() => handleCardFlip(card.id)}
              className={`
                aspect-square flex items-center justify-center text-3xl 
                transition-all duration-300 cursor-pointer rounded-lg
                transform hover:scale-105
                ${card.flipped ? 'bg-primary/10 rotate-y-180' : 'bg-primary/5'}
                ${card.matched ? 'bg-green-100 dark:bg-green-900/30 cursor-default' : ''}
                ${isAnimating ? 'pointer-events-none' : ''}
              `}
              style={{
                perspective: '1000px',
                transformStyle: 'preserve-3d'
              }}
            >
              <div className={`transition-opacity duration-300 ${card.flipped ? 'opacity-100' : 'opacity-0'}`}>
                {card.emoji}
              </div>
            </div>
          ))}
        </div>
        <div className="flex justify-center mt-4">
          <Button onClick={initGame}>New Game</Button>
        </div>
      </CardContent>
    </Card>
  );
};

export default MemoryGame;
