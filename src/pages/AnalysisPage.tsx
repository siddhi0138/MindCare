import React from 'react';
import Plot from 'react-plotly.js';
import '../../Analysis.css';
import MainLayout from '@/components/layout/MainLayout';

interface DataPoint {
  Age: number;
  Gender: string;
  Region: string;
  Stress_Level: number;
  Anxiety_Level: number;
  Depression_Level: number;
  Sleep_Duration: number;
  Exercise_Frequency: number;
  Social_Media_Usage: number;
  Work_Hours: number;
  Financial_Stress: string;
  Relationship_Issues: string;
}
const sampleData: DataPoint[] = [
  {
    Age: 25,
    Gender: 'Male',
    Region: 'North America',
    Stress_Level: 7,
    Anxiety_Level: 5,
    Depression_Level: 3,
    Sleep_Duration: 6.5,
    Exercise_Frequency: 3,
    Social_Media_Usage: 4,
    Work_Hours: 45,
    Financial_Stress: 'Yes',
    Relationship_Issues: 'No',
  },
  {
    Age: 32,
    Gender: 'Female',
    Region: 'Europe',
    Stress_Level: 8,
    Anxiety_Level: 7,
    Depression_Level: 6,
    Sleep_Duration: 5.5,
    Exercise_Frequency: 2,
    Social_Media_Usage: 5,
    Work_Hours: 50,
    Financial_Stress: 'Yes',
    Relationship_Issues: 'Yes',
  },
  {
    Age: 45,
    Gender: 'Male',
    Region: 'Asia',
    Stress_Level: 6,
    Anxiety_Level: 4,
    Depression_Level: 3,
    Sleep_Duration: 7,
    Exercise_Frequency: 4,
    Social_Media_Usage: 2,
    Work_Hours: 40,
    Financial_Stress: 'No',
    Relationship_Issues: 'No',
  },
  {
    Age: 29,
    Gender: 'Female',
    Region: 'South America',
    Stress_Level: 9,
    Anxiety_Level: 8,
    Depression_Level: 7,
    Sleep_Duration: 5,
    Exercise_Frequency: 1,
    Social_Media_Usage: 6,
    Work_Hours: 55,
    Financial_Stress: 'Yes',
    Relationship_Issues: 'Yes',
  },
  {
    Age: 38,
    Gender: 'Male',
    Region: 'Australia',
    Stress_Level: 5,
    Anxiety_Level: 3,
    Depression_Level: 2,
    Sleep_Duration: 7.5,
    Exercise_Frequency: 5,
    Social_Media_Usage: 3,
    Work_Hours: 38,
    Financial_Stress: 'No',
    Relationship_Issues: 'No',
  },
  {
    Age: 52,
    Gender: 'Female',
    Region: 'Africa',
    Stress_Level: 7,
    Anxiety_Level: 6,
    Depression_Level: 5,
    Sleep_Duration: 6,
    Exercise_Frequency: 2,
    Social_Media_Usage: 1,
    Work_Hours: 42,
    Financial_Stress: 'Yes',
    Relationship_Issues: 'No',
  },
  {
    Age: 22,
    Gender: 'Male',
    Region: 'North America',
    Stress_Level: 8,
    Anxiety_Level: 7,
    Depression_Level: 6,
    Sleep_Duration: 5.5,
    Exercise_Frequency: 3,
    Social_Media_Usage: 7,
    Work_Hours: 30,
    Financial_Stress: 'Yes',
    Relationship_Issues: 'Yes',
  },
  {
    Age: 41,
    Gender: 'Female',
    Region: 'Europe',
    Stress_Level: 6,
    Anxiety_Level: 5,
    Depression_Level: 4,
    Sleep_Duration: 6.5,
    Exercise_Frequency: 4,
    Social_Media_Usage: 3,
    Work_Hours: 45,
    Financial_Stress: 'No',
    Relationship_Issues: 'No',
  },
  {
    Age: 56,
    Gender: 'Male',
    Region: 'Europe',
    Stress_Level: 10,
    Anxiety_Level: 8,
    Depression_Level: 5,
    Sleep_Duration: 5.6,
    Exercise_Frequency: 5,
    Social_Media_Usage: 4,
    Work_Hours: 51,
    Financial_Stress: 'Yes',
    Relationship_Issues: 'Yes',
  },
];
const AnalysisPage = () => {
  const regionCounts: { [key: string]: number } = {};
  sampleData.forEach((d) => {
    regionCounts[d.Region] = (regionCounts[d.Region] || 0) + d.Stress_Level;
  });
  return (
    <MainLayout>
      <div className="dashboard">
        <h1 className="text-3xl font-bold mb-6"></h1>
        <div className="chart-container">
          <Plot
            className="chart-box"
            data={[
              {
                x: [
                  'Relationship Issues',
                  'Financial Stress',
                  'Work > 45 hrs',
                  'Sleep < 6 hrs',
                  'Exercise < 3',
                ],
                y: [
                  sampleData.filter((d) => d.Relationship_Issues === 'Yes')
                    .length,
                  sampleData.filter((d) => d.Financial_Stress === 'Yes')
                    .length,
                  sampleData.filter((d) => d.Work_Hours > 45).length,
                  sampleData.filter((d) => d.Sleep_Duration < 6).length,
                  sampleData.filter((d) => d.Exercise_Frequency < 3).length,
                ],
                type: 'bar',
                marker: { color: 'teal' },
              },
            ]}
            layout={{ title: 'Major Causes of Stress' }}
          />
          <Plot
            className="chart-box"
            data={[
              {
                x: sampleData.map((d) => d.Age),
                y: sampleData.map((d) => d.Stress_Level),
                type: 'scatter',
                mode: 'lines+markers',
                line: { color: 'purple' },
              },
            ]}
            layout={{ title: 'Stress Level by Age' }}
          />
          <Plot
            className="chart-box"
            data={[
              {
                x: sampleData.map((d) => d.Sleep_Duration),
                y: sampleData.map((d) => d.Stress_Level),
                mode: 'markers',
                marker: {
                  size: sampleData.map((d) => d.Anxiety_Level * 4),
                  color: sampleData.map((d) => d.Depression_Level),
                  colorscale: 'Portland',
                  showscale: true,
                },
              },
            ]}
            layout={{
              title: 'Stress vs Sleep Duration (Bubble Chart)',
              xaxis: { title: 'Sleep Duration' },
              yaxis: { title: 'Stress Level' },
            }}
          />
          <Plot
            className="chart-box"
            data={[
              {
                type: 'pie',
                labels: Object.keys(regionCounts),
                values: Object.values(regionCounts),
                textinfo: "label+percent",
                hole: 0.4,
              },
            ]}
            layout={{ title: 'Stress Distribution by Region' }}
          />
          <Plot
            className="chart-box"
            data={[
              {
                y: sampleData.map((d) => d.Stress_Level),
                x: sampleData.map((d) => d.Exercise_Frequency),
                type: 'box',
                marker: { color: 'green' },
              },
            ]}
            layout={{
              title: 'Exercise Frequency vs Stress Level',
              xaxis: { title: 'Exercise Frequency' },
              yaxis: { title: 'Stress Level' },
            }}
          />
          <Plot
            className="chart-box"
            data={[
              {
                z: sampleData.map((d) => [d.Anxiety_Level, d.Depression_Level]),
                x: ['Anxiety', 'Depression'],
                y: sampleData.map((_, i) => `User ${i + 1}`),
                type: 'heatmap',
                colorscale: 'YlOrRd',
              },
            ]}
            layout={{ title: 'Social Media Users: Anxiety & Depression Heatmap' }}
          />
        </div>
      </div>
    </MainLayout>
  );
};
export default AnalysisPage;
