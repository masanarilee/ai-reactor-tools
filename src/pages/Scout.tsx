import { useState, Suspense } from "react"
import { useToast } from "@/components/ui/use-toast"
import { MainContent } from "@/components/MainContent"
import { ScoutInputSection } from "@/components/scout/ScoutInputSection"
import { ScoutPreviewSection } from "@/components/scout/ScoutPreviewSection"
import AIGenerationVisualizer from "@/components/AIGenerationVisualizer"
import { askClaude } from "@/lib/claude"

export interface ScoutData {
  companyName: string
  recruiterName: string
}

const MAX_CONTENT_LENGTH = 50000 // Limiting content length to be safe

const truncateContent = (content: string, maxLength: number) => {
  if (content.length <= maxLength) return content
  return content.substring(0, maxLength) + "\n...(truncated for length)"
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
        title: "コピー失敗",
        description: "クリップボードへのアクセスが拒否されました"
      })
    }
  }

  const generatePrompt = async (resumeContent: string, jobContent: string) => {
    // Truncate contents to prevent token limit issues
    const truncatedResume = truncateContent(resumeContent, MAX_CONTENT_LENGTH)
    const truncatedJob = truncateContent(jobContent, MAX_CONTENT_LENGTH)

    return `あなたは優秀なヘッドハンターです。
入力された会社名の担当者名の人間として、以下の情報を元に、個別化された魅力的なスカウト文を作成してください：

ヘッドハンター情報：
- 会社名：${scoutData.companyName}
- 担当者名：${scoutData.recruiterName}

求人情報：
- 求人票：${truncatedJob}

候補者情報：
${truncatedResume}

制約条件：
1. 最大1000文字以内
2. 候補者の経験と求人要件の具体的なマッチング点を2-3つ含める
3. 会社の魅力や候補者への期待を簡潔に伝える
4. 丁寧かつ専門的な口調を維持する

出力形式：
---
[候補者名]様

[スカウト本文]

${scoutData.companyName}
${scoutData.recruiterName}
---

必須要素：
- 候補者の具体的なスキル・経験への言及
- ポジションの具体的な説明
- アクションの呼びかけ（面談や質問等）`
  }

  const handleError = (error: Error) => {
    console.error('Error details:', error)
    let errorMessage = error.message
    
    // Check if the error is a token limit error
    if (errorMessage.includes('prompt is too long')) {
      errorMessage = "ファイルが大きすぎます。より小さなファイルを使用してください。"
    }
    
    toast({
      variant: "destructive",
      title: "エラーが発生しました",
      description: errorMessage
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
      // Read the contents of both files
      const resumeContent = await resumeFiles[0].text()
      const jobContent = await jobFiles[0].text()
      
      // Generate the prompt
      const prompt = await generatePrompt(resumeContent, jobContent)
      
      // Get response from Claude
      const response = await askClaude(prompt)
      setPreviewContent(response)
      
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
