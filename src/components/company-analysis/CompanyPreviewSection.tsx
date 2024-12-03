import { Button } from "@/components/ui/button"
import { Copy } from "lucide-react"
import { motion } from "framer-motion"
import { useToast } from "@/components/ui/use-toast"
import { Card, CardHeader, CardContent } from "@/components/ui/card"

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
      className="grid gap-6"
    >
      {sections.map((section, index) => (
        <motion.div
          key={index}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 * index }}
        >
          <Card className="bg-white shadow-sm hover:shadow-md transition-shadow duration-200 min-h-[300px] flex flex-col">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
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
            </CardHeader>
            <CardContent className="flex-1 flex">
              <pre className="font-mono text-sm leading-relaxed whitespace-pre-wrap break-words text-left bg-gray-50 p-4 rounded-md w-full h-full min-h-[200px]">
                {section.content || `${section.title}が生成されるとここに表示されます`}
              </pre>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </motion.div>
  )
}