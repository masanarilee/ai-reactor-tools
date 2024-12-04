import { useState, Suspense } from "react"
import { useToast } from "@/components/ui/use-toast"
import { generateCounselingReport } from "@/lib/talent-summary"
import AIGenerationVisualizer from "@/components/AIGenerationVisualizer"
import { InputSection } from "@/components/main-content/InputSection"
import { MainContent } from "@/components/MainContent"
import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"
import { motion } from "framer-motion"

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

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text)
      toast({
        title: "コピー完了",
        description: "クリップボードにコピーしました"
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "コピー失敗",
        description: "クリップボードへのアクセスが拒否されました"
      })
    }
  }

  const allContent = `
【人材要約】
${counselingData.summary}

【懸念点】
${counselingData.concerns}

【質問例】
${counselingData.questions}

【キャリアプラン】
${counselingData.careerPlan}
`

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

          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: 0.2 }}
          >
            <div className="bg-white p-6 rounded-lg shadow-sm">
              <div className="h-[60px] flex items-center justify-between">
                <h3 className="text-base font-medium text-[#1E3D59]">プレビュー</h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => handleCopy(allContent)}
                  className="text-[#17A2B8] border-[#17A2B8] hover:bg-[#17A2B8] hover:text-white"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  コピー
                </Button>
              </div>
              <pre className="min-h-[500px] p-8 bg-gray-50 rounded border border-gray-200 font-mono text-sm leading-relaxed whitespace-pre-wrap break-words text-left overflow-auto">
                {allContent || "生成されたサマリーがここに表示されます"}
              </pre>
            </div>
          </motion.div>
        </div>
      </Suspense>

      {isProcessing && <AIGenerationVisualizer isGenerating={isProcessing} />}
    </MainContent>
  )
}