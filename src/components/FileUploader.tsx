import { useCallback } from "react"
import { useDropzone } from "react-dropzone"
import { Upload } from "lucide-react"

interface FileUploaderProps {
  onError: (error: Error) => void
  acceptedFileTypes: string[]
}

export function FileUploader({ onError, acceptedFileTypes }: FileUploaderProps) {
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

      console.log("アップロードされたファイル:", acceptedFiles)
      // TODO: ここでファイルを処理する
      // 例: APIにアップロード、ローカルで解析など

    } catch (error) {
      if (error instanceof Error) {
        onError(error)
      } else {
        onError(new Error("ファイルアップロード中にエラーが発生しました"))
      }
    }
  }, [acceptedFileTypes, onError])

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