import { memo } from "react"
import { SidebarState } from "./types"

interface SidebarLogoProps {
  state: SidebarState
}

export const SidebarLogo = memo(function SidebarLogo({ state }: SidebarLogoProps) {
  return (
    <span className={`text-3xl font-bold font-['Gotham'] ${state === 'collapsed' ? 'hidden' : ''}`}>
      <span className="text-[#1E3D59]">Biz</span>
      <span className="text-[#17A2B8]">Assist</span>
    </span>
  )
})