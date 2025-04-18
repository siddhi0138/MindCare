
import { useState } from 'react';
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
  WaterDroplet,
  Pill,
  Moon,
  Coffee,
  Brain,
  Bed
} from 'lucide-react';
import { toast } from '@/components/ui/sonner';

interface Reminder {
  id: string;
  title: string;
  time: string;
  days: string[];
  active: boolean;
  type: string;
}

const reminderTypes = [
  { value: 'hydrate', label: 'Hydrate', icon: <WaterDroplet className="h-4 w-4" /> },
  { value: 'medication', label: 'Medication', icon: <Pill className="h-4 w-4" /> },
  { value: 'sleep', label: 'Sleep', icon: <Moon className="h-4 w-4" /> },
  { value: 'break', label: 'Take a Break', icon: <Coffee className="h-4 w-4" /> },
  { value: 'mindfulness', label: 'Mindfulness', icon: <Brain className="h-4 w-4" /> },
  { value: 'bedtime', label: 'Bedtime', icon: <Bed className="h-4 w-4" /> },
  { value: 'custom', label: 'Custom', icon: <Clock className="h-4 w-4" /> },
];

const CustomReminders = () => {
  const [reminders, setReminders] = useState<Reminder[]>([
    {
      id: '1',
      title: 'Drink Water',
      time: '10:00',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      active: true,
      type: 'hydrate'
    },
    {
      id: '2',
      title: 'Take a Mindful Break',
      time: '15:30',
      days: ['Mon', 'Wed', 'Fri'],
      active: true,
      type: 'mindfulness'
    },
    {
      id: '3',
      title: 'Evening Medication',
      time: '20:00',
      days: ['Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat', 'Sun'],
      active: false,
      type: 'medication'
    }
  ]);
  
  const [newReminder, setNewReminder] = useState<Partial<Reminder>>({
    title: '',
    time: '',
    days: [],
    active: true,
    type: 'custom'
  });
  
  const [isAddingNew, setIsAddingNew] = useState(false);
  
  const handleToggleReminder = (id: string) => {
    setReminders(reminders.map(reminder => 
      reminder.id === id ? { ...reminder, active: !reminder.active } : reminder
    ));
    
    const reminder = reminders.find(r => r.id === id);
    if (reminder) {
      toast.info(
        reminder.active ? 'Reminder disabled' : 'Reminder enabled',
        { description: reminder.title }
      );
    }
  };
  
  const handleDeleteReminder = (id: string) => {
    const reminder = reminders.find(r => r.id === id);
    setReminders(reminders.filter(reminder => reminder.id !== id));
    
    if (reminder) {
      toast.success('Reminder deleted', {
        description: reminder.title
      });
    }
  };
  
  const handleAddReminder = () => {
    if (!newReminder.title || !newReminder.time || !newReminder.type) {
      toast.error('Missing information', {
        description: 'Please fill in all required fields'
      });
      return;
    }
    
    const reminder: Reminder = {
      id: Date.now().toString(),
      title: newReminder.title,
      time: newReminder.time,
      days: newReminder.days || ['Mon', 'Tue', 'Wed', 'Thu', 'Fri'],
      active: true,
      type: newReminder.type
    };
    
    setReminders([...reminders, reminder]);
    setIsAddingNew(false);
    setNewReminder({
      title: '',
      time: '',
      days: [],
      active: true,
      type: 'custom'
    });
    
    toast.success('Reminder created', {
      description: reminder.title
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
      
      {reminders.length > 0 ? (
        <div className="space-y-4">
          {reminders.map(reminder => (
            <Card 
              key={reminder.id} 
              className={`border-primary/10 ${!reminder.active ? 'opacity-60' : ''}`}
            >
              <CardContent className="p-4 flex items-center justify-between">
                <div className="flex items-center gap-4">
                  <div className={`p-2 rounded-full ${reminder.active ? 'bg-primary/10' : 'bg-muted'}`}>
                    {reminder.active ? 
                      getReminderIcon(reminder.type) : 
                      <BellOff className="h-4 w-4 text-muted-foreground" />
                    }
                  </div>
                  <div>
                    <h4 className="font-medium">{reminder.title}</h4>
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
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
