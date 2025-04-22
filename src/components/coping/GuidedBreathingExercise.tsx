import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Card, CardContent } from '@/components/ui/card';
import { Play, Pause, RotateCcw } from 'lucide-react';

interface BreathingExerciseProps {
  inhaleDuration: number;
  holdDuration: number;
  exhaleDuration: number;
  cycles?: number;
  onComplete?: () => void;
  onReset?: () => void;
}

enum BreathState {
  INHALE = 'Inhale',
  HOLD = 'Hold',
  EXHALE = 'Exhale',
  PAUSED = 'Paused',
  COMPLETE = 'Complete'
}

const GuidedBreathingExercise = ({
  inhaleDuration,
  holdDuration,
  exhaleDuration,
  cycles = 5,
  onComplete,
  onReset
}: BreathingExerciseProps) => {
  const [isActive, setIsActive] = useState(false);
  const [currentState, setCurrentState] = useState<BreathState>(BreathState.PAUSED);
  const [cycleCount, setCycleCount] = useState(0);
  const [progress, setProgress] = useState(0);
  const [timeRemaining, setTimeRemaining] = useState(inhaleDuration);
  const [animation, setAnimation] = useState('scale-100');

  const totalCycleDuration = inhaleDuration + holdDuration + exhaleDuration;

  const handleStart = () => {
    setIsActive(!isActive);
    if (!isActive) {
      setCurrentState(BreathState.INHALE);
      setTimeRemaining(inhaleDuration);
      setAnimation('scale-150 transition-transform duration-4000');
    }
  };

  const handlePause = () => {
    setIsActive(false);
    setCurrentState(BreathState.PAUSED);
  };

  const handleReset = () => {
    setIsActive(false);
    setCurrentState(BreathState.PAUSED);
    setCycleCount(0);
    setProgress(0);
    setTimeRemaining(inhaleDuration);
    setAnimation('scale-100');
    onReset?.();
  };

  useEffect(() => {
    let interval: NodeJS.Timeout | null = null;

    if (isActive) {
      interval = setInterval(() => {
        setTimeRemaining(prev => {
          if (prev <= 1) {
            // Transition to next state
            if (currentState === BreathState.INHALE) {
              setCurrentState(BreathState.HOLD);
              setAnimation('scale-150');
              return holdDuration;
            } else if (currentState === BreathState.HOLD) {
              setCurrentState(BreathState.EXHALE);
              setAnimation('scale-100 transition-transform duration-6000');
              return exhaleDuration;
            } else if (currentState === BreathState.EXHALE) {
              // Complete one cycle
              const newCycleCount = cycleCount + 1;
              setCycleCount(newCycleCount);
              
              // Update overall progress
              setProgress((newCycleCount / cycles) * 100);
              
              // Check if all cycles are complete
              if (newCycleCount >= cycles) {
                setCurrentState(BreathState.COMPLETE);
                setIsActive(false);
                onComplete?.();
                return 0;
              } else {
                setCurrentState(BreathState.INHALE);
                setAnimation('scale-150 transition-transform duration-4000');
                return inhaleDuration;
              }
            }
          }
          return prev - 1;
        });
      }, 1000);
    } else if (interval) {
      clearInterval(interval);
    }

    return () => {
      if (interval) clearInterval(interval);
    };
  }, [isActive, currentState, cycleCount, inhaleDuration, holdDuration, exhaleDuration, cycles, onComplete, onReset]);

  return (
    <Card className="border-primary/10">
      <CardContent className="flex flex-col items-center p-6">
        <div className="text-center mb-10">
          <h3 className="text-2xl font-medium mb-1">{currentState}</h3>
          {currentState !== BreathState.COMPLETE && currentState !== BreathState.PAUSED && (
            <p className="text-muted-foreground">{timeRemaining} seconds</p>
          )}
          
          {currentState === BreathState.COMPLETE && (
            <p className="text-success font-medium">Exercise completed successfully!</p>
          )}
        </div>
        
        <div className="relative w-48 h-48 mb-8">
          <div className="absolute inset-0 bg-primary/5 rounded-full flex items-center justify-center">
            <div 
              className={`w-32 h-32 bg-primary/20 rounded-full flex items-center justify-center ${animation}`}
            >
              <div className="w-16 h-16 bg-primary/40 rounded-full"></div>
            </div>
          </div>
        </div>
        
        <div className="w-full mb-4">
          <div className="flex justify-between text-sm mb-2">
            <span>Progress</span>
            <span>{cycleCount} of {cycles} cycles</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        <div className="flex gap-4 mt-4">
          {currentState === BreathState.COMPLETE ? (
            <Button onClick={handleReset} className="flex items-center gap-2">
              <RotateCcw size={16} />
              Start Again
            </Button>
          ) : isActive ? (
            <Button onClick={handlePause} variant="outline" className="flex items-center gap-2">
              <Pause size={16} />
              Pause
            </Button>
          ) : (
            <Button onClick={handleStart} className="flex items-center gap-2">
              <Play size={16} />
              {currentState === BreathState.PAUSED && cycleCount > 0 ? 'Resume' : 'Start'}
            </Button>
          )}
          
          {(currentState !== BreathState.COMPLETE && cycleCount > 0) && (
            <Button onClick={handleReset} variant="ghost" className="flex items-center gap-2">
              <RotateCcw size={16} />
              Reset
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default GuidedBreathingExercise;