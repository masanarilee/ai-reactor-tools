import { useState, useCallback } from 'react'
import { useToast } from '@/components/ui/use-toast'

export const useCopyToClipboard = () => {
  const [copiedText, setCopiedText] = useState<string | null>(null)
  const { toast } = useToast()

  const copyToClipboard = useCallback(async (text: string) => {
    if (!navigator?.clipboard) {
      toast({
        variant: "destructive",
        title: "コピーに失敗しました",
        description: "お使いのブラウザではクリップボードの機能がサポートされていません"
      })
      return false
    }

    try {
      await navigator.clipboard.writeText(text)
      setCopiedText(text)
      toast({
        title: "コピー完了",
        description: "クリップボードにコピーしました"
      })
      return true
    } catch (error) {
      toast({
        variant: "destructive",
        title: "コピーに失敗しました",
        description: "クリップボードへのアクセスが拒否されました"
      })
      return false
    }
  }, [toast])

  return { copiedText, copyToClipboard }
}