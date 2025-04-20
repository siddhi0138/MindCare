import { Toaster } from "@/components/ui/toaster"; // Shadcn UI Toaster (often used with useToast)
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster as SonnerToaster } from "@/components/ui/sonner"; // Import the Sonner component, aliasing to avoid name conflict

// Import the centralized router configuration
import AppRouter from './configs/router.tsx'; // Update the import path to .tsx

// Create a client
const queryClient = new QueryClient();

// App component now just sets up providers and renders the router
const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <SonnerToaster />
      <AppRouter /> 

    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
