import { memo, useCallback } from "react"
import { useLocation, useNavigate } from "react-router-dom"
import { MenuItem } from "./types"
import {
  SidebarMenuItem as BaseSidebarMenuItem,
  SidebarMenuButton,
  useSidebar
} from "@/components/ui/sidebar"

interface SidebarMenuItemProps {
  item: MenuItem
  index: number
}

export const SidebarMenuItemComponent = memo(function SidebarMenuItemComponent({ 
  item, 
  index 
}: SidebarMenuItemProps) {
  const location = useLocation()
  const navigate = useNavigate()
  const { setOpenMobile } = useSidebar()
  const isActive = location.pathname === item.path
  
  const handleClick = useCallback((e: React.MouseEvent) => {
    e.preventDefault()
    navigate(item.path)
    setOpenMobile(false) // モバイルメニューを閉じる
  }, [navigate, item.path, setOpenMobile])
  
  return (
    <BaseSidebarMenuItem>
      <SidebarMenuButton asChild>
        <a 
          href={item.path}
          onClick={handleClick}
          className={`
            text-[#1E3D59] hover:text-[#17A2B8] 
            text-base py-8 font-['Noto Sans JP'] tracking-wide 
            transition-all duration-300 ease-in-out 
            hover:bg-sidebar-hover-bg rounded-lg hover:scale-[1.02] 
            hover:shadow-sm relative group
            ${isActive ? 'bg-sidebar-hover-bg text-[#17A2B8] shadow-md scale-[1.02] border-l-4 border-[#17A2B8]' : ''}
            ${index === 0 ? 'mt-4' : ''}
            md:py-6 py-4 w-full flex items-center px-4
            touch-manipulation
          `}
        >
          <item.icon 
            className={`
              w-6 h-6 transition-transform duration-300 flex-shrink-0
              ${isActive ? 'text-[#17A2B8] scale-110' : 'text-[#1E3D59] group-hover:text-[#17A2B8] group-hover:scale-110'}
            `} 
          />
          <span className="ml-4 text-base relative whitespace-nowrap">
            {item.title}
            <span 
              className={`absolute bottom-0 left-0 w-full h-0.5 bg-[#17A2B8] transform transition-transform duration-300 origin-left ${
                isActive ? 'scale-x-100' : 'scale-x-0 group-hover:scale-x-100'
              }`}
            />
          </span>
        </a>
      </SidebarMenuButton>
    </BaseSidebarMenuItem>
  )
})