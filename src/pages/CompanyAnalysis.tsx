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

  const generatePrompt = (data: CompanyAnalysisData) => {
    return `
【分析リクエスト】
■会社名：${data.companyName}
■事業部名：${data.divisionName || "（指定なし）"}
■企業URL：${data.websiteUrl || "（必須）"}
■支援テーマ：${data.targetService}

【企業分析レポート】
1. 公開情報に基づく企業概要
- 企業の基本情報（所在地/設立年等）
- 公表されている事業領域
- 公開されている経営方針・ビジョン
※数値情報は公開情報のみ記載

2. 市場環境
- 対象業界の市場規模（出典明記）
- 業界トレンド（出典明記）
※個社の競合分析は控え、業界全体の動向を記載

3. 課題仮説
-1,2を考慮して企業がどのような課題を抱えているかの分析を支援テーマにとらわれず広い範囲で行って

4. 提案内容（支援テーマに基づく）
- 支援テーマの内容を当企業に紹介する場合、どのような提案がよいか
- 提案の方向性
- 想定される施策例

【分析基準】
・企業URLから確認できる情報のみを使用
・推測による記載は「～と推察されます」等を明記
・出典のない数値は使用しない
・競合他社の具体名は記載しない`
  }

  const parseClaudeResponse = (response: string): AnalysisResult => {
    const sections = response.split(/\d\. /);
    return {
      overview: sections[1]?.trim() || "",
      marketAnalysis: sections[2]?.trim() || "",
      challenges: sections[3]?.trim() || "",
      proposal: sections[4]?.trim() || "",
    };
  };

  const handleProcess = async () => {
    if (!companyData.companyName || !companyData.targetService || !companyData.websiteUrl) {
      toast({
        variant: "destructive",
        title: "入力エラー",
        description: "会社名、企業URL、支援テーマは必須項目です",
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
      <div className="grid lg:grid-cols-2 gap-8 mt-8">
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
