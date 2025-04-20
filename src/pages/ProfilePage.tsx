
import { useState, useEffect } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import MainLayout from '@/components/layout/MainLayout';
import ProfileSettings from '@/components/profile/ProfileSettings';
import ProgressDashboard from '@/components/dashboard/ProgressDashboard';
import CustomReminders from '@/components/dashboard/CustomReminders';
import { useAuth } from '@/contexts/AuthContext';

const ProfilePage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { user } = useAuth();
  
  // Extract tab from URL query params
  const queryParams = new URLSearchParams(location.search);
  const tabParam = queryParams.get('tab');
  
  // Set default tab based on URL or use 'settings'
  const [activeTab, setActiveTab] = useState<string>(tabParam || 'settings');
  
  // Update URL when tab changes
  useEffect(() => {
    if (activeTab) {
      navigate(`/profile?tab=${activeTab}`, { replace: true });
    }
  }, [activeTab, navigate]);

  return (
    <MainLayout>
      <div className="container w-full py-6">
        <h1 className="text-3xl font-bold mb-6">My Profile</h1>
        
        <Tabs value={activeTab} onValueChange={setActiveTab}>
          <TabsList className="mb-6">
            <TabsTrigger value="settings">Settings</TabsTrigger>
            <TabsTrigger value="progress">Progress Dashboard</TabsTrigger>
            <TabsTrigger value="reminders">Reminders</TabsTrigger>
          </TabsList>
          
          <TabsContent value="settings">
            <ProfileSettings />
          </TabsContent>
          
          <TabsContent value="progress">
            {/* Pass userId as an optional prop */}
            <ProgressDashboard userId={user?.id} />
          </TabsContent>
          
          <TabsContent value="reminders">
            <CustomReminders />
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default ProfilePage;
