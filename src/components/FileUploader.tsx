import { useCallback, useEffect } from "react"
import { useDropzone } from "react-dropzone"
import { Upload } from "lucide-react"
import { Alert, AlertDescription } from "@/components/ui/alert"
import { useFileUpload } from "@/hooks/useFileUpload"

interface FileUploaderProps {
  onError: (error: Error) => void
  onSuccess: (files: File[]) => void
  acceptedFileTypes: string[]
  resetTrigger?: boolean
}

export function FileUploader({ onError, onSuccess, acceptedFileTypes, resetTrigger }: FileUploaderProps) {
  const { uploadedFiles, handleFileDrop, resetFiles } = useFileUpload({
    onError,
    onSuccess,
    acceptedFileTypes
  })

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: handleFileDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx'],
      'application/octet-stream': ['.xls', '.xlsx'] // For some Excel files that might be detected differently
    },
    maxSize: 10 * 1024 * 1024 // 10MB limit
  })

  useEffect(() => {
    if (resetTrigger) {
      resetFiles()
    }
  }, [resetTrigger, resetFiles])

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'}`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          ドラッグ＆ドロップ、またはクリックしてファイルを選択
        </p>
        <p className="mt-1 text-xs text-gray-500">
          対応ファイル: PDF, Word (doc/docx), Excel (xls/xlsx)
        </p>
      </div>

      {uploadedFiles.length > 0 && (
        <Alert>
          <AlertDescription>
            <div className="space-y-2">
              <h4 className="font-medium">アップロード済みファイル:</h4>
              <ul className="list-disc pl-4 space-y-1">
                {uploadedFiles.map((file, index) => (
                  <li key={index} className="text-sm">
                    {file.name} ({(file.size / 1024 / 1024).toFixed(2)}MB)
                  </li>
                ))}
              </ul>
            </div>
          </AlertDescription>
        </Alert>
      )}
    </div>
  )
}