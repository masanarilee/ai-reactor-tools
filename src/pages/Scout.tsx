import { useState, Suspense } from "react"
import { MainContent } from "@/components/MainContent"
import { ScoutInputSection } from "@/components/scout/ScoutInputSection"
import { ScoutPreviewSection } from "@/components/scout/ScoutPreviewSection"
import { useToast } from "@/components/ui/use-toast"

export interface ScoutData {
  companyName: string
  recruiterName: string
}

const Scout = () => {
  const [previewContent, setPreviewContent] = useState("")
  const [scoutData, setScoutData] = useState<ScoutData>({
    companyName: "",
    recruiterName: ""
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const [resetTrigger, setResetTrigger] = useState(false)
  
  const { toast } = useToast()

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(previewContent)
      toast({
        title: "コピー完了",
        description: "クリップボードにコピーしました"
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "コピーに失敗しました",
        description: "クリップボードへのアクセスが拒否されました"
      })
    }
  }

  const handleError = (error: Error) => {
    toast({
      variant: "destructive",
      title: "エラーが発生しました",
      description: error.message
    })
  }

  const handleResumeUploadSuccess = (files: File[]) => {
    // ... handle resume upload
  }

  const handleJobUploadSuccess = (files: File[]) => {
    // ... handle job upload
  }

  const handleProcess = () => {
    setIsProcessing(true)
    // ... process logic
    setIsProcessing(false)
  }

  const handleReset = () => {
    setScoutData({
      companyName: "",
      recruiterName: ""
    })
    setPreviewContent("")
    setResetTrigger(prev => !prev)
  }

  return (
    <MainContent title="スカウトメール作成">
      <div className="container mx-auto p-6">
        <div className="grid lg:grid-cols-2 gap-8">
          <Suspense fallback={<div>Loading...</div>}>
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
              onCopy={handleCopy}
            />
          </Suspense>
        </div>
      </div>
    </MainContent>
  )
}

export default Scout