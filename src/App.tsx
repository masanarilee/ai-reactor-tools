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
      suspense: true,
    },
  },
});

const pageTransitionVariants = {
  initial: { opacity: 0, x: 20 },
  animate: { opacity: 1, x: 0 },
  exit: { opacity: 0, x: -20 },
};

const AnimatedRoutes = () => {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait" initial={false}>
      <motion.div
        key={location.pathname}
        variants={pageTransitionVariants}
        initial="initial"
        animate="animate"
        exit="exit"
        transition={{ 
          type: "tween", 
          ease: "easeInOut",
          duration: 0.15 
        }}
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
          <div className="min-h-screen flex w-full bg-background overflow-hidden">
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