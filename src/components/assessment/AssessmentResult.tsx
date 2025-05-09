
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CircularProgressbar, buildStyles } from 'react-circular-progressbar';
import 'react-circular-progressbar/dist/styles.css';
import { AlertTriangle, Info } from 'lucide-react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { AssessmentType } from './AssessmentHub';
import { useAuth } from '@/contexts/AuthContext';
import { saveUserActivity } from '@/configs/firebase';
import { useNavigate } from 'react-router-dom';

export interface AssessmentResultProps {
  title?: string;
  type?: AssessmentType;
  score: number;
  maxScore?: number;
  level: string;
  interpretation?: string;
  description?: string;
  recommendations: string[];
  onRestart?: () => void;
  onSaveResults?: () => void;
}

export const AssessmentResult = ({
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  title,
  type,
  score,
  maxScore = 27,
  level,
  interpretation = level,
  description = "",
  recommendations,
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  onRestart,
  onSaveResults,
}: AssessmentResultProps) => {  const { currentUser } = useAuth();
  const percentage = (score / maxScore) * 100;
  
  // Determine color based on severity
  const getColor = () => {
    if (level.includes("Low") || level.includes("Minimal")) {
      return "#10b981"; // green
    } else if (level.includes("Moderate") || level.includes("Mild")) {
      return "#f59e0b"; // amber
    } else {
      return "#ef4444"; // red
    }
  };

  const color = getColor();

  // Determine title based on type if not provided
  const getTitle = () => {
    if (title) return title;
    
    switch(type) {
      case "anxiety": return "Anxiety Assessment";
      case "depression": return "Depression Assessment";
      case "stress": return "Stress Assessment";
      default: return "Assessment Result";
    }
  };

  const navigate = useNavigate();

  const handleGoToAssessments = () => {
        onRestart?.();
  };

  const handleSaveResultsAndActivity = () => {
    onSaveResults?.();
    const timestamp = new Date().toISOString();
    const userId = currentUser?.id;
    const activityData = {
      userId,
      timestamp,
      activityType: "submit-assessment",
      activityName: type,
      pageName: "AssessmentPage",
    };
    saveUserActivity(activityData);
  };

  const serviceButtons = [
    { label: "Breathing Exercises", path: "/interactive-tools/grounding" },
    { label: "Affirmations", path: "/affirmations" },
    { label: "Games", path: "/coping-tools?defaultTab=games" },
    { label: "Grounding Activities", path: "/interactive-tools/grounding" },
    { label: "Journaling", path: "/journal" },
    { label: "Meditation", path: "/meditation" },
    { label: "AI Help", path: "/chat" },
    { label: "Mental Health Resources", path: "/resources" },
    { label: "Therapists", path: "/therapists" },
    { label: "Community", path: "/community" },
    ];

  return (
    <>
    <Button className="mt-4" onClick={handleGoToAssessments}>
                Back to Assessments
            </Button>
      <Card className="border-primary/10">
        <CardHeader>
          <CardTitle className="flex justify-between items-center">
            <span>{getTitle()}</span>
            <Badge
              className={`${
                color === '#10b981'
                  ? 'bg-emerald-500'
                  : color === '#f59e0b'
                    ? 'bg-amber-500'
                    : 'bg-red-500'
              } hover:${
                color === '#10b981'
                  ? 'bg-emerald-600'
                  : color === '#f59e0b'
                    ? 'bg-amber-600'
                    : 'bg-red-600'
              }`}
            >
              {level}
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
                trailColor: '#e2e8f0',
              })}
            />
          </div>

          <div className="flex-1 space-y-4">
            <div>
              <h3 className="text-lg font-medium mb-2">Your Result: {level}</h3>
              <p className="text-muted-foreground">{description}</p>

              {recommendations && recommendations.length > 0 && (
                <div className="mt-4">
                  <h4 className="font-medium mb-2">Recommendations:</h4>
                  <ul className="list-disc list-inside space-y-1 text-muted-foreground">
                    {recommendations.map((rec, i) => (
                      <li key={i}>{rec}</li>
                    ))}
                  </ul>
                </div>
              )}
            </div>

            <Alert>
              <Info className="h-4 w-4" />
              <AlertDescription>
                This assessment is for screening purposes only and not a clinical
                diagnosis. Please consult with a mental health professional for
                proper evaluation.
              </AlertDescription>
            </Alert>

            {(level.includes('Severe') || level.includes('High')) && (
              <Alert variant="destructive">
                <AlertTriangle className="h-4 w-4" />
                <AlertDescription>
                  Your score indicates a high level of distress. We strongly
                  recommend speaking with a mental health professional. If you're
                  experiencing thoughts of harming yourself, please use the SOS
                  button or contact a crisis helpline immediately.
                </AlertDescription>
              </Alert>
            )}
          </div>
        </CardContent>

        <CardFooter className="flex justify-between">
          {onSaveResults && <Button onClick={handleSaveResultsAndActivity}>Save Results</Button>}
        </CardFooter>
      </Card>
        <div className="mt-6 space-y-4">
            <p className="text-muted-foreground">To reduce stress, explore our services:</p>
            <div className="flex flex-wrap gap-2">
                {serviceButtons.map((service, index) => (
                        <Button className="mt-4"
                            key={index}
                            variant="outline"
                            onClick={() => navigate(service.path)}
                        >
                            {service.label}
                        </Button>
                    ))}
                </div>
        </div>
    </>);
};
