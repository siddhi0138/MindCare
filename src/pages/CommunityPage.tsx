import React, { useEffect } from 'react';
import MainLayout from "@/components/layout/MainLayout";
import CommunityHub from "@/components/community/CommunityHub";
import { useAuth } from '@/contexts/AuthContext';
import { recordActivity } from '@/hooks/use-toast';

const CommunityPage = () => {
  const { currentUser } = useAuth();
  useEffect(() => {
    const recordVisit = async () => {
      if (currentUser) {
        await recordActivity('visit-community-page', 'Visit Community Page', 'CommunityPage');
      }
    };
    recordVisit();
  }, [currentUser]);




  return (
    <MainLayout>
      <div className="container py-6">
        <CommunityHub />
      </div>
    </MainLayout>
  );
};

export default CommunityPage;
