import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import ClearHistoryButton from '@/components/common/ClearHistoryButton';
import { useAuth } from '@/contexts/AuthContext';
import { getToolSessions, deleteToolSessions } from '@/configs/firebase';
import { Timestamp } from 'firebase/firestore';

interface ToolSession {
  id: string;
  toolType: string;
  details?: Record<string, unknown>;
  timestamp: Timestamp;
}

const TOOL_LABELS: Record<string, string> = {
  'breathing-478': '4-7-8 Breathing',
  'breathing-box': 'Box Breathing',
  grounding: 'Grounding Exercise (5-4-3-2-1)',
  'memory-game': 'Memory Game',
  'word-zen': 'Word Zen',
  'find-the-ball': 'Find the Ball',
  coloring: 'Coloring',
  affirmations: 'Affirmations',
};

const formatDetails = (details?: Record<string, unknown>) => {
  if (!details) return null;
  return Object.entries(details)
    .map(([key, value]) => `${key.charAt(0).toUpperCase() + key.slice(1)}: ${value}`)
    .join(' · ');
};

const ToolHistory = () => {
  const { currentUser } = useAuth();
  const [sessions, setSessions] = useState<ToolSession[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!currentUser?.id) {
      setSessions([]);
      setLoading(false);
      return;
    }
    setLoading(true);
    getToolSessions(currentUser.id).then((results) => {
      setSessions(results as ToolSession[]);
      setLoading(false);
    });
  }, [currentUser?.id]);

  if (loading) {
    return <p className="text-muted-foreground">Loading tool history...</p>;
  }

  if (sessions.length === 0) {
    return (
      <p className="text-muted-foreground">
        No tool activity yet. Complete a breathing exercise, grounding session, or game to see it here.
      </p>
    );
  }

  const counts = sessions.reduce((acc, s) => {
    acc[s.toolType] = (acc[s.toolType] || 0) + 1;
    return acc;
  }, {} as Record<string, number>);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div className="flex flex-wrap gap-2">
          {Object.entries(counts).map(([type, count]) => (
            <Badge key={type} variant="outline" className="text-sm">
              {TOOL_LABELS[type] || type}: {count}
            </Badge>
          ))}
        </div>
        {currentUser?.id && (
          <ClearHistoryButton
            itemLabel="tool activity"
            pageName="ToolHistory"
            onConfirm={() => deleteToolSessions(currentUser.id)}
            onCleared={() => setSessions([])}
          />
        )}
      </div>

      <div className="space-y-3">
        {sessions.map((session) => (
          <Card key={session.id} className="border-primary/10">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center justify-between">
                <span>{TOOL_LABELS[session.toolType] || session.toolType}</span>
                <span className="text-xs font-normal text-muted-foreground">
                  {session.timestamp.toDate().toLocaleString()}
                </span>
              </CardTitle>
            </CardHeader>
            {formatDetails(session.details) && (
              <CardContent className="pt-0">
                <p className="text-sm text-muted-foreground">{formatDetails(session.details)}</p>
              </CardContent>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default ToolHistory;
