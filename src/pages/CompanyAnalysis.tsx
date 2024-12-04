// src/pages/CompanyAnalysis.tsx

import { useState } from "react"
import { MainContent } from "../../components/layouts/MainContent";
import { CompanyInputSection } from "../components/company-analysis/CompanyInputSection";
import { CompanyPreviewSection } from "../components/company-analysis/CompanyPreviewSection";
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

const COMPANY_ANALYSIS_PROMPT = `
【分析リクエスト】
■会社名：{companyName}
■事業部名：{divisionName}
■企業URL：{websiteUrl}
■支援テーマ：{targetService}

【企業分析レポート】
1. 企業概要
企業の基本情報をまとめてください
2. 市場環境
対象企業や対象事業の市場状況をまとめてください
3. 課題仮説
- 1,2を考慮して企業が抱える可能性のある課題を分析（支援テーマに依存せず広い範囲で行う）
- このセクションでは支援テーマに影響されてはならない

4. 提案内容（支援テーマに基づく）
- ここでのみ支援テーマを考慮し、提案を行う
- 提案の方向性
- 想定される施策例

【分析基準】
・企業URLから確認できる情報や確実性の高い情報のみを表示
・課題仮説（セクション3）は支援テーマに依存しない
・提案内容（セクション4）のみ支援テーマに基づく
・推測による記載は「～と推察されます」等を明記
・絶対にハルシネーションを起こさない
`

const generatePrompt = (companyData: CompanyAnalysisData) => {
  return COMPANY_ANALYSIS_PROMPT
    .replace('{companyName}', companyData.companyName)
    .replace('{divisionName}', companyData.divisionName)
    .replace('{targetService}', companyData.targetService)
    .replace('{websiteUrl}', companyData.websiteUrl)
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
    if (!companyData.companyName || !companyData.targetService) {
      toast({
        variant: "destructive",
        title: "入力エラー",
        description: "企業名と支援テーマは必須項目です",
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
