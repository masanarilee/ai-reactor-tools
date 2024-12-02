import { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Upload } from "lucide-react"

interface FileUploaderProps {
  onError: (error: Error) => void
  acceptedFileTypes: string[]
}

export function FileUploader({ onError, acceptedFileTypes }: FileUploaderProps) {
  const onDrop = useCallback((acceptedFiles: File[]) => {
    // ファイルアップロード処理をここに実装
    console.log(acceptedFiles)
  }, [])

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
  )
}