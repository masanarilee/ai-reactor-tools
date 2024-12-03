import { LucideIcon } from "lucide-react"

export type MenuItem = {
  title: string
  icon: LucideIcon
  path: string
}

export type MenuItems = readonly MenuItem[]

export type SidebarState = "expanded" | "collapsed"