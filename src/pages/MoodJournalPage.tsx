import MainLayout from "@/components/layout/MainLayout";
import React, { useState, useEffect, useContext } from 'react';
import { Card, CardHeader, CardTitle, CardDescription, CardContent, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { AuthContext } from '@/contexts/AuthContext'; // Import AuthContext
import { db } from '@/configs/firebase'; // Import db
import { collection, addDoc, query, where, getDocs, Timestamp, orderBy } from "firebase/firestore";
import { toast } from '@/components/ui/sonner'; // For feedback

// Define the structure of a Journal Entry
interface JournalEntry {
  id?: string; // Firestore document ID
  userId: string;
  timestamp: Timestamp;
  mood: string; // e.g., '😊', '😐', '😢', 'Great', 'Okay', 'Bad'
  entryText: string;
  gratitude?: string; // Optional gratitude entry
}

const MoodJournalPage: React.FC = () => {

  const { currentUser, isLoading: authIsLoading } = useContext(AuthContext); // Get user and loading state from context
  const [mood, setMood] = useState<string>(''); // State for current mood selection
  const [entryText, setEntryText] = useState<string>(''); // State for journal text
  const [gratitudeText, setGratitudeText] = useState<string>(''); // State for gratitude text
  const [journalEntries, setJournalEntries] = useState<JournalEntry[]>([]); // State for fetched entries
  const [isLoading, setIsLoading] = useState<boolean>(false); // Loading state for fetching/saving
  const [isSaving, setIsSaving] = useState<boolean>(false); // Saving state

  const moodOptions = ['😊 Happy', '😌 Calm', '😐 Neutral', '😟 Anxious', '😢 Sad', '😠 Angry']; // Example moods

  // --- Firestore Functions ---

  // Function to save a new journal entry
  const saveJournalEntry = async (entry: Omit<JournalEntry, 'id' | 'timestamp'>) => {
    if (!currentUser) return; // Should not happen if page is protected
    setIsSaving(true);
    try {
      const docRef = await addDoc(collection(db, "journalEntries"), {
        ...entry,
        timestamp: Timestamp.now() // Add server timestamp
      });
      // Add the new entry locally for immediate UI update
      setJournalEntries(prev => [{ ...entry, id: docRef.id, timestamp: Timestamp.now() }, ...prev]);
      // Clear the form
      setMood('');
      setEntryText('');
      setGratitudeText('');
      toast.success("Journal entry saved!");
    } catch (e) {
      console.error("Error adding document: ", e);
      toast.error("Failed to save entry. Please try again.");
    } finally {
      setIsSaving(false);
    }
  };

  // Function to fetch journal entries for the current user
  const fetchJournalEntries = async () => {
    if (!currentUser) return;
    setIsLoading(true);
    try {
      const q = query(
        collection(db, "journalEntries"),
        where("userId", "==", currentUser.id),
        orderBy("timestamp", "desc")
        );
      const querySnapshot = await getDocs(q);
      const entries: JournalEntry[] = [];
      querySnapshot.forEach((doc) => {
        entries.push({ id: doc.id, ...doc.data() } as JournalEntry);
      });
      setJournalEntries(entries);
    } catch (e) {
      console.error("Error fetching documents: ", e);
      toast.error("Failed to load past entries.");
    } finally {
      setIsLoading(false);
    }
  };

  // Fetch entries when the component mounts and user is available
  useEffect(() => {
    console.log("User object:", currentUser); // Log the user object
    if (currentUser) {
      fetchJournalEntries();
    }
  }, [currentUser]); // Dependency array includes user

  // Handler for submitting the form
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!currentUser || !mood || !entryText) {
      toast.warning("Please select a mood and write an entry.");
      return;
    }


    const newEntry: Omit<JournalEntry, 'id' | 'timestamp'> = {      
      userId: currentUser?.id,
      mood: mood,
      entryText: entryText,
      gratitude: gratitudeText || undefined, // Only include if not empty
    };

    saveJournalEntry(newEntry);
  };

  return (
    <MainLayout>
      {authIsLoading ? (
        <div className="container mx-auto p-4">
          <p>Loading user data...</p>
        </div>
      ) : (
        <div className="container mx-auto p-4 space-y-6">
          <h1 className="text-3xl font-bold">Mood Journal</h1>

          {/* Entry Form Card */}
          <Card>
            <CardHeader>
              <CardTitle>How are you feeling today?</CardTitle>
              <CardDescription>Log your mood and thoughts.</CardDescription>
            </CardHeader>
            <form onSubmit={handleSubmit}>
              <CardContent className="space-y-4">
                {/* Mood Selection */}
                <div>
                  <Label className="mb-2 block">Select your mood:</Label>
                  <div className="flex flex-wrap gap-2">
                    {moodOptions.map((option) => (
                      <Button
                        key={option}
                        type="button" // Important: prevent form submission on click
                        variant={mood === option ? "default" : "outline"}
                        onClick={() => setMood(option)}
                        className="text-lg px-3 py-1 h-auto" // Adjust padding/height
                      >
                        {option}
                      </Button>
                    ))}
                  </div>
                </div>

                {/* Journal Entry */}
                <div>
                  <Label htmlFor="journal-entry">Today's thoughts:</Label>
                  <Textarea
                    id="journal-entry"
                    placeholder="Write about your day, feelings, or anything on your mind..."
                    value={entryText}
                    onChange={(e) => setEntryText(e.target.value)}
                    rows={5}
                    required
                  />
                </div>

                {/* Gratitude Entry (Optional) */}
                <div>
                  <Label htmlFor="gratitude-entry">Something you're grateful for today? (Optional)</Label>
                  <Textarea
                    id="gratitude-entry"
                    placeholder="e.g., A sunny morning, a helpful friend..."
                    value={gratitudeText}
                    onChange={(e) => setGratitudeText(e.target.value)}
                    rows={3}
                  />
                </div>
              </CardContent>
              <CardFooter>
                <Button type="submit" disabled={isSaving || !currentUser || !mood || !entryText}>
                  {isSaving ? "Saving..." : "Save Entry"}
                </Button>
                {!currentUser && <p className="ml-4 text-red-500 text-sm">Please log in to save entries.</p>}
              </CardFooter>
            </form>
          </Card>

          {/* Past Entries Section */}
          <div className="space-y-4">
            <h2 className="text-2xl font-semibold">Past Entries</h2>
            {isLoading ? (
              <p>Loading entries...</p>
            ) : journalEntries.length === 0 ? (
              <p>No journal entries yet.</p>
            ) : (
              journalEntries.map((entry) => (
                <Card key={entry.id}>
                  <CardHeader>
                    {/* Format timestamp for display */}
                    <CardTitle className="flex justify-between items-center">
                      <span>Mood: {entry.mood}</span>
                      <span className="text-sm font-normal text-gray-500">
                        {entry.timestamp?.toDate().toLocaleDateString()} {entry.timestamp?.toDate().toLocaleTimeString()}
                      </span>
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <p className="whitespace-pre-wrap">{entry.entryText}</p>
                    {entry.gratitude && (
                      <div className="mt-3 pt-3 border-t">
                        <p className="font-semibold">Grateful for:</p>
                        <p className="whitespace-pre-wrap">{entry.gratitude}</p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              ))
            )}
          </div>
        </div>
      )}
    </MainLayout>
  );
};
export default MoodJournalPage;

