
import React, { useState, useEffect } from 'react';
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link, useNavigate } from 'react-router-dom';

const GroundingExercisePage: React.FC = () => {
    return (
    <MainLayout>
        <GroundingExerciseContent />
    </MainLayout>
  );
};

const GroundingExerciseContent = () => {
  const [exerciseStarted, setExerciseStarted] = useState(false);
  const navigate = useNavigate();
  const [currentStep, setCurrentStep] = useState(0);
  const [timeLeft, setTimeLeft] = useState(10);
  const [exerciseCompleted, setExerciseCompleted] = useState(false);
  const steps = [
    { label: "See", description: "Find 5 things you can see around you." },
    { label: "Touch", description: "Notice 4 things you can touch or feel." },
    { label: "Hear", description: "Listen for 3 sounds around you." },
    { label: "Smell", description: "Identify 2 smells." },
    { label: "Taste", description: "Notice 1 thing you can taste." },
  ];

  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (exerciseStarted && timeLeft > 0) {
        interval = setInterval(() => {
            setTimeLeft(prevTime => prevTime - 1);
        }, 1000);
    } else if (exerciseStarted && timeLeft === 0) { handleNextStep();
    } 
    return () => clearInterval(interval);
  }, [exerciseStarted, timeLeft, currentStep]);

  // Start the exercise automatically on component load
  useEffect(() => { handleStartExercise(); }, []);
  const handleStartExercise = () => {
    setExerciseStarted(true);
    setCurrentStep(0);
    setTimeLeft(10);
  };

  const handleNextStep = () => {
    if (currentStep < steps.length - 1) {
      setCurrentStep(prevStep => prevStep + 1);
      setTimeLeft(10);
    } else {
        setExerciseStarted(false);
        setExerciseCompleted(true);
        setCurrentStep(0);
    }
  };

  const renderExerciseStep = () => {
    if (currentStep < steps.length) {
      const step = steps[currentStep];
      return (
        <div className="flex items-start gap-4">
          <div className="bg-primary/10 h-10 w-10 rounded-full flex items-center justify-center text-primary font-medium shrink-0">
            {currentStep + 1}
          </div>
          <div>
            <strong className="block font-medium">{step.label}</strong>
            <span className="text-muted-foreground"> - {step.description}</span>
            {exerciseStarted && (
              <p className="mt-2 text-sm text-muted-foreground">
                Time left: {timeLeft} seconds
              </p>
            )}
          </div>
        </div>
      );
    }
    return null;
  };

  if (exerciseCompleted) {
    return (
      <div className="container mx-auto p-6">
        <Card className="max-w-2xl mx-auto border-primary/10">
          <CardContent className="flex justify-center items-center p-6">
            <p className="text-xl font-semibold text-green-500">Exercise Completed</p>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="container mx-auto p-6">
      <Card className="max-w-2xl mx-auto border-primary/10">
        <CardHeader>
          <CardTitle className="text-2xl font-bold">5-4-3-2-1 Grounding Exercise</CardTitle>
          <CardDescription>This grounding technique helps bring your attention to the present moment when feeling overwhelmed.</CardDescription>
        </CardHeader>
        <CardContent className="space-y-6">
          {renderExerciseStep()}
          <div className="flex gap-4 mt-4 justify-between">
            <Button onClick={handleNextStep}>Next Step</Button>
            <Link to="/coping-tools?defaultTab=games"><Button>Back to Games</Button></Link>
          </div>
        </CardContent>        
      </Card>
    </div>
  );};
export default GroundingExercisePage;
