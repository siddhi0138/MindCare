import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Slider } from '@/components/ui/slider';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Badge } from '@/components/ui/badge';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Info, Sparkles, History } from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/contexts/AuthContext';
import { recordActivity } from '@/hooks/use-toast';
import {
  saveWellnessPrediction,
  getLatestWellnessPrediction,
  getWellnessPredictions,
  deleteWellnessPredictions,
} from '@/configs/firebase';
import ClearHistoryButton from '@/components/common/ClearHistoryButton';
import { Timestamp } from 'firebase/firestore';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';

interface RiskScore {
  score: number;
  level: string;
}

interface RiskResult {
  stress: RiskScore;
  anxiety: RiskScore;
  depression: RiskScore;
}

interface PredictionHistoryEntry extends RiskResult {
  id: string;
  timestamp: Timestamp;
}

const levelColor = (level: string) => {
  if (level === 'Low') return 'bg-emerald-500 hover:bg-emerald-600';
  if (level === 'Moderate') return 'bg-amber-500 hover:bg-amber-600';
  return 'bg-red-500 hover:bg-red-600';
};

const LifestyleRiskPredictor = () => {
  const { currentUser } = useAuth();
  const [age, setAge] = useState(30);
  const [gender, setGender] = useState('Female');
  const [region, setRegion] = useState('North America');
  const [sleepDuration, setSleepDuration] = useState(7);
  const [exerciseFrequency, setExerciseFrequency] = useState(3);
  const [socialMediaUsage, setSocialMediaUsage] = useState(3);
  const [workHours, setWorkHours] = useState(40);
  const [financialStress, setFinancialStress] = useState('No');
  const [relationshipIssues, setRelationshipIssues] = useState('No');
  const [supportSystem, setSupportSystem] = useState(6);
  const [selfCareActivities, setSelfCareActivities] = useState(3);

  const [result, setResult] = useState<RiskResult | null>(null);
  const [isPredicting, setIsPredicting] = useState(false);
  const [showHistory, setShowHistory] = useState(false);
  const [history, setHistory] = useState<PredictionHistoryEntry[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);

  const loadHistory = () => {
    if (!currentUser) return;
    setIsLoadingHistory(true);
    getWellnessPredictions(currentUser.id).then((predictions) => {
      setHistory(predictions);
      setIsLoadingHistory(false);
    });
  };

  const toggleHistory = () => {
    const next = !showHistory;
    setShowHistory(next);
    if (next) loadHistory();
  };

  // Restores the last prediction (inputs + result) so it survives a refresh instead of vanishing
  useEffect(() => {
    if (!currentUser) return;
    getLatestWellnessPrediction(currentUser.id).then((prediction) => {
      if (!prediction) return;
      setAge(prediction.age);
      setGender(prediction.gender);
      setRegion(prediction.region);
      setSleepDuration(prediction.sleepDuration);
      setExerciseFrequency(prediction.exerciseFrequency);
      setSocialMediaUsage(prediction.socialMediaUsage);
      setWorkHours(prediction.workHours);
      setFinancialStress(prediction.financialStress);
      setRelationshipIssues(prediction.relationshipIssues);
      setSupportSystem(prediction.supportSystem);
      setSelfCareActivities(prediction.selfCareActivities);
      setResult({ stress: prediction.stress, anxiety: prediction.anxiety, depression: prediction.depression });
    });
  }, [currentUser]);

  const handlePredict = async () => {
    setIsPredicting(true);
    setResult(null);
    try {
      const res = await fetch(`${API_BASE_URL}/predict-wellness-risk`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          age,
          gender,
          region,
          sleep_duration: sleepDuration,
          exercise_frequency: exerciseFrequency,
          social_media_usage: socialMediaUsage,
          work_hours: workHours,
          financial_stress: financialStress,
          relationship_issues: relationshipIssues,
          support_system: supportSystem,
          self_care_activities: selfCareActivities,
        }),
      });
      if (!res.ok) throw new Error(`Request failed with status ${res.status}`);
      const data = await res.json();
      setResult(data);
      if (currentUser) {
        saveWellnessPrediction({
          age,
          gender,
          region,
          sleepDuration,
          exerciseFrequency,
          socialMediaUsage,
          workHours,
          financialStress,
          relationshipIssues,
          supportSystem,
          selfCareActivities,
          stress: data.stress,
          anxiety: data.anxiety,
          depression: data.depression,
        });
        recordActivity(
          'predict',
          `Predicted wellness risk (stress: ${data.stress.level}, anxiety: ${data.anxiety.level}, depression: ${data.depression.level})`,
          'AnalysisPage'
        );
        if (showHistory) loadHistory();
      }
    } catch (error) {
      console.error('Error predicting wellness risk:', error);
      toast.error('Prediction failed', { description: 'Could not reach the prediction model. Please try again.' });
    } finally {
      setIsPredicting(false);
    }
  };

  return (
    <Card className="border-primary/10">
      <CardHeader>
        <CardTitle className="flex items-center gap-2">
          <Sparkles size={18} className="text-primary" />
          Lifestyle Risk Predictor
        </CardTitle>
        <CardDescription>
          A machine learning model estimates your stress, anxiety, and depression risk from lifestyle factors —
          separate from the questionnaires above.
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-6">
        <Alert>
          <Info className="h-4 w-4" />
          <AlertDescription>
            This model is trained on synthetic demo data for illustration purposes, not real clinical records.
            It's a lifestyle-pattern estimate, not a diagnosis.
          </AlertDescription>
        </Alert>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div className="space-y-2">
            <label className="text-sm font-medium">Age: {age}</label>
            <Slider value={[age]} min={18} max={70} step={1} onValueChange={(v) => setAge(v[0])} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Gender</label>
            <Select value={gender} onValueChange={setGender}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="Female">Female</SelectItem>
                <SelectItem value="Male">Male</SelectItem>
                <SelectItem value="Other">Other</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Region</label>
            <Select value={region} onValueChange={setRegion}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="North America">North America</SelectItem>
                <SelectItem value="Europe">Europe</SelectItem>
                <SelectItem value="Asia">Asia</SelectItem>
                <SelectItem value="Africa">Africa</SelectItem>
                <SelectItem value="South America">South America</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Sleep duration: {sleepDuration}h/night</label>
            <Slider value={[sleepDuration]} min={3} max={10} step={0.5} onValueChange={(v) => setSleepDuration(v[0])} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Exercise: {exerciseFrequency}x/week</label>
            <Slider value={[exerciseFrequency]} min={0} max={7} step={1} onValueChange={(v) => setExerciseFrequency(v[0])} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Social media: {socialMediaUsage}h/day</label>
            <Slider value={[socialMediaUsage]} min={0} max={10} step={0.5} onValueChange={(v) => setSocialMediaUsage(v[0])} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Work hours: {workHours}h/week</label>
            <Slider value={[workHours]} min={20} max={80} step={1} onValueChange={(v) => setWorkHours(v[0])} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Support system strength: {supportSystem}/10</label>
            <Slider value={[supportSystem]} min={1} max={10} step={1} onValueChange={(v) => setSupportSystem(v[0])} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Self-care activities: {selfCareActivities}/week</label>
            <Slider value={[selfCareActivities]} min={0} max={6} step={1} onValueChange={(v) => setSelfCareActivities(v[0])} />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Financial stress</label>
            <Select value={financialStress} onValueChange={setFinancialStress}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="No">No</SelectItem>
                <SelectItem value="Yes">Yes</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Relationship issues</label>
            <Select value={relationshipIssues} onValueChange={setRelationshipIssues}>
              <SelectTrigger><SelectValue /></SelectTrigger>
              <SelectContent>
                <SelectItem value="No">No</SelectItem>
                <SelectItem value="Yes">Yes</SelectItem>
              </SelectContent>
            </Select>
          </div>
        </div>

        <div className="flex gap-2">
          <Button onClick={handlePredict} disabled={isPredicting} className="w-full">
            {isPredicting ? 'Predicting...' : 'Predict My Risk'}
          </Button>
          {currentUser && (
            <Button variant="outline" onClick={toggleHistory} className="flex items-center gap-2 shrink-0">
              <History className="h-4 w-4" />
              {showHistory ? 'Hide History' : 'View History'}
            </Button>
          )}
        </div>

        {result && (
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2">
            {(['stress', 'anxiety', 'depression'] as const).map((key) => (
              <div key={key} className="border rounded-lg p-4 text-center space-y-2">
                <p className="text-sm font-medium capitalize text-muted-foreground">{key}</p>
                <p className="text-2xl font-bold">{result[key].score}/10</p>
                <Badge className={levelColor(result[key].level)}>{result[key].level}</Badge>
              </div>
            ))}
          </div>
        )}

        {showHistory && currentUser && (
          <div className="space-y-3 pt-4 border-t">
            <div className="flex items-center justify-between">
              <h4 className="font-medium">Past Predictions</h4>
              {history.length > 0 && (
                <ClearHistoryButton
                  itemLabel="predictions"
                  pageName="AnalysisPage"
                  onConfirm={() => deleteWellnessPredictions(currentUser.id)}
                  onCleared={() => setHistory([])}
                />
              )}
            </div>
            {isLoadingHistory ? (
              <p className="text-sm text-muted-foreground">Loading history...</p>
            ) : history.length === 0 ? (
              <p className="text-sm text-muted-foreground">No past predictions yet.</p>
            ) : (
              <div className="space-y-2">
                {history.map((entry) => (
                  <div key={entry.id} className="flex items-center justify-between border rounded-lg p-3 text-sm">
                    <span className="text-muted-foreground">{entry.timestamp.toDate().toLocaleString()}</span>
                    <div className="flex gap-2">
                      <Badge className={levelColor(entry.stress.level)}>Stress: {entry.stress.level}</Badge>
                      <Badge className={levelColor(entry.anxiety.level)}>Anxiety: {entry.anxiety.level}</Badge>
                      <Badge className={levelColor(entry.depression.level)}>Depression: {entry.depression.level}</Badge>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default LifestyleRiskPredictor;
