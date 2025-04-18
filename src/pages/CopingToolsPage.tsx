
import MainLayout from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import GuidedBreathingExercise from "@/components/coping/GuidedBreathingExercise";
import AffirmationCards from "@/components/coping/AffirmationCards";
import { Wind, Heart, Gamepad2, Sparkles } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";

const CopingToolsPage = () => {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Coping Tools & Self-Help</h1>
        <p className="text-muted-foreground mb-8">
          Discover interactive tools to help manage stress, anxiety, and improve your mental wellbeing.
          Practice these techniques regularly for best results.
        </p>
        
        <Tabs defaultValue="breathing" className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="breathing" className="flex items-center gap-2">
              <Wind className="h-4 w-4" />
              <span>Breathing</span>
            </TabsTrigger>
            <TabsTrigger value="affirmations" className="flex items-center gap-2">
              <Heart className="h-4 w-4" />
              <span>Affirmations</span>
            </TabsTrigger>
            <TabsTrigger value="games" className="flex items-center gap-2">
              <Gamepad2 className="h-4 w-4" />
              <span>Games</span>
            </TabsTrigger>
            <TabsTrigger value="grounding" className="flex items-center gap-2">
              <Sparkles className="h-4 w-4" />
              <span>Grounding</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="breathing">
            <h2 className="text-2xl font-semibold mb-6">Breathing Exercises</h2>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Card className="border-primary/10 overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <div className="bg-gradient-to-br from-sky-50 to-blue-50 dark:from-sky-950/20 dark:to-blue-950/20 p-6">
                    <h3 className="text-xl font-medium mb-3">4-7-8 Breathing</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      Reduces anxiety and helps with sleep by regulating your breathing pattern.
                    </p>
                    <Button>Start Exercise</Button>
                  </div>
                </CardContent>
              </Card>
              
              <Card className="border-primary/10 overflow-hidden cursor-pointer hover:shadow-md transition-shadow">
                <CardContent className="p-0">
                  <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/20 dark:to-green-950/20 p-6">
                    <h3 className="text-xl font-medium mb-3">Box Breathing</h3>
                    <p className="text-sm text-muted-foreground mb-4">
                      A technique used by Navy SEALs to reduce stress and improve concentration.
                    </p>
                    <Button>Start Exercise</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
            
            <div className="mt-8">
              <GuidedBreathingExercise />
            </div>
          </TabsContent>
          
          <TabsContent value="affirmations">
            <AffirmationCards />
          </TabsContent>
          
          <TabsContent value="games">
            <div className="text-center py-16">
              <Gamepad2 className="mx-auto h-16 w-16 text-muted-foreground mb-4" />
              <h3 className="text-xl font-medium mb-2">Coming Soon</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Interactive mood-boosting games are currently in development.
                Check back soon for memory games, gratitude challenges, and more.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="grounding">
            <div className="grid grid-cols-1 gap-6">
              <Card className="border-primary/10 overflow-hidden">
                <CardContent className="p-0">
                  <div className="bg-gradient-to-br from-amber-50 to-orange-50 dark:from-amber-950/20 dark:to-orange-950/20 p-8">
                    <h3 className="text-xl font-medium mb-4">5-4-3-2-1 Technique</h3>
                    <p className="mb-6">
                      This grounding exercise helps bring your attention to the present moment when feeling overwhelmed.
                    </p>
                    
                    <div className="space-y-4 mb-8">
                      <div className="flex items-start gap-4">
                        <div className="bg-white dark:bg-white/10 h-8 w-8 rounded-full flex items-center justify-center text-primary font-medium shrink-0">
                          5
                        </div>
                        <div>
                          <strong>See</strong> - Find 5 things you can see around you
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="bg-white dark:bg-white/10 h-8 w-8 rounded-full flex items-center justify-center text-primary font-medium shrink-0">
                          4
                        </div>
                        <div>
                          <strong>Touch</strong> - Notice 4 things you can touch or feel
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="bg-white dark:bg-white/10 h-8 w-8 rounded-full flex items-center justify-center text-primary font-medium shrink-0">
                          3
                        </div>
                        <div>
                          <strong>Hear</strong> - Listen for 3 sounds around you
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="bg-white dark:bg-white/10 h-8 w-8 rounded-full flex items-center justify-center text-primary font-medium shrink-0">
                          2
                        </div>
                        <div>
                          <strong>Smell</strong> - Identify 2 smells
                        </div>
                      </div>
                      <div className="flex items-start gap-4">
                        <div className="bg-white dark:bg-white/10 h-8 w-8 rounded-full flex items-center justify-center text-primary font-medium shrink-0">
                          1
                        </div>
                        <div>
                          <strong>Taste</strong> - Notice 1 thing you can taste
                        </div>
                      </div>
                    </div>
                    
                    <Button>Start Guided Exercise</Button>
                  </div>
                </CardContent>
              </Card>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default CopingToolsPage;
