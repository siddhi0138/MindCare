
import React, { useState, useEffect } from 'react';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Circle } from 'lucide-react';
import { toast } from 'sonner';

const FindTheBall = () => {
  const [cups, setCups] = useState<number[]>([0, 0, 0]);
  const [ballPosition, setBallPosition] = useState<number>(0);
  const [isPlaying, setIsPlaying] = useState(false);
  const [score, setScore] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [shuffleSpeed, setShuffleSpeed] = useState(1000);

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
        <p className="mb-4">Score: {score}</p>
        {!gameStarted && (
          <Button onClick={startGame} className="mb-4">
            Start Game
          </Button>
        )}
      </div>

      <div className="grid grid-cols-3 gap-4 mb-6">
        {cups.map((cup, index) => (
          <Card
            key={index}
            className={`
              p-8 cursor-pointer transition-transform duration-300
              ${isPlaying ? 'hover:cursor-not-allowed' : 'hover:scale-105'}
              ${!gameStarted ? 'opacity-50' : ''}
            `}
            onClick={() => handleCupClick(index)}
          >
            <div className="flex justify-center items-center h-24">
              {!isPlaying && !gameStarted ? (
                <Circle className="w-8 h-8" />
              ) : (
                <div className="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center">
                  {cup === 1 && !isPlaying && (
                    <Circle className="w-8 h-8 text-primary animate-pulse" />
                  )}
                </div>
              )}
            </div>
          </Card>
        ))}
      </div>

      <div className="text-center text-sm text-muted-foreground">
        {isPlaying ? (
          "Watch carefully..."
        ) : gameStarted ? (
          "Click on the cup where you think the ball is!"
        ) : (
          "Click Start Game to begin"
        )}
      </div>
    </div>
  );
};

export default FindTheBall;
