
// src/pages/ColoringGamePage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import ColoringGame from '@/components/coping/games/ColoringGame';
import { Button } from '@/components/ui/button';

const ColoringGamePage: React.FC = () => {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <Link to="/coping-tools?defaultTab=games">
          <Button className="mb-4">Back to Games</Button>
        </Link>
        <h1 className="text-3xl font-bold mb-6">Coloring Game</h1>
        <ColoringGame />
      </div>

    </MainLayout>
  );
};

export default ColoringGamePage;