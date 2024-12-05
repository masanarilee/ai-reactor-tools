import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"
import { motion } from "framer-motion"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { useCopyToClipboard } from "@/hooks/useCopyToClipboard"

interface CompanyPreviewSectionProps {
  analysisResult: {
    overview: string
    marketAnalysis: string
    challenges: string
    proposal: string
  }
}

export const CompanyPreviewSection = ({ analysisResult }: CompanyPreviewSectionProps) => {
  const { copyToClipboard } = useCopyToClipboard()
  
  const sections = [
    { title: "企業概要", content: analysisResult.overview },
    { title: "市場環境", content: analysisResult.marketAnalysis },
    { title: "課題仮説", content: analysisResult.challenges },
    { title: "提案内容", content: analysisResult.proposal },
  ]

  const handleCopyAll = () => {
    const allContent = sections
      .map(section => `${section.title}\n${section.content}`)
      .join('\n\n')
    copyToClipboard(allContent)
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
          onClick={handleCopyAll}
          className="text-[#17A2B8] border-[#17A2B8] hover:bg-[#17A2B8] hover:text-white"
        >
          <Copy className="w-4 h-4 mr-2" />
          AllCopy
        </Button>
      </div>
      <div className="space-y-6 bg-gray-50 rounded border border-gray-200 p-6">
        {sections.map((section, index) => (
          <div key={index} className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium text-[#1E3D59]">{section.title}</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={() => copyToClipboard(section.content)}
                className="text-[#17A2B8] border-[#17A2B8] hover:bg-[#17A2B8] hover:text-white"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
            </div>
            <pre className="font-mono text-sm leading-relaxed whitespace-pre-wrap break-words text-left">
              {section.content || `${section.title}が生成されるとここに表示されます`}
            </pre>
            {index < sections.length - 1 && (
              <div className="border-b border-gray-200 my-4" />
            )}
          </div>
        ))}
      </div>
    </motion.div>
  )
}