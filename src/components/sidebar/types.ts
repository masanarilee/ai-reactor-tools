import { LucideIcon } from "lucide-react"

export interface MenuItem {
  title: string
  path: string
  icon: LucideIcon
}

export type MenuItems = readonly MenuItem[]

export type SidebarState = "expanded" | "collapsed"