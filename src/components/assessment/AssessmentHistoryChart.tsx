import React from 'react';
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';

export interface AssessmentData {
  id: string;
  userId: string;
  type: string;
  score: number;
  level: string;
  recommendations: string[];
  timestamp: any;
}

export interface AssessmentHistoryChartProps {
  assessmentType: string;
  assessmentData: AssessmentData[];
  userId: string;
}

const AssessmentHistoryChart = ({ assessmentType, assessmentData, userId }: AssessmentHistoryChartProps) => {
  const filteredData = assessmentData
    .filter(data => data.type === assessmentType && data.userId === userId)
    .map(data => ({
      timestamp: data.timestamp.toLocaleDateString(),
      score: data.score,
    }))
    .sort((a, b) => new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime());

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={filteredData}>
        <CartesianGrid strokeDasharray="3 3" />
        <XAxis dataKey="timestamp" />
        <YAxis />
        <Tooltip />
        <Legend />
        <Line type="monotone" dataKey="score" stroke="#8884d8" activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default AssessmentHistoryChart;