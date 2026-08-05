
import { useEffect, useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Switch } from '@/components/ui/switch';
import { Label } from '@/components/ui/label';
import {
  PlusCircle,
  Trash2,
  Clock,
  Bell,
  BellOff,
  Droplet,
  Pill,
  Moon,
  Coffee,
  Brain,
  Bed
} from 'lucide-react';
import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/contexts/AuthContext';
import { saveReminder, getReminders, updateReminder, deleteReminder } from '@/configs/firebase';

interface Reminder {
  id: string;
  title: string;
  time: string;
  days: string[];
  active: boolean;
  type: string;
}

const reminderTypes = [
  { value: 'hydrate', label: 'Hydrate', icon: <Droplet className="h-4 w-4" /> },
  { value: 'medication', label: 'Medication', icon: <Pill className="h-4 w-4" /> },
  { value: 'sleep', label: 'Sleep', icon: <Moon className="h-4 w-4" /> },
  { value: 'break', label: 'Take a Break', icon: <Coffee className="h-4 w-4" /> },
  { value: 'mindfulness', label: 'Mindfulness', icon: <Brain className="h-4 w-4" /> },
  { value: 'bedtime', label: 'Bedtime', icon: <Bed className="h-4 w-4" /> },
  { value: 'custom', label: 'Custom', icon: <Clock className="h-4 w-4" /> },
];

const CustomReminders = () => {
  const { currentUser } = useAuth();
  const [reminders, setReminders] = useState<Reminder[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const [newReminder, setNewReminder] = useState<Partial<Reminder>>({
    title: '',
    time: '',
    days: [],
    active: true,
    type: 'custom'
  });

  const [isAddingNew, setIsAddingNew] = useState(false);

  useEffect(() => {
    if (!currentUser) {
      setIsLoading(false);
      return;
    }

    setIsLoading(true);
    getReminders(currentUser.id)
      .then((docs) =>
        setReminders(
          docs.map((doc) => ({
            id: doc.id,
            title: doc.title,
            time: doc.time,
            days: doc.days,
            active: doc.active,
            type: doc.type,
          }))
        )
      )
      .finally(() => setIsLoading(false));
  }, [currentUser]);

  const handleToggleReminder = async (id: string) => {
    const reminder = reminders.find(r => r.id === id);
    if (!reminder) return;

    const nextActive = !reminder.active;
    setReminders(reminders.map(r => (r.id === id ? { ...r, active: nextActive } : r)));
    await updateReminder(id, { active: nextActive });

    toast.info(
      nextActive ? 'Reminder enabled' : 'Reminder disabled',
      { description: reminder.title }
    );
  };

  const handleDeleteReminder = async (id: string) => {
    const reminder = reminders.find(r => r.id === id);
    setReminders(reminders.filter(r => r.id !== id));
    await deleteReminder(id);

    if (reminder) {
      toast.success('Reminder deleted', {
        description: reminder.title
      });
    }
  };

  const handleAddReminder = async () => {
    if (!newReminder.title || !newReminder.time || !newReminder.type) {
      toast.error('Missing information', {
        description: 'Please fill in all required fields'
      });
      return;
    }

    const payload = {
      title: newReminder.title,
      time: newReminder.time,
      days: newReminder.days && newReminder.days.length > 0 ? newReminder.days : ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      active: true,
      type: newReminder.type,
    };

    const result = await saveReminder(payload);
    if (result.success) {
      setReminders([{ id: result.id, ...payload }, ...reminders]);
      toast.success('Reminder created', {
        description: payload.title
      });
    } else {
      toast.error('Could not create reminder');
    }

    setIsAddingNew(false);
    setNewReminder({
      title: '',
      time: '',
      days: [],
      active: true,
      type: 'custom'
    });
  };

  const cancelAddReminder = () => {
    setIsAddingNew(false);
    setNewReminder({
      title: '',
      time: '',
      days: [],
      active: true,
      type: 'custom'
    });
  };

  const getReminderIcon = (type: string) => {
    const reminderType = reminderTypes.find(t => t.value === type);
    return reminderType ? reminderType.icon : <Bell className="h-4 w-4" />;
  };

  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-xl font-medium">Custom Reminders</h3>
        {!isAddingNew && (
          <Button
            onClick={() => setIsAddingNew(true)}
            className="flex items-center gap-2"
          >
            <PlusCircle size={16} />
            <span>New Reminder</span>
          </Button>
        )}
      </div>

      {isAddingNew && (
        <Card className="border-primary/10">
          <CardHeader>
            <CardTitle>Create New Reminder</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="title">Title</Label>
                  <Input
                    id="title"
                    value={newReminder.title}
                    onChange={(e) => setNewReminder({...newReminder, title: e.target.value})}
                    placeholder="Reminder title"
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="time">Time</Label>
                  <Input
                    id="time"
                    type="time"
                    value={newReminder.time}
                    onChange={(e) => setNewReminder({...newReminder, time: e.target.value})}
                  />
                </div>
              </div>

              <div className="space-y-2">
                <Label htmlFor="type">Reminder Type</Label>
                <Select
                  value={newReminder.type}
                  onValueChange={(value) => setNewReminder({...newReminder, type: value})}
                >
                  <SelectTrigger>
                    <SelectValue placeholder="Select a type" />
                  </SelectTrigger>
                  <SelectContent>
                    {reminderTypes.map(type => (
                      <SelectItem key={type.value} value={type.value}>
                        <div className="flex items-center gap-2">
                          {type.icon}
                          <span>{type.label}</span>
                        </div>
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="pt-4 flex justify-end gap-2">
                <Button variant="outline" onClick={cancelAddReminder}>
                  Cancel
                </Button>
                <Button onClick={handleAddReminder}>
                  Create Reminder
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {isLoading ? (
        <Card className="border-primary/10">
          <CardContent className="p-8 text-center text-sm text-muted-foreground">
            Loading your reminders...
          </CardContent>
        </Card>
      ) : reminders.length > 0 ? (
        <div className="space-y-4">
          {reminders.map(reminder => (
            <Card
              key={reminder.id}
              className={`border-primary/10 ${!reminder.active ? 'opacity-60' : ''}`}
            >
              <CardContent className="p-4 flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-4 min-w-0">
                  <div className={`p-2 rounded-full shrink-0 ${reminder.active ? 'bg-primary/10' : 'bg-muted'}`}>
                    {reminder.active ?
                      getReminderIcon(reminder.type) :
                      <BellOff className="h-4 w-4 text-muted-foreground" />
                    }
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-medium truncate md:whitespace-normal md:overflow-visible">{reminder.title}</h4>
                    <div className="flex items-center flex-wrap gap-2 text-sm text-muted-foreground">
                      <Clock className="h-3 w-3" />
                      <span>{reminder.time}</span>
                      <span>•</span>
                      <span>{reminder.days.length === 7 ? 'Every day' : reminder.days.join(', ')}</span>
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-2">
                  <Switch
                    checked={reminder.active}
                    onCheckedChange={() => handleToggleReminder(reminder.id)}
                  />
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDeleteReminder(reminder.id)}
                    className="text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      ) : (
        <Card className="border-primary/10">
          <CardContent className="p-8 text-center">
            <Bell className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
            <h3 className="text-xl font-medium mb-2">No Reminders Yet</h3>
            <p className="text-muted-foreground mb-4">
              Create custom reminders for meditation, breaks, hydration, and more.
            </p>
            {!isAddingNew && (
              <Button onClick={() => setIsAddingNew(true)}>
                Create Your First Reminder
              </Button>
            )}
          </CardContent>
        </Card>
      )}
    </div>
  );
};

export default CustomReminders;
