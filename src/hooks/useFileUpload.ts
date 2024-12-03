import { useState, useCallback } from "react"
import { toast } from "sonner"

interface UseFileUploadProps {
  onError: (error: Error) => void
  onSuccess: (files: File[]) => void
  acceptedFileTypes: string[]
}

export const useFileUpload = ({ onError, onSuccess, acceptedFileTypes }: UseFileUploadProps) => {
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([])

  const validateFileType = (file: File): boolean => {
    const fileExtension = file.name.split('.').pop()?.toLowerCase()
    const mimeType = file.type.toLowerCase()
    
    // Common MIME types for office documents
    const validMimeTypes = [
      'application/pdf',
      'application/msword',
      'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'application/octet-stream' // Some systems might use this for Excel files
    ]

    return validMimeTypes.includes(mimeType) || 
           (fileExtension && acceptedFileTypes.some(type => 
             type.toLowerCase().includes(fileExtension)
           ))
  }

  const handleFileDrop = useCallback((acceptedFiles: File[]) => {
    try {
      if (acceptedFiles.length === 0) {
        throw new Error("ファイルが選択されていません")
      }

      // File size check (10MB limit)
      const maxSize = 10 * 1024 * 1024
      const oversizedFiles = acceptedFiles.filter(file => file.size > maxSize)
      if (oversizedFiles.length > 0) {
        throw new Error("ファイルサイズは10MB以下にしてください")
      }

      // File type validation
      const invalidFiles = acceptedFiles.filter(file => !validateFileType(file))
      if (invalidFiles.length > 0) {
        throw new Error(`対応していないファイル形式です: ${invalidFiles.map(f => f.name).join(', ')}`)
      }

      setUploadedFiles(acceptedFiles)
      onSuccess(acceptedFiles)
      toast.success("ファイルアップロード完了", {
        description: `${acceptedFiles.map(f => f.name).join(', ')}をアップロードしました`
      })

    } catch (error) {
      if (error instanceof Error) {
        onError(error)
        toast.error("エラー", {
          description: error.message
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