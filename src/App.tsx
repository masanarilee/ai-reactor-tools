import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom"
import { ThemeProvider } from "next-themes"
import "./App.css"
import { RootLayout } from "./components/layouts/RootLayout"
import { SidebarProvider } from "./components/ui/sidebar"
import { TalentSummary } from "./pages/TalentSummary"
import JobSummary from "./pages/JobSummary"
import Counseling from "./pages/Counseling"
import CompanyAnalysis from "./pages/CompanyAnalysis"
import Scout from "./pages/Scout"

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
          <SidebarProvider>
            <Routes>
              <Route element={<RootLayout />}>
                <Route path="/" element={<Navigate to="/talent-summary" replace />} />
                <Route path="/talent-summary" element={<TalentSummary />} />
                <Route path="/job-summary" element={<JobSummary />} />
                <Route path="/counseling" element={<Counseling />} />
                <Route path="/company-analysis" element={<CompanyAnalysis />} />
                <Route path="/scout" element={<Scout />} />
              </Route>
            </Routes>
          </SidebarProvider>
        </Router>
      </QueryClientProvider>
    </ThemeProvider>
  )
}

export default App
