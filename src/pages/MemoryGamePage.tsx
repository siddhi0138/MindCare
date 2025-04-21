
// src/pages/MemoryGamePage.tsx
import MainLayout from "@/components/layout/MainLayout";
import MemoryGame from "@/components/coping/games/MemoryGame";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";

const MemoryGamePage = () => {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <Link to="/coping-tools?tab=games">
          <Button className="mb-4">Back to Games</Button>
        </Link>
        <h1 className="text-3xl font-bold mb-6">Memory Game</h1> 
        <MemoryGame />
      </div>
    </MainLayout>
  );
};

export default MemoryGamePage;