import { useState } from "react";
import MainLayout from "@/components/layout/MainLayout";
import ResourceCard from "@/components/resources/ResourceCard";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Search } from "lucide-react";
import { resourceData } from "@/data/resources";

const categories = [
  "All", "Anxiety", "Depression", "Sleep", "Stress", "Relationships", "Mindfulness", "Self-Care"
];

const ResourcesPage = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [savedResources, setSavedResources] = useState<string[]>([]);

  const filteredResources = resourceData.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || resource.category === selectedCategory;
    return matchesSearch && matchesCategory;
  });

  const toggleBookmark = (id: string) => {
    setSavedResources(prev => 
      prev.includes(id) ? prev.filter(savedId => savedId !== id) : [...prev, id]
    );
  };

  return (
    <MainLayout>
      <div className="max-w-6xl mx-auto">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4 mb-8">
          <h1 className="text-3xl font-bold">Mental Health Resources</h1>
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search resources..." 
              className="pl-10 w-full md:w-1/2"
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
                  isSaved={savedResources.includes(resource.id)}
                  onBookmarkToggle={() => toggleBookmark(resource.id)}
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
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default ResourcesPage;
