import { useState, Suspense } from "react"
import { useToast } from "@/components/ui/use-toast"
import { generateTalentSummary } from "@/lib/talent-summary"
import AIGenerationVisualizer from "@/components/AIGenerationVisualizer"
import { InputSection } from "@/components/main-content/InputSection"
import { PreviewSection } from "@/components/main-content/PreviewSection"
import { MainContent } from "@/components/MainContent"

export function TalentSummary() {
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [previewContent, setPreviewContent] = useState("")
  const [supplementaryInfo, setSupplementaryInfo] = useState("")
  const [resetTrigger, setResetTrigger] = useState(false)

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
        description: "サマリーを生成するには職務経歴書または面談メモを入力してください"
      })
      return
    }

    setIsProcessing(true)
    try {
      const summary = await generateTalentSummary(
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
    setResetTrigger(prev => !prev)
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
    <MainContent title="人材サマリ生成">
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
            resetTrigger={resetTrigger}
          />

          <PreviewSection 
            previewContent={previewContent}
            onCopy={handleCopy}
          />
        </div>
      </Suspense>

      {isProcessing && <AIGenerationVisualizer isGenerating={isProcessing} />}
    </MainContent>
  )
}