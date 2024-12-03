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

export const AppSidebar = memo(function AppSidebar() {
  const { state } = useSidebar()
  
  const sidebarContent = useMemo(() => (
    <Sidebar collapsible="icon" className="border-r border-gray-200">
      <SidebarContent>
        <SidebarGroup>
          <div className="flex items-center justify-between px-3 py-2 mb-6">
            <SidebarLogo state={state} />
            <SidebarTrigger className="scale-125" />
          </div>
          <SidebarGroupContent>
            <SidebarMenu>
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