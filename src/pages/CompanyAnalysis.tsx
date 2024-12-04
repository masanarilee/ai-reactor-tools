import { useState } from "react"
import { MainContent } from "@/components/MainContent"
import { CompanyInputSection } from "@/components/company-analysis/CompanyInputSection"
import { CompanyPreviewSection } from "@/components/company-analysis/CompanyPreviewSection"
import { useToast } from "@/components/ui/use-toast"
import { askClaude } from "@/lib/claude"

export interface CompanyAnalysisData {
  companyName: string
  divisionName: string
  targetService: string
}

export interface AnalysisResult {
  overview: string
  marketAnalysis: string
  challenges: string
  proposal: string
  talentProfile: string
}

const CompanyAnalysis = () => {
  const [companyData, setCompanyData] = useState<CompanyAnalysisData>({
    companyName: "",
    divisionName: "",
    targetService: "",
  })
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult>({
    overview: "",
    marketAnalysis: "",
    challenges: "",
    proposal: "",
    talentProfile: "",
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()

  const generatePrompt = (data: CompanyAnalysisData) => {
    return `
会社名と事業部名が送信されたら企業情報事業部情報を分析の上、以下のフォーマットで分析結果をアウトプットしてください。
また、こちらから提供したい提供サービスの情報を加味して、分析を進めてください。

＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
【事前準備ＦＭＴ】　
■会社名：${data.companyName}
■事業部名：${data.divisionName}
■提供サービス：${data.targetService}

1）企業概要

2）市場分析

3）課題仮説（${data.targetService}に沿って検討）

4）提案内容（${data.targetService}に沿って検討）

5）人材想定（${data.targetService}に沿ってマッチする提案人材を検討）
＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝`
  }

  const parseClaudeResponse = (response: string): AnalysisResult => {
    const sections = response.split(/\d）/);
    return {
      overview: sections[1]?.trim() || "",
      marketAnalysis: sections[2]?.trim() || "",
      challenges: sections[3]?.trim() || "",
      proposal: sections[4]?.trim() || "",
      talentProfile: sections[5]?.trim() || "",
    };
  };

  const handleProcess = async () => {
    if (!companyData.companyName || !companyData.divisionName) {
      toast({
        variant: "destructive",
        title: "入力エラー",
        description: "会社名と事業部名は必須です",
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
    })
    setAnalysisResult({
      overview: "",
      marketAnalysis: "",
      challenges: "",
      proposal: "",
      talentProfile: "",
    })
  }

  return (
    <MainContent title="企業分析">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
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
    </MainContent>
  )
}

export default CompanyAnalysis