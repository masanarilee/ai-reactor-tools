import { FileUploader } from "../FileUploader"
import { TextInput } from "../TextInput"
import { Button } from "../ui/button"
import { RefreshCw } from "lucide-react"
import { useToast } from "../ui/use-toast"
import { motion } from "framer-motion"

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
  handleFileUploadSuccess
}: InputSectionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: -20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.1 }}
      className="space-y-8 bg-white p-8 rounded-lg shadow-sm"
    >
      <div>
        <div className="h-[60px] flex items-center">
          <h3 className="text-lg font-medium text-[#1E3D59]">ファイルアップロード</h3>
        </div>
        <div className="border-2 border-dashed border-gray-200 rounded-lg p-6 bg-gray-50">
          <FileUploader 
            onError={handleError}
            onSuccess={handleFileUploadSuccess}
            acceptedFileTypes={[".pdf", ".doc", ".docx", ".xls", ".xlsx"]}
          />
        </div>
      </div>
      <div className="space-y-6">
        <h3 className="text-lg font-medium text-[#1E3D59] mb-4">補足情報</h3>
        <TextInput 
          label=""
          placeholder="補足情報を入力してください"
          value={supplementaryInfo}
          onChange={(e) => onSupplementaryInfoChange(e.target.value)}
        />
      </div>
      <div className="pt-4">
        <div className="flex gap-4">
          <Button 
            onClick={onProcess}
            disabled={isProcessing}
            className="flex-1 bg-[#1E3D59] hover:bg-[#17A2B8] text-white"
          >
            {isProcessing ? "生成中..." : "サマリー生成"}
          </Button>
          <Button
            onClick={onReset}
            variant="outline"
            className="flex-none px-6 border-[#1E3D59] text-[#1E3D59] hover:bg-[#1E3D59] hover:text-white"
          >
            <RefreshCw className="w-4 h-4 mr-2" />
            リセット
          </Button>
        </div>
      </div>
    </motion.div>
  )
}