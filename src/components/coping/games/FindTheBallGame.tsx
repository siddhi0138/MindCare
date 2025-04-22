import React, { useState, useEffect, useRef, useCallback } from 'react'; // Added useCallback
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { motion } from 'framer-motion';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Volume2, VolumeX, TimerIcon, TrophyIcon } from 'lucide-react'; // Added TimerIcon, TrophyIcon

// Define Leaderboard Entry Type
interface LeaderboardEntry {
  name: string;
  score: number;
  level: number;
}

const FindTheBall = () => {
  // Core Game State
  const [cupPositions, setCupPositions] = useState([0, 1, 2]);
  const [ballPosition, setBallPosition] = useState(0);
  const [gameStarted, setGameStarted] = useState(false);
  const [isShuffling, setIsShuffling] = useState(false);
  const [revealedCup, setRevealedCup] = useState<number | null>(null);
  const [showInitialBall, setShowInitialBall] = useState(false);
  const [hasGuessed, setHasGuessed] = useState(false);
  const [gameOver, setGameOver] = useState(false);

  // Score & Difficulty
  const [score, setScore] = useState(0);
  const [level, setLevel] = useState(1);
  const [highScore, setHighScore] = useState(0);
  const [shuffleSpeed, setShuffleSpeed] = useState(400);

  // Timer State
  const [timeLeft, setTimeLeft] = useState(10); // Initial time limit
  const [isTimerRunning, setIsTimerRunning] = useState(false);
  const timerRef = useRef<NodeJS.Timeout | null>(null); // Ref for timer interval

  // Leaderboard State
  const [leaderboard, setLeaderboard] = useState<LeaderboardEntry[]>([]);

  // UI & Sound State
  const [soundEnabled, setSoundEnabled] = useState(true);

  const cupWidth = 100;
  const cupSpacing = 150;
  const containerWidth = cupSpacing * 3;

  // Sound Effect Refs
  const shuffleSoundRef = useRef<HTMLAudioElement>(null);
  const correctSoundRef = useRef<HTMLAudioElement>(null);
  const wrongSoundRef = useRef<HTMLAudioElement>(null);
  const levelUpSoundRef = useRef<HTMLAudioElement>(null);
  const timerTickSoundRef = useRef<HTMLAudioElement>(null); // Optional timer tick

  // --- Load High Score & Leaderboard ---
  useEffect(() => {
    const storedHighScore = localStorage.getItem('findTheBallHighScore');
    if (storedHighScore) setHighScore(parseInt(storedHighScore, 10));

    const storedLeaderboard = localStorage.getItem('findTheBallLeaderboard');
    if (storedLeaderboard) {
      try {
        setLeaderboard(JSON.parse(storedLeaderboard));
      } catch (e) {
        console.error("Failed to parse leaderboard from localStorage", e);
        setLeaderboard([]); // Reset if parsing fails
      }
    }
  }, []);

  // --- Save High Score ---
  useEffect(() => {
    if (score > highScore) {
      setHighScore(score);
      localStorage.setItem('findTheBallHighScore', score.toString());
    }
  }, [score, highScore]);

  // --- Leaderboard Management ---
  const addLeaderboardEntry = useCallback((newScore: number, finalLevel: number) => {
    if (newScore <= 0) return; // Don't add zero scores

    const isHighScore = leaderboard.length < 5 || newScore > leaderboard[leaderboard.length - 1]?.score;

    if (isHighScore) {
      const name = prompt(`New high score! Enter your name (max 10 chars):`, "Player") || "Player";
      const playerName = name.substring(0, 10); // Limit name length

      const newEntry: LeaderboardEntry = { name: playerName, score: newScore, level: finalLevel };
      const updatedLeaderboard = [...leaderboard, newEntry]
        .sort((a, b) => b.score - a.score || b.level - a.level) // Sort by score, then level
        .slice(0, 5); // Keep top 5

      setLeaderboard(updatedLeaderboard);
      localStorage.setItem('findTheBallLeaderboard', JSON.stringify(updatedLeaderboard));
      toast.info("Your score has been added to the leaderboard!");
    }
  }, [leaderboard]); // Include leaderboard in dependencies

  // --- Sound Player Helper ---
  const playSound = (audioRef: React.RefObject<HTMLAudioElement>) => {
    if (soundEnabled && audioRef.current) {
      audioRef.current.currentTime = 0;
      audioRef.current.play().catch(error => console.error("Audio play failed:", error));
    }
  };

  // --- Timer Management ---
  const clearTimer = useCallback(() => {
    if (timerRef.current) {
      clearInterval(timerRef.current);
      timerRef.current = null;
    }
    setIsTimerRunning(false);
  }, []); // Empty dependency array

  const startTimer = useCallback(() => {
    clearTimer(); // Clear any existing timer
    const duration = Math.max(3, 10 - Math.floor((level - 1) * 0.5)); // Decrease time per level, min 3s
    setTimeLeft(duration);
    setIsTimerRunning(true);

    timerRef.current = setInterval(() => {
      setTimeLeft(prevTime => {
        if (prevTime <= 1) {
          clearTimer();
          playSound(wrongSoundRef);
          toast.error("Time's up! Game Over.");
          setGameOver(true);
          setRevealedCup(cupPositions.indexOf(ballPosition)); // Reveal correct cup on time out
          addLeaderboardEntry(score, level); // Add score on game over
          return 0;
        }
        // Optional: Play tick sound for last few seconds
        // if (prevTime <= 4) playSound(timerTickSoundRef);
        return prevTime - 1;
      });
    }, 1000);
  }, [level, clearTimer, ballPosition, cupPositions, score, addLeaderboardEntry]); // Added dependencies


  // --- Game Logic ---
   const startGame = useCallback(() => {
    clearTimer(); // Ensure timer is stopped before starting
    const randomPos = Math.floor(Math.random() * 3);
    setBallPosition(randomPos);
    setCupPositions([0, 1, 2]);
    setRevealedCup(null);
    setHasGuessed(false);
    setGameOver(false);
    setGameStarted(true);
    setShowInitialBall(true);

    setTimeout(() => {
      setShowInitialBall(false);
      shuffleCups();
    }, 1500);
  }, [clearTimer]); // Added dependency

  const shuffleCups = useCallback(() => {
    setIsShuffling(true);
    playSound(shuffleSoundRef);
    let iterations = 0;
    const maxIterations = 10 + level * 2;

    const interval = setInterval(() => {
      const pos1 = Math.floor(Math.random() * 3);
      const pos2 = Math.floor(Math.random() * 3);
      if (pos1 !== pos2) {
        setCupPositions(prev => {
          const newPositions = [...prev];
          [newPositions[pos1], newPositions[pos2]] = [newPositions[pos2], newPositions[pos1]];
          return newPositions;
        });
      }
      iterations++;
      if (iterations >= maxIterations) {
        clearInterval(interval);
        setIsShuffling(false);
        startTimer(); // Start timer after shuffling finishes
      }
    }, shuffleSpeed);
  }, [level, shuffleSpeed, startTimer]); // Added dependencies


  const handleCupClick = (index: number) => {
    if (!gameStarted || isShuffling || revealedCup !== null || hasGuessed || gameOver) return;

    clearTimer(); // Stop timer on guess
    setRevealedCup(index);
    setHasGuessed(true);

    if (cupPositions[index] === ballPosition) {
      playSound(correctSoundRef);
      toast.success(`You found the ball! Level ${level} Cleared!`);
      const newScore = score + level * 10; // Score based on level (more points for higher levels)
      setScore(newScore);
      // Note: Leaderboard entry for correct guess happens in handleNextLevel or handleRestart if game ends
    } else {
      playSound(wrongSoundRef);
      toast.error("Wrong cup! Game over.");
      setGameOver(true);
      addLeaderboardEntry(score, level); // Add final score on game over
      // Score reset happens in handleRestart
    }
  };

  const handleNextLevel = () => {
    clearTimer(); // Ensure timer is stopped
    playSound(levelUpSoundRef);
    const nextLevel = level + 1;
    setLevel(nextLevel);
    setShuffleSpeed(Math.max(shuffleSpeed - 30, 150));
    toast(`Level up! Starting Level ${nextLevel}. Speed increased!`);
    startGame();
  };

  const handleRestart = () => {
    clearTimer(); // Ensure timer is stopped
    // Check if previous game had score and wasn't already added (only add on game over OR successful completion if desired)
    if (score > 0 && !gameOver) { // Optional: Add score if player restarts after winning a level
         addLeaderboardEntry(score, level);
    }
    setScore(0); // Reset score
    setLevel(1);
    setShuffleSpeed(400);
    startGame();
  };

  // Cleanup timer on component unmount
  useEffect(() => {
    return () => clearTimer();
  }, [clearTimer]);


  // --- Rendering ---
  const renderCup = (index: number) => {
    const isBallRevealed =
      revealedCup !== null && revealedCup === index && cupPositions[revealedCup] === ballPosition;
    const isInitialBallVisible =
      showInitialBall && cupPositions[index] === ballPosition;

    const targetX = cupPositions.indexOf(index) * cupSpacing;

    return (
      <motion.div
        key={index}
        className={`
          absolute top-0 w-[${cupWidth}px] h-32 bg-gradient-to-b from-secondary/30 to-secondary/50 border border-border rounded-lg shadow-md
          flex items-center justify-center transition-colors duration-200
          ${!isShuffling && revealedCup === null && !hasGuessed && !gameOver ? 'cursor-pointer hover:from-secondary/40 hover:to-secondary/60' : 'cursor-default'}
          ${revealedCup === index ? 'from-secondary/50 to-secondary/70' : ''}
        `}
        style={{ width: `${cupWidth}px` }}
        initial={{ x: index * cupSpacing, y: 0 }}
        animate={{
          x: targetX,
          y: isShuffling ? [0, -30, 0] : 0,
        }}
        transition={{
          duration: shuffleSpeed / 1000 / 2,
          ease: "easeInOut",
           y: {
             duration: shuffleSpeed / 1000 / 2,
             repeat: Infinity,
             repeatType: "loop",
             ease: "easeInOut"
           }
        }}
        onClick={() => handleCupClick(index)}
      >
        {(isBallRevealed || isInitialBallVisible) && (
          <div className="w-6 h-6 bg-primary rounded-full absolute top-2 left-1/2 transform -translate-x-1/2 shadow-lg" />
        )}
         {/* Cup number removed */}
      </motion.div>
    );
  };

  return (
    <div className="flex flex-col md:flex-row gap-8 items-start max-w-4xl mx-auto my-8"> {/* Flex layout for game + leaderboard */}
        {/* Game Card */}
        <Card className="flex-grow"> {/* Game takes available space */}
          <CardHeader className="text-center relative">
            <CardTitle className="text-2xl font-bold">Find the Ball Game</CardTitle>
            <CardDescription>
              Score: {score} | Level: {level} | High Score: {highScore}
              {isTimerRunning && ( // Display Timer only when running
                <span className="ml-4 inline-flex items-center">
                  <TimerIcon className="h-4 w-4 mr-1" /> {timeLeft}s
                </span>
              )}
            </CardDescription>
             <Button
                variant="ghost"
                size="icon"
                className="absolute top-4 right-4"
                onClick={() => setSoundEnabled(!soundEnabled)}
                aria-label={soundEnabled ? "Mute sound" : "Unmute sound"}
              >
                {soundEnabled ? <Volume2 className="h-5 w-5" /> : <VolumeX className="h-5 w-5" />}
              </Button>
          </CardHeader>
          <CardContent>
            <div
                className="flex justify-start items-center h-48 mb-6 relative"
                style={{ width: `${containerWidth}px`, margin: '0 auto' }}
            >
              {[0, 1, 2].map(index => renderCup(index))}
            </div>

            <div className="text-center text-lg text-muted-foreground min-h-[28px] mb-6">
               {isShuffling ? (
                <p className="animate-pulse">Shuffling...</p>
               ) : isTimerRunning ? (
                 <p>Find the ball quickly!</p>
               ) : gameStarted && revealedCup === null && !gameOver ? (
                <p>Make your guess!</p>
              ) : gameStarted && revealedCup !== null && !gameOver ? (
                cupPositions[revealedCup] === ballPosition ? (
                  <p className="text-green-600 font-semibold">Correct!</p>
                ) : (
                   // Game over message handled below
                   null
                )
              ) : gameOver ? (
                 <p className="text-red-600 font-semibold">Game Over!</p>
              ) : (
                <p>Ready to test your focus?</p>
              )}
            </div>

            <div className="text-center">
              {!gameStarted && (
                <Button onClick={startGame} size="lg">Start Game</Button>
              )}
              {gameOver ? (
                <Button onClick={handleRestart}>Play Again</Button>
              ) : (
                revealedCup !== null && cupPositions[revealedCup] === ballPosition && (
                  <Button onClick={handleNextLevel}>Next Level</Button>
                )
              )}
            </div>

            <audio ref={shuffleSoundRef} src="/sounds/shuffle.mp3" preload="auto"></audio>
            <audio ref={correctSoundRef} src="/sounds/correct.mp3" preload="auto"></audio>
            <audio ref={wrongSoundRef} src="/sounds/wrong.mp3" preload="auto"></audio>
            <audio ref={levelUpSoundRef} src="/sounds/levelup.mp3" preload="auto"></audio>
            {/* <audio ref={timerTickSoundRef} src="/sounds/tick.mp3" preload="auto"></audio> */}

          </CardContent>
        </Card>

        {/* Leaderboard Card */}
        <Card className="w-full md:w-64 flex-shrink-0"> {/* Fixed width on larger screens */}
           <CardHeader>
             <CardTitle className="text-xl font-semibold text-center flex items-center justify-center gap-2">
                <TrophyIcon className="h-5 w-5" /> Leaderboard
             </CardTitle>
           </CardHeader>
           <CardContent>
             {leaderboard.length === 0 ? (
               <p className="text-center text-muted-foreground">No scores yet!</p>
             ) : (
               <ol className="list-decimal list-inside space-y-2">
                 {leaderboard.map((entry, index) => (
                   <li key={index} className="flex justify-between items-center text-sm">
                     <span>{index + 1}. {entry.name}</span>
                     <span className="font-medium">{entry.score} (Lvl {entry.level})</span>
                   </li>
                 ))}
               </ol>
             )}
           </CardContent>
         </Card>
    </div>
  );
};

export default FindTheBall;
