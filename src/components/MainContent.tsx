import { FileUploader } from "./FileUploader"
import { TextInput } from "./TextInput"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { useState } from "react"
import { SidebarTrigger } from "./ui/sidebar"
import { Copy } from "lucide-react"

export function MainContent() {
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [previewContent, setPreviewContent] = useState("")

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
    <main className="flex-1 p-6 bg-gray-50">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-6">
          <SidebarTrigger className="lg:hidden" />
        </div>
        
        <div className="grid lg:grid-cols-2 gap-6">
          {/* Input Column */}
          <div className="space-y-6 bg-white p-6 rounded-lg shadow-sm">
            <FileUploader 
              onError={handleError}
              onSuccess={handleFileUploadSuccess}
              acceptedFileTypes={[".pdf", ".doc", ".docx", ".xls", ".xlsx"]}
            />
            <TextInput 
              label="補足情報"
              placeholder="補足情報を入力してください"
            />
            <Button 
              onClick={handleProcess}
              disabled={isProcessing}
              className="w-full bg-[#1E3D59] hover:bg-[#17A2B8]"
            >
              {isProcessing ? "生成中..." : "サマリを生成"}
            </Button>
          </div>

          {/* Preview Column */}
          <div className="bg-white p-6 rounded-lg shadow-sm">
            <div className="flex justify-between items-center mb-4">
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
            <div className="min-h-[400px] p-4 bg-gray-50 rounded border border-gray-200 font-mono text-sm">
              {previewContent || "生成されたサマリがここに表示されます"}
            </div>
          </div>
        </div>
      </div>
    </main>
  )
}