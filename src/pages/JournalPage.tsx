
import MainLayout from "@/components/layout/MainLayout";
import JournalEditor from "@/components/journal/JournalEditor";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Calendar, List, FileText, PlusCircle } from "lucide-react";

const JournalPage = () => {
  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Journal</h1>
          <Button>
            <PlusCircle className="mr-2 h-4 w-4" />
            New Entry
          </Button>
        </div>
        
        <Tabs defaultValue="write">
          <TabsList className="grid grid-cols-3 mb-8">
            <TabsTrigger value="write" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Write</span>
            </TabsTrigger>
            <TabsTrigger value="entries" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              <span>Entries</span>
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <Calendar className="h-4 w-4" />
              <span>Calendar</span>
            </TabsTrigger>
          </TabsList>
          
          <TabsContent value="write">
            <JournalEditor />
          </TabsContent>
          
          <TabsContent value="entries">
            <div className="grid gap-4">
              {[1, 2, 3].map((i) => (
                <Card key={i} className="border-primary/10 cursor-pointer card-hover">
                  <CardHeader className="pb-2">
                    <CardTitle className="flex justify-between items-center">
                      <span>Morning Reflections</span>
                      <span className="text-sm text-muted-foreground">May {i + 10}, 2023</span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="line-clamp-2 text-muted-foreground">
                      Today I woke up feeling calm after practicing the breathing techniques I learned yesterday. I'm going to continue with my morning meditation routine...
                    </p>
                  </CardContent>
                </Card>
              ))}
            </div>
          </TabsContent>
          
          <TabsContent value="calendar">
            <Card className="border-primary/10">
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 mx-auto text-muted-foreground mb-4" />
                  <h3 className="text-lg font-medium mb-2">Calendar View</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Track your journaling streak and view entries by date to see your emotional patterns over time.
                  </p>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default JournalPage;
