
import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Lock, Plus, Users, Check } from "lucide-react";
import { toast } from "@/components/ui/sonner";
import { SupportGroupsProps } from "./SupportGroups.d";
import { useAuth } from "@/contexts/AuthContext";
import { joinSupportGroup, leaveSupportGroup, getUserGroupMemberships, getGroupMemberCounts, createCommunityGroup, getCommunityGroups, saveUserActivity } from "@/configs/firebase";

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

const CATEGORY_TABS: Record<string, string> = {
  anxiety: "Anxiety",
  depression: "Depression",
  grief: "Grief",
  trauma: "Trauma",
};

const SupportGroups = ({ onJoinGroup }: SupportGroupsProps) => {
  const { currentUser } = useAuth();
  const [customGroups, setCustomGroups] = useState<Group[]>([]);
  const [joinDialogOpen, setJoinDialogOpen] = useState(false);
  const [selectedGroup, setSelectedGroup] = useState<Group | null>(null);
  const [joinedGroupIds, setJoinedGroupIds] = useState<string[]>([]);
  const [memberCounts, setMemberCounts] = useState<Record<string, number>>({});
  const [activeCategory, setActiveCategory] = useState("all");
  const [createDialogOpen, setCreateDialogOpen] = useState(false);
  const [newGroup, setNewGroup] = useState({ name: '', description: '', category: '', isPrivate: false });

  const groups = [...GROUPS_DATA, ...customGroups];

  const loadGroups = () => {
    getCommunityGroups().then((docs) =>
      setCustomGroups(docs.map((g) => ({
        id: g.id,
        name: g.name,
        description: g.description,
        category: g.category,
        isPrivate: g.isPrivate,
        members: 0,
        topics: [],
      })))
    );
  };

  useEffect(() => {
    loadGroups();
    getGroupMemberCounts().then(setMemberCounts);
    if (currentUser) {
      getUserGroupMemberships(currentUser.id).then(setJoinedGroupIds);
    } else {
      setJoinedGroupIds([]);
    }
  }, [currentUser]);

  const memberCount = (group: Group) => group.members + (memberCounts[group.id] || 0);

  const handleJoinGroup = (group: Group) => {
    if (!currentUser) {
      toast.error("Login required", { description: "Please log in to join community groups." });
      return;
    }
    setSelectedGroup(group);
    setJoinDialogOpen(true);
    if (onJoinGroup) {
      onJoinGroup(group.name);
    }
  };

  const confirmJoinGroup = async () => {
    if (!selectedGroup || !currentUser) return;
    setJoinDialogOpen(false);

    const result = await joinSupportGroup(currentUser.id, selectedGroup.id, selectedGroup.name);
    if (result.success) {
      setJoinedGroupIds((prev) => [...prev, selectedGroup.id]);
      setMemberCounts((prev) => ({ ...prev, [selectedGroup.id]: (prev[selectedGroup.id] || 0) + 1 }));
      toast.success(`You've joined ${selectedGroup.name}!`, {
        description: "Check your email for more information about the group."
      });
      saveUserActivity({
        userId: currentUser.id,
        timestamp: new Date().toISOString(),
        activityType: 'join_group',
        activityName: `Joined ${selectedGroup.name}`,
        pageName: 'CommunityPage',
      });
    } else {
      toast.error("Could not join group", { description: "Please try again in a moment." });
    }
  };

  const handleLeaveGroup = async (group: Group) => {
    if (!currentUser) return;
    const result = await leaveSupportGroup(currentUser.id, group.id);
    if (result.success) {
      setJoinedGroupIds((prev) => prev.filter((id) => id !== group.id));
      setMemberCounts((prev) => ({ ...prev, [group.id]: Math.max(0, (prev[group.id] || 0) - 1) }));
      toast.info(`Left ${group.name}`);
      saveUserActivity({
        userId: currentUser.id,
        timestamp: new Date().toISOString(),
        activityType: 'leave_group',
        activityName: `Left ${group.name}`,
        pageName: 'CommunityPage',
      });
    }
  };

  const createGroup = async () => {
    if (!currentUser) {
      toast.error("Login required", { description: "Please log in to create a new group." });
      return;
    }
    if (!newGroup.name.trim() || !newGroup.description.trim()) {
      toast.error("Missing information", { description: "Please fill in a group name and description." });
      return;
    }

    const result = await createCommunityGroup(newGroup);
    if (result.success) {
      setCreateDialogOpen(false);
      setNewGroup({ name: '', description: '', category: '', isPrivate: false });
      loadGroups();
      if (result.id) setJoinedGroupIds((prev) => [...prev, result.id as string]);
      toast.success("Group created!", {
        description: `${newGroup.name} is live and you've been added as a member.`
      });
      saveUserActivity({
        userId: currentUser.id,
        timestamp: new Date().toISOString(),
        activityType: 'create_group',
        activityName: `Created group ${newGroup.name}`,
        pageName: 'CommunityPage',
      });
    } else {
      toast.error("Could not create group", { description: "Please try again in a moment." });
    }
  };

  const visibleGroups = activeCategory === "all"
    ? groups
    : groups.filter((g) => g.category === CATEGORY_TABS[activeCategory]);

  return (
    <div>
      <div className="flex justify-between items-center mb-6 flex-wrap gap-4">
        <Tabs value={activeCategory} onValueChange={setActiveCategory} className="min-w-0 w-full sm:w-auto">
          <TabsList className="w-full sm:w-auto justify-start">
            <TabsTrigger value="all">All Groups</TabsTrigger>
            <TabsTrigger value="anxiety">Anxiety</TabsTrigger>
            <TabsTrigger value="depression">Depression</TabsTrigger>
            <TabsTrigger value="grief">Grief</TabsTrigger>
            <TabsTrigger value="trauma">Trauma</TabsTrigger>
          </TabsList>
        </Tabs>

        <Dialog open={createDialogOpen} onOpenChange={setCreateDialogOpen}>
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
                <Input
                  id="group-name"
                  placeholder="Enter group name"
                  value={newGroup.name}
                  onChange={(e) => setNewGroup((prev) => ({ ...prev, name: e.target.value }))}
                />
              </div>
              <div>
                <label htmlFor="group-description" className="text-sm font-medium mb-1 block">Description</label>
                <Textarea
                  id="group-description"
                  placeholder="Describe your group's purpose"
                  value={newGroup.description}
                  onChange={(e) => setNewGroup((prev) => ({ ...prev, description: e.target.value }))}
                />
              </div>
              <div>
                <label htmlFor="group-category" className="text-sm font-medium mb-1 block">Category</label>
                <Input
                  id="group-category"
                  placeholder="E.g., Anxiety, Depression, Stress"
                  value={newGroup.category}
                  onChange={(e) => setNewGroup((prev) => ({ ...prev, category: e.target.value }))}
                />
              </div>
              <div className="flex items-center gap-2">
                <input
                  type="checkbox"
                  id="private-group"
                  className="rounded"
                  checked={newGroup.isPrivate}
                  onChange={(e) => setNewGroup((prev) => ({ ...prev, isPrivate: e.target.checked }))}
                />
                <label htmlFor="private-group">Make this group private</label>
              </div>
            </div>
            <DialogFooter>
              <Button type="button" variant="outline" onClick={() => setCreateDialogOpen(false)}>Cancel</Button>
              <Button type="button" onClick={createGroup}>Submit for Review</Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {visibleGroups.map((group) => {
          const isJoined = joinedGroupIds.includes(group.id);
          return (
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
                  <span>{memberCount(group)} members</span>
                </div>
                <div className="flex flex-wrap gap-2">
                  {group.topics.map((topic, i) => (
                    <Badge key={i} variant="secondary" className="text-xs">{topic}</Badge>
                  ))}
                </div>
              </CardContent>
              <CardFooter>
                {isJoined ? (
                  <Button
                    className="w-full flex items-center gap-2"
                    variant="outline"
                    onClick={() => handleLeaveGroup(group)}
                  >
                    <Check size={16} /> Joined — Leave Group
                  </Button>
                ) : (
                  <Button
                    className="w-full"
                    variant={group.isPrivate ? "outline" : "default"}
                    onClick={() => handleJoinGroup(group)}
                  >
                    {group.isPrivate ? "Request to Join" : "Join Group"}
                  </Button>
                )}
              </CardFooter>
            </Card>
          );
        })}
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
