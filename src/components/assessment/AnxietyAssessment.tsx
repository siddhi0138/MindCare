import { useState } from "react";
import { Button } from "../ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "../ui/card";
import { RadioGroup, RadioGroupItem } from "../ui/radio-group";
import { Label } from "../ui/label";
import { Progress } from "../ui/progress";
import { toast } from "../ui/sonner";
import { AssessmentResult } from "./AssessmentResult";
import type { AnxietyAssessmentProps } from "./AnxietyAssessment.d";
import { saveAssessmentResult } from "../../configs/firebase";

// GAD-7 questions
const questions = [
  "Feeling nervous, anxious, or on edge",
  "Not being able to stop or control worrying",
  "Worrying too much about different things",
  "Trouble relaxing",
  "Being so restless that it's hard to sit still",
  "Becoming easily annoyed or irritable",
  "Feeling afraid as if something awful might happen"
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
  { range: [0, 4], severity: "Minimal anxiety", description: "Your symptoms suggest minimal anxiety." },
  { range: [5, 9], severity: "Mild anxiety", description: "Your symptoms suggest mild anxiety." },
  { range: [10, 14], severity: "Moderate anxiety", description: "Your symptoms suggest moderate anxiety." },
  { range: [15, 21], severity: "Severe anxiety", description: "Your symptoms suggest severe anxiety." }
];

const AnxietyAssessment = ({ onComplete }: AnxietyAssessmentProps) => {
  const [currentQuestion, setCurrentQuestion] = useState(0);
  const [answers, setAnswers] = useState<number[]>(Array(questions.length).fill(-1));
  const [completed, setCompleted] = useState(false);
  const [score, setScore] = useState(0);

  const handleAnswer = async (value: string) => {
    const newAnswers = [...answers];
    newAnswers[currentQuestion] = parseInt(value);
    setAnswers(newAnswers);
    
    // Move to next question or complete the assessment
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion(currentQuestion + 1);
    } else {
      const totalScore = newAnswers.reduce((sum, value) => sum + value, 0);
      setScore(totalScore);
      setCompleted(true);
      
      // Save result to Firestore
      const newResult = {
        type: "anxiety",
        score: totalScore,
        level: getInterpretation(totalScore),
        recommendations: [
          "Practice deep breathing exercises",
          "Consider talking to a mental health professional",
          "Establish a regular sleep schedule",
          "Limit caffeine and alcohol"
        ],
        timestamp: new Date(),
      };
      
      try {
        const response = await saveAssessmentResult(newResult);
        if (response.success) {
          toast.success("Assessment completed", {
            description: "Your results have been saved to your history."
          });
        } else {
          toast.error("Failed to save assessment result.");
        }
      } catch (error) {
        toast.error("Error saving assessment result.");
      }
      
      // Pass the score to the parent component
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
        title="GAD-7 Anxiety Assessment Results"
        score={score}
        maxScore={21}
        level={interpretation?.severity || "Unknown"}
        interpretation={interpretation?.severity || "Unknown"}
        description={interpretation?.description || ""}
        recommendations={[
          "Practice deep breathing exercises",
          "Consider talking to a mental health professional",
          "Establish a regular sleep schedule",
          "Limit caffeine and alcohol"
        ]}
        onRestart={handleRestart}
      />
    );
  }

  return (
    <Card className="border-primary/10">
      <CardHeader>
        <CardTitle>GAD-7 Anxiety Assessment</CardTitle>
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

export default AnxietyAssessment;
