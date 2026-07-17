import { useEffect, useState } from 'react';
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Badge } from "@/components/ui/badge";
import {
  DropdownMenu,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownMenuCheckboxItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
} from "@/components/ui/dropdown-menu";
import TherapistCard from "@/components/common/TherapistCard";
import { Search, MapPin, Calendar, Filter, X } from "lucide-react";
import { useAuth } from "@/contexts/AuthContext";
import { saveUserActivity } from "@/configs/firebase";

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

const uniqueLocations = Array.from(new Set(therapists.map((t) => t.location))).sort();
const uniqueSpecialties = Array.from(new Set(therapists.flatMap((t) => t.specialties))).sort();
const AVAILABILITY_OPTIONS = ["Today", "Tomorrow", "Next Week"];

const FILTERS_STORAGE_KEY = 'mindcare-therapist-filters';

interface StoredFilters {
  searchTerm: string;
  selectedLocations: string[];
  selectedAvailability: string[];
  selectedSpecialties: string[];
}

const loadStoredFilters = (): StoredFilters | null => {
  try {
    const raw = localStorage.getItem(FILTERS_STORAGE_KEY);
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
};

const TherapistDirectory = ({ initialSearch, onBooked }: { initialSearch?: string; onBooked?: () => void }) => {
  const { currentUser } = useAuth();
  const stored = loadStoredFilters();
  const [searchTerm, setSearchTerm] = useState(initialSearch || stored?.searchTerm || "");
  const [selectedLocations, setSelectedLocations] = useState<string[]>(stored?.selectedLocations || []);
  const [selectedAvailability, setSelectedAvailability] = useState<string[]>(stored?.selectedAvailability || []);
  const [selectedSpecialties, setSelectedSpecialties] = useState<string[]>(stored?.selectedSpecialties || []);

  useEffect(() => {
    if (initialSearch) setSearchTerm(initialSearch);
  }, [initialSearch]);

  // Persists filters across refreshes — they're view state, not user data, so localStorage
  // (not Firestore) is the right place for them.
  useEffect(() => {
    localStorage.setItem(FILTERS_STORAGE_KEY, JSON.stringify({
      searchTerm, selectedLocations, selectedAvailability, selectedSpecialties,
    }));
  }, [searchTerm, selectedLocations, selectedAvailability, selectedSpecialties]);

  const logFilterChange = (activityName: string) => {
    if (currentUser) {
      saveUserActivity({
        userId: currentUser.id,
        timestamp: new Date().toISOString(),
        activityType: 'filter',
        activityName,
        pageName: 'TherapistPage',
      });
    }
  };

  const toggleInList = (list: string[], setList: (v: string[]) => void, value: string) => {
    setList(list.includes(value) ? list.filter((v) => v !== value) : [...list, value]);
  };

  const term = searchTerm.trim().toLowerCase();
  const filteredTherapists = therapists.filter((therapist) => {
    const matchesSearch = !term ||
      therapist.name.toLowerCase().includes(term) ||
      therapist.specialties.some((s) => s.toLowerCase().includes(term)) ||
      therapist.location.toLowerCase().includes(term);
    const matchesLocation = selectedLocations.length === 0 || selectedLocations.includes(therapist.location);
    const matchesAvailability = selectedAvailability.length === 0 || selectedAvailability.includes(therapist.nextAvailable);
    const matchesSpecialty = selectedSpecialties.length === 0 ||
      therapist.specialties.some((s) => selectedSpecialties.includes(s));
    return matchesSearch && matchesLocation && matchesAvailability && matchesSpecialty;
  });

  const activeFilterCount = selectedLocations.length + selectedAvailability.length + selectedSpecialties.length;

  const clearAllFilters = () => {
    setSelectedLocations([]);
    setSelectedAvailability([]);
    setSelectedSpecialties([]);
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row gap-4 items-center">
        <div className="relative flex-1 w-full">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search by name, specialty, or location"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            onBlur={() => {
              if (searchTerm.trim()) logFilterChange(`Searched: ${searchTerm.trim()}`);
            }}
            className="pl-10"
          />
        </div>

        <div className="flex gap-2">
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <MapPin size={16} />
                <span className="hidden md:inline">Location</span>
                {selectedLocations.length > 0 && <Badge variant="secondary" className="ml-1">{selectedLocations.length}</Badge>}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Filter by location</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {uniqueLocations.map((location) => (
                <DropdownMenuCheckboxItem
                  key={location}
                  checked={selectedLocations.includes(location)}
                  onCheckedChange={() => {
                    toggleInList(selectedLocations, setSelectedLocations, location);
                    logFilterChange(`Filtered by location: ${location}`);
                  }}
                >
                  {location}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Calendar size={16} />
                <span className="hidden md:inline">Availability</span>
                {selectedAvailability.length > 0 && <Badge variant="secondary" className="ml-1">{selectedAvailability.length}</Badge>}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              <DropdownMenuLabel>Next available</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {AVAILABILITY_OPTIONS.map((option) => (
                <DropdownMenuCheckboxItem
                  key={option}
                  checked={selectedAvailability.includes(option)}
                  onCheckedChange={() => {
                    toggleInList(selectedAvailability, setSelectedAvailability, option);
                    logFilterChange(`Filtered by availability: ${option}`);
                  }}
                >
                  {option}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="flex items-center gap-2">
                <Filter size={16} />
                <span className="hidden md:inline">Filters</span>
                {selectedSpecialties.length > 0 && <Badge variant="secondary" className="ml-1">{selectedSpecialties.length}</Badge>}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end" className="max-h-72 overflow-y-auto">
              <DropdownMenuLabel>Specialty</DropdownMenuLabel>
              <DropdownMenuSeparator />
              {uniqueSpecialties.map((specialty) => (
                <DropdownMenuCheckboxItem
                  key={specialty}
                  checked={selectedSpecialties.includes(specialty)}
                  onCheckedChange={() => {
                    toggleInList(selectedSpecialties, setSelectedSpecialties, specialty);
                    logFilterChange(`Filtered by specialty: ${specialty}`);
                  }}
                >
                  {specialty}
                </DropdownMenuCheckboxItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>

          {activeFilterCount > 0 && (
            <Button variant="ghost" size="icon" onClick={clearAllFilters} title="Clear all filters">
              <X size={16} />
            </Button>
          )}
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
              onBooked={onBooked}
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
                onBooked={onBooked}
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
                onBooked={onBooked}
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
                onBooked={onBooked}
              />
            ))}
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default TherapistDirectory;
