import { useParams, useNavigate } from 'react-router-dom';
import MainLayout from '@/components/layout/MainLayout';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import { resourceData } from '@/data/resources';

const ResourceDetailPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  // Find the resource by id
  const resource = resourceData.find(r => r.id === id);

  if (!resource) {
    return (
      <MainLayout>
        <div className="max-w-4xl mx-auto py-12 text-center">
          <h2 className="text-2xl font-semibold mb-4">Resource Not Found</h2>
          <Button onClick={() => navigate('/resources')} variant="outline">
            Go Back
          </Button>
        </div>
      </MainLayout>
    );
  }

  return (
    <MainLayout>
      <div className="max-w-4xl mx-auto py-8">
        <Button 
          variant="ghost" 
          className="mb-6 flex items-center gap-2" 
          onClick={() => navigate('/resources')}
        >
          <ArrowLeft className="h-4 w-4" /> Back to Resources
        </Button>
        <h1 className="text-3xl font-bold mb-4">{resource.title}</h1>
        <img 
          src={resource.imageUrl} 
          alt={resource.title} 
          className="w-full h-64 object-cover rounded mb-6"
        />
        <p className="mb-4 text-muted-foreground">{resource.description}</p>
        <div className="flex gap-4 text-sm text-muted-foreground mb-8">
          <span>Category: {resource.category}</span>
          <span>Read Time: {resource.readTime}</span>
          <span>Author: {resource.author}</span>
        </div>
        {/* Additional detailed content can be added here */}
      </div>
    </MainLayout>
  );
};

export default ResourceDetailPage;
