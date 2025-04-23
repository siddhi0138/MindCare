
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { AssessmentType } from "./AssessmentHub";
import { getAssessmentResults } from '@/configs/firebase';
import { useAuth } from '@/contexts/AuthContext';
import AssessmentHistoryChart from '@/components/assessment/AssessmentHistoryChart';

interface AssessmentHistoryEntry {
  id: string;
  userId: string;
  type: AssessmentType;
  score: number;
  level: string;
  recommendations: string[];
  timestamp: any; // or use Timestamp type from firebase/firestore if needed
}

interface AssessmentHistoryProps {
  onSelectAssessment: (type: AssessmentType) => void;
}

const AssessmentHistory = ({ onSelectAssessment, }: AssessmentHistoryProps) => {
  const { currentUser } = useAuth();
  const [history, setHistory] = useState<AssessmentHistoryEntry[]>([]);

  useEffect(() => {
    const fetchAssessmentHistory = async () => {
      if (currentUser?.id) {
        const results = await getAssessmentResults(currentUser.id);
        setHistory(results as AssessmentHistoryEntry[]);
      }
    };

    fetchAssessmentHistory();
  }, [currentUser]);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Assessment History</h2>
      {history.length === 0 ? (
        <p className="text-muted-foreground">No assessment history yet.</p>
      ) : (
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
                  Timestamp: {entry.timestamp.toDate().toLocaleString()}
                </p>
                <AssessmentHistoryChart assessmentType={entry.type} assessmentData={history} />
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
};

export default AssessmentHistory;
