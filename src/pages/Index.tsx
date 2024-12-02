import { AppSidebar } from "@/components/AppSidebar"
import { MainContent } from "@/components/MainContent"
import { SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar"

const Index = () => {
  return (
    <SidebarProvider>
      <div className="min-h-screen flex w-full bg-background">
        <AppSidebar />
        <div className="fixed top-4 left-[280px] z-50">
          <SidebarTrigger />
        </div>
        <MainContent />
      </div>
    </SidebarProvider>
  )
}

export default Index