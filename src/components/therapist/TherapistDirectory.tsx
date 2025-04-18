
import { useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import TherapistCard from "@/components/common/TherapistCard";
import { Search, MapPin, Calendar, Filter } from "lucide-react";

interface Therapist {
  id: string;
  name: string;
  specialties: string[];
  rating: number;
  reviews: number;
  experience: number;
  price: number;
  image: string;
  available: boolean;
  location: string;
  distance: string;
  nextAvailable: string;
}

const therapists: Therapist[] = [
  {
    id: "1",
    name: "Dr. Sarah Johnson",
    specialties: ["Anxiety", "Depression", "Trauma"],
    rating: 4.9,
    reviews: 124,
    experience: 12,
    price: 120,
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Sarah",
    available: true,
    location: "New York, NY",
    distance: "2.5 miles",
    nextAvailable: "Today"
  },
  {
    id: "2",
    name: "Dr. Michael Chen",
    specialties: ["Stress", "Relationships", "Work-Life Balance"],
    rating: 4.7,
    reviews: 98,
    experience: 8,
    price: 150,
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Michael",
    available: true,
    location: "San Francisco, CA",
    distance: "Virtual Only",
    nextAvailable: "Tomorrow"
  },
  {
    id: "3",
    name: "Dr. Emily Rodriguez",
    specialties: ["Grief", "Self-Esteem", "Life Transitions"],
    rating: 4.8,
    reviews: 156,
    experience: 15,
    price: 135,
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Emily",
    available: false,
    location: "Chicago, IL",
    distance: "1.8 miles",
    nextAvailable: "Next Week"
  },
  {
    id: "4",
    name: "Dr. James Wilson",
    specialties: ["Addiction", "PTSD", "Depression"],
    rating: 4.6,
    reviews: 87,
    experience: 10,
    price: 110,
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=James",
    available: true,
    location: "Boston, MA",
    distance: "Virtual Only",
    nextAvailable: "Today"
  },
  {
    id: "5",
    name: "Dr. Lisa Thompson",
    specialties: ["Family Therapy", "Couples Counseling", "Parenting"],
    rating: 4.9,
    reviews: 210,
    experience: 18,
    price: 160,
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Lisa",
    available: true,
    location: "Seattle, WA",
    distance: "3.2 miles",
    nextAvailable: "Tomorrow"
  },
  {
    id: "6",
    name: "Dr. Robert Kim",
    specialties: ["Bipolar Disorder", "Schizophrenia", "Severe Mental Illness"],
    rating: 4.8,
    reviews: 76,
    experience: 14,
    price: 145,
    image: "https://api.dicebear.com/7.x/avataaars/svg?seed=Robert",
    available: false,
    location: "Los Angeles, CA",
    distance: "4.5 miles",
    nextAvailable: "Next Week"
  }
];

const TherapistDirectory = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [filteredTherapists, setFilteredTherapists] = useState(therapists);

  const handleSearch = (e: React.FormEvent) => {
    e.preventDefault();
    const filtered = therapists.filter(
      therapist => 
        therapist.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        therapist.specialties.some(s => s.toLowerCase().includes(searchTerm.toLowerCase())) ||
        therapist.location.toLowerCase().includes(searchTerm.toLowerCase())
    );
    setFilteredTherapists(filtered);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <form onSubmit={handleSearch} className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input 
            placeholder="Search by name, specialty, or location" 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="pl-10"
          />
        </form>
        
        <div className="flex gap-2">
          <Button variant="outline" className="flex items-center gap-2">
            <MapPin size={16} />
            <span className="hidden md:inline">Location</span>
          </Button>
          
          <Button variant="outline" className="flex items-center gap-2">
            <Calendar size={16} />
            <span className="hidden md:inline">Availability</span>
          </Button>
          
          <Button variant="outline" className="flex items-center gap-2">
            <Filter size={16} />
            <span className="hidden md:inline">Filters</span>
          </Button>
        </div>
      </div>
      
      <Tabs defaultValue="all">
        <TabsList className="mb-8">
          <TabsTrigger value="all">All Therapists</TabsTrigger>
          <TabsTrigger value="top">Top Rated</TabsTrigger>
          <TabsTrigger value="available">Available Today</TabsTrigger>
          <TabsTrigger value="video">Video Sessions</TabsTrigger>
        </TabsList>
        
        <TabsContent value="all" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTherapists.map(therapist => (
            <TherapistCard 
              key={therapist.id} 
              therapist={therapist} 
            />
          ))}
        </TabsContent>
        
        <TabsContent value="top" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTherapists
            .filter(t => t.rating >= 4.8)
            .map(therapist => (
              <TherapistCard 
                key={therapist.id} 
                therapist={therapist} 
              />
            ))}
        </TabsContent>
        
        <TabsContent value="available" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTherapists
            .filter(t => t.available && t.nextAvailable === "Today")
            .map(therapist => (
              <TherapistCard 
                key={therapist.id} 
                therapist={therapist} 
              />
            ))}
        </TabsContent>
        
        <TabsContent value="video" className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {filteredTherapists
            .filter(t => t.distance === "Virtual Only")
            .map(therapist => (
              <TherapistCard 
                key={therapist.id} 
                therapist={therapist} 
              />
            ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TherapistDirectory;
