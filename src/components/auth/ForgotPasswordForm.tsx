import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Mail, ArrowLeft } from 'lucide-react';
// toast is already imported
// import { toast } from '@/components/ui/sonner';
import { useAuth } from '@/contexts/AuthContext'; // Import useAuth

interface ForgotPasswordFormProps {
  onBack: () => void;
}

const ForgotPasswordForm = ({ onBack }: ForgotPasswordFormProps) => {
  const { resetPassword, isLoading } = useAuth(); // Get resetPassword and isLoading from context
  const [email, setEmail] = useState('');
  // const [isLoading, setIsLoading] = useState(false); // Remove local isLoading state
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    // No need to set local isLoading as we use the one from context
    // setIsLoading(true);

    // Use the resetPassword function from context
    await resetPassword(email);

    // Assuming resetPassword function handles toasts on success/error,
    // we might only need to set the submitted state here on success.
    // However, the context function likely navigates or shows global state,
    // so maybe we just need to rely on its feedback. For now, let's
    // assume resetPassword shows its own toasts and we just set local submitted state.
    // Check your resetPassword implementation in AuthContext for exact behavior.
    // A simple approach: always set submitted after calling (success message handled by context)
    // Or only set submitted if the call *doesn't* throw an error (more complex error handling needed here).
    // Let's keep the simple approach for now:
    setIsSubmitted(true);


    // try {
    //   // Replace simulation with actual call
    //   await resetPassword(email);
    //   setIsSubmitted(true);
    //   // Toasts are likely handled within the resetPassword function in AuthContext
    //   // toast.success('Reset email sent', {
    //   //   description: `If an account exists for ${email}, you'll receive reset instructions.`
    //   // });
    // } catch (error) {
    //   // Errors are likely handled within the resetPassword function too
    //   // toast.error('Something went wrong', {
    //   //   description: 'Please try again later.'
    //   // });
    // } finally {
    //   // No need to set local isLoading
    //   // setIsLoading(false);
    // }
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
                disabled={isLoading} // Use context isLoading
              />
            </div>
          </div>
          <Button type="submit" className="w-full" disabled={isLoading}> {/* Use context isLoading */}
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
