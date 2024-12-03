import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"

interface PreviewSection {
  title: string
  content: string
}

export const CompanyPreviewSection = () => {
  const { toast } = useToast()
  const sections: PreviewSection[] = [
    { title: "企業概要", content: "" },
    { title: "市場分析", content: "" },
    { title: "課題仮説", content: "" },
    { title: "提案内容", content: "" },
    { title: "人材想定", content: "" },
  ]

  const handleCopy = (content: string, title: string) => {
    navigator.clipboard.writeText(content)
    toast({
      description: `${title}をコピーしました`,
    })
  }

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
          onClick={() => handleCopy(sections.map(s => `${s.title}\n${s.content || "内容が生成されていません"}\n\n`).join(""), "すべての内容")}
          className="text-[#17A2B8] border-[#17A2B8] hover:bg-[#17A2B8] hover:text-white"
        >
          <Copy className="w-4 h-4 mr-2" />
          すべてコピー
        </Button>
      </div>
      <div className="space-y-6 bg-gray-50 rounded border border-gray-200 p-6">
        {sections.map((section, index) => (
          <div key={index} className="bg-white rounded-lg border border-gray-200 p-4 space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium text-[#1E3D59]">{section.title}</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={() => handleCopy(section.content || "内容が生成されていません", section.title)}
                className="text-[#17A2B8] border-[#17A2B8] hover:bg-[#17A2B8] hover:text-white"
              >
                <Copy className="w-4 h-4 mr-2" />
                コピー
              </Button>
            </div>
            <pre className="font-mono text-sm leading-relaxed whitespace-pre-wrap break-words text-left">
              {section.content || `${section.title}が生成されるとここに表示されます`}
            </pre>
          </div>
        ))}
      </div>
    </motion.div>
  )
}