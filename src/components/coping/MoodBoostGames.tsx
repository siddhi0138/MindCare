
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Gamepad2, Heart, Sparkles } from "lucide-react";
import { toast } from "@/components/ui/sonner";

type GameType = "memory" | "gratitude" | "positive";

interface MemoryCard {
  id: number;
  emoji: string;
  matched: boolean;
  flipped: boolean;
}

const MoodBoostGames = () => {
  const [activeGame, setActiveGame] = useState<GameType | null>(null);
  const [memoryCards, setMemoryCards] = useState<MemoryCard[]>([]);
  const [flippedCards, setFlippedCards] = useState<number[]>([]);
  const [matchedPairs, setMatchedPairs] = useState(0);
  const [moves, setMoves] = useState(0);
  const [gratitudePrompt, setGratitudePrompt] = useState("");
  const [gratitudeEntry, setGratitudeEntry] = useState("");
  const [positiveThoughts, setPositiveThoughts] = useState<string[]>([]);
  const [currentPositiveThought, setCurrentPositiveThought] = useState("");
  
  const memoryEmojis = ['😊', '🌟', '🌈', '🎉', '🌻', '🦋', '🐬', '🌺'];
  const gratitudePrompts = [
    "What's one thing that made you smile today?",
    "Who is someone you're grateful for right now?",
    "What's something beautiful you noticed recently?",
    "What's a small victory you've had lately?",
    "What's something you're looking forward to?",
    "What's a simple pleasure that brings you joy?",
    "What's something you appreciate about yourself?",
    "What's a challenge you've overcome recently?"
  ];

  // Initialize memory game
  const initMemoryGame = () => {
    const cardSet = [...memoryEmojis, ...memoryEmojis]
      .sort(() => Math.random() - 0.5)
      .map((emoji, index) => ({
        id: index,
        emoji,
        matched: false,
        flipped: false
      }));
    setMemoryCards(cardSet);
    setFlippedCards([]);
    setMatchedPairs(0);
    setMoves(0);
  };

  // Initialize gratitude challenge
  const initGratitudeChallenge = () => {
    const randomPrompt = gratitudePrompts[Math.floor(Math.random() * gratitudePrompts.length)];
    setGratitudePrompt(randomPrompt);
    setGratitudeEntry("");
  };

  // Initialize positive reframing
  const initPositiveReframing = () => {
    setPositiveThoughts([]);
    setCurrentPositiveThought("");
  };

  // Handle game selection
  useEffect(() => {
    if (activeGame === "memory") {
      initMemoryGame();
    } else if (activeGame === "gratitude") {
      initGratitudeChallenge();
    } else if (activeGame === "positive") {
      initPositiveReframing();
    }
  }, [activeGame]);

  // Handle card flipping in memory game
  const handleCardFlip = (cardId: number) => {
    // Don't allow more than 2 cards to be flipped or already matched cards
    if (flippedCards.length >= 2 || memoryCards[cardId].matched) return;
    
    // Don't allow the same card to be flipped twice
    if (flippedCards.length === 1 && flippedCards[0] === cardId) return;
    
    // Flip the card
    const updatedCards = [...memoryCards];
    updatedCards[cardId].flipped = true;
    setMemoryCards(updatedCards);
    
    // Add to flipped cards
    const newFlippedCards = [...flippedCards, cardId];
    setFlippedCards(newFlippedCards);
    
    // Check for a match if two cards are flipped
    if (newFlippedCards.length === 2) {
      setMoves(moves + 1);
      
      const [firstCardId, secondCardId] = newFlippedCards;
      
      if (memoryCards[firstCardId].emoji === memoryCards[secondCardId].emoji) {
        // Cards match
        updatedCards[firstCardId].matched = true;
        updatedCards[secondCardId].matched = true;
        setMemoryCards(updatedCards);
        setMatchedPairs(matchedPairs + 1);
        setFlippedCards([]);
        
        // Check if all pairs are matched
        if (matchedPairs + 1 === memoryEmojis.length) {
          setTimeout(() => {
            toast.success("Congratulations! You've completed the game!", {
              description: `You found all pairs in ${moves + 1} moves.`
            });
          }, 500);
        } else {
          toast.success("Great job! You found a match!", {
            duration: 1000
          });
        }
      } else {
        // Cards don't match, flip them back after a delay
        setTimeout(() => {
          updatedCards[firstCardId].flipped = false;
          updatedCards[secondCardId].flipped = false;
          setMemoryCards(updatedCards);
          setFlippedCards([]);
        }, 1000);
      }
    }
  };

  // Handle gratitude submission
  const handleGratitudeSubmit = () => {
    if (gratitudeEntry.trim()) {
      toast.success("Gratitude recorded!", {
        description: "Taking time to appreciate the good things can boost your mood."
      });
      initGratitudeChallenge();
    }
  };

  // Handle positive thought submission
  const handlePositiveThoughtSubmit = () => {
    if (currentPositiveThought.trim()) {
      setPositiveThoughts([...positiveThoughts, currentPositiveThought]);
      setCurrentPositiveThought("");
      toast.success("Positive thought recorded!", {
        description: "Focusing on positive thoughts can improve your mental wellbeing."
      });
    }
  };

  return (
    <div className="space-y-6">
      {!activeGame ? (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="border-primary/10 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveGame("memory")}>
            <CardHeader>
              <div className="bg-gradient-to-br from-blue-100 to-blue-50 dark:from-blue-900/30 dark:to-blue-800/20 rounded-lg p-4 mb-2 w-12 h-12 flex items-center justify-center">
                <Gamepad2 className="h-6 w-6 text-blue-600 dark:text-blue-400" />
              </div>
              <CardTitle>Memory Match</CardTitle>
              <CardDescription>Boost focus by matching pairs of cards</CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="border-primary/10 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveGame("gratitude")}>
            <CardHeader>
              <div className="bg-gradient-to-br from-green-100 to-green-50 dark:from-green-900/30 dark:to-green-800/20 rounded-lg p-4 mb-2 w-12 h-12 flex items-center justify-center">
                <Heart className="h-6 w-6 text-green-600 dark:text-green-400" />
              </div>
              <CardTitle>Gratitude Challenge</CardTitle>
              <CardDescription>Reflect on the positive aspects of your life</CardDescription>
            </CardHeader>
          </Card>
          
          <Card className="border-primary/10 hover:shadow-md transition-shadow cursor-pointer" onClick={() => setActiveGame("positive")}>
            <CardHeader>
              <div className="bg-gradient-to-br from-purple-100 to-purple-50 dark:from-purple-900/30 dark:to-purple-800/20 rounded-lg p-4 mb-2 w-12 h-12 flex items-center justify-center">
                <Sparkles className="h-6 w-6 text-purple-600 dark:text-purple-400" />
              </div>
              <CardTitle>Positive Reframing</CardTitle>
              <CardDescription>Transform negative thoughts into positive ones</CardDescription>
            </CardHeader>
          </Card>
        </div>
      ) : activeGame === "memory" ? (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Memory Match</CardTitle>
              <Button variant="outline" size="sm" onClick={() => setActiveGame(null)}>Back to Games</Button>
            </div>
            <CardDescription>Find all matching pairs. Moves: {moves}</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-4 gap-3">
              {memoryCards.map((card) => (
                <div 
                  key={card.id}
                  onClick={() => handleCardFlip(card.id)}
                  className={`
                    aspect-square flex items-center justify-center text-3xl 
                    transition-all duration-300 cursor-pointer rounded-lg
                    ${card.flipped ? 'bg-primary/10' : 'bg-primary/5'}
                    ${card.matched ? 'bg-green-100 dark:bg-green-900/30' : ''}
                  `}
                >
                  {card.flipped ? card.emoji : ''}
                </div>
              ))}
            </div>
            <div className="flex justify-center mt-4">
              <Button variant="outline" onClick={initMemoryGame}>Restart Game</Button>
            </div>
          </CardContent>
        </Card>
      ) : activeGame === "gratitude" ? (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Gratitude Challenge</CardTitle>
              <Button variant="outline" size="sm" onClick={() => setActiveGame(null)}>Back to Games</Button>
            </div>
            <CardDescription>Practicing gratitude can boost happiness and reduce depression</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="bg-primary/5 p-6 rounded-lg text-center">
              <p className="text-lg font-medium">{gratitudePrompt}</p>
            </div>
            
            <textarea
              className="w-full h-32 p-4 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
              placeholder="Write your thoughts here..."
              value={gratitudeEntry}
              onChange={(e) => setGratitudeEntry(e.target.value)}
            />
            
            <div className="flex justify-between">
              <Button variant="outline" onClick={initGratitudeChallenge}>New Prompt</Button>
              <Button onClick={handleGratitudeSubmit}>Save & Continue</Button>
            </div>
          </CardContent>
        </Card>
      ) : activeGame === "positive" ? (
        <Card>
          <CardHeader>
            <div className="flex justify-between items-center">
              <CardTitle>Positive Reframing</CardTitle>
              <Button variant="outline" size="sm" onClick={() => setActiveGame(null)}>Back to Games</Button>
            </div>
            <CardDescription>Transform negative thoughts into positive ones</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="space-y-2">
              <textarea
                className="w-full h-20 p-4 border rounded-md resize-none focus:outline-none focus:ring-2 focus:ring-primary/50"
                placeholder="Write a positive thought or reframe a negative one..."
                value={currentPositiveThought}
                onChange={(e) => setCurrentPositiveThought(e.target.value)}
              />
              <Button onClick={handlePositiveThoughtSubmit} className="w-full">Add Positive Thought</Button>
            </div>
            
            <div className="bg-primary/5 p-4 rounded-lg">
              <p className="font-medium mb-2">Your Positive Thoughts:</p>
              {positiveThoughts.length > 0 ? (
                <ul className="space-y-2">
                  {positiveThoughts.map((thought, index) => (
                    <li key={index} className="bg-white dark:bg-gray-800 p-3 rounded-md shadow-sm flex items-start gap-2">
                      <Sparkles className="h-5 w-5 text-purple-500 shrink-0 mt-0.5" />
                      <span>{thought}</span>
                    </li>
                  ))}
                </ul>
              ) : (
                <p className="text-muted-foreground text-sm">No positive thoughts added yet. Start by adding one above!</p>
              )}
            </div>
          </CardContent>
        </Card>
      ) : null}
    </div>
  );
};

export default MoodBoostGames;
