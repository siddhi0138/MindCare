
import MainLayout from "@/components/layout/MainLayout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { AlertCircle } from "lucide-react";

const CommunityPage = () => {
  return (
    <MainLayout>
      <div className="container py-6 space-y-8">
        <div className="max-w-3xl mx-auto">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Community Features Unavailable</AlertTitle>
            <AlertDescription>
              Community features are currently under development. Please check back later.
            </AlertDescription>
          </Alert>

          <Card className="mt-8">
            <CardHeader>
              <CardTitle>Community Features</CardTitle>
              <CardDescription>
                These features will be available in a future update:
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <ul className="list-disc list-inside space-y-2 text-muted-foreground">
                <li>Support Groups</li>
                <li>Chat Rooms</li>
                <li>Events & Workshops</li>
                <li>Community Forums</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </MainLayout>
  );
};

export default CommunityPage;
