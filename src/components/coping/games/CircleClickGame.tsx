import React, { useState, useEffect, useRef } from 'react';

const CircleClickGame: React.FC = () => {
  const [score, setScore] = useState(0);
  const [timeLeft, setTimeLeft] = useState(60);
  const [gameState, setGameState] = useState<'start' | 'playing' | 'paused' | 'over'>('start');
  const [soundEnabled, setSoundEnabled] = useState(true);
  const [musicEnabled, setMusicEnabled] = useState(true);

  const audioRef = useRef<HTMLAudioElement>(null);
  const clickSoundRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    let timer: NodeJS.Timeout;
    if (gameState === 'playing' && timeLeft > 0) {
      timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
    } else if (timeLeft === 0) {
      setGameState('over');
    }
    return () => clearTimeout(timer);
  }, [gameState, timeLeft]);

  const startGame = () => {
    setScore(0);
    setTimeLeft(60);
    setGameState('playing');
    if (musicEnabled && audioRef.current) {
      audioRef.current.play();
    }
  };

  const pauseGame = () => {
    setGameState('paused');
    if (audioRef.current) {
      audioRef.current.pause();
    }
  };

  const resumeGame = () => {
    setGameState('playing');
    if (musicEnabled && audioRef.current) {
      audioRef.current.play();
    }
  };

  const restartGame = () => {
    setGameState('playing');
    setScore(0);
    setTimeLeft(60);
    if (musicEnabled && audioRef.current) {
      audioRef.current.play();
    }
  };

  const quitGame = () => {
    setGameState('start');
    setScore(0);
    setTimeLeft(60);
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  const toggleSound = () => {
    setSoundEnabled(!soundEnabled);
  };

  const toggleMusic = () => {
    setMusicEnabled(!musicEnabled);
    if (audioRef.current) {
      if (musicEnabled) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
    }
  };

  const handleCircleClick = () => {
    if (gameState !== 'playing') return;
    setScore(score + 1);
    if (soundEnabled && clickSoundRef.current) {
      clickSoundRef.current.play();
      clickSoundRef.current.currentTime = 0; // Reset for immediate playback
    }
  };

  return (
    <div className="container mt-5">
      <h1>Circle Click Game</h1>
      <p>Score: {score}</p>
      <p>Time Left: {timeLeft}</p>

      {gameState === 'start' && (
        <button onClick={startGame} className="btn btn-primary">Start Game</button>
      )}

      {gameState === 'playing' && (
        <>
          <button onClick={pauseGame} className="btn btn-warning me-2">Pause</button>
          <svg width="200" height="200" onClick={handleCircleClick} style={{ cursor: 'pointer' }}>
            <circle cx="100" cy="100" r="50" fill="blue" />
          </svg>
        </>
      )}

      {gameState === 'paused' && (
        <button onClick={resumeGame} className="btn btn-success">Resume</button>
      )}

      {gameState === 'over' && (
        <div>
          <p>Game Over! Your score: {score}</p>
          <button onClick={restartGame} className="btn btn-primary me-2">Restart</button>
          <button onClick={quitGame} className="btn btn-danger">Quit</button>
        </div>
      )}

      <div className="mt-3">
        <button onClick={toggleSound} className="btn btn-secondary me-2">
          {soundEnabled ? 'Sound On' : 'Sound Off'}
        </button>
        <button onClick={toggleMusic} className="btn btn-secondary">
          {musicEnabled ? 'Music On' : 'Music Off'}
        </button>
      </div>

      <audio ref={audioRef} src="sound.mp3" loop />
      <audio ref={clickSoundRef} src="sound2.mp3" />
    </div>
  );
};

export default CircleClickGame;