
import MainLayout from "@/components/layout/MainLayout";
import CommunityHub from "@/components/community/CommunityHub";

const CommunityPage = () => {
  return (
    <MainLayout>
      <div className="container py-6">
        <CommunityHub />
      </div>
    </MainLayout>
  );
};

export default CommunityPage;
