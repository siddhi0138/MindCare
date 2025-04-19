import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Star, Video } from 'lucide-react';
import { Avatar, AvatarImage, AvatarFallback } from '@/components/ui/avatar';

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
  
  const displayName = therapist ? therapist.name : name;
  const displaySpecialty = therapist ? therapist.specialties[0] : specialty;
  const displayImageUrl = therapist ? therapist.image : imageUrl;
  const displayRating = therapist ? therapist.rating : rating;
  const displayExperience = therapist ? `${therapist.experience} years` : experience;
  const displayPrice = therapist ? `$${therapist.price}/session` : price;
  const displayAvailableToday = therapist ? (therapist.nextAvailable === "Today") : availableToday;
  
  return (
    <Card className="border bg-card hover:shadow-lg transition-shadow duration-300">
      <div className="flex flex-col md:flex-row h-full">
        <div className="relative p-6 md:w-1/3 flex items-center justify-center bg-muted/10">
          <Avatar className="h-32 w-32">
            <AvatarImage src={displayImageUrl} alt={displayName} />
            <AvatarFallback>{displayName?.charAt(0)}</AvatarFallback>
          </Avatar>
        </div>
        
        <div className="flex flex-col flex-grow">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start gap-4">
              <div>
                <CardTitle className="text-xl font-semibold">{displayName}</CardTitle>
                <CardDescription className="text-sm">{displaySpecialty}</CardDescription>
              </div>
              {displayAvailableToday && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200 whitespace-nowrap">
                  Available Today
                </Badge>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="pb-2 flex-grow">
            {displayRating && (
              <div className="flex items-center gap-1.5 mb-4">
                <div className="flex">
                  {[...Array(5)].map((_, i) => (
                    <Star 
                      key={i} 
                      size={16} 
                      className={i < displayRating ? 'fill-yellow-400 text-yellow-400' : 'text-muted'} 
                    />
                  ))}
                </div>
                <span className="text-sm text-muted-foreground ml-1">({displayRating.toFixed(1)})</span>
              </div>
            )}
            
            <div className="space-y-3">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Experience</span>
                <span className="font-medium">{displayExperience}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Session Fee</span>
                <span className="font-medium">{displayPrice}</span>
              </div>
            </div>
          </CardContent>
          
          <CardFooter className="flex-col gap-2 pt-4 border-t">
            <Button className="w-full bg-primary hover:bg-primary/90" size="sm">
              <CalendarIcon className="mr-2 h-4 w-4" />
              Schedule Consultation
            </Button>
            <Button variant="outline" className="w-full" size="sm">
              <Video className="mr-2 h-4 w-4" />
              Book Video Session
            </Button>
          </CardFooter>
        </div>
      </div>
    </Card>
  );
};

export default TherapistCard;
