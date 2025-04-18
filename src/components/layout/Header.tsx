
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { Button } from "@/components/ui/button";
import { Moon, Sun, Menu, X, Bell, UserCircle } from "lucide-react";
import { Sheet, SheetContent, SheetTrigger } from "@/components/ui/sheet";
import { useIsMobile } from "@/hooks/use-mobile";

const Header = () => {
  const [darkMode, setDarkMode] = useState(false);
  const isMobile = useIsMobile();

  const toggleDarkMode = () => {
    setDarkMode(!darkMode);
    document.documentElement.classList.toggle('dark');
  };

  const NavItems = () => (
    <>
      <Link to="/" className="text-lg font-medium hover:text-primary transition-colors">
        Home
      </Link>
      <Link to="/journal" className="text-lg font-medium hover:text-primary transition-colors">
        Journal
      </Link>
      <Link to="/meditation" className="text-lg font-medium hover:text-primary transition-colors">
        Meditate
      </Link>
      <Link to="/resources" className="text-lg font-medium hover:text-primary transition-colors">
        Resources
      </Link>
      <Link to="/community" className="text-lg font-medium hover:text-primary transition-colors">
        Community
      </Link>
    </>
  );

  return (
    <header className="w-full py-4 px-6 md:px-8 flex items-center justify-between bg-background/80 backdrop-blur-md z-50 border-b">
      <div className="flex items-center gap-2">
        <Link to="/" className="flex items-center gap-2">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-serenity-purple-dark flex items-center justify-center">
            <span className="text-white font-bold">S</span>
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-serenity-purple-dark">
            Serenity
          </span>
        </Link>
      </div>
      
      {!isMobile ? (
        <nav className="hidden md:flex items-center gap-8">
          <NavItems />
        </nav>
      ) : null}
      
      <div className="flex items-center gap-3">
        <Button variant="ghost" size="icon" onClick={toggleDarkMode} className="rounded-full">
          {darkMode ? <Sun size={20} /> : <Moon size={20} />}
        </Button>
        
        <Button variant="ghost" size="icon" className="rounded-full">
          <Bell size={20} />
        </Button>
        
        <Link to="/profile">
          <Button variant="ghost" size="icon" className="rounded-full">
            <UserCircle size={22} />
          </Button>
        </Link>
        
        {isMobile && (
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="ghost" size="icon" className="md:hidden">
                <Menu size={24} />
              </Button>
            </SheetTrigger>
            <SheetContent side="right" className="w-[80%] sm:w-[380px]">
              <div className="flex flex-col gap-8 pt-12">
                <NavItems />
                <Link to="/login">
                  <Button className="w-full">Sign In</Button>
                </Link>
                <Link to="/signup">
                  <Button variant="outline" className="w-full">Create Account</Button>
                </Link>
              </div>
            </SheetContent>
          </Sheet>
        )}
      </div>
    </header>
  );
};

export default Header;
