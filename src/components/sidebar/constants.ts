import {
  Users,
  Briefcase,
  MessageSquare,
  Send,
  ChartBar,
} from "lucide-react"
import { MenuItems } from "./types"

export const MENU_ITEMS: MenuItems = [
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
] as const