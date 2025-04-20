import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { Label } from "@/components/ui/label";
import { Progress } from "@/components/ui/progress";
import { toast } from "@/components/ui/sonner";
import AssessmentResult from "./AssessmentResult";
import { DepressionAssessmentProps } from "./DepressionAssessment.d";

// PHQ-9 questions
const questions = [
  "Little interest or pleasure in doing things",
  "Feeling down, depressed, or hopeless",
  "Trouble falling or staying asleep, or sleeping too much",
  "Feeling tired or having little energy",
  "Poor appetite or overeating",
  "Feeling bad about yourself - or that you are a failure or have let yourself or your family down",
  "Trouble concentrating on things, such as reading the newspaper or watching television",
  "Moving or speaking so slowly that other people could have noticed. Or the opposite - being so fidgety or restless that you have been moving around a lot more than usual",
  "Thoughts that you would be better off dead, or of hurting yourself in some way"
];

// Answer options
const options = [
  { value: "0", label: "Not at all" },
  { value: "1", label: "Several days" },
  { value: "2", label: "More than half the days" },
  { value: "3", label: "Nearly every day" }
];

// Score interpretations
const interpretations = [
  { range: [0, 4], severity: "Minimal or none", description: "Your symptoms suggest minimal depression." },
  { range: [5, 9], severity: "Mild", description: "Your symptoms suggest mild depression." },
  { range: [10, 14], severity: "Moderate", description: "Your symptoms suggest moderate depression." },
  { range: [15, 19], severity: "Moderately severe", description: "Your symptoms suggest moderately severe depression." },
  { range: [20, 27], severity: "Severe", description: "Your symptoms suggest severe depression." }
];

const DepressionAssessment = ({ onComplete }: DepressionAssessmentProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(questions.length).fill(-1));
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswer = (value: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = parseInt(value);
    setAnswers(newAnswers);
    
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const totalScore = newAnswers.reduce((sum, value) => sum + value, 0);
      setScore(totalScore);
      setCompleted(true);
      
      const newResult = {
        id: Date.now().toString(),
        type: "depression",
        name: "PHQ-9",
        score: totalScore,
        date: new Date().toISOString(),
        interpretation: getInterpretation(totalScore)
      };
      
      const history = JSON.parse(localStorage.getItem('assessmentHistory') || '[]');
      localStorage.setItem('assessmentHistory', JSON.stringify([...history, newResult]));
      
      toast.success("Assessment completed", {
        description: "Your results have been saved to your history."
      });
      
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
        title="PHQ-9 Depression Assessment Results"
        score={score}
        maxScore={27}
        level={interpretation?.severity || "Unknown"}
        interpretation={interpretation?.severity || "Unknown"}
        description={interpretation?.description || ""}
        recommendations={[
          "Reach out to a mental health professional",
          "Establish a consistent daily routine",
          "Regular physical activity",
          "Connect with supportive friends and family"
        ]}
        onRestart={handleRestart}
      />
    );
  }

  return (
    <Card className="border-primary/10">
      <CardHeader>
        <CardTitle>PHQ-9 Depression Assessment</CardTitle>
        <CardDescription>
          Over the last 2 weeks, how often have you been bothered by any of the following problems?
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
          
          <RadioGroup className="gap-4">
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

export default DepressionAssessment;
