'use client'

import { FileUploader } from "./FileUploader"
import { TextInput } from "./TextInput"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { useState, memo, Suspense } from "react"
import { SidebarTrigger } from "./ui/sidebar"
import { Copy, RefreshCw } from "lucide-react"
import AIGenerationVisualizer from "./AIGenerationVisualizer"
import { useLocation } from "react-router-dom"
import { Separator } from "./ui/separator"
import { motion } from "framer-motion"

const contentVariants = {
  initial: { opacity: 0, y: 10 },
  animate: { opacity: 1, y: 0 },
  exit: { opacity: 0, y: -10 }
};

const MainContentComponent = () => {
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [previewContent, setPreviewContent] = useState("")
  const [supplementaryInfo, setSupplementaryInfo] = useState("")
  const location = useLocation()

  const menuTitles: { [key: string]: string } = {
    "/talent-summary": "人材サマリ生成",
    "/job-summary": "案件サマリ生成",
    "/counseling": "カウンセリング支援",
    "/scout": "スカウト文生成",
    "/": "人材サマリ生成"
  }

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
    if (uploadedFiles.length === 0) {
      toast({
        variant: "destructive",
        title: "ファイルが必要です",
        description: "サマリを生成するにはファイルをアップロードしてください"
      })
      return
    }

    setIsProcessing(true)
    try {
      toast({
        title: "処理中",
        description: "サマリを生成しています..."
      })
      
      // Simulate processing
      await new Promise(resolve => setTimeout(resolve, 1000))
      setPreviewContent("生成されたサマリの内容がここに表示されます。")
      
      toast({
        title: "完了",
        description: "サマリが生成されました"
      })
    } catch (error) {
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
      description: "すべての情報を削除しました"
    })
  }

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(previewContent)
      toast({
        title: "コピー完了",
        description: "内容をクリップボードにコピーしました"
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "コピーに失敗しました",
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
      <div className="container mx-auto max-w-7xl">
        <div className="flex items-center justify-between mb-2">
          <SidebarTrigger className="lg:hidden" />
          <h1 className="text-2xl font-bold text-[#1E3D59] ml-4">{currentMenuTitle}</h1>
        </div>
        <Separator className="mb-6" />
        
        <Suspense fallback={<div className="animate-pulse">Loading...</div>}>
          <div className="grid lg:grid-cols-2 gap-8 mt-8">
            {/* Input Column */}
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.1 }}
              className="space-y-8 bg-white p-8 rounded-lg shadow-sm"
            >
              <div>
                <div className="h-[60px] flex items-center">
                  <h3 className="text-lg font-medium text-[#1E3D59]">ファイルアップロード</h3>
                </div>
                <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 bg-gray-50">
                  <FileUploader 
                    onError={handleError}
                    onSuccess={handleFileUploadSuccess}
                    acceptedFileTypes={[".pdf", ".doc", ".docx", ".xls", ".xlsx"]}
                  />
                </div>
              </div>
              <div className="space-y-6">
                <h3 className="text-lg font-medium text-[#1E3D59] mb-4">補足情報</h3>
                <TextInput 
                  label=""
                  placeholder="補足情報を入力してください"
                  value={supplementaryInfo}
                  onChange={(e) => setSupplementaryInfo(e.target.value)}
                />
              </div>
              <div className="pt-4">
                <div className="flex gap-4">
                  <Button 
                    onClick={handleProcess}
                    disabled={isProcessing}
                    className="flex-1 bg-[#1E3D59] hover:bg-[#17A2B8]"
                  >
                    {isProcessing ? "生成中..." : "サマリを生成"}
                  </Button>
                  <Button
                    onClick={handleReset}
                    variant="outline"
                    className="flex-none px-6 border-[#1E3D59] text-[#1E3D59] hover:bg-[#1E3D59] hover:text-white"
                  >
                    <RefreshCw className="w-4 h-4 mr-2" />
                    リセット
                  </Button>
                </div>
              </div>
            </motion.div>

            {/* Preview Column */}
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ delay: 0.2 }}
              className="bg-white p-10 rounded-lg shadow-sm"
            >
              <div className="h-[60px] flex items-center justify-between">
                <h3 className="text-lg font-medium text-[#1E3D59]">プレビュー</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleCopy}
                  className="text-[#17A2B8] border-[#17A2B8] hover:bg-[#17A2B8] hover:text-white"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  コピー
                </Button>
              </div>
              <div className="min-h-[500px] p-8 bg-gray-50 rounded border border-gray-200 font-mono text-sm leading-relaxed">
                {previewContent || "生成されたサマリがここに表示されます"}
              </div>
            </motion.div>
          </div>
        </Suspense>
      </div>

      {isProcessing && <AIGenerationVisualizer isGenerating={isProcessing} />}
    </motion.main>
  )
}

export const MainContent = memo(MainContentComponent);