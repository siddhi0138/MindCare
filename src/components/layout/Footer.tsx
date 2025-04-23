
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';
import { Heart, Phone } from 'lucide-react';


const Footer = () => {
  return (
    <footer className="bg-background border-t py-10 px-6">
      <div className="container mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6 md:gap-8">
          <div className="col-span-1 md:col-span-1">
            <Link to="/" className="flex items-center gap-2 mb-4">
              <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-serenity-purple-dark flex items-center justify-center">
                <span className="text-white font-bold">S</span>
              </div>
              <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-serenity-purple-dark">
                Serenity
              </span>
            </Link>
            <p className="text-muted-foreground text-sm mt-2">
              Your companion for mental wellness and emotional support.
            </p>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-4">Features</h3>
            <ul className="space-y-3">
              <li><Link to="/journal" className="text-muted-foreground hover:text-foreground transition-colors">Journaling</Link></li>
              <li><Link to="/meditation" className="text-muted-foreground hover:text-foreground transition-colors">Meditation</Link></li>
              <li><Link to="/chat" className="text-muted-foreground hover:text-foreground transition-colors">AI Support</Link></li>
              <li><Link to="/resources" className="text-muted-foreground hover:text-foreground transition-colors">Resources</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-4">Company</h3>
            <ul className="space-y-3">
              <li><Link to="/about" className="text-muted-foreground hover:text-foreground transition-colors">About Us</Link></li>
              <li><Link to="/contact" className="text-muted-foreground hover:text-foreground transition-colors">Contact</Link></li>
              <li><Link to="/privacy" className="text-muted-foreground hover:text-foreground transition-colors">Privacy Policy</Link></li>
              <li><Link to="/terms" className="text-muted-foreground hover:text-foreground transition-colors">Terms of Service</Link></li>
            </ul>
          </div>
          
          <div>
            <h3 className="font-medium text-lg mb-4">Emergency Support</h3>
            <p className="text-muted-foreground text-sm mb-4">
              If you're in crisis or need urgent help:
            </p>
            <Button asChild className="w-full mb-2 bg-destructive hover:bg-destructive/90 flex items-center gap-2">
            <a href="https://www.thelivelovelaughfoundation.org/helpline" target="_blank" rel="noopener noreferrer">
              <Phone size={16} /> Call To Action
            </a>
            </Button>
            <p className="text-xs text-muted-foreground mt-3">
              Always seek professional help for mental health emergencies.
            </p>
          </div>
        </div>
        
        <div className="border-t mt-10 pt-6 flex flex-col md:flex-row justify-between items-center">
          <p className="text-sm text-muted-foreground">
            © {new Date().getFullYear()} Serenity. All rights reserved.
          </p>
          <div className="flex items-center gap-2 mt-4 md:mt-0">
            <span className="text-sm text-muted-foreground">Made with</span>
            <Heart size={14} className="text-red-500" />
            <span className="text-sm text-muted-foreground">for mental wellbeing</span>
          </div>
        </div>
      </div>
    </footer>
  );
};

export default Footer;
