import React, { useEffect, useState } from 'react';
import Plot from 'react-plotly.js';
import { useAuth } from '@/contexts/AuthContext';
import { saveUserActivity } from '@/configs/firebase';
import MainLayout from '@/components/layout/MainLayout';
import LifestyleRiskPredictor from '@/components/assessment/LifestyleRiskPredictor';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

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

const AnalysisPageUpdated = () => {
  const { currentUser } = useAuth();
  const [sampleData, setSampleData] = useState<DataPoint[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const recordVisit = async () => {
      if (currentUser) {
        const timestamp = new Date().toISOString();
        const activityData = {
          userId: currentUser.id,
          timestamp,
          activityType: "visit-analysis-page",
          activityName: "",
          pageName: "AnalysisPage",
        };
        await saveUserActivity(activityData);
      }
    };
    recordVisit();
  }, [currentUser]);

  useEffect(() => {
    const loadDataset = async () => {
      try {
        const res = await fetch(`${API_BASE_URL}/wellness-dataset-sample?n=300`);
        if (res.ok) setSampleData(await res.json());
      } catch (error) {
        console.error('Error loading wellness dataset:', error);
      } finally {
        setIsLoading(false);
      }
    };
    loadDataset();
  }, []);

  const regionCounts: { [key: string]: number } = {};
  sampleData.forEach((d) => {
    regionCounts[d.Region] = (regionCounts[d.Region] || 0) + d.Stress_Level;
  });

  if (isLoading) {
    return (
      <MainLayout>
        <div className="flex items-center justify-center py-24 text-muted-foreground">
          Loading population analytics...
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <style>{`
        .chart-container {
          display: flex;
          flex-wrap: wrap;
          justify-content: space-between;
          padding: 60px;
          gap: 25px;
        }
        .chart-box {
          width: 48%;
          display: flex;
          flex-direction: column;
          align-items: center;
        }
        .chart-title {
          margin-top: 10px;
          font-weight: bold;
          text-align: center;
          font-size: 16px;
        }
        @media (max-width: 768px) {
          .chart-box {
            width: 100%;
          }
        }
      `}</style>
      <div className="dashboard px-6 md:px-12">
        <h1 className="text-3xl font-bold mb-2">Wellness Analytics</h1>
        <p className="text-sm text-muted-foreground mb-6 max-w-2xl">
          Population-level patterns from a synthetic wellness dataset (not real patient data), powering the
          machine learning model used below to estimate your own risk from lifestyle factors.
        </p>
        <div className="chart-container">
          <div className="chart-box">
            <Plot
              style={{ width: '100%' }}
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
              layout={{ margin: { t: 30, b: 30 } }}
            />
            <div className="chart-title">Major Causes of Stress</div>
          </div>
          
          <div className="chart-box">
            <Plot
              style={{ width: '100%' }}
              data={[
                {
                  x: sampleData.map((d) => d.Age),
                  y: sampleData.map((d) => d.Stress_Level),
                  type: 'scatter',
                  mode: 'lines+markers',
                  line: { color: 'purple' },
                },
              ]}
              layout={{ margin: { t: 30, b: 30 } }}
            />
            <div className="chart-title">Stress Level by Age</div>
          </div>
          
          <div className="chart-box">
            <Plot
              style={{ width: '100%' }}
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
                xaxis: { title: 'Sleep Duration' },
                yaxis: { title: 'Stress Level' },
                margin: { t: 30, b: 30 },
              }}
            />
            <div className="chart-title">Stress vs Sleep Duration (Bubble Chart)</div>
          </div>
          
          <div className="chart-box">
            <Plot
              style={{ width: '100%' }}
              data={[
                {
                  type: 'pie',
                  labels: Object.keys(regionCounts),
                  values: Object.values(regionCounts),
                  textinfo: "label+percent",
                  hole: 0.4,
                },
              ]}
              layout={{ margin: { t: 30, b: 30 } }}
            />
            <div className="chart-title">Stress Distribution by Region</div>
          </div>
          
          <div className="chart-box">
            <Plot
              style={{ width: '100%' }}
              data={[
                {
                  y: sampleData.map((d) => d.Stress_Level),
                  x: sampleData.map((d) => d.Exercise_Frequency),
                  type: 'box',
                  marker: { color: 'green' },
                },
              ]}
              layout={{
                xaxis: { title: 'Exercise Frequency' },
                yaxis: { title: 'Stress Level' },
                margin: { t: 30, b: 30 },
              }}
            />
            <div className="chart-title">Exercise Frequency vs Stress Level</div>
          </div>
          
          <div className="chart-box">
            <Plot
              style={{ width: '100%' }}
              data={[
                {
                  z: sampleData.map((d) => [d.Anxiety_Level, d.Depression_Level]),
                  x: ['Anxiety', 'Depression'],
                  y: sampleData.map((_, i) => `User ${i + 1}`),
                  type: 'heatmap',
                  colorscale: 'YlOrRd',
                },
              ]}
              layout={{ margin: { t: 30, b: 30 } }}
            />
            <div className="chart-title">Social Media Users: Anxiety & Depression Heatmap</div>
          </div>
        </div>

        <div className="mt-4 mb-12">
          <LifestyleRiskPredictor />
        </div>
      </div>
    </MainLayout>
  );
};
export default AnalysisPageUpdated;