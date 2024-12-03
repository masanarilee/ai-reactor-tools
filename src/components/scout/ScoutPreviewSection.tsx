import { motion } from "framer-motion"

interface ScoutPreviewSectionProps {
  previewContent: string
}

export const ScoutPreviewSection = ({ previewContent }: ScoutPreviewSectionProps) => {
  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="bg-white p-6 rounded-lg shadow-sm"
    >
      <div className="h-[60px] flex items-center">
        <h3 className="text-base font-medium text-[#1E3D59]">プレビュー</h3>
      </div>
      <pre className="min-h-[500px] p-8 bg-gray-50 rounded border border-gray-200 font-mono text-sm leading-relaxed whitespace-pre-wrap break-words text-left overflow-auto">
        {previewContent || "生成されたスカウト文がここに表示されます"}
      </pre>
    </motion.div>
  )
}