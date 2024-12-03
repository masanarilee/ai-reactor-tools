import { useState, Suspense } from "react"
import { useToast } from "@/components/ui/use-toast"
import { MainContent } from "@/components/MainContent"
import { ScoutInputSection } from "@/components/scout/ScoutInputSection"
import { ScoutPreviewSection } from "@/components/scout/ScoutPreviewSection"
import AIGenerationVisualizer from "@/components/AIGenerationVisualizer"

export interface ScoutData {
  companyName: string
  recruiterName: string
}

export default function Scout() {
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)
  const [resumeFiles, setResumeFiles] = useState<File[]>([])
  const [jobFiles, setJobFiles] = useState<File[]>([])
  const [scoutData, setScoutData] = useState<ScoutData>({
    companyName: "",
    recruiterName: "",
  })
  const [previewContent, setPreviewContent] = useState("")
  const [resetTrigger, setResetTrigger] = useState(false)

  const handleError = (error: Error) => {
    toast({
      variant: "destructive",
      title: "エラーが発生しました",
      description: error.message
    })
  }

  const handleResumeUploadSuccess = (files: File[]) => {
    setResumeFiles(files)
  }

  const handleJobUploadSuccess = (files: File[]) => {
    setJobFiles(files)
  }

  const handleProcess = async () => {
    if (resumeFiles.length === 0 || jobFiles.length === 0) {
      toast({
        variant: "destructive",
        title: "入力が必要です",
        description: "職務経歴書と案件/求人票の両方をアップロードしてください"
      })
      return
    }

    if (!scoutData.companyName || !scoutData.recruiterName) {
      toast({
        variant: "destructive",
        title: "入力が必要です",
        description: "自社名と担当者名を入力してください"
      })
      return
    }

    setIsProcessing(true)
    try {
      // TODO: Implement scout message generation logic
      const generatedMessage = "スカウト文が生成されます"
      setPreviewContent(generatedMessage)
      
      toast({
        title: "完了",
        description: "スカウト文が生成されました"
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
    setResumeFiles([])
    setJobFiles([])
    setScoutData({
      companyName: "",
      recruiterName: "",
    })
    setPreviewContent("")
    setResetTrigger(prev => !prev)
    toast({
      title: "リセット完了",
      description: "すべての情報がクリアされました"
    })
  }

  return (
    <MainContent title="スカウト文生成">
      <Suspense fallback={<div className="animate-pulse">読み込み中...</div>}>
        <div className="grid lg:grid-cols-2 gap-8 mt-8">
          <ScoutInputSection 
            isProcessing={isProcessing}
            scoutData={scoutData}
            onScoutDataChange={setScoutData}
            onProcess={handleProcess}
            onReset={handleReset}
            handleError={handleError}
            handleResumeUploadSuccess={handleResumeUploadSuccess}
            handleJobUploadSuccess={handleJobUploadSuccess}
            resetTrigger={resetTrigger}
          />

          <ScoutPreviewSection 
            previewContent={previewContent}
          />
        </div>
      </Suspense>

      {isProcessing && <AIGenerationVisualizer isGenerating={isProcessing} />}
    </MainContent>
  )
}