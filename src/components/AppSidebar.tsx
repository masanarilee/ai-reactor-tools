import {
  Users,
  Briefcase,
  MessageSquare,
  Send,
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
    title: "スカウト文生成",
    icon: Send,
    path: "/scout"
  }
]

export function AppSidebar() {
  const { state } = useSidebar();
  
  return (
    <Sidebar collapsible="icon">
      <SidebarContent>
        <SidebarGroup>
          <div className={`flex items-center justify-between px-4 py-3 ${state === 'collapsed' ? 'hidden' : ''}`}>
            <span className="text-3xl font-bold font-['Gotham']">
              <span className="text-[#1E3D59]">Biz</span>
              <span className="text-[#17A2B8]">Assist</span>
            </span>
            <SidebarTrigger className="scale-125" />
          </div>
          <div className={`flex justify-center px-4 py-2 ${state === 'collapsed' ? 'block' : 'hidden'}`}>
            <SidebarTrigger className="scale-125" />
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
              {menuItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <SidebarMenuButton asChild>
                    <a href={item.path} className="text-[#1E3D59] hover:text-[#17A2B8] text-base py-12">
                      <item.icon className="w-38 h-38" />
                      <span className="ml-4 text-base">{item.title}</span>
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