'use client'

import { useState, memo, Suspense } from "react"
import { useToast } from "@/components/ui/use-toast"
import { useLocation } from "react-router-dom"
import { motion } from "framer-motion"
import { generateTalentSummary, generateJobSummary } from "@/lib/talent-summary"
import AIGenerationVisualizer from "./AIGenerationVisualizer"
import { InputSection } from "./main-content/InputSection"
import { PreviewSection } from "./main-content/PreviewSection"
import { PageHeader } from "./main-content/PageHeader"

const contentVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 }
}

const menuTitles: { [key: string]: string } = {
  "/talent-summary": "人材サマリ生成",
  "/job-summary": "求人サマリ生成",
  "/counseling": "カウンセリングサポート",
  "/scout": "スカウトメッセージ生成",
  "/company-analysis": "企業分析",
  "/": "人材サマリ生成"
}

const MainContentComponent = () => {
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [previewContent, setPreviewContent] = useState("")
  const [supplementaryInfo, setSupplementaryInfo] = useState("")
  const location = useLocation()

  const currentMenuTitle = menuTitles[location.pathname]

  const handleError = (error: Error) => {
    toast({
      variant: "destructive",
      title: "エラーが発生しました",
      description: error.message
    })
  }

  const handleFileUploadSuccess = (files: File[]) => {
    setUploadedFiles(files)
  }

  const handleProcess = async () => {
    if (uploadedFiles.length === 0 && !supplementaryInfo) {
      toast({
        variant: "destructive",
        title: "入力が必要です",
        description: location.pathname === "/job-summary" 
          ? "サマリーを生成するには案件情報/求人票または案件情報を入力してください"
          : "サマリーを生成するには職務経歴書または面談メモを入力してください"
      })
      return
    }

    setIsProcessing(true)
    try {
      const summary = location.pathname === "/job-summary"
        ? await generateJobSummary(
            uploadedFiles.length > 0 ? uploadedFiles[0] : null, 
            supplementaryInfo
          )
        : await generateTalentSummary(
            uploadedFiles.length > 0 ? uploadedFiles[0] : null, 
            supplementaryInfo
          )
      
      setPreviewContent(summary)
      
      toast({
        title: "完了",
        description: "サマリーが生成されました"
      })
    } catch (error) {
      console.error('Error in handleProcess:', error)
      if (error instanceof Error) {
        handleError(error)
      }
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReset = () => {
    setUploadedFiles([])
    setPreviewContent("")
    setSupplementaryInfo("")
    toast({
      title: "リセット完了",
      description: "すべての情報がクリアされました"
    })
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(previewContent)
      toast({
        title: "コピー完了",
        description: "内容がクリップボードにコピーされました"
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "コピー失敗",
        description: "クリップボードへのアクセスが拒否されました"
      })
    }
  }

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
        <PageHeader title={currentMenuTitle} />
        
        <Suspense fallback={<div className="animate-pulse">読み込み中...</div>}>
          <div className="grid lg:grid-cols-2 gap-8 mt-8">
            <InputSection 
              isProcessing={isProcessing}
              supplementaryInfo={supplementaryInfo}
              onSupplementaryInfoChange={setSupplementaryInfo}
              onProcess={handleProcess}
              onReset={handleReset}
              handleError={handleError}
              handleFileUploadSuccess={handleFileUploadSuccess}
            />

            <PreviewSection 
              previewContent={previewContent}
              onCopy={handleCopy}
            />
          </div>
        </Suspense>
      </div>

      {isProcessing && <AIGenerationVisualizer isGenerating={isProcessing} />}
    </motion.main>
  )
}

export const MainContent = memo(MainContentComponent)