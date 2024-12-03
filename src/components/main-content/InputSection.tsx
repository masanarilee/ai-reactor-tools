import { FileUploader } from "../FileUploader"
import { TextInput } from "../TextInput"
import { Button } from "../ui/button"
import { RotateCcw, FileText } from "lucide-react"
import { useState } from "react"

interface InputSectionProps {
  isProcessing: boolean
  supplementaryInfo: string
  onSupplementaryInfoChange: (value: string) => void
  onProcess: () => void
  onReset: () => void
  handleError: (error: Error) => void
  handleFileUploadSuccess: (files: File[]) => void
}

export const InputSection = ({
  isProcessing,
  supplementaryInfo,
  onSupplementaryInfoChange,
  onProcess,
  onReset,
  handleError,
  handleFileUploadSuccess,
}: InputSectionProps) => {
  const [resetFiles, setResetFiles] = useState(false)

  const handleReset = () => {
    setResetFiles(true)
    onReset()
    // Reset the flag after a short delay
    setTimeout(() => setResetFiles(false), 100)
  }

  return (
    <div className="flex flex-col gap-6 p-6 bg-white rounded-lg shadow-sm">
      <FileUploader 
        onError={handleError} 
        onSuccess={handleFileUploadSuccess}
        acceptedFileTypes={[".pdf", ".doc", ".docx", ".xls", ".xlsx"]}
        resetFiles={resetFiles}
      />
      <TextInput
        label="補足情報"
        value={supplementaryInfo}
        onChange={(e) => onSupplementaryInfoChange(e.target.value)}
        placeholder="補足情報を入力してください"
      />
      <div className="flex gap-4 justify-end">
        <Button
          onClick={onProcess}
          className="w-32 h-10"
          disabled={isProcessing}
        >
          <FileText className="w-4 h-4" />
          サマリ生成
        </Button>
        <Button
          variant="outline"
          onClick={handleReset}
          className="w-32 h-10"
          disabled={isProcessing}
        >
          <RotateCcw className="w-4 h-4" />
          リセット
        </Button>
      </div>
    </div>
  )
}