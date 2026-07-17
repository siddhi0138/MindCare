import { useEffect, useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell,
  Legend
} from "recharts";
import CustomXAxis from "@/components/assessment/CustomXAxis";
import CustomYAxis from "@/components/assessment/CustomYAxis";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AchievementBadge from "@/components/common/AchievementBadge";
import AIInsights from "./AIInsights";
import { ProgressDashboardProps } from "./ProgressDashboard.d";
import { getMoodEntries, getEmotionLogs, getJournalEntries, getToolSessions } from "@/configs/firebase";
import { Timestamp } from "firebase/firestore";
import { aggregateMoodByDay } from "@/lib/mood";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8", "#FF6B9D", "#A0522D", "#607D8B"];

// Mood is stored as a 0-4 score (matches the Mood Tracker widget's scale) — label it so the
// chart reads as "Good"/"Low" etc. instead of an unexplained raw number.
const MOOD_LABELS = ["Very Low", "Low", "Neutral", "Good", "Great"];
const moodLabel = (value: number) => MOOD_LABELS[Math.round(value)] ?? `${value}`;

const dayKey = (d: Date) => d.toISOString().slice(0, 10);

const formatToolType = (type: string) =>
  type.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1)).join(' ');

const ProgressDashboard = ({ userId }: ProgressDashboardProps) => {
  const [moodData, setMoodData] = useState<{ date: string; value: number }[]>([]);
  const [emotionDistribution, setEmotionDistribution] = useState<{ name: string; value: number }[]>([]);
  const [uniqueMoodDays, setUniqueMoodDays] = useState(0);
  const [activityData, setActivityData] = useState<{ name: string; count: number }[]>([]);
  const [toolSessionCount, setToolSessionCount] = useState(0);
  const [journalStreak, setJournalStreak] = useState(0);
  const [journalHeatmap, setJournalHeatmap] = useState<boolean[]>(Array.from({ length: 21 }, () => false));
  const [journalEntryCount, setJournalEntryCount] = useState(0);

  useEffect(() => {
    if (!userId) return;

    const loadChartData = async () => {
      const [moodEntries, emotionLogs, journalEntries, toolSessions] = await Promise.all([
        getMoodEntries(userId),
        getEmotionLogs(userId),
        getJournalEntries(userId) as Promise<Array<{ id: string; timestamp: Timestamp }>>,
        getToolSessions(userId),
      ]);

      setMoodData(
        aggregateMoodByDay(moodEntries).map(({ date, mood }) => ({
          date: date.toLocaleDateString([], { month: 'short', day: 'numeric' }),
          value: mood,
        }))
      );
      setUniqueMoodDays(new Set(moodEntries.map((e) => dayKey(e.timestamp.toDate()))).size);

      const emotionCounts: Record<string, number> = {};
      emotionLogs.forEach((log) => {
        emotionCounts[log.emotion] = (emotionCounts[log.emotion] || 0) + 1;
      });
      setEmotionDistribution(
        Object.entries(emotionCounts).map(([name, value]) => ({
          name: name.charAt(0).toUpperCase() + name.slice(1),
          value,
        }))
      );

      const todayKey = dayKey(new Date());
      const sessionCounts: Record<string, number> = {};
      toolSessions.forEach((session) => {
        if (dayKey(session.timestamp.toDate()) === todayKey) {
          sessionCounts[session.toolType] = (sessionCounts[session.toolType] || 0) + 1;
        }
      });
      setActivityData(
        Object.entries(sessionCounts).map(([name, count]) => ({ name: formatToolType(name), count }))
      );
      setToolSessionCount(toolSessions.length);

      const journalDays = new Set(journalEntries.map((e) => dayKey(e.timestamp.toDate())));
      setJournalEntryCount(journalEntries.length);
      let streak = 0;
      const cursor = new Date();
      while (journalDays.has(dayKey(cursor))) {
        streak++;
        cursor.setDate(cursor.getDate() - 1);
      }
      setJournalStreak(streak);
      setJournalHeatmap(
        Array.from({ length: 21 }, (_, i) => {
          const d = new Date();
          d.setDate(d.getDate() - (20 - i));
          return journalDays.has(dayKey(d));
        })
      );
    };

    loadChartData();
  }, [userId]);

  const achievements = [
    {
      id: "streak",
      icon: "🔥",
      title: "7-Day Streak",
      description: "Journal for 7 days in a row",
      achieved: journalStreak >= 7,
      progress: Math.min(100, Math.round((journalStreak / 7) * 100)),
    },
    {
      id: "journal",
      icon: "📓",
      title: "Journal Explorer",
      description: "Created 5 journal entries",
      achieved: journalEntryCount >= 5,
      progress: Math.min(100, Math.round((journalEntryCount / 5) * 100)),
    },
    {
      id: "emotion",
      icon: "💗",
      title: "Emotion Tracker",
      description: "Logged mood check-ins on 14 different days",
      achieved: uniqueMoodDays >= 14,
      progress: Math.min(100, Math.round((uniqueMoodDays / 14) * 100)),
    },
    {
      id: "tools",
      icon: "🧘",
      title: "Coping Tools Explorer",
      description: "Completed 10 coping-tool sessions",
      achieved: toolSessionCount >= 10,
      progress: Math.min(100, Math.round((toolSessionCount / 10) * 100)),
    },
  ];

  return (
    <div className="space-y-8">
      <AIInsights userId={userId} />

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-primary/10 col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Mood Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {moodData.length === 0 ? (
                <div className="h-full flex items-center justify-center text-sm text-muted-foreground">
                  No mood check-ins yet. Log your mood to see trends here.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart data={moodData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <CustomXAxis dataKey="date" />
                    <CustomYAxis domain={[0, 4]} ticks={[0, 1, 2, 3, 4]} tickFormatter={moodLabel} width={70} />
                    <Tooltip formatter={(value: number) => [moodLabel(value), 'Mood']} />
                    <Line
                      type="monotone"
                      dataKey="value"
                      stroke="#9b87f5"
                      strokeWidth={2}
                      activeDot={{ r: 8 }}
                    />
                  </LineChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Emotion Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              {emotionDistribution.length === 0 ? (
                <div className="h-full flex items-center justify-center text-sm text-muted-foreground text-center px-4">
                  No emotion data yet. Chat with the AI assistant to build this up.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={emotionDistribution}
                      cx="50%"
                      cy="45%"
                      outerRadius={70}
                      fill="#8884d8"
                      dataKey="value"
                      nameKey="name"
                      label={({ percent }) => `${(percent * 100).toFixed(0)}%`}
                    >
                      {emotionDistribution.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                      ))}
                    </Pie>
                    <Tooltip />
                    <Legend verticalAlign="bottom" height={48} wrapperStyle={{ fontSize: 12 }} />
                  </PieChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-primary/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Coping Tool Sessions Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              {activityData.length === 0 ? (
                <div className="h-full flex items-center justify-center text-sm text-muted-foreground text-center px-4">
                  No coping tool sessions today. Try a breathing exercise or game to see it here.
                </div>
              ) : (
                <ResponsiveContainer width="100%" height="100%">
                  <BarChart data={activityData}>
                    <CartesianGrid strokeDasharray="3 3" />
                    <CustomXAxis dataKey="name" />
                    <CustomYAxis allowDecimals={false} />
                    <Tooltip />
                    <Bar dataKey="count" fill="#60a5fa" />
                  </BarChart>
                </ResponsiveContainer>
              )}
            </div>
          </CardContent>
        </Card>

        <Card className="border-primary/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Journaling Streak</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col items-center mb-4">
              <div className="text-5xl font-bold text-primary mb-2">{journalStreak}</div>
              <div className="text-sm text-muted-foreground">Current Streak (Days)</div>
            </div>

            <div className="grid grid-cols-7 gap-1 mb-6">
              {journalHeatmap.map((filled, i) => (
                <div
                  key={i}
                  className={`h-8 rounded-sm ${filled ? 'bg-primary/80' : 'bg-muted'}`}
                />
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      <Card className="border-primary/10">
        <CardHeader className="pb-2">
          <CardTitle>Your Achievements</CardTitle>
        </CardHeader>
        <CardContent>
          <Tabs defaultValue="earned">
            <TabsList className="mb-4">
              <TabsTrigger value="earned">Earned ({achievements.filter(a => a.achieved).length})</TabsTrigger>
              <TabsTrigger value="locked">Locked ({achievements.filter(a => !a.achieved).length})</TabsTrigger>
            </TabsList>

            <TabsContent value="earned" className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {achievements
                .filter(achievement => achievement.achieved)
                .map(achievement => (
                  <AchievementBadge
                    key={achievement.id}
                    icon={achievement.icon}
                    title={achievement.title}
                    description={achievement.description}
                    unlocked={achievement.achieved}
                  />
                ))}
            </TabsContent>

            <TabsContent value="locked" className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {achievements
                .filter(achievement => !achievement.achieved)
                .map(achievement => (
                  <AchievementBadge
                    key={achievement.id}
                    icon={achievement.icon}
                    title={achievement.title}
                    description={achievement.description}
                    unlocked={achievement.achieved}
                    progress={achievement.progress}
                  />
                ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressDashboard;
