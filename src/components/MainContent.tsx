import { FileUploader } from "./FileUploader"
import { TextInput } from "./TextInput"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ChatInterface from "./ChatInterface"
import { useState } from "react"

export function MainContent() {
  const { toast } = useToast()
  const [isProcessing, setIsProcessing] = useState(false)
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])

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
      // 処理中の表示
      toast({
        title: "処理中",
        description: "サマリを生成しています..."
      })
      
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      // 成功時の表示
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

  return (
    <main className="flex-1 p-6">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-6">BizAssist</h1>
        
        <Tabs defaultValue="talent" className="space-y-6">
          <TabsList>
            <TabsTrigger value="talent">人材サマリ生成</TabsTrigger>
            <TabsTrigger value="job">案件サマリ生成</TabsTrigger>
            <TabsTrigger value="counseling">カウンセリング支援</TabsTrigger>
            <TabsTrigger value="scout">スカウト文生成</TabsTrigger>
          </TabsList>

          {/* 各タブのコンテンツ */}
          <TabsContent value="talent" className="space-y-6">
            <div className="grid gap-6">
              <FileUploader 
                onError={handleError}
                onSuccess={handleFileUploadSuccess}
                acceptedFileTypes={[".pdf", ".doc", ".docx", ".xls", ".xlsx"]}
              />
              <TextInput 
                label="補足情報"
                placeholder="面談メモや補足情報を入力してください"
              />
              <Button 
                onClick={handleProcess}
                disabled={isProcessing}
              >
                {isProcessing ? "生成中..." : "サマリを生成"}
              </Button>
              <ChatInterface />
            </div>
          </TabsContent>

          <TabsContent value="job" className="space-y-6">
            <div className="grid gap-6">
              <FileUploader 
                onError={handleError}
                onSuccess={handleFileUploadSuccess}
                acceptedFileTypes={[".pdf", ".doc", ".docx", ".xls", ".xlsx"]}
              />
              <TextInput 
                label="補足情報"
                placeholder="案件に関する補足情報を入力してください"
              />
              <Button 
                onClick={handleProcess}
                disabled={isProcessing}
              >
                {isProcessing ? "生成中..." : "サマリを生成"}
              </Button>
              <ChatInterface />
            </div>
          </TabsContent>

          <TabsContent value="counseling" className="space-y-6">
            <div className="grid gap-6">
              <FileUploader 
                onError={handleError}
                onSuccess={handleFileUploadSuccess}
                acceptedFileTypes={[".pdf", ".doc", ".docx", ".xls", ".xlsx"]}
              />
              <TextInput 
                label="補足情報"
                placeholder="カウンセリングに関する補足情報を入力してください"
              />
              <Button 
                onClick={handleProcess}
                disabled={isProcessing}
              >
                {isProcessing ? "生成中..." : "支援情報を生成"}
              </Button>
              <ChatInterface />
            </div>
          </TabsContent>

          <TabsContent value="scout" className="space-y-6">
            <div className="grid gap-6">
              <FileUploader 
                onError={handleError}
                onSuccess={handleFileUploadSuccess}
                acceptedFileTypes={[".pdf", ".doc", ".docx", ".xls", ".xlsx"]}
              />
              <TextInput 
                label="補足情報"
                placeholder="スカウトに関する補足情報を入力してください"
              />
              <Button 
                onClick={handleProcess}
                disabled={isProcessing}
              >
                {isProcessing ? "生成中..." : "スカウト文を生成"}
              </Button>
              <ChatInterface />
            </div>
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}
