// src/components/company-analysis/CompanyPreviewSection.tsx

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
    <div className="space-y-4">
      <div className="flex justify-end">
        <Button onClick={handleCopyAll} variant="outline" size="sm">
          <Copy className="mr-2 h-4 w-4" />
          AllCopy
        </Button>
      </div>
      <div className="grid gap-4">
        {sections.map((section, index) => (
          <Card key={index}>
            <CardHeader>
              <h3 className="text-base font-medium text-[#1E3D59]">{section.title}</h3>
            </CardHeader>
            <CardContent>
              <p className="whitespace-pre-wrap">{section.content}</p>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  )
}
