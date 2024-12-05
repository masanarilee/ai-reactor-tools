import { useState, Suspense } from "react"
import { MainContent } from "@/components/MainContent"
import { ScoutInputSection } from "@/components/scout/ScoutInputSection"
import { ScoutPreviewSection } from "@/components/scout/ScoutPreviewSection"
import { useToast } from "@/components/ui/use-toast"

const Scout = () => {
  const [previewContent, setPreviewContent] = useState("")

  const toast = useToast()

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(previewContent)
      toast({
        title: "コピー完了",
        description: "クリップボードにコピーしました"
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "コピーに失敗しました",
        description: "クリップボードへのアクセスが拒否されました"
      })
    }
  }

  return (
    <MainContent title="スカウトメール作成">
      <div className="container mx-auto p-6">
        <div className="grid lg:grid-cols-2 gap-8">
          <Suspense fallback={<div>Loading...</div>}>
            <ScoutInputSection
              setPreviewContent={setPreviewContent}
            />
            <ScoutPreviewSection 
              previewContent={previewContent}
              onCopy={handleCopy}
            />
          </Suspense>
        </div>
      </div>
    </MainContent>
  )
}

export default Scout
