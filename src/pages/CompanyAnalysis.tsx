import { useState } from "react"
import { MainContent } from "@/components/MainContent"
import { CompanyInputSection } from "@/components/company-analysis/CompanyInputSection"
import { CompanyPreviewSection } from "@/components/company-analysis/CompanyPreviewSection"
import { useToast } from "@/components/ui/use-toast"
import { askClaude } from "@/lib/claude"
import { PROMPTS } from "@/lib/constants/prompts"

export interface CompanyAnalysisData {
  companyName: string
  divisionName: string
  targetService: string
  websiteUrl: string
}

const generatePrompt = (companyData: CompanyAnalysisData) => {
  return PROMPTS.COMPANY.ANALYSIS
    .replace('{companyName}', companyData.companyName)
    .replace('{divisionName}', companyData.divisionName)
    .replace('{targetService}', companyData.targetService)
    .replace('{websiteUrl}', companyData.websiteUrl)
}

const parseClaudeResponse = (response: string) => {
  const sections = response.split('【')
  const result = {
    overview: '',
    marketAnalysis: '',
    challenges: '',
    proposal: ''
  }

  sections.forEach(section => {
    if (section.includes('企業概要】')) {
      result.overview = section.split('】')[1].trim()
    } else if (section.includes('市場環境】')) {
      result.marketAnalysis = section.split('】')[1].trim()
    } else if (section.includes('課題仮説】')) {
      result.challenges = section.split('】')[1].trim()
    } else if (section.includes('提案内容】')) {
      result.proposal = section.split('】')[1].trim()
    }
  })

  return result
}

const CompanyAnalysis = () => {
  const [companyData, setCompanyData] = useState<CompanyAnalysisData>({
    companyName: "",
    divisionName: "",
    targetService: "",
    websiteUrl: ""
  })
  
  const [analysisResult, setAnalysisResult] = useState({
    overview: "",
    marketAnalysis: "",
    challenges: "",
    proposal: ""
  })

  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()

  const handleProcess = async () => {
    if (!companyData.companyName || !companyData.targetService) {
      toast({
        variant: "destructive",
        title: "入力エラー",
        description: "企業名と支援テーマは必須項目です"
      })
      return
    }

    setIsProcessing(true)
    try {
      const prompt = generatePrompt(companyData)
      const response = await askClaude(prompt)
      const result = parseClaudeResponse(response)
      setAnalysisResult(result)
      toast({
        title: "分析完了",
        description: "企業分析が完了しました"
      })
    } catch (error) {
      toast({
        variant: "destructive",
        title: "エラーが発生しました",
        description: "もう一度お試しください"
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
      websiteUrl: ""
    })
    setAnalysisResult({
      overview: "",
      marketAnalysis: "",
      challenges: "",
      proposal: ""
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
          <CompanyPreviewSection
            analysisResult={analysisResult}
          />
        </div>
      </div>
    </MainContent>
  )
}

export default CompanyAnalysis
