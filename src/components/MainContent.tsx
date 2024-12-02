import { FileUploader } from "./FileUploader"
import { TextInput } from "./TextInput"
import { useToast } from "@/components/ui/use-toast"
import { Button } from "@/components/ui/button"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import ChatInterface from "./ChatInterface"
import { useState } from "react"
import { SidebarTrigger } from "./ui/sidebar"

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
      toast({
        title: "処理中",
        description: "サマリを生成しています..."
      })
      
      await new Promise(resolve => setTimeout(resolve, 1000))
      
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
    <main className="flex-1 p-6 bg-gray-50">
      <div className="container mx-auto">
        <div className="flex items-center justify-between mb-6">
          <SidebarTrigger className="lg:hidden" />
        </div>
        
        <Tabs defaultValue="talent" className="space-y-6">
          <TabsList className="bg-white border border-[#1E3D59]/10">
            <TabsTrigger value="talent" className="text-[#1E3D59] data-[state=active]:bg-[#17A2B8]/10">人材サマリ生成</TabsTrigger>
            <TabsTrigger value="job" className="text-[#1E3D59] data-[state=active]:bg-[#17A2B8]/10">案件サマリ生成</TabsTrigger>
            <TabsTrigger value="counseling" className="text-[#1E3D59] data-[state=active]:bg-[#17A2B8]/10">カウンセリング支援</TabsTrigger>
            <TabsTrigger value="scout" className="text-[#1E3D59] data-[state=active]:bg-[#17A2B8]/10">スカウト文生成</TabsTrigger>
          </TabsList>

          {["talent", "job", "counseling", "scout"].map((tab) => (
            <TabsContent key={tab} value={tab} className="space-y-6">
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
                    placeholder={`${tab === 'talent' ? '面談メモや補足情報' : 
                                 tab === 'job' ? '案件に関する補足情報' :
                                 tab === 'counseling' ? 'カウンセリングに関する補足情報' :
                                 'スカウトに関する補足情報'}を入力してください`}
                  />
                  <Button 
                    onClick={handleProcess}
                    disabled={isProcessing}
                    className="w-full bg-[#1E3D59] hover:bg-[#17A2B8]"
                  >
                    {isProcessing ? "生成中..." : "サマリを生成"}
                  </Button>
                </div>

                {/* Output Column */}
                <div className="bg-white p-6 rounded-lg shadow-sm">
                  <ChatInterface />
                </div>
              </div>
            </TabsContent>
          ))}
        </Tabs>
      </div>
    </main>
  )
}