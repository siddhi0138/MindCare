
import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { ArrowRight, Eye, Ear, Thermometer, Hand, Brain } from "lucide-react";

const steps = [
  {
    title: "5 Things You Can See",
    description: "Look around you and name 5 things you can see. Focus on details and really observe each object.",
    icon: <Eye className="h-8 w-8" />,
    color: "bg-blue-500"
  },
  {
    title: "4 Things You Can Touch",
    description: "Notice 4 things you can physically feel. This could be the texture of your clothing, the surface you're sitting on, etc.",
    icon: <Hand className="h-8 w-8" />,
    color: "bg-green-500"
  },
  {
    title: "3 Things You Can Hear",
    description: "Listen carefully and identify 3 sounds around you. Focus on each sound individually.",
    icon: <Ear className="h-8 w-8" />,
    color: "bg-yellow-500"
  },
  {
    title: "2 Things You Can Smell",
    description: "Identify 2 scents in your environment, or recall 2 scents you enjoy if none are present.",
    icon: <Thermometer className="h-8 w-8" />,
    color: "bg-orange-500"
  },
  {
    title: "1 Thing You Can Taste",
    description: "Notice 1 taste in your mouth, or simply focus on how your mouth feels right now.",
    icon: <Brain className="h-8 w-8" />,
    color: "bg-red-500"
  },
  {
    title: "Grounding Complete",
    description: "Well done! You've completed the 5-4-3-2-1 grounding exercise. How do you feel now?",
    icon: <Brain className="h-8 w-8" />,
    color: "bg-purple-500"
  }
];

const GroundingExercise = () => {
  const [currentStep, setCurrentStep] = useState(0);
  const [breathCount, setBreathCount] = useState(0);
  const [isBreathing, setIsBreathing] = useState(false);
  const [animationState, setAnimationState] = useState<"inhale" | "hold" | "exhale" | "rest">("rest");

  const progress = ((currentStep) / (steps.length - 1)) * 100;
  
  const handleNext = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(currentStep + 1);
    }
  };
  
  const handleStart = () => {
    setCurrentStep(0);
  };
  
  const startBreathingExercise = () => {
    setIsBreathing(true);
    setBreathCount(0);
    breathingCycle();
  };
  
  const breathingCycle = () => {
    // Inhale for 4 seconds
    setAnimationState("inhale");
    setTimeout(() => {
      // Hold for 2 seconds
      setAnimationState("hold");
      setTimeout(() => {
        // Exhale for 6 seconds
        setAnimationState("exhale");
        setTimeout(() => {
          // Rest for 2 seconds
          setAnimationState("rest");
          setTimeout(() => {
            setBreathCount(prev => {
              const next = prev + 1;
              if (next < 3) {
                breathingCycle();
                return next;
              } else {
                setIsBreathing(false);
                return 0;
              }
            });
          }, 2000); // Rest
        }, 6000); // Exhale
      }, 2000); // Hold
    }, 4000); // Inhale
  };

  return (
    <Card className="border-primary/10">
      <CardHeader>
        <CardTitle>5-4-3-2-1 Grounding Exercise</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Progress value={progress} className="h-2" />
        </div>
        
        {currentStep < steps.length - 1 ? (
          <div className="space-y-6">
            <div className="flex items-center gap-4 mb-4">
              <div className={`p-4 rounded-full ${steps[currentStep].color}`}>
                {steps[currentStep].icon}
              </div>
              <div>
                <h3 className="text-xl font-medium">{steps[currentStep].title}</h3>
              </div>
            </div>
            
            <p className="text-muted-foreground mb-8">
              {steps[currentStep].description}
            </p>

            {isBreathing ? (
              <div className="text-center py-4">
                <div className="mb-4">
                  <div 
                    className={`w-24 h-24 rounded-full mx-auto border-4 transition-all duration-1000 ${
                      animationState === "inhale" 
                        ? "scale-125 border-blue-500" 
                        : animationState === "hold" 
                        ? "scale-125 border-green-500" 
                        : animationState === "exhale" 
                        ? "scale-100 border-purple-500" 
                        : "scale-100 border-gray-300"
                    }`}
                  ></div>
                </div>
                <p className="text-lg font-medium">
                  {animationState === "inhale" 
                    ? "Breathe in..." 
                    : animationState === "hold" 
                    ? "Hold..." 
                    : animationState === "exhale" 
                    ? "Breathe out..." 
                    : "Relax..."}
                </p>
                <p className="text-sm text-muted-foreground">Breath {breathCount + 1} of 3</p>
              </div>
            ) : (
              <Button 
                onClick={startBreathingExercise} 
                variant="outline" 
                className="w-full mb-4"
              >
                Take 3 deep breaths first
              </Button>
            )}
            
            <Button 
              onClick={handleNext} 
              className="w-full flex items-center justify-center gap-2"
            >
              Continue <ArrowRight className="h-4 w-4" />
            </Button>
          </div>
        ) : (
          <div className="text-center space-y-6 py-4">
            <div className={`p-6 rounded-full ${steps[currentStep].color} mx-auto w-fit`}>
              {steps[currentStep].icon}
            </div>
            
            <h3 className="text-xl font-medium">
              {steps[currentStep].title}
            </h3>
            
            <p className="text-muted-foreground mb-8">
              {steps[currentStep].description}
            </p>
            
            <Button 
              onClick={handleStart} 
              className="w-full"
            >
              Start Again
            </Button>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default GroundingExercise;
