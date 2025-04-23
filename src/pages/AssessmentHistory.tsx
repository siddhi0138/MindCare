import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "../components/ui/card";
import { Button } from "../components/ui/button";
import { useNavigate } from "react-router-dom"; import * as firebaseAuth from 'firebase/auth'; import { collection, where, orderBy, onSnapshot, query } from 'firebase/firestore';
import { AssessmentType, assessments } from "../components/ui/AssessmentHub";
import { useAuth } from "../contexts/AuthContext";
import { firestore } from "@/configs/firebase"; import { Timestamp } from 'firebase/firestore'; 

interface AssessmentResult {
  id: string;
  userId: string;
  type: string;
  score: number;
  timestamp: Date;
  level: string;
}

const AssessmentHistoryPage = () => {
  const [loading, setLoading] = useState(true);
  const { currentUser } = useAuth();
  const navigate = useNavigate();
  const [assessmentHistory, setAssessmentHistory] = useState<AssessmentResult[]>([]);

  useEffect(() => {
    setLoading(true);
    if (!currentUser) {
      setAssessmentHistory([]);
      setLoading(false);
      return;
    }

    const q = query(
      collection(firestore, 'assessmentResults'),
      where('userId', '==', currentUser.id),
      orderBy('timestamp', 'desc')
    );
    const unsubscribe = onSnapshot(q, (snapshot) => {
      const history = snapshot.docs.map(doc => {
        const data = doc.data();
        return { id: doc.id, userId: data.userId, type: data.type, score: data.score, timestamp: (data.timestamp as Timestamp).toDate(), level: "-" } as AssessmentResult;
      });
      setAssessmentHistory(history);
      setLoading(false);
    });
    return () => unsubscribe();
  }, [currentUser]);
  
  return (
    <Card>
      <CardHeader className="space-y-1">
        <CardTitle className="text-2xl">Assessment History</CardTitle>
        <CardDescription>View your previous assessment results.</CardDescription>
      </CardHeader>

      <CardContent>
        {loading ? (
          <p>Loading assessment history...</p>
        ) : assessmentHistory.length > 0 ? (
          <ul>
            {assessmentHistory.map((result) => (
              <li key={result.id}>
                {assessments.find(a => a.type === result.type)?.name || result.type} - {result.timestamp.toLocaleDateString()} - Score: {result.score} - Level: {result.level}
              </li>
            ))}
          </ul>
        ) : (
          <p>No assessment history found.</p>
        )}
      </CardContent>
    </Card>
  );
};

export default AssessmentHistoryPage;
