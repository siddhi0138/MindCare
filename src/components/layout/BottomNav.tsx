import { Link, useLocation } from 'react-router-dom';
import { Home, MessageCircle, FileText, Brain, User, LogIn } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

const authedItems = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/chat', label: 'Chat', icon: MessageCircle },
  { to: '/journal', label: 'Journal', icon: FileText },
  { to: '/coping-tools', label: 'Tools', icon: Brain },
  { to: '/profile', label: 'Profile', icon: User },
];

const guestItems = [
  { to: '/', label: 'Home', icon: Home },
  { to: '/resources', label: 'Resources', icon: FileText },
  { to: '/about', label: 'About', icon: Brain },
  { to: '/login', label: 'Log in', icon: LogIn },
];

const BottomNav = () => {
  const { pathname } = useLocation();
  const { isAuthenticated } = useAuth();
  const items = isAuthenticated ? authedItems : guestItems;

  return (
    <nav
      className="md:hidden fixed bottom-0 inset-x-0 z-40 bg-background border-t pb-[env(safe-area-inset-bottom)]"
      aria-label="Primary"
    >
      <div className="grid h-16" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }}>
        {items.map(({ to, label, icon: Icon }) => {
          const active = to === '/' ? pathname === '/' : pathname.startsWith(to);
          return (
            <Link
              key={to}
              to={to}
              className={cn(
                'flex flex-col items-center justify-center gap-1 text-xs',
                active ? 'text-primary' : 'text-muted-foreground'
              )}
            >
              <Icon className="h-5 w-5" />
              <span>{label}</span>
            </Link>
          );
        })}
      </div>
    </nav>
  );
};

export default BottomNav;
