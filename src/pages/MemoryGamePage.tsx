import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import MainLayout from "@/components/layout/MainLayout";
import MemoryGame from "@/components/coping/games/MemoryGame";
import { useNavigate } from "react-router-dom";

const MemoryGamePage = () => {
  const navigate = useNavigate();

  const handleBack = () => {
    navigate("/coping-tools?tab=games");
  };

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <Link to="/coping-tools?defaultTab=games"><Button className="mb-4">Back to Games</Button></Link>
        <h1 className="text-3xl font-bold mb-6">Memory Game</h1>
        <MemoryGame onBack={handleBack} />
      </div>
    </MainLayout>
  );
};

export default MemoryGamePage;