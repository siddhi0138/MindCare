
import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
import { AssessmentType, assessments } from "@/components/ui/AssessmentHub";

export interface AssessmentResultProps {
  id: string;
  type: AssessmentType;
  name: string;
  score: number;
  date: string;
  interpretation: string;
}

const AssessmentHistory = () => {
  const [assessmentHistory, setAssessmentHistory] = useState<AssessmentResultProps[]>([]);
  const navigate = useNavigate();

  useEffect(() => {
    const history = JSON.parse(localStorage.getItem('assessmentHistory') || '[]');
    setAssessmentHistory(history);
  }, []);

  const handleGoToAssessments = () => {
    navigate("/home/user/serenity-wellbeing-hub/src/pages/AssessmentsPage.tsx");
  };

  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Assessment History</CardTitle>
        <CardDescription>View your previous assessment results.</CardDescription>
      </CardHeader>
      <CardContent className="grid gap-4">
        {assessmentHistory.length > 0 ? (
          assessmentHistory.map((result) => {
            const assessment = assessments.find((a) => a.type === result.type);
            return (
              <div key={result.id} className="border rounded-md p-4 space-y-2">
                <h4 className="text-lg font-medium">
                  {assessment?.name || result.name} - {result.date}
                </h4>
                <p className="text-sm">Score: {result.score} - {result.interpretation}</p>
                <Button className="mt-4" onClick={handleGoToAssessments}>
                  Back to Assessments
                </Button>
              </div>
            );
          })
        ) : (
          <p>No assessment history found.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default AssessmentHistory;