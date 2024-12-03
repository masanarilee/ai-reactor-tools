import { SidebarTrigger } from "../ui/sidebar"
import { Separator } from "../ui/separator"

interface PageHeaderProps {
  title: string
}

export const PageHeader = ({ title }: PageHeaderProps) => {
  return (
    <>
      <div className="flex items-center justify-between mb-2">
        <SidebarTrigger className="lg:hidden" />
        <h1 className="text-2xl font-bold text-[#1E3D59] ml-4">{title}</h1>
      </div>
      <Separator className="mb-6" />
    </>
  )
}