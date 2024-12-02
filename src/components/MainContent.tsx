import { FileUploader } from "./FileUploader"
import { TextInput } from "./TextInput"
import { LoadingSpinner } from "./LoadingSpinner"
import { useToast } from "@/components/ui/use-toast"

export function MainContent() {
  const { toast } = useToast()

  const handleError = (error: Error) => {
    toast({
      variant: "destructive",
      title: "エラーが発生しました",
      description: error.message
    })
  }

  return (
    <main className="flex-1 p-6">
      <div className="container mx-auto">
        <h1 className="text-2xl font-bold mb-6">BizAssist</h1>
        <div className="space-y-6">
          <FileUploader 
            onError={handleError}
            acceptedFileTypes={[".pdf", ".doc", ".docx", ".xls", ".xlsx"]}
          />
          <TextInput 
            label="補足情報"
            placeholder="メモや補足情報を入力してください"
          />
        </div>
      </div>
    </main>
  )
}