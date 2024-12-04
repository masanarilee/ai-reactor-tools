import { FileUploader } from "../FileUploader"
import { TextInput } from "../TextInput"
import { Button } from "../ui/button"
import { RotateCcw, FileText } from "lucide-react"
import { ScoutData } from "@/pages/Scout"

interface ScoutInputSectionProps {
  isProcessing: boolean
  scoutData: ScoutData
  onScoutDataChange: (data: ScoutData) => void
  onProcess: () => void
  onReset: () => void
  handleError: (error: Error) => void
  handleResumeUploadSuccess: (files: File[]) => void
  handleJobUploadSuccess: (files: File[]) => void
  resetTrigger: boolean
}

export const ScoutInputSection = ({
  isProcessing,
  scoutData,
  onScoutDataChange,
  onProcess,
  onReset,
  handleError,
  handleResumeUploadSuccess,
  handleJobUploadSuccess,
  resetTrigger,
}: ScoutInputSectionProps) => {
  return (
    <div className="flex flex-col gap-6 p-6 bg-white rounded-lg shadow-sm">
      <div className="text-left h-[60px] flex items-center">
        <h3 className="text-base font-medium text-[#1E3D59]">職務経歴書アップロード</h3>
      </div>
      <FileUploader 
        onError={handleError} 
        onSuccess={handleResumeUploadSuccess}
        acceptedFileTypes={[".pdf", ".doc", ".docx", ".xls", ".xlsx"]}
        resetTrigger={resetTrigger}
      />

      <div className="text-left h-[60px] flex items-center">
        <h3 className="text-base font-medium text-[#1E3D59]">案件/求人票アップロード</h3>
      </div>
      <FileUploader 
        onError={handleError} 
        onSuccess={handleJobUploadSuccess}
        acceptedFileTypes={[".pdf", ".doc", ".docx", ".xls", ".xlsx"]}
        resetTrigger={resetTrigger}
      />

      <TextInput
        label="自社名"
        value={scoutData.companyName}
        onChange={(e) => onScoutDataChange({ ...scoutData, companyName: e.target.value })}
        placeholder="自社名を入力してください"
        align="left"
      />

      <TextInput
        label="自社担当者名"
        value={scoutData.recruiterName}
        onChange={(e) => onScoutDataChange({ ...scoutData, recruiterName: e.target.value })}
        placeholder="担当者名を入力してください"
        align="left"
      />

      <div className="flex gap-4 justify-end">
        <Button
          onClick={onProcess}
          className="w-32 h-10 bg-gradient-to-r from-[#1E3D59] to-[#17A2B8] hover:opacity-90 relative"
          disabled={isProcessing}
        >
          <FileText className="w-4 h-4 mr-2" />
          Generate
        </Button>
        <Button
          variant="outline"
          onClick={onReset}
          className="w-32 h-10"
          disabled={isProcessing}
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          Reset
        </Button>
      </div>
    </div>
  )
}
