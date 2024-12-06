import { Button } from "../ui/button"
import { Copy } from "lucide-react"
import { motion } from "framer-motion"
import { Card, CardHeader, CardContent } from "../ui/card"

interface PreviewSectionProps {
  previewContent: string
  onCopy: () => void
}

interface CounselingSection {
  title: string
  content: string
}

interface CounselingPreviewProps {
  sections: {
    summary: string
    concerns: string
    questions: string
    careerPlan: string
  }
  onCopy: (text: string, section: string) => void
}

export const PreviewSection = ({ previewContent, onCopy }: PreviewSectionProps) => {
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
        {previewContent || "生成されたサマリーがここに表示されます。"}
      </pre>
    </motion.div>
  )
}

export const CounselingPreview = ({ sections, onCopy }: CounselingPreviewProps) => {
  const sectionsList: CounselingSection[] = [
    { title: "1. 人材要約", content: sections.summary },
    { title: "2. 懸念点", content: sections.concerns },
    { title: "3. 質問例", content: sections.questions },
    { title: "4. キャリアプラン", content: sections.careerPlan }
  ]

  const allContent = sectionsList
    .map(section => `${section.title}\n${section.content}`)
    .join('\n\n')

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
          onClick={() => onCopy(allContent, "全ての内容")}
          className="text-[#17A2B8] border-[#17A2B8] hover:bg-[#17A2B8] hover:text-white"
        >
          <Copy className="w-4 h-4 mr-2" />
          AllCopy
        </Button>
      </div>
      <div className="space-y-6 bg-gray-50 rounded border border-gray-200 p-6">
        {sectionsList.map((section, index) => (
          <div key={index} className="space-y-4">
            <div className="flex justify-between items-center">
              <h4 className="font-medium text-[#1E3D59]">{section.title}</h4>
              <Button
                variant="outline"
                size="sm"
                onClick={() => onCopy(section.content, section.title)}
                className="text-[#17A2B8] border-[#17A2B8] hover:bg-[#17A2B8] hover:text-white"
              >
                <Copy className="w-4 h-4 mr-2" />
                Copy
              </Button>
            </div>
            <pre className="font-mono text-sm leading-relaxed whitespace-pre-wrap break-words text-left">
              {section.content || `${section.title}が生成されるとここに表示されます`}
            </pre>
            {index < sectionsList.length - 1 && (
              <div className="border-b border-gray-200 my-4" />
            )}
          </div>
        ))}
      </div>
    </motion.div>
  )
}
