import { memo } from "react"
import { useNavigate } from "react-router-dom"
import { SidebarState } from "./types"

interface SidebarLogoProps {
  state: SidebarState
}

export const SidebarLogo = memo(function SidebarLogo({ state }: SidebarLogoProps) {
  const navigate = useNavigate()

  return (
    <span 
      className={`text-3xl font-extrabold font-sans cursor-pointer ${state === 'collapsed' ? 'hidden' : ''}`}
      onClick={() => navigate("/")}
    >
      <span className="text-[#1E3D59]">Biz</span>
      <span className="text-[#17A2B8]">Assist</span>
    </span>
  )
})