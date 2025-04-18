
import { useEffect, useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend } from "recharts";
import { format, parseISO, subMonths } from "date-fns";

interface AssessmentResult {
  id: string;
  type: "depression" | "anxiety" | "stress";
  name: string;
  score: number;
  date: string;
  interpretation: string;
}

const AssessmentHistory = () => {
  const [history, setHistory] = useState<AssessmentResult[]>([]);
  const [chartType, setChartType] = useState<"depression" | "anxiety" | "stress">("depression");
  
  useEffect(() => {
    const savedHistory = JSON.parse(localStorage.getItem("assessmentHistory") || "[]");
    setHistory(savedHistory);
  }, []);

  const formatDate = (dateStr: string) => {
    return format(parseISO(dateStr), "MMM d, yyyy");
  };

  const getBadgeColor = (interpretation: string) => {
    if (interpretation.includes("Minimal") || interpretation.includes("Low")) {
      return "bg-emerald-500 hover:bg-emerald-600";
    } else if (interpretation.includes("Mild") || interpretation.includes("Moderate")) {
      return "bg-amber-500 hover:bg-amber-600"; 
    } else {
      return "bg-red-500 hover:bg-red-600";
    }
  };

  // Generate chart data
  const getChartData = () => {
    const filteredResults = history.filter(item => item.type === chartType);
    
    // If no data, return sample data for the last 4 months
    if (filteredResults.length === 0) {
      return Array(4).fill(0).map((_, i) => ({
        date: format(subMonths(new Date(), 3 - i), "MMM d"),
        score: null,
      }));
    }

    return filteredResults
      .sort((a, b) => new Date(a.date).getTime() - new Date(b.date).getTime())
      .map(item => ({
        date: format(parseISO(item.date), "MMM d"),
        score: item.score
      }));
  };

  const getMaxScore = () => {
    switch (chartType) {
      case "depression": return 27;
      case "anxiety": return 21;
      case "stress": return 40;
      default: return 30;
    }
  };

  return (
    <div className="space-y-8">
      <Card className="border-primary/10">
        <CardHeader>
          <CardTitle>Assessment History</CardTitle>
          <CardDescription>
            Track your assessment results over time to monitor your progress
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Tabs 
            defaultValue="depression" 
            className="w-full"
            onValueChange={(value) => setChartType(value as "depression" | "anxiety" | "stress")}
          >
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="depression">Depression (PHQ-9)</TabsTrigger>
              <TabsTrigger value="anxiety">Anxiety (GAD-7)</TabsTrigger>
              <TabsTrigger value="stress">Stress (PSS-10)</TabsTrigger>
            </TabsList>
            
            <TabsContent value="depression">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={getChartData()}
                    margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, getMaxScore()]} />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#9b87f5" 
                      activeDot={{ r: 8 }}
                      name="PHQ-9 Score" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="anxiety">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={getChartData()}
                    margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, getMaxScore()]} />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#60a5fa" 
                      activeDot={{ r: 8 }}
                      name="GAD-7 Score" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
            
            <TabsContent value="stress">
              <div className="h-[300px]">
                <ResponsiveContainer width="100%" height="100%">
                  <LineChart
                    data={getChartData()}
                    margin={{ top: 5, right: 20, left: 10, bottom: 5 }}
                  >
                    <CartesianGrid strokeDasharray="3 3" />
                    <XAxis dataKey="date" />
                    <YAxis domain={[0, getMaxScore()]} />
                    <Tooltip />
                    <Legend />
                    <Line 
                      type="monotone" 
                      dataKey="score" 
                      stroke="#f97316" 
                      activeDot={{ r: 8 }}
                      name="PSS-10 Score" 
                    />
                  </LineChart>
                </ResponsiveContainer>
              </div>
            </TabsContent>
          </Tabs>
        </CardContent>
      </Card>
      
      <Card className="border-primary/10">
        <CardHeader>
          <CardTitle>Recent Assessments</CardTitle>
          <CardDescription>
            Your most recent assessment results
          </CardDescription>
        </CardHeader>
        <CardContent>
          {history.length === 0 ? (
            <div className="text-center py-8 text-muted-foreground">
              You haven't completed any assessments yet.
            </div>
          ) : (
            <div className="space-y-4">
              {history
                .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                .slice(0, 5)
                .map((result) => (
                  <div 
                    key={result.id}
                    className="flex justify-between items-center p-4 rounded-lg border"
                  >
                    <div>
                      <h4 className="font-medium">{result.name}</h4>
                      <p className="text-sm text-muted-foreground">{formatDate(result.date)}</p>
                    </div>
                    <div className="flex items-center gap-3">
                      <div className="text-right">
                        <span className="text-lg font-semibold">{result.score}</span>
                        <span className="text-muted-foreground text-sm ml-1">points</span>
                      </div>
                      <Badge className={getBadgeColor(result.interpretation)}>
                        {result.interpretation}
                      </Badge>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
};

export default AssessmentHistory;
