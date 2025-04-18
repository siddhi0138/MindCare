
import MainLayout from "@/components/layout/MainLayout";
import ResourceCard from "@/components/resources/ResourceCard";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";

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
  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold">Mental Health Resources</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input placeholder="Search resources..." className="pl-10 w-[250px]" />
          </div>
        </div>
        
        <div className="mb-8 overflow-x-auto">
          <div className="flex gap-2">
            {categories.map((category) => (
              <Button 
                key={category} 
                variant={category === "All" ? "default" : "outline"} 
                size="sm"
                className="whitespace-nowrap"
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
            {resourceData.map((resource) => (
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
            ))}
          </TabsContent>
          
          <TabsContent value="podcasts">
            <div className="py-12 text-center">
              <h3 className="text-xl font-medium mb-2">Podcasts Coming Soon</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                We're curating a collection of mental health podcasts to support your wellbeing journey.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="videos">
            <div className="py-12 text-center">
              <h3 className="text-xl font-medium mb-2">Videos Coming Soon</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Check back soon for guided videos on mental health topics.
              </p>
            </div>
          </TabsContent>
          
          <TabsContent value="exercises">
            <div className="py-12 text-center">
              <h3 className="text-xl font-medium mb-2">Exercises Coming Soon</h3>
              <p className="text-muted-foreground max-w-md mx-auto">
                Interactive exercises to improve your mental wellbeing will be available soon.
              </p>
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default ResourcesPage;
