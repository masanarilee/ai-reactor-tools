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
【分析リクエスト】
■会社名：${data.companyName}
■事業部名：${data.divisionName || "（指定なし）"}
■提供サービス：${data.targetService}

【分析レポート】
1. 企業概要
- 事業内容
- 規模/成長性
- 業界ポジション

2. 市場分析
- 業界動向
- 競合状況
- 成長機会

3. サービス適合性分析
- 現状の課題仮説
- 提供サービスによる解決可能性
- 想定される導入障壁

4. ソリューション提案
- 具体的な提案内容
- 期待される効果
- 実装ステップ

5. 人材要件
- 必要スキル
- 経験レベル
- 適性要件

【留意点】
- 提供サービスの特性を踏まえた具体的な提案を行う
- 業界特有の課題やトレンドを考慮
- 実現可能性の高い施策を優先`
  }

  const parseClaudeResponse = (response: string): AnalysisResult => {
    const sections = response.split(/\d\. /);
    return {
      overview: sections[1]?.trim() || "",
      marketAnalysis: sections[2]?.trim() || "",
      challenges: sections[3]?.trim() || "",
      proposal: sections[4]?.trim() || "",
      talentProfile: sections[5]?.trim() || "",
    };
  };

  const handleProcess = async () => {
    if (!companyData.companyName || !companyData.targetService) {
      toast({
        variant: "destructive",
        title: "入力エラー",
        description: "会社名と提供サービスは必須項目です",
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