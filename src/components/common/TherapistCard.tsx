
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CalendarIcon, Star, Video } from 'lucide-react';

interface TherapistCardProps {
  id: string;
  name: string;
  specialty: string;
  imageUrl: string;
  rating: number;
  experience: string;
  price: string;
  availableToday?: boolean;
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
}: TherapistCardProps) => {
  return (
    <Card className="border-primary/10 overflow-hidden card-hover h-full">
      <div className="flex flex-col md:flex-row h-full">
        <div 
          className="h-48 md:h-auto md:w-1/3 bg-cover bg-center"
          style={{ backgroundImage: `url(${imageUrl})` }}
        />
        
        <div className="flex flex-col flex-grow">
          <CardHeader className="pb-2">
            <div className="flex justify-between items-start">
              <div>
                <CardTitle className="text-xl">{name}</CardTitle>
                <CardDescription>{specialty}</CardDescription>
              </div>
              {availableToday && (
                <Badge variant="outline" className="bg-green-50 text-green-700 border-green-200">
                  Available Today
                </Badge>
              )}
            </div>
          </CardHeader>
          
          <CardContent className="pb-2 flex-grow">
            <div className="flex items-center gap-1 mb-2">
              <div className="flex">
                {[...Array(5)].map((_, i) => (
                  <Star 
                    key={i} 
                    size={14} 
                    className={i < rating ? 'fill-yellow-400 text-yellow-400' : 'text-muted'} 
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">({rating.toFixed(1)})</span>
            </div>
            
            <div className="space-y-2">
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Experience</span>
                <span className="font-medium">{experience}</span>
              </div>
              <div className="flex items-center justify-between text-sm">
                <span className="text-muted-foreground">Session Price</span>
                <span className="font-medium">{price}</span>
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
