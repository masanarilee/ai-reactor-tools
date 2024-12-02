import { QueryClient, QueryClientProvider } from "@tanstack/react-query"
import { BrowserRouter as Router } from "react-router-dom"
import { ThemeProvider } from "next-themes"
import "./App.css"
import { AppSidebar } from "./components/AppSidebar"
import { MainContent } from "./components/MainContent"
import { Toaster } from "./components/ui/sonner"
import { SidebarProvider } from "./components/ui/sidebar"

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
    <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
      <QueryClientProvider client={queryClient}>
        <Router>
          <SidebarProvider>
            <div className="flex min-h-screen w-full">
              <AppSidebar />
              <MainContent />
            </div>
          </SidebarProvider>
          <Toaster />
        </Router>
      </QueryClientProvider>
    </ThemeProvider>
  )
}

export default App