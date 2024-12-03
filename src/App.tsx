import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter as Router, Routes, Route } from "react-router-dom"
import { ThemeProvider } from "next-themes"
import "./App.css"
import { RootLayout } from "./components/layouts/RootLayout"
import { SidebarProvider } from "./components/ui/sidebar"
import { TalentSummary } from "./pages/TalentSummary"
import JobSummary from "./pages/JobSummary"
import Counseling from "./pages/Counseling"
import CompanyAnalysis from "./pages/CompanyAnalysis"
import Scout from "./pages/Scout"
import TopPage from "./pages/TopPage"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5,
      gcTime: 1000 * 60 * 60,
    },
  },
})

function App() {
  return (
    <ThemeProvider attribute="class" defaultTheme="light" enableSystem={false}>
      <QueryClientProvider client={queryClient}>
        <Router>
          <SidebarProvider defaultOpen>
            <div className="flex min-h-screen w-full">
              <RootLayout>
                <Routes>
                  <Route path="/" element={<TopPage />} />
                  <Route path="/talent-summary" element={<TalentSummary />} />
                  <Route path="/job-summary" element={<JobSummary />} />
                  <Route path="/counseling" element={<Counseling />} />
                  <Route path="/company-analysis" element={<CompanyAnalysis />} />
                  <Route path="/scout" element={<Scout />} />
                </Routes>
              </RootLayout>
            </div>
          </SidebarProvider>
        </Router>
      </QueryClientProvider>
    </ThemeProvider>
  )
}

export default App