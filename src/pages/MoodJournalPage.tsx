
import { useState, useEffect } from "react";
import MainLayout from "@/components/layout/MainLayout";
import MoodJournalEntry from "@/components/journal/MoodJournalEntry";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { format } from "date-fns";
import { PlusCircle, BookOpen, Calendar, Book, Trash } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { toast } from "@/components/ui/sonner";

interface MoodEntry {
  id: string;
  date: Date;
  mood: string;
  factors: string[];
  notes: string;
}

const MoodJournalPage = () => {
  const [entries, setEntries] = useState<MoodEntry[]>([]);
  const [isCreating, setIsCreating] = useState(false);
  const [editingEntry, setEditingEntry] = useState<MoodEntry | null>(null);

  useEffect(() => {
    const storedEntries = localStorage.getItem("moodJournalEntries");
    if (storedEntries) {
      const parsedEntries = JSON.parse(storedEntries).map((entry: any) => ({
        ...entry,
        date: new Date(entry.date),
      }));
      setEntries(parsedEntries);
    }
  }, []);

  const handleSave = (entry: MoodEntry) => {
    if (editingEntry) {
      setEntries(entries.map((e) => (e.id === entry.id ? entry : e)));
      setEditingEntry(null);
    } else {
      setEntries([...entries, entry]);
      setIsCreating(false);
    }
  };

  const handleDelete = (id: string) => {
    setEntries(entries.filter((entry) => entry.id !== id));
    const storedEntries = JSON.parse(localStorage.getItem("moodJournalEntries") || "[]");
    const updatedEntries = storedEntries.filter((entry: any) => entry.id !== id);
    localStorage.setItem("moodJournalEntries", JSON.stringify(updatedEntries));
    toast.success("Journal entry deleted");
  };

  const getMoodIcon = (mood: string) => {
    switch (mood) {
      case "great":
        return <span className="text-green-500">😄</span>;
      case "good":
        return <span className="text-teal-500">🙂</span>;
      case "okay":
        return <span className="text-amber-500">😐</span>;
      case "poor":
        return <span className="text-red-500">😞</span>;
      default:
        return null;
    }
  };

  return (
    <MainLayout>
      <div className="container py-6">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center mb-8 gap-4">
          <div>
            <h1 className="text-3xl font-bold">Mood Journal</h1>
            <p className="text-muted-foreground">Track your feelings and reflect on your emotional well-being</p>
          </div>
          <Button 
            onClick={() => {
              setIsCreating(true);
              setEditingEntry(null);
            }}
            className="flex items-center gap-2"
          >
            <PlusCircle size={16} />
            New Entry
          </Button>
        </div>

        {(isCreating || editingEntry) ? (
          <div className="mb-10">
            <MoodJournalEntry 
              onSave={handleSave}
              existingEntry={editingEntry || undefined}
            />
            <div className="mt-4 flex justify-end">
              <Button 
                variant="outline" 
                onClick={() => {
                  setIsCreating(false);
                  setEditingEntry(null);
                }}
              >
                Cancel
              </Button>
            </div>
          </div>
        ) : null}

        <Tabs defaultValue="entries" className="mt-8">
          <TabsList>
            <TabsTrigger value="entries" className="flex items-center gap-2">
              <BookOpen size={16} />
              Journal Entries
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <Calendar size={16} />
              Calendar View
            </TabsTrigger>
          </TabsList>

          <TabsContent value="entries">
            <div className="space-y-4 mt-4">
              {entries.length > 0 ? (
                entries
                  .sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
                  .map((entry) => (
                    <Card key={entry.id} className="border-primary/10">
                      <CardHeader className="flex flex-row items-center justify-between pb-2">
                        <CardTitle className="text-lg font-medium flex items-center gap-2">
                          {getMoodIcon(entry.mood)}
                          {format(new Date(entry.date), "PPPP")}
                        </CardTitle>
                        <div className="flex items-center gap-2">
                          <Button variant="ghost" size="icon" onClick={() => setEditingEntry(entry)}>
                            <Book size={16} />
                          </Button>
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="ghost" size="icon" className="text-destructive">
                                <Trash size={16} />
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Delete Entry?</AlertDialogTitle>
                                <AlertDialogDescription>
                                  This action cannot be undone. This will permanently delete this journal entry.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleDelete(entry.id)}>Delete</AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
                      </CardHeader>
                      <CardContent>
                        {entry.factors.length > 0 && (
                          <div className="mb-4">
                            <p className="text-sm font-medium mb-2">Factors:</p>
                            <div className="flex flex-wrap gap-2">
                              {entry.factors.map((factor) => (
                                <div key={factor} className="bg-muted text-muted-foreground text-xs py-1 px-2 rounded-full">
                                  {factor}
                                </div>
                              ))}
                            </div>
                          </div>
                        )}
                        {entry.notes && (
                          <div>
                            <p className="text-sm font-medium mb-2">Notes:</p>
                            <p className="text-sm whitespace-pre-wrap">{entry.notes}</p>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  ))
              ) : (
                <Card className="border-primary/10">
                  <CardContent className="p-8 text-center">
                    <Book className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                    <h3 className="text-xl font-medium mb-2">No Journal Entries Yet</h3>
                    <p className="text-muted-foreground mb-4">
                      Start tracking your mood and thoughts to gain insights into your emotional wellbeing.
                    </p>
                    <Button onClick={() => setIsCreating(true)}>
                      Create Your First Entry
                    </Button>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>

          <TabsContent value="calendar">
            <Card className="border-primary/10 mt-4">
              <CardContent className="p-6">
                <div className="text-center py-12">
                  <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                  <h3 className="text-xl font-medium mb-2">Calendar View Coming Soon</h3>
                  <p className="text-muted-foreground max-w-md mx-auto">
                    Soon you'll be able to visualize your mood patterns over time with our calendar view.
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

export default MoodJournalPage;
