import { useState } from 'react';
import { saveUserActivity } from '@/configs/firebase';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import * as Icons from 'lucide-react';
import AnxietyAssessment from './AnxietyAssessment';
import DepressionAssessment from './DepressionAssessment';
import StressAssessment from './StressAssessment';
import AssessmentHistory from './AssessmentHistory';
import { AssessmentResult } from './AssessmentResult';
import { useAuth } from '@/contexts/AuthContext';
import { saveAssessmentResult } from '@/configs/firebase';

export type AssessmentType = 'anxiety' | 'depression' | 'stress';

const AssessmentHub = () => {
  const { isAuthenticated, currentUser } = useAuth();
  const userId = currentUser?.id;
  const [activeTab, setActiveTab] = useState<AssessmentType | 'history'>('anxiety');
  const [isAssessing, setIsAssessing] = useState(false);
  const [result, setResult] = useState<{score: number, level: string, recommendations: string[]} | null>(null);
  
  const startAssessment = (type: AssessmentType) => {
    setActiveTab(type);
    const timestamp = new Date().toISOString();
    if(userId){
    const activityData = {
      userId,
      timestamp,
      activityType: "start-assessment",
      activityName: type,
      pageName: "AssessmentPage",
    };
    saveUserActivity(activityData);}
    setIsAssessing(true);
    setResult(null);
  };
  
  const handleAssessmentComplete = (score: number) => {
    // Determine level and recommendations based on score
    let level = '';
    let recommendations = [];
    
    if (score < 5) {
      level = 'Low';
      recommendations = [
        'Maintain your current self-care practices',
        'Continue mindfulness exercises',
        'Regular check-ins for preventative care',
      ];
    } else if (score < 10) {
      level = 'Moderate';
      recommendations = [
        'Consider talking to a therapist',
        'Practice daily meditation',
        'Engage in regular physical activity',
        'Explore stress management techniques',
      ];
    } else {
      level = 'High';
      recommendations = [
        'Reach out to a mental health professional',
        'Try guided breathing exercises',
        'Establish a consistent sleep schedule',
        'Consider joining a support group',
        'Use the SOS feature for immediate support if needed',
      ];
    }
    
    setResult({ score, level, recommendations });
    setIsAssessing(false);
  };

  // Function to reset the result to null
  const handleRestartAssessment = () => {
    setResult(null);
    setIsAssessing(false);
  };

  // Function to save assessment result to Firestore
  const handleSaveResults = async () => {
    if (!currentUser || !result) return;
    const saveResult = {
      userId: currentUser.id,
      type: activeTab,
      score: result.score,
      level: result.level,
      recommendations: result.recommendations,
    };
    const response = await saveAssessmentResult(saveResult);
    if (response.success) {
      alert('Assessment result saved successfully.');
    } else {
      alert('Failed to save assessment result.');
    }
  };

  return (
    <div className="space-y-6">
      {!isAssessing && !result && (
        <>
          <div className="flex items-center justify-between">
            <h2 className="text-2xl font-bold">Mental Health Assessments</h2>
          </div>
          
          <p className="text-muted-foreground">
            These self-assessment tools can help you evaluate your current mental wellbeing. 
            Remember, they are not a substitute for professional diagnosis.
          </p>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Anxiety Assessment</CardTitle>
                <CardDescription>
                  Evaluate symptoms of generalized anxiety disorder
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  This 7-question assessment measures the severity of anxiety symptoms over the past two weeks.
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => startAssessment('anxiety')}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Icons.Activity className="h-4 w-4" />
                  Start Assessment
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Depression Assessment</CardTitle>
                <CardDescription>
                  Screen for depression and monitor treatment
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  This 9-question assessment helps identify depression symptoms and their severity.
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => startAssessment('depression')}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Icons.Activity className="h-4 w-4" />
                  Start Assessment
                </Button>
              </CardFooter>
            </Card>
            
            <Card>
              <CardHeader>
                <CardTitle>Stress Assessment </CardTitle>
                <CardDescription>
                  Measure your perception of stress
                </CardDescription>
              </CardHeader>
              <CardContent>
                <p className="text-sm text-muted-foreground">
                  This 10-question assessment evaluates how stressful you find situations in your life.
                </p>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => startAssessment('stress')}
                  className="w-full flex items-center justify-center gap-2"
                >
                  <Icons.Activity className="h-4 w-4" />
                  Start Assessment
                </Button>
              </CardFooter>
            </Card>
          </div>
          
          <Card className="bg-muted/50 border-dashed">
            <CardContent className="p-4">
              <div className="flex items-start gap-4">
                <Icons.AlertCircle className="h-5 w-5 text-muted-foreground mt-0.5" />
                <div>
                  <h3 className="font-medium mb-1">Important Note</h3>
                  <p className="text-sm text-muted-foreground">
                    These assessments are meant to be educational and provide guidance. They are not a substitute for professional evaluation. 
                    If you're experiencing severe symptoms, please contact a healthcare provider or use the emergency SOS feature.
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>
          {isAuthenticated && (
            <div className="flex justify-end">
              <Button 
                variant="outline"
                onClick={() => {
                  setActiveTab('history');
                  const timestamp = new Date().toISOString();
                  if (userId) {
                    const activityData = {
                      userId,
                      timestamp,
                      activityType: 'view-assessment-history',
                      activityName: 'Assessment History',
                      pageName: 'AssessmentPage',
                    };
                    saveUserActivity(activityData);
                  }
                }}
                className="flex items-center gap-2"
              >
                <Icons.LineChart className="h-4 w-4" />
                View History
              </Button>
            </div>
          )}
        </>
      )}
      
      {isAssessing && (
        <Card>
          <CardHeader>
            <CardTitle>
              {activeTab === 'anxiety' && 'Anxiety Assessment'}
              {activeTab === 'depression' && 'Depression Assessment '}
              {activeTab === 'stress' && 'Stress Assessment'}
            </CardTitle>
            <CardDescription>
              Answer each question based on how you've felt over the past two weeks.
            </CardDescription>
          </CardHeader>
          <CardContent>
            {activeTab === 'anxiety' && (
              <AnxietyAssessment onComplete={handleAssessmentComplete} />
            )}
            {activeTab === 'depression' && (
              <DepressionAssessment onComplete={handleAssessmentComplete} />
            )}
            {activeTab === 'stress' && (
              <StressAssessment onComplete={handleAssessmentComplete} />
            )}
          </CardContent>
        </Card>
      )}
      
      {result && (
        <AssessmentResult 
          type={activeTab as AssessmentType}
          score={result.score}
          level={result.level}
          recommendations={result.recommendations}
          onRestart={handleRestartAssessment}
          onSaveResults={handleSaveResults}
        />
      )}
      
      {activeTab === 'history' && (
        <AssessmentHistory onSelectAssessment={startAssessment} />
      )}
    </div>
  );
};

export default AssessmentHub;