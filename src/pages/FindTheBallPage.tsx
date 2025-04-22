
import React from 'react';
import { Link } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import FindTheBall from '@/components/coping/games/FindTheBall';
import { Button } from '@/components/ui/button';

const FindTheBallPage: React.FC = () => {
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
