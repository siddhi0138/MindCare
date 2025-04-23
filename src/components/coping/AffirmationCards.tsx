
import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Card, CardContent } from '@/components/ui/card';
import { Sparkles, ArrowRight, ArrowLeft, Heart } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { useAuth } from "@/contexts/AuthContext";
import { saveUserActivity } from "@/configs/firebase";

const affirmations = [
  {
    id: 1,
    text: "I am worthy of love and respect exactly as I am.",
    category: "Self-Love"
  },
  {
    id: 2,
    text: "I have the power to create positive change in my life.",
    category: "Empowerment"
  },
  {
    id: 3,
    text: "My feelings are valid, and it's okay to feel them.",
    category: "Emotional Awareness"
  },
  {
    id: 4,
    text: "I am resilient and can overcome any challenge.",
    category: "Resilience"
  },
  {
    id: 5,
    text: "I choose to focus on what I can control.",
    category: "Mindfulness"
  },
  {
    id: 6,
    text: "Each day is a new opportunity to grow and learn.",
    category: "Growth"
  },
  {
    id: 7,
    text: "I release worry and embrace peace.",
    category: "Anxiety Relief"
  },
  {
    id: 8,
    text: "I am allowed to take the time I need to heal.",
    category: "Self-Care"
  },
  {
    id: 9,
    text: "My needs and desires matter, and I deserve to have them met.",
    category: "Self-Worth"
  },
  {
    id: 10,
    text: "I am becoming the best version of myself every day.",
    category: "Personal Growth"
  }
];

const AffirmationCards = () => {
  const [favorites, setFavorites] = useState<number[]>([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const { currentUser } = useAuth()
  
  const currentAffirmation = affirmations[currentIndex];
  
  const handleNext = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === affirmations.length - 1 ? 0 : prevIndex + 1
    );
  };
  
  const handlePrevious = () => {
    setCurrentIndex((prevIndex) => 
      prevIndex === 0 ? affirmations.length - 1 : prevIndex - 1
    );
  };
  
  const toggleFavorite = async (id: number) => {
    const userId = currentUser?.id;
    const timestamp = new Date().toISOString();

    if (userId) {
      if (favorites.includes(id)) {
        setFavorites(favorites.filter(favId => favId !== id));
        toast.info("Removed from favorites");
      } else {
        setFavorites([...favorites, id]);
        toast.success("Added to favorites");

        const activityData = {
          userId,
          timestamp,
          activityType: "affirmation-added-to-favorites",
          activityName: currentAffirmation.text,
          pageName: "Affirmation",
        };

        await saveUserActivity(activityData);
      }
    } else {
      toast.error("You must be logged in to add favorites.");
    }
  };
  
  const getRandomAffirmation = () => {
    const randomIndex = Math.floor(Math.random() * affirmations.length);
    setCurrentIndex(randomIndex);
  };
  
  const isFavorite = favorites.includes(currentAffirmation.id);

  return (
    <div className="space-y-6">
      <div className="flex justify-between mb-4">
        <h3 className="text-xl font-medium">Daily Affirmations</h3>
        <Button 
          variant="ghost" 
          onClick={getRandomAffirmation}
          className="flex items-center gap-2"
        >
          <Sparkles size={16} />
          <span>Random</span>
        </Button>
      </div>
      
      <Card className="border-primary/10 bg-gradient-to-br from-violet-50 to-purple-50 dark:from-violet-950/20 dark:to-purple-950/20">
        <CardContent className="flex flex-col items-center justify-center p-8 min-h-[200px]">
          <span className="text-xs text-muted-foreground uppercase tracking-wider mb-4">
            {currentAffirmation.category}
          </span>
          
          <p className="text-xl md:text-2xl text-center font-medium mb-8">
            "{currentAffirmation.text}"
          </p>
          
          <Button
            variant={isFavorite ? "default" : "outline"}
            onClick={() => toggleFavorite(currentAffirmation.id)}
            className="flex items-center gap-2"
          >
            <Heart size={16} fill={isFavorite ? "currentColor" : "none"} />
            <span>{isFavorite ? "Favorited" : "Add to Favorites"}</span>
          </Button>
        </CardContent>
      </Card>
      
      <div className="flex justify-center gap-4">
        <Button 
          variant="outline" 
          onClick={handlePrevious}
          className="flex items-center gap-2"
        >
          <ArrowLeft size={16} />
          <span>Previous</span>
        </Button>
        
        <Button 
          onClick={handleNext}
          className="flex items-center gap-2"
        >
          <span>Next</span>
          <ArrowRight size={16} />
        </Button>
      </div>
    </div>
  );
};

export default AffirmationCards;
