import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, Outlet, useLocation } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import { AnimatePresence, motion } from "framer-motion";
import Index from "./pages/Index";
import TalentSummary from "./pages/TalentSummary";
import JobSummary from "./pages/JobSummary";
import Counseling from "./pages/Counseling";
import CompanyAnalysis from "./pages/CompanyAnalysis";
import Scout from "./pages/Scout";

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      refetchOnWindowFocus: false,
    },
  },
});

const pageTransitionVariants = {
  initial: { 
    opacity: 0,
    y: 10,
    scale: 0.99
  },
  animate: { 
    opacity: 1,
    y: 0,
    scale: 1
  },
  exit: { 
    opacity: 0,
    y: -10,
    scale: 0.99
  },
};

// レイアウトコンポーネント
const Layout = () => {
  const location = useLocation();
  
  return (
    <div className="min-h-screen flex w-full bg-background overflow-hidden">
      <AppSidebar />
      <div className="flex-1 relative">
        <AnimatePresence mode="wait" initial={false}>
          <motion.div
            key={location.pathname}
            variants={pageTransitionVariants}
            initial="initial"
            animate="animate"
            exit="exit"
            transition={{ 
              type: "spring",
              stiffness: 350,
              damping: 35,
              duration: 0.15
            }}
            className="h-full w-full absolute inset-0"
          >
            <Outlet />
          </motion.div>
        </AnimatePresence>
      </div>
    </div>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SidebarProvider>
        <BrowserRouter>
          <Toaster />
          <Sonner />
          <Routes>
            <Route element={<Layout />}>
              <Route path="/" element={<Index />} />
              <Route path="/talent-summary" element={<TalentSummary />} />
              <Route path="/job-summary" element={<JobSummary />} />
              <Route path="/counseling" element={<Counseling />} />
              <Route path="/company-analysis" element={<CompanyAnalysis />} />
              <Route path="/scout" element={<Scout />} />
            </Route>
          </Routes>
        </BrowserRouter>
      </SidebarProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;