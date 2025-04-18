
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
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
    duration: "10 min",
    category: "morning",
  },
  {
    id: "2",
    title: "Deep Sleep",
    description: "Drift into restful sleep with gentle sounds",
    imageUrl: "https://images.unsplash.com/photo-1511295742362-92c96b478480?ixlib=rb-4.0.3",
    duration: "30 min",
    category: "sleep",
  },
  {
    id: "3",
    title: "Anxiety Relief",
    description: "Release tension and find your center",
    imageUrl: "https://images.unsplash.com/photo-1528319725582-ddc096101511?ixlib=rb-4.0.3",
    duration: "15 min",
    category: "anxiety",
  },
  {
    id: "4",
    title: "Breathing Focus",
    description: "Control your breathing to calm your mind",
    imageUrl: "https://images.unsplash.com/photo-1515894274780-af5088f7114a?ixlib=rb-4.0.3",
    duration: "5 min",
    category: "breathing",
  },
];

const MeditationPage = () => {
  const [featuredMeditation] = useState(meditationData[0]);

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Guided Meditations</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search meditations..." className="pl-10 w-[250px]" />
          </div>
        </div>
        
        <div className="mb-12">
          <MeditationPlayer 
            title={featuredMeditation.title}
            description={featuredMeditation.description}
            imageUrl={featuredMeditation.imageUrl}
            duration={featuredMeditation.duration}
          />
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
            {meditationData.map((meditation) => (
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
                  <Button className="w-full mt-4">
                    Play Meditation
                  </Button>
                </CardContent>
              </Card>
            ))}
          </TabsContent>
          
          {["sleep", "morning", "anxiety", "focus", "quick"].map((category) => (
            <TabsContent key={category} value={category}>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {meditationData
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
                        <Button className="w-full mt-4">
                          Play Meditation
                        </Button>
                      </CardContent>
                    </Card>
                  ))}
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default MeditationPage;
