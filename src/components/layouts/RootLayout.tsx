import { Outlet } from "react-router-dom"
import { AppSidebar } from "../AppSidebar"
import { Toaster } from "../ui/sonner"

export function RootLayout() {
  return (
    <>
      <div className="flex min-h-screen w-full">
        <AppSidebar />
        <Outlet />
      </div>
      <Toaster />
    </>
  )
}