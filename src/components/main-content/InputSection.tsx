import { useState } from "react"
import { FileUploader } from "../FileUploader"
import { TextInput } from "../TextInput"
import { Button } from "../ui/button"
import { RotateCcw, FileText } from "lucide-react"
import { useLocation } from "react-router-dom"

interface InputSectionProps {
  isProcessing: boolean
  supplementaryInfo: string
  onSupplementaryInfoChange: (value: string) => void
  onProcess: () => void
  onReset: () => void
  handleError: (error: Error) => void
  handleFileUploadSuccess: (files: File[]) => void
  resetTrigger: boolean
}

export const InputSection = ({
  isProcessing,
  supplementaryInfo,
  onSupplementaryInfoChange,
  onProcess,
  onReset,
  handleError,
  handleFileUploadSuccess,
  resetTrigger,
}: InputSectionProps) => {
  const location = useLocation()

  const handleReset = () => {
    onReset()
  }

  const getUploadTitle = () => {
    return location.pathname === "/job-summary" 
      ? "案件情報/求人票アップロード"
      : "経歴書アップロード"
  }

  const getMemoTitle = () => {
    return location.pathname === "/job-summary"
      ? "案件情報"
      : "補足情報"
  }

  return (
    <div className="flex flex-col gap-6 p-6 bg-white rounded-lg shadow-sm">
      <div className="text-left h-[60px] flex items-center">
        <h3 className="text-base font-medium text-[#1E3D59]">{getUploadTitle()}</h3>
      </div>
      <FileUploader 
        onError={handleError} 
        onSuccess={handleFileUploadSuccess}
        acceptedFileTypes={[".pdf", ".doc", ".docx", ".xls", ".xlsx"]}
        resetTrigger={resetTrigger}
      />
      <TextInput
        label={getMemoTitle()}
        value={supplementaryInfo}
        onChange={(e) => onSupplementaryInfoChange(e.target.value)}
        placeholder={`${getMemoTitle()}を入力してください`}
        align="left"
      />
      <div className="flex gap-4 justify-end">
        <Button
          onClick={onProcess}
          className="w-32 h-10 bg-[#1E3D59] hover:bg-[#17A2B8]"
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