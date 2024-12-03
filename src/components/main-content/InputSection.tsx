import { FileUploader } from "../FileUploader"
import { TextInput } from "../TextInput"
import { Button } from "../ui/button"

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
  return (
    <div className="flex flex-col gap-6 p-6 bg-white rounded-lg shadow-sm">
      <FileUploader onError={handleError} onSuccess={handleFileUploadSuccess} />
      <TextInput
        value={supplementaryInfo}
        onChange={onSupplementaryInfoChange}
        placeholder="補足情報を入力してください"
      />
      <div className="flex gap-4 justify-end">
        <Button
          variant="outline"
          onClick={onReset}
          className="w-32 h-10"
          disabled={isProcessing}
        >
          リセット
        </Button>
        <Button
          onClick={onProcess}
          className="w-32 h-10"
          disabled={isProcessing}
        >
          サマリ生成
        </Button>
      </div>
    </div>
  )
}