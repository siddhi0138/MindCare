import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import FindTheBall from '@/components/coping/games/FindTheBall';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/contexts/AuthContext';
import { useToast } from '@/hooks/use-toast';

const FindTheBallPage: React.FC = () => {
  const { currentUser } = useAuth();
  const { recordActivity } = useToast();
  
  useEffect(() => {
    const recordVisit = async () => {
      if (currentUser ) {
        await recordActivity("visit", "visit-find-the-ball-game", "FindTheBallPage")
      }
    };

    recordVisit();

  }, [currentUser, recordActivity]);

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <Link to="/coping-tools?defaultTab=games">
          <Button className="mb-4">Back to Games</Button>
        </Link>
        <h1 className="text-3xl font-bold mb-6">Find the Ball</h1>
        <FindTheBall />
      </div>
    </MainLayout>
  );
};

export default FindTheBallPage;
