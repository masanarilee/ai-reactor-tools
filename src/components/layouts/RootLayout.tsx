import { memo } from "react"
import { Outlet } from "react-router-dom"
import { AppSidebar } from "../AppSidebar"
import { Toaster } from "../ui/sonner"

export const RootLayout = memo(() => {
  return (
    <>
      <AppSidebar />
      <Outlet />
      <Toaster />
    </>
  )
})

RootLayout.displayName = "RootLayout"