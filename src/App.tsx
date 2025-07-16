import { Toaster } from "@/components/ui/toaster"; 
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster as SonnerToaster } from "@/components/ui/sonner"; 

import AppRouter from './configs/router.tsx'; 


const queryClient = new QueryClient();


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
