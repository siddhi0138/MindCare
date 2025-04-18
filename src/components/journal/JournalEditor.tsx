
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Textarea } from '@/components/ui/textarea';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { Calendar as CalendarIcon, Save, Lock, Smile, Cloud } from 'lucide-react';

const JournalEditor = () => {
  const [title, setTitle] = useState('');
  const [content, setContent] = useState('');
  const [date, setDate] = useState<Date>(new Date());
  const [mood, setMood] = useState('neutral');
  const [isSaving, setIsSaving] = useState(false);

  const moods = [
    { label: 'Happy', value: 'happy', emoji: '😊' },
    { label: 'Calm', value: 'calm', emoji: '😌' },
    { label: 'Neutral', value: 'neutral', emoji: '😐' },
    { label: 'Anxious', value: 'anxious', emoji: '😰' },
    { label: 'Sad', value: 'sad', emoji: '😔' },
  ];

  const handleSave = () => {
    setIsSaving(true);
    // Simulate saving
    setTimeout(() => {
      setIsSaving(false);
      // Reset or navigate in a real app
    }, 1500);
  };

  return (
    <Card className="border-primary/10 w-full">
      <CardHeader className="pb-3">
        <CardTitle>Journal Entry</CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="title">Title</Label>
          <Input 
            id="title" 
            placeholder="Give your entry a title"
            value={title}
            onChange={(e) => setTitle(e.target.value)}
          />
        </div>
        
        <div className="grid grid-cols-2 gap-4">
          <div className="space-y-2">
            <Label>Date</Label>
            <Popover>
              <PopoverTrigger asChild>
                <Button
                  variant="outline"
                  className="w-full justify-start text-left font-normal"
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {format(date, 'PPP')}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={date}
                  onSelect={(date) => date && setDate(date)}
                  initialFocus
                />
              </PopoverContent>
            </Popover>
          </div>
          
          <div className="space-y-2">
            <Label>Mood</Label>
            <div className="grid grid-cols-5 gap-1">
              {moods.map((m) => (
                <Button
                  key={m.value}
                  type="button"
                  variant={mood === m.value ? "default" : "outline"}
                  className={cn(
                    "flex flex-col items-center py-3 h-auto",
                    mood === m.value ? "border-primary" : ""
                  )}
                  onClick={() => setMood(m.value)}
                >
                  <span className="text-xl mb-1">{m.emoji}</span>
                  <span className="text-xs">{m.label}</span>
                </Button>
              ))}
            </div>
          </div>
        </div>
        
        <div className="space-y-2">
          <Label htmlFor="content">Your thoughts</Label>
          <Textarea 
            id="content" 
            placeholder="Write your journal entry here..."
            value={content}
            onChange={(e) => setContent(e.target.value)}
            rows={12}
            className="resize-none"
          />
        </div>
      </CardContent>
      <CardFooter className="flex justify-between">
        <div className="flex items-center text-xs text-muted-foreground gap-2">
          <Lock size={12} />
          <span>Private and encrypted</span>
        </div>
        <Button onClick={handleSave} disabled={isSaving || !content.trim()}>
          {isSaving ? (
            <>
              <Cloud className="mr-2 h-4 w-4 animate-bounce" />
              Saving...
            </>
          ) : (
            <>
              <Save className="mr-2 h-4 w-4" />
              Save Entry
            </>
          )}
        </Button>
      </CardFooter>
    </Card>
  );
};

export default JournalEditor;
