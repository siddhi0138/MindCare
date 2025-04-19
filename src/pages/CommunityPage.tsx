
import MainLayout from "@/components/layout/MainLayout";
import CommunityHub from "@/components/community/CommunityHub";
import { useAuth } from "@/contexts/AuthContext";

const CommunityPage = () => {
  const { isAuthenticated } = useAuth();

  return (
    <MainLayout>
      <div className="container py-6 space-y-8">
        <CommunityHub />
        
        {isAuthenticated && (
          <div className="p-4 bg-primary-foreground rounded-lg border">
            <h2 className="text-lg font-medium mb-2">Community Guidelines</h2>
            <ul className="list-disc list-inside space-y-1 text-sm text-muted-foreground">
              <li>Be respectful and kind to fellow community members</li>
              <li>Maintain confidentiality - what's shared here stays here</li>
              <li>Avoid giving medical advice - suggest seeking professional help instead</li>
              <li>Focus on support, not diagnosis</li>
              <li>Report any concerning content to moderators</li>
            </ul>
          </div>
        )}
      </div>
    </MainLayout>
  );
};

export default CommunityPage;
