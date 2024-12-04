import { useState } from "react"
import { MainContent } from "@/components/MainContent"
import { CompanyInputSection } from "@/components/company-analysis/CompanyInputSection"
import { CompanyPreviewSection } from "@/components/company-analysis/CompanyPreviewSection"
import { useToast } from "@/components/ui/use-toast"
import { askClaude } from "@/lib/claude"
import AIGenerationVisualizer from "@/components/AIGenerationVisualizer"

export interface CompanyAnalysisData {
  companyName: string
  divisionName: string
  targetService: string
  websiteUrl: string
}

export interface AnalysisResult {
  overview: string
  marketAnalysis: string
  divisionAnalysis: string
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
    divisionAnalysis: "",
    proposal: "",
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()

  const generatePrompt = (data: CompanyAnalysisData) => {
    return `
【分析リクエスト】
※ハルシネーションに注意してください
■会社名：${data.companyName}
■事業部名：${data.divisionName || "（指定なし）"}
■企業URL：${data.websiteUrl || "（指定なし）"}
■支援テーマ：${data.targetService}

【企業分析レポート】
1. 企業プロファイル（URLを読み込んで参考にしてください）
- 事業概要
- 業績/規模
- 経営方針

2. 市場環境分析
- 業界動向
- 競合状況
- 成長機会

3. 事業部分析（指定時）
- 組織構造
- 主要施策
- KPI

4. 提案内容（支援テーマに基づく）
- 現状の課題
- 具体的施策
- 期待効果
- 実施スケジュール

【分析基準】
・1-3は客観的な企業分析のみ実施
・4のみ支援テーマを考慮した提案を展開`
  }

  const parseClaudeResponse = (response: string): AnalysisResult => {
    const sections = response.split(/\d\. /);
    return {
      overview: sections[1]?.trim() || "",
      marketAnalysis: sections[2]?.trim() || "",
      divisionAnalysis: sections[3]?.trim() || "",
      proposal: sections[4]?.trim() || "",
    };
  };

  const handleProcess = async () => {
    if (!companyData.companyName || !companyData.targetService) {
      toast({
        variant: "destructive",
        title: "入力エラー",
        description: "会社名と支援テーマは必須項目です",
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
      websiteUrl: "",
    })
    setAnalysisResult({
      overview: "",
      marketAnalysis: "",
      divisionAnalysis: "",
      proposal: "",
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
        {isProcessing ? (
          <div className="flex items-center justify-center min-h-[300px] bg-white rounded-lg shadow-sm">
            <AIGenerationVisualizer isGenerating={isProcessing} />
          </div>
        ) : (
          <CompanyPreviewSection
            analysisResult={analysisResult}
          />
        )}
      </div>
    </MainContent>
  )
}

export default CompanyAnalysis