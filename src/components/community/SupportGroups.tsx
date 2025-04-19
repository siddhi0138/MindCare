import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lock, Plus, Users } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { SupportGroupsProps } from "./SupportGroups.d";

interface Group {
  id: string;
  name: string;
  description: string;
  members: number;
  category: string;
  isPrivate: boolean;
  topics: string[];
}

const GROUPS_DATA: Group[] = [
  {
    id: "1",
    name: "Anxiety Support Circle",
    description: "A safe space to share experiences and coping strategies for anxiety disorders.",
    members: 128,
    category: "Anxiety",
    isPrivate: false,
    topics: ["Coping strategies", "Panic attacks", "Social anxiety"]
  },
  {
    id: "2",
    name: "Depression Recovery",
    description: "Support group focused on depression recovery and management techniques.",
    members: 156,
    category: "Depression",
    isPrivate: false,
    topics: ["Mindfulness", "Treatment options", "Daily challenges"]
  },
  {
    id: "3",
    name: "Grief & Loss",
    description: "A community for those experiencing grief and processing loss.",
    members: 89,
    category: "Grief",
    isPrivate: false,
    topics: ["Coping with loss", "Memorial ideas", "Moving forward"]
  },
  {
    id: "4",
    name: "Burnout Prevention",
    description: "Discuss strategies to prevent and recover from professional burnout.",
    members: 73,
    category: "Work Stress",
    isPrivate: true,
    topics: ["Work-life balance", "Setting boundaries", "Self-care"]
  },
  {
    id: "5",
    name: "PTSD Support Network",
    description: "Peer support group for individuals managing PTSD and trauma.",
    members: 62,
    category: "Trauma",
    isPrivate: true,
    topics: ["Trauma recovery", "Therapeutic approaches", "Daily coping"]
  }
];

const SupportGroups = ({ onJoinGroup }: SupportGroupsProps) => {
  const [groups] = useState<Group[]>(GROUPS_DATA);
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);

  const handleJoinGroup = (group: Group) => {
    setSelectedGroup(group);
    setJoinDialogOpen(true);
    if (onJoinGroup) {
      onJoinGroup(group.name);
    }
  };

  const confirmJoinGroup = () => {
    setJoinDialogOpen(false);
    toast.success(`You've joined ${selectedGroup?.name}!`, {
      description: "Check your email for more information about the group."
    });
  };

  const createGroup = () => {
    toast.success("Group creation request submitted!", {
      description: "Our team will review your request and get back to you soon."
    });
  };

  return (
    <div>
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-2xl font-semibold">Support Groups</h2>
        <Dialog>
          <DialogTrigger asChild>
            <Button className="flex items-center gap-2">
              <Plus size={16} />
              <span>Create Group</span>
            </Button>
          </DialogTrigger>
          <DialogContent className="sm:max-w-md">
            <DialogHeader>
              <DialogTitle>Create Support Group</DialogTitle>
              <DialogDescription>
                Create a new support group for others with similar experiences.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div>
                <label htmlFor="group-name" className="text-sm font-medium mb-1 block">Group Name</label>
                <Input id="group-name" placeholder="Enter group name" />
              </div>
              <div>
                <label htmlFor="group-description" className="text-sm font-medium mb-1 block">Description</label>
                <Textarea id="group-description" placeholder="Describe your group's purpose" />
              </div>
              <div>
                <label htmlFor="group-category" className="text-sm font-medium mb-1 block">Category</label>
                <Input id="group-category" placeholder="E.g., Anxiety, Depression, Stress" />
              </div>
              <div className="flex items-center gap-2">
                <input type="checkbox" id="private-group" className="rounded" />
                <label htmlFor="private-group">Make this group private</label>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => {}}>Cancel</Button>
              <Button type="button" onClick={createGroup}>Submit for Review</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <Tabs defaultValue="all" className="mb-6">
        <TabsList>
          <TabsTrigger value="all">All Groups</TabsTrigger>
          <TabsTrigger value="anxiety">Anxiety</TabsTrigger>
          <TabsTrigger value="depression">Depression</TabsTrigger>
          <TabsTrigger value="grief">Grief</TabsTrigger>
          <TabsTrigger value="trauma">Trauma</TabsTrigger>
        </TabsList>
      </Tabs>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {groups.map((group) => (
          <Card key={group.id} className="border-primary/10 overflow-hidden">
            <CardHeader>
              <div className="flex justify-between items-start">
                <CardTitle className="text-xl">{group.name}</CardTitle>
                {group.isPrivate && (
                  <Badge variant="outline" className="flex items-center gap-1">
                    <Lock size={12} /> Private
                  </Badge>
                )}
              </div>
              <CardDescription>{group.description}</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-4">
                <Users size={16} />
                <span>{group.members} members</span>
              </div>
              <div className="flex flex-wrap gap-2">
                {group.topics.map((topic, i) => (
                  <Badge key={i} variant="secondary" className="text-xs">{topic}</Badge>
                ))}
              </div>
            </CardContent>
            <CardFooter>
              <Button 
                className="w-full" 
                variant={group.isPrivate ? "outline" : "default"}
                onClick={() => handleJoinGroup(group)}
              >
                {group.isPrivate ? "Request to Join" : "Join Group"}
              </Button>
            </CardFooter>
          </Card>
        ))}
      </div>

      <Dialog open={joinDialogOpen} onOpenChange={setJoinDialogOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Join {selectedGroup?.name}</DialogTitle>
            <DialogDescription>
              {selectedGroup?.isPrivate 
                ? "This is a private group. Your request will be reviewed by the group moderators." 
                : "You're about to join this support group. Group guidelines will be sent to your email."}
            </DialogDescription>
          </DialogHeader>
          <div className="py-4">
            <p className="text-sm text-muted-foreground mb-4">
              By joining this group, you agree to follow community guidelines, respect other members, 
              and contribute positively to discussions.
            </p>
            {selectedGroup?.isPrivate && (
              <div className="mt-4">
                <label htmlFor="join-reason" className="text-sm font-medium mb-1 block">
                  Why do you want to join this group? (Optional)
                </label>
                <Textarea id="join-reason" placeholder="Share your reason for joining..." />
              </div>
            )}
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setJoinDialogOpen(false)}>Cancel</Button>
            <Button onClick={confirmJoinGroup}>
              {selectedGroup?.isPrivate ? "Submit Request" : "Join Group"}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default SupportGroups;
