import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardHeader, CardContent } from "@/components/ui/card"
import { AnalysisResult } from "@/pages/CompanyAnalysis"

interface CompanyPreviewSectionProps {
  analysisResult: AnalysisResult
}

export const CompanyPreviewSection = ({ analysisResult }: CompanyPreviewSectionProps) => {
  const { toast } = useToast()
  const sections = [
    { title: "企業概要", content: analysisResult.overview },
    { title: "市場環境", content: analysisResult.marketAnalysis },
    { title: "課題仮説", content: analysisResult.challenges },
    { title: "提案内容", content: analysisResult.proposal },
  ]

  const handleCopy = (content: string, title: string) => {
    navigator.clipboard.writeText(content)
    toast({
      title: "コピー完了",
      description: `${title}をクリップボードにコピーしました`
    })
  }

  const handleCopyAll = () => {
    const allContent = sections.map(section => 
      `${section.title}\n${section.content}`
    ).join('\n\n')
    navigator.clipboard.writeText(allContent)
    toast({
      title: "コピー完了",
      description: "すべての内容をクリップボードにコピーしました"
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, x: 20 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ delay: 0.2 }}
      className="flex flex-col gap-6"
    >
      <div className="flex justify-between items-center bg-white p-6 rounded-lg shadow-sm">
        <h3 className="text-base font-medium text-[#1E3D59]">分析結果</h3>
        <Button
          variant="outline"
          size="sm"
          onClick={handleCopyAll}
          className="text-[#17A2B8] border-[#17A2B8] hover:bg-[#17A2B8] hover:text-white"
        >
          <Copy className="w-4 h-4 mr-2" />
          All Copy
        </Button>
      </div>

      {sections.map((section, index) => (
        <Card key={index} className="bg-white shadow-sm">
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <h4 className="text-sm font-medium text-[#1E3D59]">{section.title}</h4>
            <Button
              variant="outline"
              size="sm"
              onClick={() => handleCopy(section.content, section.title)}
              className="text-[#17A2B8] border-[#17A2B8] hover:bg-[#17A2B8] hover:text-white"
            >
              <Copy className="w-4 h-4 mr-2" />
              Copy
            </Button>
          </CardHeader>
          <CardContent>
            <pre className="whitespace-pre-wrap text-sm text-gray-600 font-normal">
              {section.content}
            </pre>
          </CardContent>
        </Card>
      ))}
    </motion.div>
  )
}
  )
}
