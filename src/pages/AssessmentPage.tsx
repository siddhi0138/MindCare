
import MainLayout from "@/components/layout/MainLayout";
import AssessmentHub from "@/components/assessment/AssessmentHub";

const AssessmentPage = () => {
  return (
    <MainLayout>
      <div className="container py-6">
        <AssessmentHub />
      </div>
    </MainLayout>
  );
};

export default AssessmentPage;
