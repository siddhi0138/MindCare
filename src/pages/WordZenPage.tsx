
// src/pages/WordZenPage.tsx
import React, { useEffect } from 'react';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from "@/components/ui/button"
import WordZen from '@/components/coping/games/WordZen';
import { Link } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { recordActivity } from '@/hooks/use-toast';

const WordZenPage: React.FC = () => {
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      recordActivity('Start Playing', 'Game started', 'WordZenPage');
    }
  }, [currentUser]);

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <Link to="/coping-tools?defaultTab=games">
          <Button className="mb-4">Back to Games</Button>
        </Link>
        <h1 className="text-3xl font-bold mb-6">Word Zen</h1>
        <WordZen />
      </div>
    </MainLayout>
  );
};

export default WordZenPage;