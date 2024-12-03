import {
  Users,
  Briefcase,
  MessageSquare,
  Send,
  ChartBar,
} from "lucide-react"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarTrigger,
  useSidebar
} from "@/components/ui/sidebar"
import "@fontsource/noto-sans-jp"
import { useLocation } from "react-router-dom"

const menuItems = [
  {
    title: "人材サマリ生成",
    icon: Users,
    path: "/talent-summary"
  },
  {
    title: "案件サマリ生成",
    icon: Briefcase,
    path: "/job-summary"
  },
  {
    title: "カウンセリング支援",
    icon: MessageSquare,
    path: "/counseling"
  },
  {
    title: "企業分析",
    icon: ChartBar,
    path: "/company-analysis"
  },
  {
    title: "スカウト文生成",
    icon: Send,
    path: "/scout"
  }
]

export function AppSidebar() {
  const { state } = useSidebar();
  const location = useLocation();
  
  return (
    <Sidebar collapsible="icon" className="border-r border-gray-200">
      <SidebarContent>
        <SidebarGroup>
          <div className="flex items-center justify-between px-3 py-2 mb-6">
            <span className={`text-3xl font-bold font-['Gotham'] ${state === 'collapsed' ? 'hidden' : ''}`}>
              <span className="text-[#1E3D59]">Biz</span>
              <span className="text-[#17A2B8]">Assist</span>
            </span>
            <SidebarTrigger className="scale-125" />
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item, index) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a 
                      href={item.path} 
                      className={`
                        text-[#1E3D59] hover:text-[#17A2B8] 
                        text-base py-8 font-['Noto Sans JP'] tracking-wide 
                        transition-all duration-300 ease-in-out 
                        hover:bg-sidebar-hover-bg rounded-lg hover:scale-[1.02] 
                        hover:shadow-sm relative group
                        ${location.pathname === item.path ? 
                          'bg-sidebar-hover-bg text-[#17A2B8] shadow-md scale-[1.02] border-l-4 border-[#17A2B8]' : ''}
                        ${index === 0 ? 'mt-4' : ''}
                      `}
                    >
                      <item.icon 
                        className={`
                          w-38 h-38 transition-transform duration-300 
                          ${location.pathname === item.path ? 'text-[#17A2B8] scale-110' : 'text-[#1E3D59] group-hover:text-[#17A2B8] group-hover:scale-110'}
                        `} 
                      />
                      <span className="ml-4 text-base relative">
                        {item.title}
                        <span 
                          className={`absolute bottom-0 left-0 w-full h-0.5 bg-[#17A2B8] transform transition-transform duration-300 origin-left ${
                            location.pathname === item.path ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
                          }`}
                        ></span>
                      </span>
                    </a>
                  </SidebarMenuButton>
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  )
}