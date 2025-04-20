
import { useState } from "react";
import { Card, CardContent, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { 
  Select, 
  SelectContent, 
  SelectItem, 
  SelectTrigger, 
  SelectValue 
} from "@/components/ui/select";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { format } from "date-fns";
import { Calendar as CalendarIcon, Save, Smile, SmilePlus, Frown, Meh } from "lucide-react";
import { toast } from "@/components/ui/sonner";

const moodOptions = [
  { value: "great", label: "Great", icon: <Smile className="h-5 w-5 text-green-500" /> },
  { value: "good", label: "Good", icon: <SmilePlus className="h-5 w-5 text-teal-500" /> },
  { value: "okay", label: "Okay", icon: <Meh className="h-5 w-5 text-amber-500" /> },
  { value: "poor", label: "Poor", icon: <Frown className="h-5 w-5 text-red-500" /> },
];

interface MoodJournalEntryProps {
  onSave?: (entry: {
    id: string;
    date: Date;
    mood: string;
    factors: string[];
    notes: string;
  }) => void;
  existingEntry?: {
    id: string;
    date: Date;
    mood: string;
    factors: string[];
    notes: string;
  };
}

const factorOptions = [
  "Sleep", "Exercise", "Nutrition", "Social", "Work/School", "Family", "Leisure", "Health"
];

const MoodJournalEntry = ({ onSave, existingEntry }: MoodJournalEntryProps) => {
  const [date, setDate] = useState<Date>(existingEntry?.date || new Date());
  const [mood, setMood] = useState<string>(existingEntry?.mood || "");
  const [selectedFactors, setSelectedFactors] = useState<string[]>(existingEntry?.factors || []);
  const [notes, setNotes] = useState<string>(existingEntry?.notes || "");

  const handleSave = () => {
    if (!mood) {
      toast.error("Please select a mood");
      return;
    }

    const entry = {
      id: existingEntry?.id || Date.now().toString(),
      date,
      mood,
      factors: selectedFactors,
      notes,
    };

    if (onSave) {
      onSave(entry);
    }

    // Save to local storage
    const storedEntries = JSON.parse(localStorage.getItem("moodJournalEntries") || "[]");
    const updatedEntries = existingEntry
      ? storedEntries.map((e: any) => (e.id === entry.id ? entry : e))
      : [...storedEntries, entry];
    localStorage.setItem("moodJournalEntries", JSON.stringify(updatedEntries));

    toast.success("Journal entry saved");

    if (!existingEntry) {
      // Clear form if it's a new entry
      setMood("");
      setSelectedFactors([]);
      setNotes("");
    }
  };

  const toggleFactor = (factor: string) => {
    setSelectedFactors((prev) =>
      prev.includes(factor)
        ? prev.filter((f) => f !== factor)
        : [...prev, factor]
    );
  };

  const getMoodIcon = () => {
    const selectedMood = moodOptions.find((option) => option.value === mood);
    return selectedMood?.icon || null;
  };

  return (
    <Card className="border-primary/10">
      <CardHeader>
        <CardTitle className="flex items-center justify-between">
          <div>Mood Journal Entry</div>
          <Popover>
            <PopoverTrigger asChild>
              <Button
                variant="outline"
                className="ml-auto h-10 w-fit px-3"
              >
                <CalendarIcon className="mr-2 h-4 w-4" />
                {date ? format(date, "PPP") : "Select date"}
              </Button>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0" align="end">
              <Calendar
                mode="single"
                selected={date}
                onSelect={(newDate) => setDate(newDate || new Date())}
                initialFocus
              />
            </PopoverContent>
          </Popover>
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-6">
        <div className="space-y-2">
          <label className="text-sm font-medium">How are you feeling today?</label>
          <Select value={mood} onValueChange={setMood}>
            <SelectTrigger>
              <SelectValue placeholder="Select your mood">
                {mood && (
                  <div className="flex items-center gap-2">
                    {getMoodIcon()}
                    <span>{moodOptions.find((option) => option.value === mood)?.label}</span>
                  </div>
                )}
              </SelectValue>
            </SelectTrigger>
            <SelectContent>
              {moodOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  <div className="flex items-center gap-2">
                    {option.icon}
                    <span>{option.label}</span>
                  </div>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div className="space-y-2">
          <label className="text-sm font-medium">What factors affected your mood today?</label>
          <div className="flex flex-wrap gap-2">
            {factorOptions.map((factor) => (
              <Button
                key={factor}
                variant={selectedFactors.includes(factor) ? "default" : "outline"}
                size="sm"
                onClick={() => toggleFactor(factor)}
              >
                {factor}
              </Button>
            ))}
          </div>
        </div>

        <div className="space-y-2">
          <label htmlFor="notes" className="text-sm font-medium">Journal Notes</label>
          <Textarea
            id="notes"
            placeholder="Write your thoughts here..."
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            className="min-h-[150px]"
          />
        </div>
      </CardContent>
      <CardFooter>
        <Button onClick={handleSave} className="w-full gap-2">
          <Save className="h-4 w-4" />
          Save Journal Entry
        </Button>
      </CardFooter>
    </Card>
  );
};

export default MoodJournalEntry;
