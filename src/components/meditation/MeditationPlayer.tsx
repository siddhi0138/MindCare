
import { useState } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';

interface MeditationPlayerProps {
  title: string;
  description: string;
  imageUrl: string;
  duration: string;
}

const MeditationPlayer = ({
  title,
  description,
  imageUrl,
  duration
}: MeditationPlayerProps) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(70);

  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    // In a real app, this would control actual audio playback
  };

  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  // This would be calculated from actual audio duration in a real app
  const totalSeconds = 600; // 10 minutes
  const currentTime = Math.floor(totalSeconds * (progress / 100));

  return (
    <Card className="border-primary/10 overflow-hidden">
      <div 
        className="w-full h-48 bg-cover bg-center"
        style={{ backgroundImage: `url(${imageUrl})` }}
      >
        <div className="w-full h-full bg-gradient-to-t from-background to-transparent flex items-end">
          <div className="p-6">
            <span className="inline-block px-2 py-1 bg-primary/20 backdrop-blur-sm text-xs rounded-full">
              {duration}
            </span>
          </div>
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <CardTitle>{title}</CardTitle>
        <CardDescription>{description}</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <Slider
              value={[progress]}
              min={0}
              max={100}
              step={1}
              onValueChange={(value) => setProgress(value[0])}
            />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(totalSeconds)}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-4">
            <Button variant="ghost" size="icon" className="rounded-full">
              <SkipBack size={20} />
            </Button>
            
            <Button 
              onClick={togglePlayPause} 
              className="h-12 w-12 rounded-full"
              variant={isPlaying ? "secondary" : "default"}
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </Button>
            
            <Button variant="ghost" size="icon" className="rounded-full">
              <SkipForward size={20} />
            </Button>
          </div>
        </div>
      </CardContent>
      
      <CardFooter className="flex items-center gap-2">
        <Volume2 size={16} className="text-muted-foreground" />
        <Slider
          className="w-28"
          value={[volume]}
          min={0}
          max={100}
          step={1}
          onValueChange={(value) => setVolume(value[0])}
        />
      </CardFooter>
    </Card>
  );
};

export default MeditationPlayer;
