import { memo, useMemo } from "react"
import "@fontsource/noto-sans-jp"
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarMenu,
  SidebarTrigger,
  useSidebar
} from "@/components/ui/sidebar"
import { MENU_ITEMS } from "./sidebar/constants"
import { SidebarLogo } from "./sidebar/SidebarLogo"
import { SidebarMenuItemComponent } from "./sidebar/SidebarMenuItem"
import { Separator } from "./ui/separator"

export const AppSidebar = memo(function AppSidebar() {
  const { state } = useSidebar()
  
  const sidebarContent = useMemo(() => (
    <Sidebar collapsible="icon" className="border-r border-gray-200">
      <SidebarContent>
        <SidebarGroup>
          <div className="flex flex-col px-3 py-2 mb-6">
            <div className="flex items-center justify-between">
              <SidebarLogo state={state} />
              <div className="flex items-center justify-center w-8 h-8">
                <SidebarTrigger 
                  className="scale-90 hover:bg-sidebar-hover-bg transition-colors duration-200" 
                />
              </div>
            </div>
            <Separator className="mt-4" />
          </div>
          <SidebarGroupContent>
            <SidebarMenu className="px-2">
              {MENU_ITEMS.map((item, index) => (
                <SidebarMenuItemComponent 
                  key={item.path} 
                  item={item} 
                  index={index}
                />
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>
    </Sidebar>
  ), [state])

  return sidebarContent
})