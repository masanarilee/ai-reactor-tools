import { useCallback, useState } from "react"
import { useDropzone } from "react-dropzone"
import { Upload } from "lucide-react"
import { toast } from "@/components/ui/use-toast"

interface FileUploaderProps {
  onError: (error: Error) => void
  onSuccess: (files: File[]) => void
  acceptedFileTypes: string[]
}

export function FileUploader({ onError, onSuccess, acceptedFileTypes }: FileUploaderProps) {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])

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
        description: `${acceptedFiles.map(f => f.name).join(', ')}`,
      })

    } catch (error) {
      if (error instanceof Error) {
        onError(error)
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
    }
  })

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
          対応ファイル: {acceptedFileTypes.join(", ")}
        </p>
      </div>
      {uploadedFiles.length > 0 && (
        <div className="bg-gray-50 p-4 rounded-lg">
          <h4 className="text-sm font-medium mb-2">アップロード済みファイル:</h4>
          <ul className="text-sm text-gray-600">
            {uploadedFiles.map((file, index) => (
              <li key={index}>{file.name}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}