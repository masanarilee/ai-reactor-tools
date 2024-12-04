import { motion } from "framer-motion"
import { Button } from "../ui/button"
import { Copy } from "lucide-react"

interface ScoutPreviewSectionProps {
  previewContent: string
  onCopy: () => void  // コピー機能のための関数を追加
}

export const ScoutPreviewSection = ({ 
  previewContent,
  onCopy 
}: ScoutPreviewSectionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white p-6 rounded-lg shadow-sm"
    >
      <div className="h-[60px] flex items-center justify-between">
        <h3 className="text-base font-medium text-[#1E3D59]">プレビュー</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={onCopy}
          className="text-[#17A2B8] border-[#17A2B8] hover:bg-[#17A2B8] hover:text-white"
        >
          <Copy className="w-4 h-4 mr-2" />
          Copy
        </Button>
      </div>
      <pre className="min-h-[500px] p-8 bg-gray-50 rounded border border-gray-200 font-mono text-sm leading-relaxed whitespace-pre-wrap break-words text-left overflow-auto">
        {previewContent || "生成されたスカウト文がここに表示されます"}
      </pre>
    </motion.div>
  )
}
