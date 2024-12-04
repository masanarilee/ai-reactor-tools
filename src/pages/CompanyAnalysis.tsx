// src/pages/CompanyAnalysis.tsx

import { useState, useEffect } from "react"
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

const COMPANY_ANALYSIS_PROMPT = (data: CompanyAnalysisData) => `
【分析リクエスト】
■会社名：${data.companyName}
■事業部名：${data.divisionName}
■企業URL：${data.websiteUrl}
■支援テーマ：${data.targetService}

【企業分析レポート】
1. 企業概要
企業の基本情報をまとめてください
2. 市場環境
対象企業や対象事業の市場状況をまとめてください
3. 課題仮説
- 1,2を考慮して企業が抱える可能性のある課題を分析（支援テーマに依存せず広い範囲で行う）
- このセクションでは支援テーマに影響されてはならない

4. 提案内容（支援テーマに基づく）
- ここでのみ支援テーマを考慮し、提案を行う...
`

const CompanyAnalysisPage = () => {
  const [companyData, setCompanyData] = useState<CompanyAnalysisData>({
    companyName: "",
    divisionName: "",
    targetService: "",
    websiteUrl: ""
  })
  
  const [analysisResult, setAnalysisResult] = useState<AnalysisResult | null>(null)
  const { toast } = useToast()

  const handleSubmit = async () => {
    // フォームデータをAPIに渡して解析結果を取得
    const prompt = COMPANY_ANALYSIS_PROMPT(companyData)

    try {
      // askClaudeはOpenAPI仕様でAPIを呼び出す関数
      const response = await askClaude(prompt)

      // 成功した場合、結果を解析
      if (response && response.data) {
        setAnalysisResult({
          overview: response.data.overview,
          marketAnalysis: response.data.marketAnalysis,
          challenges: response.data.challenges,
          proposal: response.data.proposal
        })
      } else {
        throw new Error("APIからのレスポンスに問題があります。")
      }
    } catch (error) {
      // エラーハンドリング
      toast({
        title: "エラーが発生しました",
        description: error instanceof Error ? error.message : "不明なエラーが発生しました。",
        variant: "destructive"
      })
    }
  }

  return (
    <MainContent>
      <CompanyInputSection companyData={companyData} setCompanyData={setCompanyData} />
      <button onClick={handleSubmit}>解析を実行</button>
      {analysisResult && (
        <CompanyPreviewSection analysisResult={analysisResult} />
      )}
    </MainContent>
  )
}

export default CompanyAnalysisPage
