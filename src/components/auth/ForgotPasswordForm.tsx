import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, ArrowLeft } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';

interface ForgotPasswordFormProps {
  onBack: () => void;
}

const ForgotPasswordForm = ({ onBack }: ForgotPasswordFormProps) => {
  const { resetPassword, isLoading } = useAuth(); 
  const [email, setEmail] = useState('');
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    await resetPassword(email);
    setIsSubmitted(true);
  };

  if (isSubmitted) {
    // Submitted view remains the same
     return (
      <Card className="w-full max-w-md mx-auto shadow-lg border-primary/10">
        <CardHeader className="text-center">
          <CardTitle className="text-2xl font-bold">Check Your Email</CardTitle>
          <CardDescription>
            We've sent instructions to reset your password
          </CardDescription>
        </CardHeader>
        <CardContent className="text-center space-y-4">
          <p className="text-muted-foreground">
            If an account exists for <strong>{email}</strong>, you'll receive
            an email with instructions to reset your password.
          </p>
          <p className="text-sm text-muted-foreground">
            Please check your spam folder if you don't see the email.
          </p>
        </CardContent>
        <CardFooter>
          <Button onClick={onBack} variant="outline" className="w-full" disabled={isLoading}> {/* Disable if needed */}
            <ArrowLeft className="mr-2 h-4 w-4" />
            Back to Login
          </Button>
        </CardFooter>
      </Card>
    );
  }

  return (
    <Card className="w-full max-w-md mx-auto shadow-lg border-primary/10">
      {/* Header remains the same */}
       <CardHeader className="space-y-1 text-center">
        <CardTitle className="text-2xl font-bold">Reset Password</CardTitle>
        <CardDescription>
          Enter your email to receive reset instructions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="reset-email">Email</Label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
              <Input
                id="reset-email"
                placeholder="name@example.com"
                type="email"
                required
                className="pl-10"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={isLoading} 
              />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}> 
            {isLoading ? "Sending..." : "Send Reset Instructions"}
          </Button>
        </form>
      </CardContent>
      {/* Footer remains the same */}
      <CardFooter className="flex justify-center">
        <Button variant="ghost" size="sm" onClick={onBack} className="text-xs" disabled={isLoading}> {/* Disable if needed */}
          <ArrowLeft className="mr-2 h-4 w-4" />
          Back to Login
        </Button>
      </CardFooter>
    </Card>
  );
};

export default ForgotPasswordForm;
