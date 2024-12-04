// src/pages/CompanyAnalysis.tsx

import { useState } from "react"
import { MainContent } from "@/components/MainContent"
import { CompanyInputSection } from "@/components/company-analysis/CompanyInputSection"
import { CompanyPreviewSection } from "@/components/company-analysis/CompanyPreviewSection"
import { useToast } from "@/components/ui/use-toast"
import { askClaude } from "@/lib/api"

export interface CompanyAnalysisData {
  companyName: string
  divisionName: string
  targetService: string
  websiteUrl: string
}

interface AnalysisResult {
  overview: string
  marketAnalysis: string
  challenges: string
  proposal: string
}

const CompanyAnalysis = () => {
  const [companyData, setCompanyData] = useState<CompanyAnalysisData>({
    companyName: "",
    divisionName: "",
    targetService: "",
    websiteUrl: "",
  })
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult>({
    overview: "",
    marketAnalysis: "",
    challenges: "",
    proposal: "",
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()

  const handleProcess = async () => {
    setIsProcessing(true)
    try {
      const prompt = generatePrompt(companyData)
      const response = await askClaude(prompt)
      const result = parseClaudeResponse(response)
      setAnalysisResult(result)
      toast({
        title: "分析完了",
        description: "企業分析が完了しました",
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "エラーが発生しました",
        description: "もう一度お試しください",
      })
    } finally {
      setIsProcessing(false)
    }
  }

  const handleReset = () => {
    setCompanyData({
      companyName: "",
      divisionName: "",
      targetService: "",
      websiteUrl: "",
    })
    setAnalysisResult({
      overview: "",
      marketAnalysis: "",
      challenges: "",
      proposal: "",
    })
  }

  return (
    <MainContent title="企業分析">
      <div className="container mx-auto p-6">
        <div className="grid lg:grid-cols-2 gap-8">
          <CompanyInputSection
            companyData={companyData}
            setCompanyData={setCompanyData}
            isProcessing={isProcessing}
            onProcess={handleProcess}
            onReset={handleReset}
          />
          {(analysisResult.overview || 
            analysisResult.marketAnalysis || 
            analysisResult.challenges || 
            analysisResult.proposal) && (
            <CompanyPreviewSection analysisResult={analysisResult} />
          )}
        </div>
      </div>
    </MainContent>
  )
}

export default CompanyAnalysis
