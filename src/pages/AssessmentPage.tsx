
import MainLayout from '@/components/layout/MainLayout';
import AssessmentHub from '@/components/assessment/AssessmentHub';
import { useToast } from '@/hooks/use-toast';
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

const AssessmentPage = () => {
  const { currentUser } = useAuth();
  const { recordActivity } = useToast();

  useEffect(() => {
    const recordVisit = async() => {
      if (currentUser) {
        await recordActivity("view", " Visited Assessment Page", "AssessmentPage");
      }
    };
    recordVisit();
  }, [currentUser, recordActivity]);

  return (

    <MainLayout>
      <div className="container py-6">
        <AssessmentHub />
      </div>
    </MainLayout>
  );
};

export default AssessmentPage;
