import { useState, useCallback } from "react"
import { toast } from "sonner"

interface UseFileUploadProps {
  onError: (error: Error) => void
  onSuccess: (files: File[]) => void
  acceptedFileTypes: string[]
}

export const useFileUpload = ({ onError, onSuccess, acceptedFileTypes }: UseFileUploadProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])

  const handleFileDrop = useCallback((acceptedFiles: File[]) => {
    try {
      if (acceptedFiles.length === 0) {
        throw new Error("ファイルが選択されていません")
      }

      // ファイルサイズチェック (10MB制限)
      const maxSize = 10 * 1024 * 1024
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

  const resetFiles = useCallback(() => {
    setUploadedFiles([])
  }, [])

  return {
    uploadedFiles,
    handleFileDrop,
    resetFiles
  }
}