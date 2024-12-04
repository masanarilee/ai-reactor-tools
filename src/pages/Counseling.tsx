import { useState, Suspense } from "react"
import { useToast } from "@/components/ui/use-toast"
import { generateCounselingReport } from "@/lib/talent-summary"
import AIGenerationVisualizer from "@/components/AIGenerationVisualizer"
import { InputSection } from "@/components/main-content/InputSection"
import { CounselingPreview } from "@/components/main-content/PreviewSection"
import { MainContent } from "@/components/MainContent"

export default function Counseling() {
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [supplementaryInfo, setSupplementaryInfo] = useState("")
  const [resetTrigger, setResetTrigger] = useState(false)
  const [counselingData, setCounselingData] = useState({
    summary: "",
    concerns: "",
    questions: "",
    careerPlan: ""
  })

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
        description: "分析を開始するには経歴書または補足情報を入力してください"
      })
      return
    }

    setIsProcessing(true)
    try {
      const result = await generateCounselingReport(
        uploadedFiles.length > 0 ? uploadedFiles[0] : null, 
        supplementaryInfo
      )
      
      setCounselingData(result)
      
      toast({
        title: "完了",
        description: "カウンセリング情報が生成されました"
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
    setCounselingData({
      summary: "",
      concerns: "",
      questions: "",
      careerPlan: ""
    })
    setSupplementaryInfo("")
    setResetTrigger(prev => !prev)
    toast({
      title: "リセット完了",
      description: "すべての情報がクリアされました"
    })
  }

  const handleCopy = async (text: string, section: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "コピー完了",
        description: `${section}をクリップボードにコピーしました`
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
    <MainContent title="カウンセリング支援">
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

          <CounselingPreview 
            sections={counselingData}
            onCopy={handleCopy}
          />
        </div>
      </Suspense>

      {isProcessing && <AIGenerationVisualizer isGenerating={isProcessing} />}
    </MainContent>
  )
}