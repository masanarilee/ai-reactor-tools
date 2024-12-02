import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter as Router } from "react-router-dom"
import "./App.css"
import AppSidebar from "./components/AppSidebar"
import MainContent from "./components/MainContent"
import { Toaster } from "./components/ui/sonner"

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: Infinity,
      gcTime: 24 * 60 * 60 * 1000, // 24 hours
      refetchOnWindowFocus: false,
    },
  },
})

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <Router>
        <div className="flex min-h-screen">
          <AppSidebar />
          <MainContent />
        </div>
        <Toaster />
      </Router>
    </QueryClientProvider>
  )
}

export default App