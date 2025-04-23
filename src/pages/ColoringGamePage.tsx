
// src/pages/ColoringGamePage.tsx
import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import ColoringGame from '@/components/coping/games/ColoringGame';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const ColoringGamePage: React.FC = () => {
  const { recordActivity } = useToast();
  const { currentUser } = useAuth();

  useEffect(() => {
    const recordVisit = async () => {
      if (currentUser) {
        await recordActivity('Coloring', 'Start Coloring', 'ColoringGamePage');        
      }
    };
    recordVisit();
  }, [currentUser, recordActivity]);

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <Link
          to="/coping-tools?defaultTab=games">
          <Button className="mb-4">Back to Games</Button>
        </Link>
        <h1 className="text-3xl font-bold mb-6">Coloring Game</h1>
        <ColoringGame />
      </div>

    </MainLayout>
  );
};

export default ColoringGamePage;