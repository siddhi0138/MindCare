
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import { useAuth } from "@/contexts/AuthContext";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Label } from "@/components/ui/label";
import { Switch } from "@/components/ui/switch";
import { toast } from "@/components/ui/sonner";
import { User, Settings, Bell, Shield, LogOut } from "lucide-react";
import ProgressDashboard from "@/components/dashboard/ProgressDashboard";
import CustomReminders from "@/components/dashboard/CustomReminders";

const ProfilePage = () => {
  const { user, logout } = useAuth();
  
  const [profileData, setProfileData] = useState({
    firstName: user?.firstName || "",
    lastName: user?.lastName || "",
    email: user?.email || "",
    phone: "",
    bio: ""
  });

  const [notificationSettings, setNotificationSettings] = useState({
    emailNotifications: true,
    pushNotifications: true,
    reminderAlerts: true,
    marketingEmails: false
  });

  const handleUpdateProfile = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would update the user profile via an API
    toast.success("Profile updated successfully");
  };

  const handleUpdateNotifications = (e: React.FormEvent) => {
    e.preventDefault();
    
    // In a real app, this would update notification settings via an API
    toast.success("Notification settings updated");
  };

  const getInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
    }
    return "U";
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <div className="flex items-center gap-4">
            <Avatar className="h-16 w-16">
              <AvatarImage src={user?.profileImage} alt={`${user?.firstName} ${user?.lastName}`} />
              <AvatarFallback>{getInitials()}</AvatarFallback>
            </Avatar>
            <div>
              <h1 className="text-3xl font-bold">{user?.firstName} {user?.lastName}</h1>
              <p className="text-muted-foreground">{user?.email}</p>
            </div>
          </div>
          <Button variant="outline" className="flex items-center gap-2" onClick={logout}>
            <LogOut className="h-4 w-4" />
            Sign Out
          </Button>
        </div>
        
        <Tabs defaultValue="progress" className="w-full">
          <TabsList className="grid grid-cols-4 w-full mb-8">
            <TabsTrigger value="progress" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span>Progress Dashboard</span>
            </TabsTrigger>
            <TabsTrigger value="reminders" className="flex items-center gap-2">
              <Bell className="h-4 w-4" />
              <span>Reminders</span>
            </TabsTrigger>
            <TabsTrigger value="account" className="flex items-center gap-2">
              <Settings className="h-4 w-4" />
              <span>Account Settings</span>
            </TabsTrigger>
            <TabsTrigger value="privacy" className="flex items-center gap-2">
              <Shield className="h-4 w-4" />
              <span>Privacy & Data</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="progress">
            <ProgressDashboard />
          </TabsContent>
          
          <TabsContent value="reminders">
            <CustomReminders />
          </TabsContent>
          
          <TabsContent value="account">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
              <Card className="border-primary/10">
                <CardHeader>
                  <CardTitle>Profile Information</CardTitle>
                  <CardDescription>
                    Update your personal information and account details
                  </CardDescription>
                </CardHeader>
                <form onSubmit={handleUpdateProfile}>
                  <CardContent className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="firstName">First Name</Label>
                        <Input 
                          id="firstName" 
                          value={profileData.firstName}
                          onChange={(e) => setProfileData({...profileData, firstName: e.target.value})}
                        />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="lastName">Last Name</Label>
                        <Input 
                          id="lastName" 
                          value={profileData.lastName}
                          onChange={(e) => setProfileData({...profileData, lastName: e.target.value})}
                        />
                      </div>
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="email">Email</Label>
                      <Input 
                        id="email" 
                        type="email" 
                        value={profileData.email}
                        onChange={(e) => setProfileData({...profileData, email: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="phone">Phone (optional)</Label>
                      <Input 
                        id="phone" 
                        type="tel" 
                        value={profileData.phone}
                        onChange={(e) => setProfileData({...profileData, phone: e.target.value})}
                      />
                    </div>
                    
                    <div className="space-y-2">
                      <Label htmlFor="bio">Bio (optional)</Label>
                      <Input 
                        id="bio" 
                        value={profileData.bio}
                        onChange={(e) => setProfileData({...profileData, bio: e.target.value})}
                      />
                    </div>
                  </CardContent>
                  <CardFooter>
                    <Button type="submit">Save Changes</Button>
                  </CardFooter>
                </form>
              </Card>
              
              <div className="space-y-8">
                <Card className="border-primary/10">
                  <CardHeader>
                    <CardTitle>Notification Settings</CardTitle>
                    <CardDescription>
                      Configure how and when you receive notifications
                    </CardDescription>
                  </CardHeader>
                  <form onSubmit={handleUpdateNotifications}>
                    <CardContent className="space-y-4">
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="email-notifications">Email Notifications</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive activity updates via email
                          </p>
                        </div>
                        <Switch 
                          checked={notificationSettings.emailNotifications}
                          onCheckedChange={(checked) => 
                            setNotificationSettings({...notificationSettings, emailNotifications: checked})
                          }
                          id="email-notifications"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="push-notifications">Push Notifications</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive push notifications on your device
                          </p>
                        </div>
                        <Switch 
                          checked={notificationSettings.pushNotifications}
                          onCheckedChange={(checked) => 
                            setNotificationSettings({...notificationSettings, pushNotifications: checked})
                          }
                          id="push-notifications"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="reminder-alerts">Reminder Alerts</Label>
                          <p className="text-sm text-muted-foreground">
                            Get alerts for your custom reminders
                          </p>
                        </div>
                        <Switch 
                          checked={notificationSettings.reminderAlerts}
                          onCheckedChange={(checked) => 
                            setNotificationSettings({...notificationSettings, reminderAlerts: checked})
                          }
                          id="reminder-alerts"
                        />
                      </div>
                      
                      <div className="flex items-center justify-between">
                        <div className="space-y-0.5">
                          <Label htmlFor="marketing-emails">Marketing Emails</Label>
                          <p className="text-sm text-muted-foreground">
                            Receive news and promotional content
                          </p>
                        </div>
                        <Switch 
                          checked={notificationSettings.marketingEmails}
                          onCheckedChange={(checked) => 
                            setNotificationSettings({...notificationSettings, marketingEmails: checked})
                          }
                          id="marketing-emails"
                        />
                      </div>
                    </CardContent>
                    <CardFooter>
                      <Button type="submit">Save Preferences</Button>
                    </CardFooter>
                  </form>
                </Card>
                
                <Card className="border-primary/10 border-red-200">
                  <CardHeader>
                    <CardTitle className="text-red-500">Danger Zone</CardTitle>
                    <CardDescription>
                      Actions in this section can't be undone
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="space-y-4">
                    <Button variant="destructive" className="w-full">Reset Account Data</Button>
                    <Button variant="destructive" className="w-full">Delete Account</Button>
                  </CardContent>
                </Card>
              </div>
            </div>
          </TabsContent>
          
          <TabsContent value="privacy">
            <Card className="border-primary/10">
              <CardHeader>
                <CardTitle>Privacy & Data Settings</CardTitle>
                <CardDescription>
                  Control how your data is used and accessed
                </CardDescription>
              </CardHeader>
              <CardContent className="space-y-6">
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Data Collection</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Usage Analytics</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow anonymous usage data to improve the app
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Mood Tracking History</Label>
                      <p className="text-sm text-muted-foreground">
                        Store history of your mood tracking entries
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Assessment Results</Label>
                      <p className="text-sm text-muted-foreground">
                        Store results from mental health assessments
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                </div>
                
                <div className="space-y-4">
                  <h3 className="text-lg font-medium">Data Sharing</h3>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Community Profile Visibility</Label>
                      <p className="text-sm text-muted-foreground">
                        Make your profile visible to other community members
                      </p>
                    </div>
                    <Switch defaultChecked />
                  </div>
                  
                  <div className="flex items-center justify-between">
                    <div className="space-y-0.5">
                      <Label>Third-party Integrations</Label>
                      <p className="text-sm text-muted-foreground">
                        Allow integration with fitness apps and wearables
                      </p>
                    </div>
                    <Switch />
                  </div>
                </div>
                
                <div className="pt-4">
                  <Button>Download My Data</Button>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default ProfilePage;
