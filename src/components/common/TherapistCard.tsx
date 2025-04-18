
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Star, Video } from 'lucide-react';

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

interface TherapistCardProps {
  id?: string;
  name?: string;
  specialty?: string;
  imageUrl?: string;
  rating?: number;
  experience?: string;
  price?: string;
  availableToday?: boolean;
  therapist?: Therapist;
}

const TherapistCard = ({
  id,
  name,
  specialty,
  imageUrl,
  rating,
  experience,
  price,
  availableToday = false,
  therapist,
}: TherapistCardProps) => {
  
  // Use the therapist object if provided, otherwise use the individual props
  const displayName = therapist ? therapist.name : name;
  const displaySpecialty = therapist ? therapist.specialties[0] : specialty;
  const displayImageUrl = therapist ? therapist.image : imageUrl;
  const displayRating = therapist ? therapist.rating : rating;
  const displayExperience = therapist ? `${therapist.experience} years` : experience;
  const displayPrice = therapist ? `$${therapist.price}/session` : price;
  const displayAvailableToday = therapist ? (therapist.nextAvailable === "Today") : availableToday;
  
  return (
    <Card className="border-primary/10 overflow-hidden card-hover h-full">
      <div className="flex flex-col md:flex-row h-full">
        <div 
          className="h-48 md:h-auto md:w-1/3 bg-cover bg-center"
          style={{ backgroundImage: `url(${displayImageUrl})` }}
        />
        
        <div className="flex flex-col flex-grow">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">{displayName}</CardTitle>
                <CardDescription>{displaySpecialty}</CardDescription>
              </div>
              {displayAvailableToday && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Available Today
                </Badge>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="pb-2 flex-grow">
            {displayRating && (
              <div className="flex items-center gap-1 mb-2">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={14} 
                      className={i < displayRating ? 'fill-yellow-400 text-yellow-400' : 'text-muted'} 
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground">({displayRating.toFixed(1)})</span>
              </div>
            )}
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Experience</span>
                <span className="font-medium">{displayExperience}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Session Price</span>
                <span className="font-medium">{displayPrice}</span>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex-col gap-2 pt-2 border-t">
            <Button className="w-full" asChild>
              <span className="flex items-center gap-2">
                <CalendarIcon size={16} /> Book Session
              </span>
            </Button>
            <Button variant="outline" className="w-full" asChild>
              <span className="flex items-center gap-2">
                <Video size={16} /> Video Consult
              </span>
            </Button>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
};

export default TherapistCard;
