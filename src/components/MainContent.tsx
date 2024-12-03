'use client'

import { memo } from "react"
import { motion } from "framer-motion"
import { PageHeader } from "./main-content/PageHeader"

const contentVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 }
}

interface MainContentProps {
  title: string
  children: React.ReactNode
}

const MainContentComponent = ({ title, children }: MainContentProps) => {
  return (
    <motion.main
      variants={contentVariants}
      initial="initial"
      animate="animate"
      exit="exit"
      transition={{ duration: 0.2 }}
      className="flex-1 p-6 bg-gray-50 min-h-screen w-full"
    >
      <div className="w-full px-4">
        <PageHeader title={title} />
        {children}
      </div>
    </motion.main>
  )
}

export const MainContent = memo(MainContentComponent)