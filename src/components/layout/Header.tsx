import { useState, useEffect } from "react";
import { Link, useNavigate, useLocation } from "react-router-dom";
import {
  NavigationMenu,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  navigationMenuTriggerStyle,
} from "@/components/ui/navigation-menu";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetTrigger } from "@/components/ui/sheet";
import { useAuth } from "@/contexts/AuthContext";
import { cn } from "@/lib/utils";
import { Menu, X, User, Settings, LogOut, LineChart, Book, MessageCircle, Users, Activity, Brain, UserPlus, LogIn, Sparkles } from "lucide-react";
import { useIsMobile } from "@/hooks/use-mobile";

interface NavItem {
  name: string;
  href: string;
  icon?: React.ReactNode;
}

const Header = () => {
  const { user, isAuthenticated, logout } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const isMobile = useIsMobile();
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMenuOpen, setIsMenuOpen] = useState(false);

  const navItems: NavItem[] = [
    {
      name: "Journal",
      href: "/journal",
      icon: <Book className="h-4 w-4" />
    },
    {
      name: "Meditation",
      href: "/meditation",
      icon: <Brain className="h-4 w-4" />
    },
    {
      name: "Chat",
      href: "/chat",
      icon: <MessageCircle className="h-4 w-4" />
    },
    {
      name: "Assessments",
      href: "/assessment",
      icon: <Activity className="h-4 w-4" />
    },
    {
      name: "Therapists",
      href: "/therapists",
      icon: <User className="h-4 w-4" />
    },
    {
      name: "Coping Tools",
      href: "/coping-tools",
      icon: <Sparkles className="h-4 w-4" />
    },
    {
      name: "Resources",
      href: "/resources",
      icon: <Book className="h-4 w-4" />
    },
    {
      name: "Community",
      href: "/community",
      icon: <Users className="h-4 w-4" />
    }
  ];

  useEffect(() => {
    const handleScroll = () => {
      const scrollTop = window.scrollY;
      setIsScrolled(scrollTop > 10);
    };

    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleNavItemClick = (href: string) => {
    navigate(href);
    setIsMenuOpen(false);
  };

  const getUserInitials = () => {
    if (user?.firstName && user?.lastName) {
      return `${user.firstName.charAt(0)}${user.lastName.charAt(0)}`;
    }
    return "U";
  };

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300 border-b",
        isScrolled
          ? "bg-background/95 backdrop-blur-sm border-border shadow-sm"
          : "bg-background/80 backdrop-blur-md border-transparent"
      )}
    >
      <div className="container flex items-center justify-between h-16 px-4 sm:px-6 lg:px-8">
        <Link to="/" className="flex items-center gap-2 hover:opacity-80 transition-opacity">
          <div className="w-8 h-8 rounded-full bg-gradient-to-br from-primary to-serenity-purple-dark flex items-center justify-center">
            <span className="text-white font-bold text-sm">S</span>
          </div>
          <span className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-serenity-purple-dark">
            Serenity
          </span>
        </Link>

        {!isMobile && (
          <NavigationMenu className="hidden md:flex">
            <NavigationMenuList>
              {navItems.map((item) => (
                <NavigationMenuItem key={item.name}>
                  <Link to={item.href}>
                    <NavigationMenuLink
                      className={cn(
                        navigationMenuTriggerStyle(),
                        "text-sm transition-colors group",
                        location.pathname === item.href
                          ? "text-primary bg-primary/10"
                          : "text-muted-foreground hover:text-foreground hover:bg-accent/50"
                      )}
                    >
                      <div className="flex items-center gap-2">
                        {item.icon}
                        {item.name}
                      </div>
                    </NavigationMenuLink>
                  </Link>
                </NavigationMenuItem>
              ))}
            </NavigationMenuList>
          </NavigationMenu>
        )}

        <div className="flex items-center gap-2">
          {isAuthenticated ? (
            <DropdownMenu>
              <DropdownMenuTrigger asChild>
                <Button
                  variant="ghost"
                  className="relative h-10 w-10 rounded-full hover:bg-accent/50"
                  aria-label="User account menu"
                >
                  <Avatar>
                    <AvatarImage src={user?.profileImage} />
                    <AvatarFallback>{getUserInitials()}</AvatarFallback>
                  </Avatar>
                </Button>
              </DropdownMenuTrigger>
              <DropdownMenuContent align="end" className="w-56">
                <DropdownMenuLabel className="flex flex-col">
                  <span>{user?.firstName} {user?.lastName}</span>
                  <span className="text-xs font-normal text-muted-foreground">
                    {user?.email}
                  </span>
                </DropdownMenuLabel>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={() => navigate("/profile")}>
                  <User className="mr-2 h-4 w-4" />
                  <span>Profile</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/profile?tab=progress")}>
                  <LineChart className="mr-2 h-4 w-4" />
                  <span>Progress Dashboard</span>
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => navigate("/profile?tab=settings")}>
                  <Settings className="mr-2 h-4 w-4" />
                  <span>Settings</span>
                </DropdownMenuItem>
                <DropdownMenuSeparator />
                <DropdownMenuItem onClick={logout}>
                  <LogOut className="mr-2 h-4 w-4" />
                  <span>Log out</span>
                </DropdownMenuItem>
              </DropdownMenuContent>
            </DropdownMenu>
          ) : (
            <div className="flex items-center gap-2">
              <Button 
                variant="ghost" 
                onClick={() => navigate("/login")} 
                className="flex items-center gap-2 hover:bg-accent/50"
              >
                <LogIn className="h-4 w-4" />
                <span>Login</span>
              </Button>
              <Button 
                onClick={() => navigate("/signup")} 
                className="flex items-center gap-2"
              >
                <UserPlus className="h-4 w-4" />
                <span>Sign Up</span>
              </Button>
            </div>
          )}

          {isMobile && (
            <Sheet open={isMenuOpen} onOpenChange={setIsMenuOpen}>
              <SheetTrigger asChild>
                <Button variant="outline" size="icon" className="ml-2">
                  <Menu className="h-5 w-5" />
                  <span className="sr-only">Toggle menu</span>
                </Button>
              </SheetTrigger>
              <SheetContent side="right" className="w-[80%] sm:w-[350px] p-0">
                <SheetHeader className="p-4 border-b">
                  <SheetTitle className="flex items-center gap-2">
                    <div className="w-7 h-7 rounded-full bg-gradient-to-br from-primary to-serenity-purple-dark flex items-center justify-center">
                      <span className="text-white font-bold text-sm">S</span>
                    </div>
                    <span className="font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-serenity-purple-dark">
                      Serenity
                    </span>
                  </SheetTitle>
                </SheetHeader>
                <div className="flex flex-col py-2">
                  {navItems.map((item) => (
                    <Button
                      key={item.name}
                      variant="ghost"
                      className={cn(
                        "justify-start px-4 py-2 h-12 w-full text-left",
                        location.pathname === item.href
                          ? "bg-primary/10 text-primary"
                          : "text-muted-foreground hover:bg-accent/50"
                      )}
                      onClick={() => handleNavItemClick(item.href)}
                    >
                      {item.icon}
                      <span className="ml-3">{item.name}</span>
                    </Button>
                  ))}

                  <div className="border-t mt-2 pt-2">
                    {isAuthenticated ? (
                      <>
                        <Button
                          variant="ghost"
                          className="justify-start w-full px-4 py-2 h-12"
                          onClick={() => {
                            handleNavItemClick("/profile");
                          }}
                        >
                          <User className="h-4 w-4" />
                          <span className="ml-3">Profile</span>
                        </Button>
                        <Button
                          variant="ghost"
                          className="justify-start w-full px-4 py-2 h-12"
                          onClick={() => {
                            logout();
                            setIsMenuOpen(false);
                          }}
                        >
                          <LogOut className="h-4 w-4" />
                          <span className="ml-3">Log out</span>
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button
                          variant="ghost"
                          className="justify-start w-full px-4 py-2 h-12"
                          onClick={() => handleNavItemClick("/login")}
                        >
                          <LogIn className="h-4 w-4" />
                          <span className="ml-3">Login</span>
                        </Button>
                        <Button
                          variant="ghost"
                          className="justify-start w-full px-4 py-2 h-12"
                          onClick={() => handleNavItemClick("/signup")}
                        >
                          <UserPlus className="h-4 w-4" />
                          <span className="ml-3">Sign Up</span>
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </SheetContent>
            </Sheet>
          )}
        </div>
      </div>
    </header>
  );
};

export default Header;
