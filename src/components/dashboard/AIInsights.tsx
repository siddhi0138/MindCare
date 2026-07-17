import { useEffect, useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Sparkles, TrendingUp, TrendingDown, Minus } from 'lucide-react';
import { getMoodEntries, getEmotionLogs } from '@/configs/firebase';
import { aggregateMoodByDay } from '@/lib/mood';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface Recommendation {
  tool: string;
  reason: string;
}

interface MoodPrediction {
  trend: string;
  risk_probability: number;
  explanation: string;
}

const trendIcon = (trend: string) => {
  if (trend === 'improving') return <TrendingUp className="text-green-500" size={20} />;
  if (trend === 'declining') return <TrendingDown className="text-destructive" size={20} />;
  return <Minus className="text-muted-foreground" size={20} />;
};

const AIInsights = ({ userId }: { userId?: string }) => {
  const [loading, setLoading] = useState(true);
  const [recommendation, setRecommendation] = useState<Recommendation | null>(null);
  const [prediction, setPrediction] = useState<MoodPrediction | null>(null);
  const [error, setError] = useState(false);

  useEffect(() => {
    if (!userId) {
      setLoading(false);
      return;
    }

    const loadInsights = async () => {
      setLoading(true);
      setError(false);
      try {
        const [moodEntries, emotionLogs] = await Promise.all([
          getMoodEntries(userId),
          getEmotionLogs(userId),
        ]);

        // One value per day (same-day check-ins averaged), so a heavy journaling day doesn't
        // skew the trend heuristic or the average shown to the recommendation prompt.
        const moodValues = aggregateMoodByDay(moodEntries).map((d) => d.mood);
        const avgMood = moodValues.length
          ? moodValues.reduce((a, b) => a + b, 0) / moodValues.length
          : null;

        const emotionCounts: Record<string, number> = {};
        emotionLogs.forEach((log) => {
          emotionCounts[log.emotion] = (emotionCounts[log.emotion] || 0) + 1;
        });

        const [recRes, predRes] = await Promise.all([
          fetch(`${API_BASE_URL}/recommend`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ emotion_counts: emotionCounts, avg_mood: avgMood }),
          }),
          fetch(`${API_BASE_URL}/predict-mood`, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ mood_values: moodValues }),
          }),
        ]);

        if (recRes.ok) setRecommendation(await recRes.json());
        if (predRes.ok) setPrediction(await predRes.json());
      } catch (err) {
        console.error('Error loading AI insights:', err);
        setError(true);
      } finally {
        setLoading(false);
      }
    };

    loadInsights();
  }, [userId]);

  if (!userId) return null;

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <Card className="border-primary/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium flex items-center gap-2">
            <Sparkles size={18} className="text-primary" />
            AI Recommendation
          </CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Analyzing your recent check-ins...</p>
          ) : error || !recommendation ? (
            <p className="text-sm text-muted-foreground">
              Not enough data yet. Chat with the AI assistant or log a few moods to get a personalized recommendation.
            </p>
          ) : (
            <div>
              <p className="font-medium mb-1">{recommendation.tool}</p>
              <p className="text-sm text-muted-foreground">{recommendation.reason}</p>
            </div>
          )}
        </CardContent>
      </Card>

      <Card className="border-primary/10">
        <CardHeader className="pb-2">
          <CardTitle className="text-lg font-medium">Mood Forecast</CardTitle>
        </CardHeader>
        <CardContent>
          {loading ? (
            <p className="text-sm text-muted-foreground">Calculating trend...</p>
          ) : error || !prediction ? (
            <p className="text-sm text-muted-foreground">Could not calculate a mood forecast right now.</p>
          ) : (
            <div>
              <div className="flex items-center gap-2 mb-1">
                {trendIcon(prediction.trend)}
                <span className="font-medium capitalize">{prediction.trend.replace('_', ' ')}</span>
                {prediction.trend !== 'insufficient_data' && (
                  <span className="text-xs text-muted-foreground ml-auto">
                    {(prediction.risk_probability * 100).toFixed(0)}% shift signal
                  </span>
                )}
              </div>
              <p className="text-sm text-muted-foreground">{prediction.explanation}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AIInsights;
