import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { Toaster as SonnerToaster } from "@/components/ui/sonner";

import AppRouter from './configs/router.tsx';
import ReminderChecker from '@/components/common/ReminderChecker';


const queryClient = new QueryClient();


const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <SonnerToaster />
      <ReminderChecker />
      <AppRouter />

    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
