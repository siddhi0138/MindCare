
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import {
  LineChart,
  Line,
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  PieChart,
  Pie,
  Cell
} from "recharts";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import AchievementBadge from "@/components/common/AchievementBadge";
import { Calendar } from "lucide-react";

// Mock data
const moodData = [
  { date: "Apr 12", value: 3 },
  { date: "Apr 13", value: 2 },
  { date: "Apr 14", value: 4 },
  { date: "Apr 15", value: 3 },
  { date: "Apr 16", value: 5 },
  { date: "Apr 17", value: 4 },
  { date: "Apr 18", value: 4 }
];

const activityData = [
  { name: "Meditation", minutes: 45 },
  { name: "Journaling", minutes: 20 },
  { name: "Reading", minutes: 30 },
  { name: "Exercise", minutes: 60 }
];

const emotionDistribution = [
  { name: "Happy", value: 35 },
  { name: "Calm", value: 25 },
  { name: "Anxious", value: 15 },
  { name: "Sad", value: 10 },
  { name: "Energetic", value: 15 }
];

const COLORS = ["#0088FE", "#00C49F", "#FFBB28", "#FF8042", "#8884d8"];

const achievements = [
  {
    id: "1",
    title: "7-Day Streak",
    description: "Completed activities for 7 days in a row",
    image: "https://api.dicebear.com/7.x/shapes/svg?seed=achievement1",
    achieved: true
  },
  {
    id: "2",
    title: "Mindfulness Master",
    description: "Completed 10 meditation sessions",
    image: "https://api.dicebear.com/7.x/shapes/svg?seed=achievement2",
    achieved: true
  },
  {
    id: "3",
    title: "Journal Explorer",
    description: "Created 5 journal entries",
    image: "https://api.dicebear.com/7.x/shapes/svg?seed=achievement3",
    achieved: true
  },
  {
    id: "4",
    title: "Emotion Tracker",
    description: "Tracked your mood for 14 days consecutively",
    image: "https://api.dicebear.com/7.x/shapes/svg?seed=achievement4",
    achieved: false
  },
  {
    id: "5",
    title: "Resource Scholar",
    description: "Read 10 mental health resources",
    image: "https://api.dicebear.com/7.x/shapes/svg?seed=achievement5",
    achieved: false
  }
];

const ProgressDashboard = () => {
  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-primary/10 col-span-2">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Mood Trends</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={moodData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="date" />
                  <YAxis domain={[0, 5]} />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="value" 
                    stroke="#9b87f5" 
                    strokeWidth={2}
                    activeDot={{ r: 8 }} 
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-primary/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Emotion Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <PieChart>
                  <Pie
                    data={emotionDistribution}
                    cx="50%"
                    cy="50%"
                    labelLine={false}
                    label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                    outerRadius={80}
                    fill="#8884d8"
                    dataKey="value"
                  >
                    {emotionDistribution.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
                    ))}
                  </Pie>
                  <Tooltip />
                </PieChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="border-primary/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Activity Minutes Today</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-[250px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={activityData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="minutes" fill="#60a5fa" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card className="border-primary/10">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-medium">Journaling Streaks</CardTitle>
          </CardHeader>
          <CardContent className="p-6">
            <div className="flex flex-col items-center mb-4">
              <div className="text-5xl font-bold text-primary mb-2">7</div>
              <div className="text-sm text-muted-foreground">Current Streak (Days)</div>
            </div>
            
            <div className="grid grid-cols-7 gap-1 mb-6">
              {Array.from({ length: 21 }).map((_, i) => (
                <div 
                  key={i}
                  className={`h-8 rounded-sm ${i < 18 ? 'bg-primary/80' : 'bg-muted'}`}
                />
              ))}
            </div>
            
            <Button variant="outline" className="w-full flex items-center justify-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>View Full Calendar</span>
            </Button>
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
                  <AchievementBadge key={achievement.id} achievement={achievement} />
                ))}
            </TabsContent>
            
            <TabsContent value="locked" className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {achievements
                .filter(achievement => !achievement.achieved)
                .map(achievement => (
                  <AchievementBadge key={achievement.id} achievement={achievement} />
                ))}
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
    </div>
  );
};

export default ProgressDashboard;
