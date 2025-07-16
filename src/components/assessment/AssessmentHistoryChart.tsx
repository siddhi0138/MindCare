import React from 'react';
import { LineChart, Line, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from 'recharts';
import CustomYAxis from './CustomYAxis';
import CustomXAxis from './CustomXAxis';

export interface AssessmentData {
  id: string;
  userId: string;
  type: string;
  score: number;
  level: string;
  recommendations: string[];
  timestamp: Date;
}

export interface AssessmentHistoryChartProps {
  assessmentType: string;
  assessmentData: AssessmentData[];
  userId: string;
}

const AssessmentHistoryChart = ({ assessmentType, assessmentData, userId }: AssessmentHistoryChartProps) => {
  const filteredData = assessmentData
    .filter(data => data.type === assessmentType) 
    .map(data => ({
      timestamp: data.timestamp.getTime(),
      score: data.score,
    }))
    .sort((a, b) => a.timestamp - b.timestamp);

  const formatDate = (timestamp: number) => {
    const date = new Date(timestamp);
    return date.toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' });
  };

  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart data={filteredData}>
        <CartesianGrid strokeDasharray="3 3" />
        <CustomXAxis 
          dataKey="timestamp" 
          tickFormatter={formatDate} 
          type="number" 
          domain={['dataMin', 'dataMax']} 
          scale="time" 
        />
        <CustomYAxis />
        <Tooltip labelFormatter={(label) => formatDate(label as number)} />
        <Legend />
        <Line type="monotone" dataKey="score" stroke="#8884d8" activeDot={{ r: 8 }} />
      </LineChart>
    </ResponsiveContainer>
  );
};

export default AssessmentHistoryChart;
