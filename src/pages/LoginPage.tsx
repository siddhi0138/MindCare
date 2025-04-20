
import { Link } from "react-router-dom";
import AuthForm from "@/components/auth/AuthForm";

const LoginPage = () => {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gradient-to-br from-background via-background to-secondary/20 p-4 sm:p-6 md:p-8">
      <div className="w-full max-w-md">
        <Link to="/" className="flex items-center gap-2 mb-8 justify-center">
          <div className="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-serenity-purple-dark flex items-center justify-center">
            <span className="text-white font-bold text-lg">S</span>
          </div>
          <span className="text-2xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-serenity-purple-dark">
            Serenity
          </span>
        </Link>
        
        <AuthForm defaultTab="login" />
        
        <div className="mt-8 text-center text-sm text-muted-foreground">
          <p>
            New here? <Link to="/signup" className="text-primary hover:underline font-medium">Create an account</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
