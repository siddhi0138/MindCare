import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Clock, User, Bookmark } from 'lucide-react';

interface ResourceCardProps {
  id: string;
  title: string;
  description: string;
  imageUrl: string;
  category: string;
  readTime: string;
  author: string;
  isSaved?: boolean;
  onBookmarkToggle?: () => void;
}

const ResourceCard = ({
  id,
  title,
  description,
  imageUrl,
  category,
  readTime,
  author,
  isSaved = false,
  onBookmarkToggle,
}: ResourceCardProps) => {
  return (
    <Card className="overflow-hidden h-full flex flex-col border-primary/10 card-hover">
      <div 
        className="w-full h-48 bg-cover bg-center"
        style={{ backgroundImage: `url(${imageUrl})` }}
      />
      
      <CardHeader className="pb-2">
        <div className="flex justify-between items-start">
          <Badge variant="secondary" className="mb-2">
            {category}
          </Badge>
          <Button 
            variant="ghost" 
            size="icon" 
            className="h-8 w-8 rounded-full"
            onClick={onBookmarkToggle}
          >
            <Bookmark className={`h-4 w-4 ${isSaved ? 'fill-current' : ''}`} />
          </Button>
        </div>
        <CardTitle className="line-clamp-2">{title}</CardTitle>
      </CardHeader>
      
      <CardContent className="flex-grow">
        <CardDescription className="line-clamp-3">
          {description}
        </CardDescription>
      </CardContent>
      
      <CardFooter className="pt-2 flex justify-between border-t">
        <div className="flex items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1">
            <Clock className="h-3 w-3" />
            <span>{readTime}</span>
          </div>
          <div className="flex items-center gap-1">
            <User className="h-3 w-3" />
            <span>{author}</span>
          </div>
        </div>
        
        <Button variant="ghost" size="sm" className="text-primary" asChild>
          <Link to={`/resources/${id}`}>Read</Link>
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ResourceCard;
