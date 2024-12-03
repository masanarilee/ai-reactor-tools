import { Button } from "../ui/button"
import { Copy } from "lucide-react"
import { motion } from "framer-motion"

interface PreviewSectionProps {
  previewContent: string
  onCopy: () => void
}

export const PreviewSection = ({ previewContent, onCopy }: PreviewSectionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white p-6 rounded-lg shadow-sm"
    >
      <div className="h-[60px] flex items-center justify-between mb-4">
        <h3 className="text-lg font-medium text-[#1E3D59]">プレビュー</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={onCopy}
          className="text-[#17A2B8] border-[#17A2B8] hover:bg-[#17A2B8] hover:text-white"
        >
          <Copy className="w-4 h-4 mr-2" />
          コピー
        </Button>
      </div>
      <div className="min-h-[500px] p-8 bg-gray-50 rounded border border-gray-200 font-mono text-sm leading-relaxed">
        {previewContent || "生成されたサマリーがここに表示されます"}
      </div>
    </motion.div>
  )
}