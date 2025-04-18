
import MainLayout from "@/components/layout/MainLayout";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { BrainCircuit, Activity, LineChart } from "lucide-react";
import DepressionAssessment from "@/components/assessment/DepressionAssessment";
import AnxietyAssessment from "@/components/assessment/AnxietyAssessment";
import StressAssessment from "@/components/assessment/StressAssessment";
import AssessmentHistory from "@/components/assessment/AssessmentHistory";

const AssessmentPage = () => {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <h1 className="text-3xl font-bold mb-6">Mental Health Assessment</h1>
        <p className="text-muted-foreground mb-8">
          These scientifically validated assessments can help you understand your current mental health state.
          Results are stored privately and can help track your progress over time.
        </p>

        <Tabs defaultValue="depression" className="w-full">
          <TabsList className="grid grid-cols-4 mb-8">
            <TabsTrigger value="depression" className="flex items-center gap-2">
              <BrainCircuit className="h-4 w-4" />
              <span>Depression</span>
            </TabsTrigger>
            <TabsTrigger value="anxiety" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span>Anxiety</span>
            </TabsTrigger>
            <TabsTrigger value="stress" className="flex items-center gap-2">
              <Activity className="h-4 w-4" />
              <span>Stress</span>
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <LineChart className="h-4 w-4" />
              <span>History</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="depression">
            <DepressionAssessment />
          </TabsContent>
          
          <TabsContent value="anxiety">
            <AnxietyAssessment />
          </TabsContent>
          
          <TabsContent value="stress">
            <StressAssessment />
          </TabsContent>
          
          <TabsContent value="history">
            <AssessmentHistory />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default AssessmentPage;
