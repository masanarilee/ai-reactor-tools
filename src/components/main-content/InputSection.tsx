import { useState } from "react"
import { FileUploader } from "../FileUploader"
import { TextInput } from "../TextInput"
import { Button } from "../ui/button"
import { RotateCcw, FileText } from "lucide-react"

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
  const [resetTrigger, setResetTrigger] = useState(false)

  const handleReset = () => {
    setResetTrigger(prev => !prev) // トリガーの切り替え
    onReset()
  }

  return (
    <div className="flex flex-col gap-6 p-6 bg-white rounded-lg shadow-sm">
      <FileUploader 
        onError={handleError} 
        onSuccess={handleFileUploadSuccess}
        acceptedFileTypes={[".pdf", ".doc", ".docx", ".xls", ".xlsx"]}
        resetTrigger={resetTrigger}
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
          <FileText className="w-4 h-4 mr-2" />
          サマリ生成
        </Button>
        <Button
          variant="outline"
          onClick={handleReset}
          className="w-32 h-10"
          disabled={isProcessing}
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          リセット
        </Button>
      </div>
    </div>
  )
}