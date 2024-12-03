import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Upload } from "lucide-react"
import { toast } from "@/components/ui/use-toast"
import { Alert, AlertDescription } from "@/components/ui/alert"

interface FileUploaderProps {
  onError: (error: Error) => void
  onSuccess: (files: File[]) => void
  acceptedFileTypes: string[]
  resetFiles?: boolean
}

export function FileUploader({ onError, onSuccess, acceptedFileTypes, resetFiles }: FileUploaderProps) {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])
  const [isDragging, setIsDragging] = useState(false)

  // Reset files when resetFiles prop changes
  useCallback(() => {
    if (resetFiles) {
      setUploadedFiles([])
    }
  }, [resetFiles])

  const onDrop = useCallback((acceptedFiles: File[]) => {
    try {
      if (acceptedFiles.length === 0) {
        throw new Error("ファイルが選択されていません")
      }

      // ファイルサイズチェック (10MB制限)
      const maxSize = 10 * 1024 * 1024 // 10MB
      const oversizedFiles = acceptedFiles.filter(file => file.size > maxSize)
      if (oversizedFiles.length > 0) {
        throw new Error("ファイルサイズは10MB以下にしてください")
      }

      // ファイル形式チェック
      const invalidFiles = acceptedFiles.filter(file => {
        const fileExtension = file.name.split('.').pop()?.toLowerCase()
        return !acceptedFileTypes.some(type => 
          type.toLowerCase().includes(fileExtension || '')
        )
      })
      if (invalidFiles.length > 0) {
        throw new Error(`対応していないファイル形式です: ${invalidFiles.map(f => f.name).join(', ')}`)
      }

      setUploadedFiles(acceptedFiles)
      onSuccess(acceptedFiles)
      toast({
        title: "ファイルアップロード完了",
        description: `${acceptedFiles.map(f => f.name).join(', ')}をアップロードしました`,
      })

    } catch (error) {
      if (error instanceof Error) {
        onError(error)
        toast({
          variant: "destructive",
          title: "エラー",
          description: error.message,
        })
      } else {
        onError(new Error("ファイルアップロード中にエラーが発生しました"))
      }
    }
  }, [acceptedFileTypes, onError, onSuccess])

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      'application/pdf': ['.pdf'],
      'application/msword': ['.doc'],
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document': ['.docx'],
      'application/vnd.ms-excel': ['.xls'],
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': ['.xlsx']
    },
    onDragEnter: () => setIsDragging(true),
    onDragLeave: () => setIsDragging(false)
  })

  return (
    <div className="space-y-4">
      <div
        {...getRootProps()}
        className={`border-2 border-dashed rounded-lg p-8 text-center cursor-pointer transition-colors
          ${isDragActive || isDragging ? 'border-primary bg-primary/5' : 'border-gray-300 hover:border-primary'}`}
      >
        <input {...getInputProps()} />
        <Upload className="mx-auto h-12 w-12 text-gray-400" />
        <p className="mt-2 text-sm text-gray-600">
          ドラッグ＆ドロップ、またはクリックしてファイルを選択
        </p>
        <p className="mt-1 text-xs text-gray-500">
          対応ファイル: {acceptedFileTypes.join(", ")}
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