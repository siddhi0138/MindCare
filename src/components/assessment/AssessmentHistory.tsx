import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "../ui/card";
import { Badge } from "../ui/badge";
import { AssessmentType } from "./AssessmentHub";
import AssessmentHistoryChart from "./AssessmentHistoryChart";
import { useAuth } from "../../contexts/AuthContext";
import { collection, query, where, orderBy, onSnapshot, Timestamp } from "firebase/firestore";
import { firestore } from "../../configs/firebase";

interface AssessmentHistoryEntry {
  userId: string;
  id: string;
  type: AssessmentType;
  score: number;
  level: string;
  recommendations: string[];
  timestamp: Date;
}

interface AssessmentHistoryProps {
  onSelectAssessment: (type: AssessmentType) => void;
}

const AssessmentHistory = ({ onSelectAssessment }: AssessmentHistoryProps) => {
  const { currentUser } = useAuth();
  const [history, setHistory] = useState<AssessmentHistoryEntry[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser) {
      setHistory([]);
      setLoading(false);
      return;
    }

    setLoading(true);
    const q = query(
      collection(firestore, "assessmentResults"),
      where("userId", "==", currentUser.id),
      orderBy("timestamp", "desc")
    );

    const unsubscribe = onSnapshot(q, (snapshot) => {
      const results = snapshot.docs.map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          userId: data.userId,
          type: data.type,
          score: data.score,
          level: data.level,
          recommendations: data.recommendations || [],
          timestamp: (data.timestamp as Timestamp).toDate(),
        } as AssessmentHistoryEntry;
      });
      setHistory(results);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [currentUser]);

  if (loading) {
    return <p>Loading assessment history...</p>;
  }

  if (history.length === 0) {
    return <p className="text-muted-foreground">No assessment history yet.</p>;
  }

  // Group history by assessment type
  const groupedByType = history.reduce((acc, entry) => {
    if (!acc[entry.type]) {
      acc[entry.type] = [];
    }
    acc[entry.type].push(entry);
    return acc;
  }, {} as Record<AssessmentType, AssessmentHistoryEntry[]>);

  return (
    <div className="space-y-6">
      <h2 className="text-2xl font-bold">Assessment History</h2>
      <div className="space-y-4">
        {Object.entries(groupedByType).map(([type, entries]) => (
          <Card key={type} className="border-primary/10">
            <CardHeader>
              <CardTitle className="flex justify-between items-center">
                <span>{type} Assessment</span>
              </CardTitle>
            </CardHeader>

            <CardContent className="space-y-4">
              <div className="flex items-center justify-between">
                <p className="text-muted-foreground">Latest Score: {entries[0].score}</p>
                <Badge
                  className={`${
                    entries[0].level?.includes("Low")
                      ? "bg-emerald-500"
                      : entries[0].level?.includes("Moderate")
                      ? "bg-amber-500"
                      : "bg-red-500"
                  } hover:${
                    entries[0].level?.includes("Low")
                      ? "bg-emerald-600"
                      : entries[0].level?.includes("Moderate")
                      ? "bg-amber-600"
                      : "bg-red-600"
                  }`}
                >
                  {entries[0].level || "Unknown"}
                </Badge>
              </div>

              <p className="text-muted-foreground">
                Latest Timestamp: {entries[0].timestamp.toLocaleString()}
              </p>
              <AssessmentHistoryChart
                assessmentType={type as AssessmentType}
                assessmentData={entries}
                userId={entries[0].userId}
              />
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default AssessmentHistory;
