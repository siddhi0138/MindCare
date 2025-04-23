import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AssessmentType } from "./AssessmentHub";
import AssessmentHistoryChart from '@/components/assessment/AssessmentHistoryChart';
interface AssessmentHistoryEntry {
  userId: string;
  id: string;
  type: AssessmentType;
  score: number;
  level: string;
  recommendations: string[];
  timestamp: string;
}

interface AssessmentHistoryProps {
  onSelectAssessment: (type: AssessmentType) => void;
}

const AssessmentHistory = ({ onSelectAssessment }: AssessmentHistoryProps) => {
  const [history, setHistory] = useState<AssessmentHistoryEntry[]>([]);

  useEffect(() => {
    const storedHistory = localStorage.getItem("assessmentHistory");
    if (storedHistory) {
      setHistory(JSON.parse(storedHistory));
    }
  }, []);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Assessment History</h2>
      {history.length === 0 ? (
        <p className="text-muted-foreground">No assessment history yet.</p>
      ) :
       (

        <div className="space-y-4">
          {history.map((entry, index) => (
            <Card key={index} className="border-primary/10">
              <CardHeader>
                <CardTitle className="flex justify-between items-center">
                  <span>{entry.type} Assessment</span>
                </CardTitle>
              </CardHeader>

              <CardContent className="space-y-4">
                <div className="flex items-center justify-between">
                  <p className="text-muted-foreground">Score: {entry.score}</p>
                  <Badge
                    className={`${entry.level.includes('Low')
                      ? 'bg-emerald-500'
                      : entry.level.includes('Moderate')
                        ? 'bg-amber-500'
                        : 'bg-red-500'
                      } hover:${entry.level.includes('Low')
                        ? 'bg-emerald-600'
                        : entry.level.includes('Moderate')
                          ? 'bg-amber-600'
                          : 'bg-red-600'
                      }`}
                  >
                    {entry.level}
                  </Badge>
                </div>

                <p className="text-muted-foreground">
                  Timestamp: {new Date(entry.timestamp).toLocaleString()}
                </p>
                <AssessmentHistoryChart
                  assessmentType={entry.type}
                  assessmentData={history.filter(histEntry => histEntry.type === entry.type).map(histEntry => ({
                    ...histEntry, timestamp: new Date(histEntry.timestamp),
                  }))}
                  userId={entry.userId} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssessmentHistory;
