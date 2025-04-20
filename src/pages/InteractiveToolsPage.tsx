
import MainLayout from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AffirmationGenerator from "@/components/coping/AffirmationGenerator";
import GuidedBreathingExercise from "@/components/coping/GuidedBreathingExercise";
import GroundingExercise from "@/components/coping/GroundingExercise";
import AffirmationCards from "@/components/coping/AffirmationCards";
import MoodBoostGames from "@/components/coping/MoodBoostGames";

const InteractiveToolsPage = () => {
  return (
    <MainLayout>
      <div className="container py-6">
        <h1 className="text-3xl font-bold mb-6">Interactive Coping Tools</h1>
        <p className="text-muted-foreground max-w-3xl mb-8">
          These evidence-based tools can help you manage stress, anxiety, and difficult emotions in the moment. 
          Practice regularly to build your mental wellbeing toolkit.
        </p>
        
        <Tabs defaultValue="breathing">
          <TabsList className="mb-8">
            <TabsTrigger value="breathing">Breathing</TabsTrigger>
            <TabsTrigger value="grounding">Grounding</TabsTrigger>
            <TabsTrigger value="affirmations">Affirmations</TabsTrigger>
            <TabsTrigger value="mood-boost">Mood Boosters</TabsTrigger>
          </TabsList>
          
          <TabsContent value="breathing">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <GuidedBreathingExercise />
              <div className="space-y-4">
                <h3 className="text-xl font-medium">Benefits of Breathing Exercises</h3>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>Activates the parasympathetic nervous system</li>
                  <li>Reduces stress hormones like cortisol</li>
                  <li>Lowers blood pressure and heart rate</li>
                  <li>Improves focus and mental clarity</li>
                  <li>Can be done anywhere, anytime</li>
                </ul>
                <p className="text-muted-foreground pt-2">
                  Regular practice of breathing exercises can strengthen your ability to manage stress and anxiety over time. 
                  Try to incorporate these exercises into your daily routine.
                </p>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="grounding">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <GroundingExercise />
              <div className="space-y-4">
                <h3 className="text-xl font-medium">About Grounding Techniques</h3>
                <p className="text-muted-foreground">
                  Grounding techniques help you reconnect with the present moment when you're feeling overwhelmed, 
                  anxious, or experiencing dissociation. They work by engaging your five senses to bring your focus 
                  back to the here and now.
                </p>
                <h4 className="text-lg font-medium mt-4">When to Use Grounding Techniques:</h4>
                <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                  <li>During anxiety or panic attacks</li>
                  <li>When experiencing flashbacks or intrusive thoughts</li>
                  <li>When feeling overwhelmed or dissociated</li>
                  <li>Before stressful situations to center yourself</li>
                </ul>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="affirmations">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <AffirmationGenerator />
              <AffirmationCards />
            </div>
          </TabsContent>
          
          <TabsContent value="mood-boost">
            <MoodBoostGames />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default InteractiveToolsPage;
