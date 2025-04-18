
import { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from '@/components/ui/sonner';

interface User {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  profileImage?: string;
}

interface AuthContextType {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (email: string, password: string) => Promise<void>;
  signup: (firstName: string, lastName: string, email: string, password: string) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const navigate = useNavigate();

  useEffect(() => {
    // Check if user is stored in localStorage on initial load
    const storedUser = localStorage.getItem('user');
    if (storedUser) {
      setUser(JSON.parse(storedUser));
    }
    setIsLoading(false);
  }, []);

  const login = async (email: string, password: string) => {
    try {
      setIsLoading(true);
      // In a real app, this would be an API call to your auth service
      // For now, we'll simulate a successful login with mock data
      
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Mock validation
      if (email === 'demo@example.com' && password === 'password') {
        const userData: User = {
          id: '1',
          email,
          firstName: 'Demo',
          lastName: 'User',
          profileImage: 'https://api.dicebear.com/7.x/avataaars/svg?seed=demo'
        };
        
        setUser(userData);
        localStorage.setItem('user', JSON.stringify(userData));
        toast.success('Login successful', {
          description: `Welcome back, Demo!`
        });
        navigate('/');
      } else {
        toast.error('Login failed', {
          description: 'Invalid email or password. Try demo@example.com / password'
        });
      }
    } catch (error) {
      console.error('Login error:', error);
      toast.error('Login failed', {
        description: 'Something went wrong. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const signup = async (firstName: string, lastName: string, email: string, password: string) => {
    try {
      setIsLoading(true);
      // In a real app, this would be an API call to your auth service
      
      // Simulate network request
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      // Create a new user object
      const userData: User = {
        id: Date.now().toString(),
        email,
        firstName,
        lastName,
        profileImage: `https://api.dicebear.com/7.x/avataaars/svg?seed=${firstName}`
      };
      
      setUser(userData);
      localStorage.setItem('user', JSON.stringify(userData));
      
      toast.success('Account created successfully', {
        description: `Welcome to Serenity, ${firstName}!`
      });
      
      navigate('/');
    } catch (error) {
      console.error('Signup error:', error);
      toast.error('Signup failed', {
        description: 'Something went wrong. Please try again.'
      });
    } finally {
      setIsLoading(false);
    }
  };

  const logout = () => {
    setUser(null);
    localStorage.removeItem('user');
    toast.success('Logged out successfully');
    navigate('/login');
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login,
        signup,
        logout
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
