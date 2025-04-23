import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Progress } from "../ui/progress";
import { toast } from "../ui/sonner";
import { AssessmentResult } from "./AssessmentResult";
import { StressAssessmentProps } from "./StressAssessment.d";
import { saveAssessmentResult } from "../../configs/firebase";
import { useAuth } from "../../contexts/AuthContext";

// PSS-10 questions
const questions = [
  "In the last month, how often have you been upset because of something that happened unexpectedly?",
  "In the last month, how often have you felt that you were unable to control the important things in your life?",
  "In the last month, how often have you felt nervous and stressed?",
  "In the last month, how often have you felt confident about your ability to handle your personal problems?",
  "In the last month, how often have you felt that things were going your way?",
  "In the last month, how often have you found that you could not cope with all the things that you had to do?",
  "In the last month, how often have you been able to control irritations in your life?",
  "In the last month, how often have you felt that you were on top of things?",
  "In the last month, how often have you been angered because of things that were outside of your control?",
  "In the last month, how often have you felt difficulties were piling up so high that you could not overcome them?"
];

// Answer options
const options = [
  { value: "0", label: "Never" },
  { value: "1", label: "Almost Never" },
  { value: "2", label: "Sometimes" },
  { value: "3", label: "Fairly Often" },
  { value: "4", label: "Very Often" }
];

// Score interpretations
const interpretations = [
  { range: [0, 13], severity: "Low stress", description: "Your symptoms suggest low perceived stress." },
  { range: [14, 26], severity: "Moderate stress", description: "Your symptoms suggest moderate perceived stress." },
  { range: [27, 40], severity: "High stress", description: "Your symptoms suggest high perceived stress." }
];

const StressAssessment = ({ onComplete }: StressAssessmentProps) => {
  const { currentUser } = useAuth();
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(questions.length).fill(-1));
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswer = async (value: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = parseInt(value);
    setAnswers(newAnswers);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      // For PSS-10, items 4, 5, 7, and 8 are scored in reverse
      const reversedItems = [3, 4, 6, 7]; // 0-indexed
      
      let totalScore = 0;
      for (let i = 0; i < newAnswers.length; i++) {
        if (reversedItems.includes(i)) {
          totalScore += (4 - newAnswers[i]); // Reverse scoring
        } else {
          totalScore += newAnswers[i];
        }
      }
      
      setScore(totalScore);
      setCompleted(true);
      
      if (onComplete) {
        onComplete(totalScore);
      }
    }
  };

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion(currentQuestion - 1);
    }
  };
  
  const handleRestart = () => {
    setCurrentQuestion(0);
    setAnswers(Array(questions.length).fill(-1));
    setCompleted(false);
  };
  
  const getInterpretation = (score: number) => {
    for (const item of interpretations) {
      if (score >= item.range[0] && score <= item.range[1]) {
        return item.severity;
      }
    }
    return "Unknown";
  };
  
  const progress = ((currentQuestion + 1) / questions.length) * 100;

  if (completed) {
    const interpretation = interpretations.find(
      item => score >= item.range[0] && score <= item.range[1]
    );
    
    return (
      <AssessmentResult
        title="Stress Assessment Results"
        score={score}
        maxScore={40}
        level={interpretation?.severity || "Unknown"}
        interpretation={interpretation?.severity || "Unknown"}
        description={interpretation?.description || ""}
        recommendations={[
          "Practice mindfulness meditation",
          "Engage in regular physical activity",
          "Prioritize and delegate tasks",
          "Establish healthy boundaries"
        ]}
        onRestart={handleRestart}
      />
    );
  }

  return (
    <Card className="border-primary/10">
      <CardHeader>
        <CardTitle>Perceived Stress Scale</CardTitle>
        <CardDescription>
          The questions in this scale ask you about your feelings and thoughts during the last month.
        </CardDescription>
      </CardHeader>
      
      <CardContent>
        <div className="mb-6">
          <div className="flex justify-between text-sm mb-2">
            <span>Question {currentQuestion + 1} of {questions.length}</span>
            <span>{Math.round(progress)}%</span>
          </div>
          <Progress value={progress} className="h-2" />
        </div>
        
        <div className="py-4">
          <h3 className="text-lg font-medium mb-6">{questions[currentQuestion]}</h3>
          
          <RadioGroup className="gap-3">
            {options.map((option) => (
              <div key={option.value} className="flex items-center space-x-2">
                <RadioGroupItem 
                  id={`q${currentQuestion}-${option.value}`} 
                  value={option.value}
                  onClick={() => handleAnswer(option.value)}
                />
                <Label htmlFor={`q${currentQuestion}-${option.value}`} className="flex-1">
                  {option.label}
                </Label>
              </div>
            ))}
          </RadioGroup>
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button 
          variant="outline" 
          onClick={handlePrevious}
          disabled={currentQuestion === 0}
        >
          Previous
        </Button>
        <div className="text-sm text-muted-foreground">
          Select an option to continue
        </div>
      </CardFooter>
    </Card>
  );
};

export default StressAssessment;
