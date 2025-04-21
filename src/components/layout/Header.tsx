
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { useAuth } from "@/contexts/AuthContext";
import {
  Menu,
  X,
  BookOpen,
  MessageCircle,
  Activity,
  Users,
  Moon,
  FileText,
  User,
  LogOut,
  Brain,
  Heart
} from "lucide-react";
import { useState } from "react";

const Header = () => {
  const {currentUser, isAuthenticated, logout } = useAuth();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const toggleMobileMenu = () => {
    setMobileMenuOpen(!mobileMenuOpen);
  };

  return (
    <header className="sticky top-0 z-40 w-full bg-background shadow-sm">
      <div className="container flex h-16 items-center justify-between px-4 sm:px-6 lg:px-8">
          <Link to="/" className="flex items-center justify-start gap-2">
            <Heart className="h-6 w-6 text-serenity-purple" />
            <span className="text-xl font-bold">Serenity</span>
          </Link>

        {/* Desktop Navigation */}
        <nav className="hidden md:flex space-x-6">
          {isAuthenticated && (
            <>
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-1.5">
                    <FileText className="h-4 w-4" />
                    <Link to="/journal" className="w-full">Journal</Link>
                  </Button>
                </DropdownMenuTrigger>
              </DropdownMenu>
              
              <Button variant="ghost" asChild>
                <Link to="/meditation" className="flex items-center gap-1.5">
                  <Moon className="h-4 w-4" />
                  <span>Meditation</span>
                </Link>
              </Button>
              
              <Button variant="ghost" asChild>
                <Link to="/chat" className="flex items-center gap-1.5">
                  <MessageCircle className="h-4 w-4" />
                  <span>Chat</span>
                </Link>
              </Button>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-1.5">
                    <Brain className="h-4 w-4" />
                    <span>Tools</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <Link to="/coping-tools" className="w-full">Coping Tools</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/assessment" className="w-full">Assessments</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/exercises" className="w-full">Exercises</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
              
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="flex items-center gap-1.5">
                    <BookOpen className="h-4 w-4" />
                    <span>Resources</span>
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent>
                  <DropdownMenuItem asChild>
                    <Link to="/resources" className="w-full">Library</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/therapists" className="w-full">Find Therapists</Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild>
                    <Link to="/community" className="w-full">Community</Link>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </>
          )}
        </nav>

        <div className="flex items-center gap-4">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-8 w-8 rounded-full"
                >
                  <Avatar className="h-8 w-8">
                    <AvatarImage src={currentUser?.profileImage} alt={currentUser?.firstName} />
                    <AvatarFallback>
                      {currentUser?.firstName?.[0]}
                      {currentUser?.lastName?.[0]}
                    </AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent className="w-full md:w-56" align="end" forceMount>
                <DropdownMenuLabel className="font-normal">
                  <div className="flex flex-col space-y-1">
                    <p className="text-sm font-medium leading-none">
                      {currentUser?.firstName} {currentUser?.lastName}
                    </p>
                    <p className="text-xs leading-none text-muted-foreground">
                      {currentUser?.email}
                    </p>
                  </div>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem asChild>
                  <Link to="/profile" className="cursor-pointer flex w-full items-center">
                    <User className="mr-2 h-4 w-4" />
                    <span>Profile</span>
                  </Link>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={logout} className="cursor-pointer">
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="hidden md:flex items-center space-x-4">
              <Button variant="ghost" asChild>
                <Link to="/login">Log in</Link>
              </Button>
              <Button asChild>
                <Link to="/signup">Sign up</Link>
              </Button>
            </div>
          )}

          {/* Mobile menu button */}
          <Button
            variant="ghost"
            size="icon"
            className="md:hidden"
            onClick={toggleMobileMenu}
          >
            <Menu className="h-6 w-6" />
            <span className="sr-only">Toggle menu</span>
          </Button>
        </div>
      </div>

      {/* Mobile menu */}
      {mobileMenuOpen && (
        <div className="md:hidden fixed inset-0 z-50 bg-background">
          <div className="container flex h-16 items-center px-4 sm:px-6">
            <Link to="/" className="flex items-center gap-2">
              <Heart className="h-6 w-6 text-serenity-purple" />
              <span className="text-xl font-bold">Serenity</span>
            </Link>
            
            <Button
              variant="ghost"
              size="icon"
              className="ml-auto"
              onClick={toggleMobileMenu}
            >
              <X className="h-6 w-6" />
              <span className="sr-only">Close menu</span>
            </Button>
          </div>
          
          <nav className="container px-4 sm:px-6 pb-6 space-y-1">
            {isAuthenticated ? (
              <>
                <div className="pt-4 pb-6 border-b">
                  <div className="flex items-center gap-4 mb-4">
                    <Avatar className="h-10 w-10">
                      <AvatarImage src={currentUser?.profileImage} alt={currentUser?.firstName} />
                      <AvatarFallback>
                        {currentUser?.firstName?.[0]}
                        {currentUser?.lastName?.[0]}
                      </AvatarFallback>
                    </Avatar>
                    <div>
                      <p className="font-medium"> {currentUser?.firstName} {currentUser?.lastName}
                      </p>
                      <p className="text-sm text-muted-foreground">{currentUser?.email}</p>
                    </div>
                  </div>
                  <div className="flex gap-4">
                    <Link to="/profile">
                      <Button asChild variant="outline" size="sm" className="flex-1">
                        Profile
                      </Button> </Link>
                    <Button onClick={logout} size="sm" className="flex-1">
                      Log out
                    </Button>
                  </div>
                </div>
                
                <div className="space-y-1 py-2">
                  <p className="text-sm font-medium text-muted-foreground px-2 py-1">
                    Journal
                  </p>
                  <Link
                    to="/journal"
                    className="flex items-center gap-3 px-2 py-1.5 text-sm rounded-md hover:bg-muted"
                    onClick={toggleMobileMenu}
                  >
                    <FileText className="h-4 w-4" />
                    Thought Journal
                  </Link>
                  <Link
                    to="/mood-journal"
                    className="flex items-center gap-3 px-2 py-1.5 text-sm rounded-md hover:bg-muted"
                    onClick={toggleMobileMenu}
                  >
                    <Activity className="h-4 w-4" />
                    Mood Journal
                  </Link>
                </div>
                
                <Link
                  to="/meditation"
                  className="flex items-center gap-3 px-2 py-1.5 text-sm rounded-md hover:bg-muted"
                  onClick={toggleMobileMenu}
                >
                  <Moon className="h-4 w-4" />
                  Meditation
                </Link>
                
                <Link
                  to="/chat"
                  className="flex items-center gap-3 px-2 py-1.5 text-sm rounded-md hover:bg-muted"
                  onClick={toggleMobileMenu}
                >
                  <MessageCircle className="h-4 w-4" />
                  Chat
                </Link>
                
                <div className="space-y-1 py-2">
                  <p className="text-sm font-medium text-muted-foreground px-2 py-1">
                    Tools
                  </p>
                  <Link
                    to="/coping-tools"
                    className="flex items-center gap-3 px-2 py-1.5 text-sm rounded-md hover:bg-muted"
                    onClick={toggleMobileMenu}
                  >
                    <Brain className="h-4 w-4" />
                    Coping Tools
                  </Link>
                  <Link
                    to="/assessment"
                    className="flex items-center gap-3 px-2 py-1.5 text-sm rounded-md hover:bg-muted"
                    onClick={toggleMobileMenu}
                  >
                    <Activity className="h-4 w-4" />
                    Assessments

                  </Link>
                  <Link
                    to="/exercises"
                    className="flex items-center gap-3 px-2 py-1.5 text-sm rounded-md hover:bg-muted"
                    onClick={toggleMobileMenu}
                  >
                    Exercises

                  </Link>

                </div>
                
                <div className="space-y-1 py-2">
                  <p className="text-sm font-medium text-muted-foreground px-2 py-1">
                    Resources
                  </p>
                  <Link
                    to="/resources"
                    className="flex items-center gap-3 px-2 py-1.5 text-sm rounded-md hover:bg-muted"
                    onClick={toggleMobileMenu}
                  >
                    <BookOpen className="h-4 w-4" />
                    Library
                  </Link>
                  <Link
                    to="/therapists"
                    className="flex items-center gap-3 px-2 py-1.5 text-sm rounded-md hover:bg-muted"
                    onClick={toggleMobileMenu}
                  >
                    <User className="h-4 w-4" />
                    Find Therapists
                  </Link>

                      <Link

                    to="/community"
                    className="flex items-center gap-3 px-2 py-1.5 text-sm rounded-md hover:bg-muted"
                    onClick={toggleMobileMenu}
                  >
                    <Users className="h-4 w-4" />
                    Community
                  </Link>

                </div>
              </>
            ) : (
              <div className="pt-4 flex flex-col space-y-3">
                <Button asChild variant="outline">
                  <Link to="/login" onClick={toggleMobileMenu}>
                    Log in
                  </Link>
                </Button>
                <Button asChild>
                  <Link to="/signup" onClick={toggleMobileMenu}>
                    Sign up
                  </Link>
                </Button>
              </div>
            )}
          </nav>
        </div>
      )}
    </header>
  );
};

export default Header;
