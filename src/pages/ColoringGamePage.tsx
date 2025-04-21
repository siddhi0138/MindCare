
// src/pages/ColoringGamePage.tsx
import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import ColoringGame from '@/components/coping/games/ColoringGame';

const ColoringGamePage: React.FC = () => {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <Link to="/coping-tools#games" className="mb-4 inline-block text-blue-500 hover:underline">
          Back to Games
        </Link>
        <h1 className="text-3xl font-bold mb-6">Coloring Game</h1>
        <ColoringGame />
      </div>
    </MainLayout>
  );
};

export default ColoringGamePage;