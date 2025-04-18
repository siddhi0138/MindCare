
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { FaGoogle, FaApple, FaFacebook } from 'react-icons/fa';
import { Mail, Lock, Eye, EyeOff } from 'lucide-react';

interface AuthFormProps {
  defaultTab?: 'login' | 'signup';
}

const AuthForm = ({ defaultTab = 'login' }: AuthFormProps) => {
  const navigate = useNavigate();
  const [showPassword, setShowPassword] = useState(false);
  
  // Mock authentication function - would be replaced with real auth logic
  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Simulate login/signup success
    navigate('/');
  };

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border-primary/10">
      <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold">Welcome to Serenity</CardTitle>
        <CardDescription>
          Your journey to mental wellbeing starts here
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue={defaultTab} className="w-full">
          <TabsList className="grid w-full grid-cols-2 mb-6">
            <TabsTrigger value="login">Login</TabsTrigger>
            <TabsTrigger value="signup">Sign Up</TabsTrigger>
          </TabsList>
          
          <TabsContent value="login">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="email" 
                    placeholder="name@example.com" 
                    type="email" 
                    autoComplete="email" 
                    required 
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <div className="flex items-center justify-between">
                  <Label htmlFor="password">Password</Label>
                  <Button variant="link" className="text-xs p-0 h-auto" type="button">
                    Forgot password?
                  </Button>
                </div>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="password" 
                    type={showPassword ? "text" : "password"} 
                    required 
                    className="pl-10"
                  />
                  <Button 
                    type="button"
                    variant="ghost" 
                    size="sm" 
                    className="absolute right-0 top-0 h-10 px-3" 
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                </div>
              </div>
              <Button type="submit" className="w-full">Login</Button>
            </form>
          </TabsContent>
          
          <TabsContent value="signup">
            <form onSubmit={handleSubmit} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <Label htmlFor="firstName">First Name</Label>
                  <Input id="firstName" required />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="lastName">Last Name</Label>
                  <Input id="lastName" required />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="signupEmail">Email</Label>
                <div className="relative">
                  <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="signupEmail" 
                    placeholder="name@example.com" 
                    type="email" 
                    autoComplete="email" 
                    required 
                    className="pl-10"
                  />
                </div>
              </div>
              <div className="space-y-2">
                <Label htmlFor="signupPassword">Password</Label>
                <div className="relative">
                  <Lock className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                  <Input 
                    id="signupPassword" 
                    type={showPassword ? "text" : "password"} 
                    required 
                    className="pl-10"
                  />
                  <Button 
                    type="button"
                    variant="ghost" 
                    size="sm" 
                    className="absolute right-0 top-0 h-10 px-3" 
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    {showPassword ? <EyeOff size={16} /> : <Eye size={16} />}
                  </Button>
                </div>
              </div>
              <Button type="submit" className="w-full">Create Account</Button>
            </form>
          </TabsContent>
        </Tabs>

        <div className="relative my-6">
          <div className="absolute inset-0 flex items-center">
            <span className="w-full border-t" />
          </div>
          <div className="relative flex justify-center text-xs uppercase">
            <span className="bg-card px-2 text-muted-foreground">
              Or continue with
            </span>
          </div>
        </div>
        
        <div className="grid grid-cols-3 gap-3">
          <Button variant="outline" type="button" className="flex items-center justify-center gap-2">
            <FaGoogle className="text-red-500" />
          </Button>
          <Button variant="outline" type="button" className="flex items-center justify-center gap-2">
            <FaApple />
          </Button>
          <Button variant="outline" type="button" className="flex items-center justify-center gap-2">
            <FaFacebook className="text-blue-600" />
          </Button>
        </div>
      </CardContent>
      <CardFooter className="text-center text-xs text-muted-foreground">
        By continuing, you agree to our <Button variant="link" className="p-0 h-auto text-xs">Terms of Service</Button> and <Button variant="link" className="p-0 h-auto text-xs">Privacy Policy</Button>.
      </CardFooter>
    </Card>
  );
};

export default AuthForm;
