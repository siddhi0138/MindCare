import MainLayout from '@/components/layout/MainLayout';
import JournalEditor from '@/components/journal/JournalEditor';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Calendar as CalendarIcon, List, FileText, PlusCircle } from 'lucide-react';
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { collection, query, where, orderBy, onSnapshot } from 'firebase/firestore';
import { firestore } from '@/configs/firebase';
import { Calendar } from '@/components/ui/calendar';
import { format } from 'date-fns';
import { DayProps } from 'react-day-picker';

interface JournalEntry {
  id: string;
  title: string;
  content: string;
  date: Date;
  mood: string;
  timestamp: any;
  type?: 'past' | 'current';
  emoji?: string;
}

const moodEmojiMap: { [key: string]: string } = {
  happy: '😊',
  calm: '😌',
  neutral: '😐',
  anxious: '😰',
  sad: '😔',
};

const getNormalizedDate = (date: Date) => {
  const newDate = new Date(date);
  return new Date(newDate.getFullYear(), newDate.getMonth(), newDate.getDate());
};

const JournalPage = () => {
  const [entries, setEntries] = useState<JournalEntry[]>([]);
  const [selectedEntry, setSelectedEntry] = useState<JournalEntry | undefined>(undefined);
  const [editorKey, setEditorKey] = useState(0);
  const { currentUser } = useAuth();

  useEffect(() => {
    if (currentUser) {
      const q = query(
        collection(firestore, 'journalEntries'),
        where('userId', '==', currentUser.id),
        orderBy('timestamp', 'desc')
      );

      const unsubscribe = onSnapshot(q, (querySnapshot) => {
        const fetchedEntries: JournalEntry[] = [];
        querySnapshot.forEach((doc) => {
          const data = doc.data();
          fetchedEntries.push({
            id: doc.id,
            ...data,
            timestamp: data.timestamp?.toDate(),
          } as JournalEntry);
        });
        setEntries(fetchedEntries);
      });

      return () => unsubscribe();
    }
  }, [currentUser]);

  const getCalendarEntry = (date: Date) => {
    const entriesForDate = entries.filter(
      (entry) =>
        entry.timestamp && 
        getNormalizedDate(entry.timestamp).getTime() === getNormalizedDate(date).getTime()
    );

    if (entriesForDate.length === 0) {
      return '';
    }

    // Find the latest entry for this date
    const latestEntry = entriesForDate.reduce((prev, current) =>
      prev.timestamp > current.timestamp ? prev : current
    );

    return moodEmojiMap[latestEntry.mood] || moodEmojiMap['neutral'];
  };

  // Custom day component for calendar
  const renderDay = (day: DayProps) => {    
    const emoji = getCalendarEntry(day.date);
    return (
      <div className="flex justify-center items-center w-full h-full">
        {day.date.getDate()}
        {emoji && <span className="absolute text-xl">{emoji}</span>}
      </div>
    );
  };

  return (
    <MainLayout>
      <div className="w-full mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">My Journal</h1>
          <Button
            onClick={() => {
              setSelectedEntry(undefined);
              setEditorKey((prevKey) => prevKey + 1);
            }}
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
                      selectedEntry?.id === entry.id ? 'bg-primary/10' : ''
                    }`}
                    onClick={() => {
                      setSelectedEntry(entry);
                      setEditorKey((prevKey) => prevKey + 1);
                    }}
                  >
                    <CardHeader className="pb-2">
                      <CardTitle className="flex justify-between items-center">
                        <span>{entry.title || 'Untitled'}</span>
                        <span className="text-sm text-muted-foreground">
                          {entry.timestamp ? format(entry.timestamp, 'PPP') : 'No Date'}
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
                    selected={null}
                    modifiers={{
                      hasEntry: entries
                        .map(entry => entry.timestamp)
                        .filter(Boolean)
                        .map(date => getNormalizedDate(date as Date))
                    }}
                    modifiersStyles={{
                      hasEntry: { fontWeight: 'bold' }
                    }}
                    components={{
                      Day: renderDay
                    }}
                    onSelect={(date) => {
                      if (date) {
                        const entriesForDate = entries.filter(
                          (entry) => 
                            entry.timestamp && 
                            getNormalizedDate(entry.timestamp).getTime() === getNormalizedDate(date).getTime()
                        );
                        if (entriesForDate.length > 0) {
                          // Select the most recent entry for this date
                          const latestEntry = entriesForDate.reduce((prev, current) =>
                            prev.timestamp > current.timestamp ? prev : current
                          );
                          setSelectedEntry(latestEntry);
                          setEditorKey((prevKey) => prevKey + 1);
                        }
                      }
                    }}
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