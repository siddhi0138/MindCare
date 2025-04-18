
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CircularProgressbar, buildStyles } from "react-circular-progressbar";
import "react-circular-progressbar/dist/styles.css";
import { AlertTriangle, Info } from "lucide-react";
import { Alert, AlertDescription } from "@/components/ui/alert";

interface AssessmentResultProps {
  title: string;
  score: number;
  maxScore: number;
  interpretation: string;
  description: string;
  onRestart: () => void;
}

const AssessmentResult = ({
  title,
  score,
  maxScore,
  interpretation,
  description,
  onRestart
}: AssessmentResultProps) => {
  const percentage = (score / maxScore) * 100;
  
  // Determine color based on severity
  const getColor = () => {
    if (interpretation.includes("Minimal") || interpretation.includes("Low")) {
      return "#10b981"; // green
    } else if (interpretation.includes("Mild") || interpretation.includes("Moderate")) {
      return "#f59e0b"; // amber
    } else {
      return "#ef4444"; // red
    }
  };
  
  const color = getColor();
  
  return (
    <Card className="border-primary/10">
      <CardHeader>
        <CardTitle className="flex justify-between items-center">
          <span>{title}</span>
          <Badge className={`${
            color === "#10b981" ? "bg-emerald-500" : 
            color === "#f59e0b" ? "bg-amber-500" : "bg-red-500"
          } hover:${
            color === "#10b981" ? "bg-emerald-600" : 
            color === "#f59e0b" ? "bg-amber-600" : "bg-red-600"
          }`}>
            {interpretation}
          </Badge>
        </CardTitle>
      </CardHeader>
      
      <CardContent className="flex flex-col md:flex-row items-center gap-6">
        <div className="w-48 h-48">
          <CircularProgressbar
            value={percentage}
            text={`${score}/${maxScore}`}
            styles={buildStyles({
              pathColor: color,
              textColor: color,
              trailColor: "#e2e8f0"
            })}
          />
        </div>
        
        <div className="flex-1 space-y-4">
          <div>
            <h3 className="text-lg font-medium mb-2">Your Result: {interpretation}</h3>
            <p className="text-muted-foreground">{description}</p>
          </div>
          
          <Alert>
            <Info className="h-4 w-4" />
            <AlertDescription>
              This assessment is for screening purposes only and not a clinical diagnosis. 
              Please consult with a mental health professional for proper evaluation.
            </AlertDescription>
          </Alert>
          
          {(interpretation.includes("Severe") || interpretation.includes("High")) && (
            <Alert variant="destructive">
              <AlertTriangle className="h-4 w-4" />
              <AlertDescription>
                Your score indicates a high level of distress. We strongly recommend 
                speaking with a mental health professional. If you're experiencing thoughts 
                of harming yourself, please use the SOS button or contact a crisis helpline 
                immediately.
              </AlertDescription>
            </Alert>
          )}
        </div>
      </CardContent>
      
      <CardFooter className="flex justify-between">
        <Button variant="outline" onClick={onRestart}>
          Take Assessment Again
        </Button>
        <Button>
          Save Results
        </Button>
      </CardFooter>
    </Card>
  );
};

export default AssessmentResult;
