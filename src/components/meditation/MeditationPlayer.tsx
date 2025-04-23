
import { useState, useRef, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Button } from '@/components/ui/button';
import { Play, Pause, SkipBack, SkipForward, Volume2 } from 'lucide-react';
import { useAuth } from "@/contexts/AuthContext";

interface MeditationPlayerProps {
  currentMeditation: {
    id: string;
    title: string;
    description: string;
    imageUrl: string;
    duration: string;
    audioSrc: string;
  };
  onNext: () => void;
  onPrev: () => void;
}

const MeditationPlayer: React.FC<MeditationPlayerProps> = (props) => {
  const [isPlaying, setIsPlaying] = useState(false);
  const [progress, setProgress] = useState(0);
  const [volume, setVolume] = useState(70);
  const [durationInSeconds, setDurationInSeconds] = useState(0);
  const { currentUser } = useAuth();
  const audioRef = useRef<HTMLAudioElement>(null);
  const togglePlayPause = () => {
    setIsPlaying(!isPlaying);
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  };

  const handleProgressChange = (value: number[]) => {
    setProgress(value[0]);
    if (audioRef.current) {
      audioRef.current.currentTime = (value[0] / 100) * durationInSeconds;
    }
  };

  const handleVolumeChange = (value: number[]) => {
    setVolume(value[0]);
    if (audioRef.current) {
      audioRef.current.volume = value[0] / 100;
    }
  };

  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
  
    // Handlers
    const onLoaded = () => {
      setDurationInSeconds(audio.duration);
    };
    const onTimeUpdate = () => {
      const pct = (audio.currentTime / audio.duration) * 100;
      setProgress(isNaN(pct) ? 0 : pct);
    };
  
    // Attach
    audio.addEventListener("loadedmetadata", onLoaded);
    audio.addEventListener("timeupdate", onTimeUpdate);
  
    // Apply initial volume (and re‑apply whenever `volume` changes)
    audio.volume = volume / 100;
  
    // Clean up
    return () => {
      audio.removeEventListener("loadedmetadata", onLoaded);
      audio.removeEventListener("timeupdate", onTimeUpdate);
    };
  }, [volume]);
  
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;
  
    // stop & reload the new file
    audio.pause();
    audio.load();
  
    // if we’re in “playing” state, start it immediately
    if (isPlaying) {
      audio
        .play()
        .then(() => setIsPlaying(true))
        .catch(() => {
          console.warn("Autoplay blocked, user must interact");
          setIsPlaying(false);
        });
    } 
  }, [props.currentMeditation.audioSrc]);
  
  const formatTime = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = Math.floor(seconds % 60);
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const currentTime = Math.floor(durationInSeconds * (progress / 100));

  return (
    <Card className="border-primary/10 overflow-hidden">
      <div 
        className="w-full h-48 bg-cover bg-center"
        style={{ backgroundImage: `url(${props.currentMeditation.imageUrl})` }}
      >
        <div className="w-full h-full bg-gradient-to-t from-background to-transparent flex items-end">
          <div className="p-6">
            <span className="inline-block px-2 py-1 bg-primary/20 backdrop-blur-sm text-xs rounded-full">
              {props.currentMeditation.duration}
            </span> 
          </div> 
        </div>
      </div>
      
      <CardHeader className="pb-2">
        <CardTitle>{props.currentMeditation.title}</CardTitle>
        <CardDescription>{props.currentMeditation.description}</CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="space-y-6">
          <div className="space-y-2">
            <Slider
              value={[isNaN(progress) ? 0 : progress]}
              min={0}
              max={100}
              step={1}
              onValueChange={handleProgressChange}
              />
            <div className="flex justify-between text-xs text-muted-foreground">
              <span>{formatTime(currentTime)}</span>
              <span>{formatTime(durationInSeconds)}</span>
            </div>
          </div>
          
          <div className="flex items-center justify-center gap-4">
            <Button variant="ghost" size="icon" onClick={props.onPrev} className="rounded-full">
              <SkipBack size={20} />
            </Button>
            
            <Button
              onClick={togglePlayPause} 
              className="h-12 w-12 rounded-full"
              variant={isPlaying ? "secondary" : "default"}
            >
              {isPlaying ? <Pause size={24} /> : <Play size={24} />}
            </Button>
            
            <Button variant="ghost" size="icon"  className="rounded-full" onClick={props.onNext} >
              
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
          onValueChange={handleVolumeChange}
        />
      </CardFooter>

      <audio ref={audioRef} preload="metadata">
        <source src={props.currentMeditation.audioSrc} type="audio/mpeg" />
        Your browser doesn’t support this audio format.
      </audio>

    </Card>
  );
};

export default MeditationPlayer;
