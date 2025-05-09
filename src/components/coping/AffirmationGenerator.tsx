
import { useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { toast } from "@/components/ui/sonner";

const affirmations = [
  "I am worthy of love and respect.",
  "I choose to focus on what I can control.",
  "My feelings are valid, and I honor them.",
  "I am growing and learning every day.",
  "I release all self-doubt and trust my abilities.",
  "I am enough just as I am.",
  "Every day is a fresh opportunity.",
  "I choose peace over worry.",
  "I am resilient and can overcome challenges.",
  "My potential is limitless.",
  "I deserve to take care of myself.",
  "I release the need for perfection.",
  "I am becoming the best version of myself.",
  "I can find joy in the smallest things.",
  "I am in control of how I respond to challenges.",
  "My mind is calm and my body is relaxed.",
  "I am surrounded by love and support.",
  "I am patient with myself and my progress.",
  "Today, I choose happiness.",
  "I trust the journey, even when I don't understand it.",
  "I am capable of amazing things.",
  "I am learning to let go of what no longer serves me.",
  "My thoughts and ideas matter.",
  "I attract positive energy into my life.",
  "I embrace change as an opportunity for growth.",
  "I am stronger than I know.",
  "I forgive myself for my mistakes.",
  "I am grateful for the abundance in my life.",
  "I am creating a life I love.",
  "I believe in my ability to succeed."
];

const AffirmationGenerator = () => {
  const [currentAffirmation, setCurrentAffirmation] = useState(
    affirmations[Math.floor(Math.random() * affirmations.length)]
  );
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem("favoriteAffirmations");
    return saved ? JSON.parse(saved) : [];
  });
  const { currentUser } = useAuth();
  const handleGenerateAffirmation = () => {
    console.log("handleGenerateAffirmation called");
    generateNewAffirmation();
  };

  const generateNewAffirmation = () => {
    let newAffirmation;
    do {
      newAffirmation = affirmations[Math.floor(Math.random() * affirmations.length)];
    } while (newAffirmation === currentAffirmation);
    setAffirmation(newAffirmation);
  };
  const setAffirmation = (newAffirmation: string) => {
    console.log("setAffirmation called with:", newAffirmation);
    setCurrentAffirmation(newAffirmation);
    // Call saveUserActivity after the state has been updated
    // saveUserActivity(newAffirmation)
  };
  const saveUserActivity = (newAffirmation: string) => {
    console.log("saveUserActivity called with: ", newAffirmation);
    // setAffirmation(newAffirmation);
    console.log("Saving user activity for affirmation:", newAffirmation);
    // setCurrentAffirmation(newAffirmation)
  };

  return (
    <Card className="border-primary/10">
      <CardHeader>
        <CardTitle>Daily Affirmation</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="bg-muted rounded-lg p-6 text-center mb-4">
          <blockquote className="text-xl font-medium">"{currentAffirmation}"</blockquote>
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={handleGenerateAffirmation} title="Generate new">
          Generate new
        </Button>
        <Button variant="outline" onClick={() => saveUserActivity(currentAffirmation)}>Save </Button>
      </CardFooter>
    </Card>
  );
};

export default AffirmationGenerator;
