import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { AnimatePresence, motion } from "framer-motion";
import Index from "./pages/Index";
import TalentSummary from "./pages/TalentSummary";
import JobSummary from "./pages/JobSummary";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
    },
  },
});

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        transition={{ duration: 0.2 }}
        className="h-full w-full"
      >
        <Routes location={location}>
          <Route path="/" element={<Index />} />
          <Route path="/talent-summary" element={<TalentSummary />} />
          <Route path="/job-summary" element={<JobSummary />} />
        </Routes>
      </motion.div>
    </AnimatePresence>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SidebarProvider>
        <BrowserRouter>
          <div className="min-h-screen flex w-full bg-background">
            <Toaster />
            <Sonner />
            <AppSidebar />
            <div className="flex-1 relative">
              <AnimatedRoutes />
            </div>
          </div>
        </BrowserRouter>
      </SidebarProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;