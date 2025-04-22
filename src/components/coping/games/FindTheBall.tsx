import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Cup } from 'lucide-react';
import { toast } from 'sonner';

const FindTheBall = () => {
  const [cups, setCups] = useState<number[]>([0, 0, 0]);
  const [ballPosition, setBallPosition] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [shuffleSpeed, setShuffleSpeed] = useState(1000);
  const [hoveredCup, setHoveredCup] = useState<number | null>(null);

  const startGame = () => {
    const randomPosition = Math.floor(Math.random() * 3);
    setBallPosition(randomPosition);
    const newCups = [0, 0, 0];
    newCups[randomPosition] = 1;
    setCups(newCups);
    setGameStarted(true);
    setTimeout(() => {
      setIsPlaying(true);
      shuffleCups();
    }, 2000);
  };

  const shuffleCups = () => {
    let iterations = 0;
    const maxIterations = 5;
    const interval = setInterval(() => {
      if (iterations >= maxIterations) {
        clearInterval(interval);
        setIsPlaying(false);
        return;
      }

      const pos1 = Math.floor(Math.random() * 3);
      const pos2 = Math.floor(Math.random() * 3);

      if (pos1 !== pos2) {
        setCups(prev => {
          const newCups = [...prev];
          [newCups[pos1], newCups[pos2]] = [newCups[pos2], newCups[pos1]];
          if (ballPosition === pos1) setBallPosition(pos2);
          else if (ballPosition === pos2) setBallPosition(pos1);
          return newCups;
        });
      }

      iterations++;
    }, shuffleSpeed);
  };

  const handleCupClick = (index: number) => {
    if (isPlaying) return;
    if (!gameStarted) return;

    if (index === ballPosition) {
      toast.success("You found the ball! +1 point");
      setScore(prev => prev + 1);
      if (score > 0 && score % 3 === 0) {
        setShuffleSpeed(prev => Math.max(prev - 100, 400));
        toast("Speed increased! Get ready for a challenge!");
      }
    } else {
      toast.error("Wrong cup! Try again");
      setScore(0);
      setShuffleSpeed(1000);
    }

    setTimeout(startGame, 1500);
  };

  return (
    <div className="max-w-2xl mx-auto p-4">
      <div className="text-center mb-6">
        <h2 className="text-2xl font-bold mb-2">Find the Ball Game</h2>
        <p className="mb-4 text-lg">Score: {score}</p>
        {!gameStarted && (
          <Button onClick={startGame} className="mb-4 text-lg px-8">
            Start Game
          </Button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-8 mb-6">
        {cups.map((cup, index) => (
          <Card
            key={index}
            className={`
              relative p-8 cursor-pointer transition-all duration-300 transform
              ${isPlaying ? 'hover:cursor-not-allowed' : 'hover:scale-105'}
              ${!gameStarted ? 'opacity-50' : ''}
              ${hoveredCup === index ? 'shadow-xl' : 'shadow-md'}
              bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900
            `}
            onClick={() => handleCupClick(index)}
            onMouseEnter={() => !isPlaying && setHoveredCup(index)}
            onMouseLeave={() => setHoveredCup(null)}
          >
            <div className="flex justify-center items-center h-32">
              {!isPlaying && !gameStarted ? (
                <div className="relative">
                  <Cup className="w-20 h-20 text-primary/80" strokeWidth={1.5} />
                  {index === 1 && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary rounded-full animate-bounce" />
                  )}
                </div>
              ) : (
                <div className="relative">
                  <Cup 
                    className={`w-20 h-20 ${
                      cup === 1 && !isPlaying 
                        ? 'text-primary animate-pulse' 
                        : 'text-primary/80'
                    }`}
                    strokeWidth={1.5}
                  />
                  {cup === 1 && !isPlaying && (
                    <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-4 h-4 bg-primary rounded-full animate-bounce" />
                  )}
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      <div className="text-center text-lg text-muted-foreground">
        {isPlaying ? (
          <p className="animate-pulse">Watch carefully...</p>
        ) : gameStarted ? (
          <p>Click on the cup hiding the ball!</p>
        ) : (
          <p>Click Start Game to begin</p>
        )}
      </div>
    </div>
  );
};

export default FindTheBall;
