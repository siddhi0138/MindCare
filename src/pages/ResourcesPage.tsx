import { useState, useEffect, useCallback } from "react";
import MainLayout from "@/components/layout/MainLayout";
import ResourceCard from "@/components/resources/ResourceCard";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Search, Bookmark } from "lucide-react";
import { resourceData } from "@/data/resources";
import { saveUserActivity, saveBookmark, removeBookmark, getSavedResourceIds } from "@/configs/firebase";
import { useAuth } from "@/contexts/AuthContext";
import { toast } from "@/components/ui/sonner";

const categories = [
  "All", "Anxiety", "Depression", "Sleep", "Stress", "Relationships", "Mindfulness", "Self-Care"
];

const ResourcesPage = () => {
  const { currentUser } = useAuth();
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [savedResources, setSavedResources] = useState<string[]>([]);
  const [selectedTab, setSelectedTab] = useState("articles");

  useEffect(() => {
    if (!currentUser) {
      setSavedResources([]);
      return;
    }
    getSavedResourceIds(currentUser.id).then(setSavedResources);
  }, [currentUser]);

  const logUserActivity = useCallback(async (activityType: string, activityName: string) => {
    if (!currentUser) return;
    try {
      await saveUserActivity({
        userId: currentUser.id,
        timestamp: new Date().toISOString(),
        activityType,
        activityName,
        pageName: "ResourcesPage"
      });
    } catch (error) {
      console.error("Failed to log user activity:", error);
    }
  }, [currentUser]);

  const filteredResources = (resourceType: string) => resourceData.filter(resource => {
    const matchesSearch = resource.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         resource.description.toLowerCase().includes(searchQuery.toLowerCase());
    const matchesCategory = selectedCategory === "All" || resource.category === selectedCategory;
    const matchesResourceType = resource.resourceType === resourceType
    return matchesSearch && matchesCategory && matchesResourceType;
  });

  const savedResourceItems = resourceData.filter(resource => savedResources.includes(resource.id));

  const toggleBookmark = async (id: string) => {
    if (!currentUser) {
      toast.error("Login required", { description: "Please log in to save resources." });
      return;
    }

    const isSaved = savedResources.includes(id);
    const resourceTitle = resourceData.find(r => r.id === id)?.title || "Resource";
    setSavedResources(prev => (isSaved ? prev.filter(savedId => savedId !== id) : [...prev, id]));

    if (isSaved) {
      await removeBookmark(currentUser.id, id);
      toast.success("Removed from Saved", { description: resourceTitle });
    } else {
      await saveBookmark(currentUser.id, id);
      toast.success("Saved for later", { description: resourceTitle });
    }
    logUserActivity("bookmark", isSaved ? "Removed bookmark" : "Saved bookmark");
  };


  const handleSearchChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setSearchQuery(e.target.value);
    logUserActivity("search", "searchQueryChange");
  };

  const handleCategorySelect = (category: string) => {
    setSelectedCategory(category);
    logUserActivity("category", "categorySelected");
  };


  const handleTabChange = (value: string) => {
    setSelectedTab(value);
    logUserActivity("tab", "tabChanged");
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
              onChange={handleSearchChange}
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
                onClick={() => handleCategorySelect(category)}
              >
                {category}
              </Button>
            ))}
          </div>
        </div>
        
        <Tabs defaultValue="articles" value={selectedTab} onValueChange={handleTabChange}>
          <TabsList className="mb-8">
            <TabsTrigger value="articles">Articles</TabsTrigger>
            <TabsTrigger value="podcasts">Podcasts</TabsTrigger>
            <TabsTrigger value="videos">Videos</TabsTrigger>
            <TabsTrigger value="saved" className="flex items-center gap-1.5">
              <Bookmark className="h-3.5 w-3.5" />
              Saved ({savedResources.length})
            </TabsTrigger>
          </TabsList>

          <TabsContent value="saved" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {!currentUser ? (
              <div className="col-span-3 py-12 text-center">
                <h3 className="text-xl font-medium mb-2">Log in to save resources</h3>
                <p className="text-muted-foreground">Your bookmarked articles, podcasts, and videos will show up here.</p>
              </div>
            ) : savedResourceItems.length > 0 ? (
              savedResourceItems.map((resource) => (
                <ResourceCard
                  key={resource.id}
                  id={resource.id}
                  title={resource.title}
                  description={resource.description}
                  imageUrl={resource.imageUrl}
                  category={resource.category}
                  readTime={resource.readTime}
                  author={resource.author}
                  isSaved={true}
                  onBookmarkToggle={() => toggleBookmark(resource.id)}
                />
              ))
            ) : (
              <div className="col-span-3 py-12 text-center">
                <h3 className="text-xl font-medium mb-2">Nothing saved yet</h3>
                <p className="text-muted-foreground">Tap the bookmark icon on any resource to save it here.</p>
              </div>
            )}
          </TabsContent>

          <TabsContent value="articles" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {filteredResources("article").length > 0 ? (
              filteredResources("article").map((resource) => (
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
              {filteredResources("podcast").length > 0 ?( filteredResources("podcast").map((resource) => (
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
                ))):(
              <div className="col-span-3 py-12 text-center">
                <h3 className="text-xl font-medium mb-2">No resources found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
              </div>
            )}
            </div>
          </TabsContent>
          
          <TabsContent value="videos">
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
               {filteredResources("video").length > 0 ? (filteredResources("video").map((resource) => (
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
              ))):(
                <div className="col-span-3 py-12 text-center">
                <h3 className="text-xl font-medium mb-2">No resources found</h3>
                <p className="text-muted-foreground">Try adjusting your search or filter criteria</p>
              </div>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </MainLayout>
  );
};

export default ResourcesPage;
