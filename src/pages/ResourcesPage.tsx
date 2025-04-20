
import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import ResourceCard from "@/components/resources/ResourceCard";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Search, Filter } from "lucide-react";

const resourceData = [
  {
    id: "1",
    title: "Understanding Anxiety: Causes and Management Techniques",
    description: "Learn about the root causes of anxiety and discover effective techniques to manage anxiety symptoms in your daily life.",
    imageUrl: "https://images.unsplash.com/photo-1523240795612-9a054b0db644?ixlib=rb-4.0.3",
    category: "Anxiety",
    readTime: "8 min read",
    author: "Dr. Lisa Chen",
  },
  {
    id: "2",
    title: "Mindfulness Practices for Better Sleep",
    description: "Discover mindfulness techniques that can help you fall asleep faster and improve your overall sleep quality.",
    imageUrl: "https://images.unsplash.com/photo-1541199249251-f713e6145474?ixlib=rb-4.0.3",
    category: "Sleep",
    readTime: "5 min read",
    author: "Michael Torres",
  },
  {
    id: "3",
    title: "Depression: Signs, Symptoms, and Seeking Help",
    description: "Understanding the signs of depression and knowing when and how to seek professional help for yourself or a loved one.",
    imageUrl: "https://images.unsplash.com/photo-1514845505178-849cebf1a91d?ixlib=rb-4.0.3",
    category: "Depression",
    readTime: "10 min read",
    author: "Dr. James Wilson",
  },
  {
    id: "4",
    title: "Building Resilience: Bouncing Back from Setbacks",
    description: "Learn practical strategies for developing emotional resilience and improving your ability to cope with life's challenges.",
    imageUrl: "https://images.unsplash.com/photo-1513745405825-efaf9a49315f?ixlib=rb-4.0.3",
    category: "Resilience",
    readTime: "7 min read",
    author: "Sarah Johnson",
  },
  {
    id: "5",
    title: "Nutrition and Mental Health: The Food-Mood Connection",
    description: "Explore the important relationship between what you eat and how you feel, with tips for a brain-healthy diet.",
    imageUrl: "https://images.unsplash.com/photo-1498837167922-ddd27525d352?ixlib=rb-4.0.3",
    category: "Nutrition",
    readTime: "6 min read",
    author: "Emma Rodriguez, RD",
  },
  {
    id: "6",
    title: "Digital Detox: Reducing Screen Time for Better Mental Health",
    description: "Practical strategies to reduce your dependency on digital devices and create a healthier relationship with technology.",
    imageUrl: "https://images.unsplash.com/photo-1565803974275-dccd2f933cbb?ixlib=rb-4.0.3",
    category: "Digital Wellness",
    readTime: "5 min read",
    author: "Alex Thompson",
  },
];

const categories = [
  "All", "Anxiety", "Depression", "Sleep", "Stress", "Relationships", "Mindfulness", "Self-Care"
];

const ResourcesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  
  const filteredResources = resourceData.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold">Mental Health Resources</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input 
              placeholder="Search resources..." 
              className="pl-10 w-full md:w-[250px]" 
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
            />
          </div>
        </div>
        
        <div className="mb-8 overflow-x-auto">
          <div className="flex gap-2">
            {categories.map((category) => (
              <Button 
                key={category} 
                variant={category === selectedCategory ? "default" : "outline"} 
                size="sm"
                className="whitespace-nowrap"
                onClick={() => setSelectedCategory(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
        
        <Tabs defaultValue="articles">
          <TabsList className="mb-8">
            <TabsTrigger value="articles">Articles</TabsTrigger>
            <TabsTrigger value="podcasts">Podcasts</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="exercises">Exercises</TabsTrigger>
          </TabsList>
          
          <TabsContent value="articles" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources.length > 0 ? (
              filteredResources.map((resource) => (
                <ResourceCard 
                  key={resource.id}
                  id={resource.id}
                  title={resource.title}
                  description={resource.description}
                  imageUrl={resource.imageUrl}
                  category={resource.category}
                  readTime={resource.readTime}
                  author={resource.author}
                />
              ))
            ) : (
              <div className="col-span-3 py-12 text-center">
                <h3 className="text-xl font-medium mb-2">No resources found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
              </div>
            )}
          </TabsContent>
          
          <TabsContent value="podcasts">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ResourceCard 
                id="podcast1"
                title="Managing Anxiety in Uncertain Times"
                description="A calming discussion on practical ways to manage anxiety during periods of uncertainty and change."
                imageUrl="https://images.unsplash.com/photo-1581368087049-7034ed0d1e6f?ixlib=rb-4.0.3"
                category="Anxiety"
                readTime="45 min listen"
                author="Dr. Emma Watson"
              />
              <ResourceCard 
                id="podcast2"
                title="Sleep Better Tonight: A Guided Journey"
                description="Learn evidence-based techniques to improve your sleep quality and establish healthy sleep routines."
                imageUrl="https://images.unsplash.com/photo-1541199249251-f713e6145474?ixlib=rb-4.0.3"
                category="Sleep"
                readTime="32 min listen"
                author="Sleep Specialist Mark Johnson"
              />
              <ResourceCard 
                id="podcast3"
                title="Mindfulness for Beginners"
                description="Start your mindfulness journey with this beginner-friendly introduction to mindfulness practices."
                imageUrl="https://images.unsplash.com/photo-1506126613408-eca07ce68773?ixlib=rb-4.0.3"
                category="Mindfulness"
                readTime="28 min listen"
                author="Meditation Coach Sarah Lee"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="videos">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ResourceCard 
                id="video1"
                title="5-Minute Anxiety Relief Exercise"
                description="A quick guided exercise to help reduce anxiety symptoms in just five minutes."
                imageUrl="https://images.unsplash.com/photo-1545205597-3d9d02c29597?ixlib=rb-4.0.3"
                category="Anxiety"
                readTime="5 min video"
                author="Therapist Anna Garcia"
              />
              <ResourceCard 
                id="video2"
                title="Understanding Depression: Signs and Support"
                description="Learn to recognize signs of depression and how to support yourself or loved ones."
                imageUrl="https://images.unsplash.com/photo-1514845505178-849cebf1a91d?ixlib=rb-4.0.3"
                category="Depression"
                readTime="18 min video"
                author="Dr. Michael Chen"
              />
              <ResourceCard 
                id="video3"
                title="Guided Evening Meditation for Better Sleep"
                description="Wind down your day with this calming guided meditation designed to prepare your mind and body for restful sleep."
                imageUrl="https://images.unsplash.com/photo-1508672019048-805c876b67e2?ixlib=rb-4.0.3"
                category="Sleep"
                readTime="15 min video"
                author="Sleep Coach Rebecca Taylor"
              />
            </div>
          </TabsContent>
          
          <TabsContent value="exercises">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              <ResourceCard 
                id="exercise1"
                title="Progressive Muscle Relaxation"
                description="Follow along with this exercise to release tension throughout your body by systematically tensing and relaxing muscle groups."
                imageUrl="https://images.unsplash.com/photo-1518611012118-696072aa579a?ixlib=rb-4.0.3"
                category="Stress"
                readTime="10 min exercise"
                author="Physical Therapist David Wilson"
              />
              <ResourceCard 
                id="exercise2"
                title="Gratitude Journal Practice"
                description="An interactive exercise to help you establish a regular gratitude practice to improve mental wellbeing."
                imageUrl="https://images.unsplash.com/photo-1506784983877-45594efa4cbe?ixlib=rb-4.0.3"
                category="Self-Care"
                readTime="5 min exercise"
                author="Wellness Coach Jamie Rodriguez"
              />
              <ResourceCard 
                id="exercise3"
                title="5-4-3-2-1 Grounding Technique"
                description="A simple but effective sensory awareness exercise to help manage overwhelming feelings and anxiety."
                imageUrl="https://images.unsplash.com/photo-1508214751196-bcfd4ca60f91?ixlib=rb-4.0.3"
                category="Anxiety"
                readTime="3 min exercise"
                author="Anxiety Specialist Lisa Parker"
              />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default ResourcesPage;
