import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { SidebarProvider } from "@/components/ui/sidebar";
import { AppSidebar } from "@/components/AppSidebar";
import Index from "./pages/Index";
import TalentSummary from "./pages/TalentSummary";
import JobSummary from "./pages/JobSummary";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <SidebarProvider>
        <div className="min-h-screen flex w-full bg-background">
          <Toaster />
          <Sonner />
          <BrowserRouter>
            <AppSidebar />
            <div className="flex-1 transition-all duration-300 ease-in-out">
              <Routes>
                <Route path="/" element={<Index />} />
                <Route path="/talent-summary" element={<TalentSummary />} />
                <Route path="/job-summary" element={<JobSummary />} />
              </Routes>
            </div>
          </BrowserRouter>
        </div>
      </SidebarProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;