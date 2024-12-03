import { memo } from "react"
import { AppSidebar } from "../AppSidebar"
import { Toaster } from "../ui/sonner"

export const RootLayout = memo(({ children }: { children: React.ReactNode }) => {
  return (
    <>
      <AppSidebar />
      {children}
      <Toaster />
    </>
  )
})

RootLayout.displayName = "RootLayout"