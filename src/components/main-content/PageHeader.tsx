import { Menu } from "lucide-react"
import { Button } from "../ui/button"
import { Separator } from "../ui/separator"
import { useSidebar } from "../ui/sidebar"

interface PageHeaderProps {
  title: string
}

export const PageHeader = ({ title }: PageHeaderProps) => {
  const { toggleSidebar, isMobile } = useSidebar()

  return (
    <>
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              className="md:hidden"
              onClick={toggleSidebar}
            >
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          )}
          <h1 className="text-2xl font-bold text-[#1E3D59]">{title}</h1>
        </div>
      </div>
      <Separator className="mb-6" />
    </>
  )
}