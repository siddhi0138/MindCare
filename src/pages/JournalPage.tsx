import MainLayout from '@/components/layout/MainLayout';
import JournalEditor from '@/components/journal/JournalEditor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar as CalendarIcon, List, FileText, PlusCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext'; 
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '@/configs/firebase';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';

// Import the emoji

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: Date;
  mood: string;
  timestamp: any;
  type: 'past' | 'current';
  emoji?: string;
}

const JournalPage = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | undefined>(undefined);
  const [editorKey, setEditorKey] = useState(0);
  const { currentUser } = useAuth(); // Access currentUser from AuthContext
  useEffect(() => {
    if (currentUser) {
      const q = query(
        collection(db, 'journalEntries'),
        where('userId', '==', currentUser.id),
        orderBy('timestamp', 'desc')
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const journalEntries: JournalEntry[] = [];
        querySnapshot.docChanges().forEach((change) => {
          const doc = change.doc;
          (doc.data() as any).type = change.type === 'added' ? 'current' : 'past';
          journalEntries.push({ id: doc.id, ...doc.data() } as JournalEntry);
        });
        setEntries(journalEntries);
      });
      return () => unsubscribe();
    }
  }, [currentUser]);


  return ( // Update to use currentUser
    <MainLayout>
      <div className="w-full mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Journal</h1>
          <Button onClick={() => {
            setSelectedEntry(undefined);
            setEditorKey(prevKey => prevKey + 1);
          }
          }
          >
            <PlusCircle className="mr-2 h-4 w-4" />
            New Entry
          </Button>
        </div>

        <Tabs defaultValue="write">
          <TabsList className="grid grid-cols-1 md:grid-cols-3 mb-8">
            <TabsTrigger value="write" className="flex items-center gap-2">
              <FileText className="h-4 w-4" />
              <span>Write</span>
            </TabsTrigger>
            <TabsTrigger value="entries" className="flex items-center gap-2">
              <List className="h-4 w-4" />
              <span>Entries</span>
            </TabsTrigger>
            <TabsTrigger value="calendar" className="flex items-center gap-2">
              <CalendarIcon className="h-4 w-4" />
              <span>Calendar</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="entries">
            {entries.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {entries.map((entry) => (
                  <Card
                    key={entry.id}
                    className={`border-primary/10 cursor-pointer card-hover ${
                      entry.type === 'current' ? 'bg-primary/10' : ''
                    }`}
                    onClick={() => {
                      setSelectedEntry(entry);
                      setEditorKey(prevKey => prevKey + 1);
                    }}>
                    <CardHeader className="pb-2">
                      <CardTitle className="flex justify-between items-center">
                        <span>{entry.title || 'Untitled'}</span>
                        <span className="text-sm text-muted-foreground">
                          {entry.timestamp ? format(entry.timestamp.toDate(), 'PPP') : 'No Date'}
                        </span>
                      </CardTitle>
                    </CardHeader>
                    <CardContent>
                      <p className="line-clamp-2 text-muted-foreground">
                        {entry.content ? entry.content.substring(0, 100) : ''}...
                      </p>
                    </CardContent>
                  </Card>
                ))}
              </div>
            ) : (
              <p>No entries found.</p>
            )}
          </TabsContent>

          <TabsContent value="write">
            <JournalEditor key={editorKey} />
          </TabsContent>

          <TabsContent value="calendar">
            <Card className="border-primary/10">
              <CardHeader className="pb-2">
                <CardTitle>Calendar View</CardTitle>
              </CardHeader>
              <CardContent className="p-6">
                <div className="flex justify-center">
                  <Calendar
                    mode="single"
                    className="rounded-md border mx-auto"
                    entries={entries.map(entry => ({
                      date: entry.date instanceof Date ? entry.date : new Date(),
                      emoji: entry.emoji ?? '🙂',
                    }))}
                  />
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