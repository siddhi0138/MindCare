import { useState, useEffect, useCallback } from "react";
import { useAuth } from "@/contexts/AuthContext";
import {  saveUserActivity } from "@/configs/firebase";
import MainLayout from "@/components/layout/MainLayout";
import { useToast } from "@/hooks/use-toast";
import MeditationPlayer from "@/components/meditation/MeditationPlayer";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Search, Moon, Sun, Clock, Sparkles, Wind } from "lucide-react";

const meditationData = [
  {
    id: "1",
    title: "Morning Calm",
    description: "Start your day with clarity and peace",
    imageUrl: "https://images.unsplash.com/photo-1519834785169-98be25ec3f84?ixlib=rb-4.0.3",
    duration: "2:09 min",
    category: "morning",
    audioSrc: "public/meditation/audio1.mp3",
  },
  {
    id: "2",
    title: "Deep Sleep",
    description: "Drift into restful sleep with gentle sounds",
    imageUrl: "public/meditation/image2.jpg",
    duration: "10 min",
    audioSrc: "public/meditation/audio2.mp3",
    category: "sleep",
  },
  {
    id: "3",
    title: "Anxiety Relief",
    description: "Release tension and find your center",
    imageUrl: "https://images.unsplash.com/photo-1528319725582-ddc096101511?ixlib=rb-4.0.3",
    duration: "3:01 min",
    audioSrc: "public/meditation/audio3.mp3",
    category: "anxiety",
  },
  {
    id: "4",
    title: "Breathing Focus",
    description: "Control your breathing to calm your mind",
    imageUrl: "public/meditation/image1.jpg",
    duration: "10 min",
    audioSrc: "public/meditation/audio4.mp3",
    category: "breathing",
  },
  {
    id: "5",
    title: "Mindful Focus",
    description: "Sharpen your attention and stay grounded with this guided focus session",
    imageUrl: "https://images.unsplash.com/photo-1505678261036-a3fcc5e884ee?ixlib=rb-4.0.3",
    duration: "3:14 min",
    category: "focus",
    audioSrc: "public/meditation/audio5.mp3",
  },
];

const MeditationPage = () => {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [currentMeditation, setCurrentMeditation] = useState(meditationData[currentIndex]);
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredMeditations, setFilteredMeditations] = useState(meditationData);

  useEffect(() => {
   recordActivity('view ','Visit Meditation Page','MeditationPage')
  }, [])

    const { recordActivity } = useToast();

  useEffect(() => {
    setCurrentMeditation(meditationData[currentIndex]);
  }, [currentIndex]);

  useEffect(() => {
    setFilteredMeditations(
      meditationData.filter(
        (meditation) => meditation.title.toLowerCase().includes(searchTerm.toLowerCase()) || meditation.description.toLowerCase().includes(searchTerm.toLowerCase())
      )
    );
  }, [searchTerm]);

  const { currentUser } = useAuth();
  
  const handlePlayMeditation = (meditation,userId) => {
    const timestamp = new Date().toISOString();
    const activityData = {
      userId,
      timestamp,
      activityType: "play-meditation",
      activityName: meditation.title,
      pageName: "MeditationPage",

    };
    saveUserActivity(activityData);
    setCurrentMeditation(meditation);

  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Guided Meditations</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search meditations..."
              className="pl-10 w-[250px]"
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </div>
        </div>

        <Tabs defaultValue="all">
          <TabsList className="mb-8">
            <TabsTrigger value="all">All</TabsTrigger>
            <TabsTrigger value="sleep" className="flex items-center gap-1">
              <Moon className="h-4 w-4" />
              <span>Sleep</span>
            </TabsTrigger>
            <TabsTrigger value="morning" className="flex items-center gap-1">
              <Sun className="h-4 w-4" />
              <span>Morning</span>
            </TabsTrigger>
            <TabsTrigger value="anxiety" className="flex items-center gap-1">
              <Wind className="h-4 w-4" />
              <span>Anxiety</span>
            </TabsTrigger>
            <TabsTrigger value="focus" className="flex items-center gap-1">
              <Sparkles className="h-4 w-4" />
              <span>Focus</span>
            </TabsTrigger>
            <TabsTrigger value="quick" className="flex items-center gap-1">
              <Clock className="h-4 w-4" />
              <span>Quick</span>
            </TabsTrigger>
          </TabsList>

          <TabsContent value="all" className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            {filteredMeditations.map((meditation) => (
              <Card key={meditation.id} className="border-primary/10 overflow-hidden cursor-pointer card-hover">
                <div
                  className="h-40 bg-cover bg-center"
                  style={{ backgroundImage: `url(${meditation.imageUrl})` }}
                >
                  <div className="h-full flex items-end p-3">
                    <span className="inline-block px-2 py-1 bg-primary/20 backdrop-blur-sm rounded-full text-xs">
                      {meditation.duration}
                    </span>
                  </div>
                </div>
                <CardContent className="p-4">
                  <h3 className="font-medium text-lg">{meditation.title}</h3>
                  <p className="text-muted-foreground text-sm">{meditation.description}</p>
                  <Button className="w-full mt-4" onClick={() => handlePlayMeditation(meditation, currentUser?.id)}>
                    Play Meditation
                  </Button>
                </CardContent>
              </Card>
            ))}
          </TabsContent>

          {["sleep", "morning", "anxiety", "focus", "quick"].map((category) => (
            <TabsContent key={category} value={category}>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredMeditations
                  .filter((m) => m.category === category || category === "all")
                  .map((meditation) => (
                    <Card key={meditation.id} className="border-primary/10 overflow-hidden cursor-pointer card-hover">
                      <div
                        className="h-40 bg-cover bg-center"
                        style={{ backgroundImage: `url(${meditation.imageUrl})` }}
                      >
                        <div className="h-full flex items-end p-3">
                          <span className="inline-block px-2 py-1 bg-primary/20 backdrop-blur-sm rounded-full text-xs">
                            {meditation.duration}
                          </span>
                        </div>
                      </div>
                      <CardContent className="p-4">
                        <h3 className="font-medium text-lg">{meditation.title}</h3>
                        <p className="text-muted-foreground text-sm">{meditation.description}</p>
                        <Button className="w-full mt-4" onClick={() => handlePlayMeditation(meditation, currentUser?.id)}>
                          Play Meditation
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>

        <div className="mt-16 mb-12">
          <MeditationPlayer
            currentMeditation={currentMeditation}
            onNext={() => setCurrentIndex((currentIndex + 1) % meditationData.length)}
            onPrev={() => setCurrentIndex((currentIndex - 1 + meditationData.length) % meditationData.length)}
          />
        </div>
      </div>
    </MainLayout>
  );
};

export default MeditationPage;
