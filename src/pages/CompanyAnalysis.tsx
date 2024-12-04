import { useState } from "react"
import { MainContent } from "@/components/layouts/MainContent"
import { useToast } from "@/hooks/use-toast"
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
  hypothesis: string
  proposal: string
}

const COMPANY_ANALYSIS_PROMPT = `
【分析リクエスト】
■会社名：${data.companyName}
■事業部名：${data.divisionName}
■企業URL：${data.websiteUrl}
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

const parseClaudeResponse = (response: string): AnalysisResult => {
  // 応答を分析結果の各セクションに分割するロジック
  return {
    overview: response.split('2.')[0] || "",
    marketAnalysis: response.split('2.')[1]?.split('3.')[0] || "",
    hypothesis: response.split('3.')[1]?.split('4.')[0] || "",
    proposal: response.split('4.')[1] || "",
  }
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
    hypothesis: "",
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
      hypothesis: "",
      proposal: "",
    })
    toast({
      title: "リセット完了",
      description: "すべての情報がクリアされました",
    })
  }

  return (
    <MainContent title="企業分析">
      <div className="grid lg:grid-cols-2 gap-8 mt-8">
        <div className="space-y-6">
          <div className="space-y-4">
            <label className="text-sm font-medium">企業名</label>
            <input
              type="text"
              value={companyData.companyName}
              onChange={(e) => setCompanyData({ ...companyData, companyName: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="space-y-4">
            <label className="text-sm font-medium">部署名</label>
            <input
              type="text"
              value={companyData.divisionName}
              onChange={(e) => setCompanyData({ ...companyData, divisionName: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="space-y-4">
            <label className="text-sm font-medium">対象サービス</label>
            <input
              type="text"
              value={companyData.targetService}
              onChange={(e) => setCompanyData({ ...companyData, targetService: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="space-y-4">
            <label className="text-sm font-medium">WebサイトURL</label>
            <input
              type="text"
              value={companyData.websiteUrl}
              onChange={(e) => setCompanyData({ ...companyData, websiteUrl: e.target.value })}
              className="w-full p-2 border rounded"
            />
          </div>
          <div className="flex gap-4 justify-end">
            <button
              onClick={handleProcess}
              disabled={isProcessing}
              className="px-4 py-2 bg-blue-600 text-white rounded"
            >
              分析開始
            </button>
            <button
              onClick={handleReset}
              className="px-4 py-2 border rounded"
            >
              リセット
            </button>
          </div>
        </div>
        <div className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium mb-4">分析結果</h3>
          <div className="space-y-6">
            <div>
              <h4 className="font-medium">企業概要</h4>
              <p className="whitespace-pre-wrap">{analysisResult.overview}</p>
            </div>
            <div>
              <h4 className="font-medium">市場環境</h4>
              <p className="whitespace-pre-wrap">{analysisResult.marketAnalysis}</p>
            </div>
            <div>
              <h4 className="font-medium">課題仮説</h4>
              <p className="whitespace-pre-wrap">{analysisResult.hypothesis}</p>
            </div>
            <div>
              <h4 className="font-medium">提案内容</h4>
              <p className="whitespace-pre-wrap">{analysisResult.proposal}</p>
            </div>
          </div>
        </div>
      </div>
    </MainContent>
  )
}

export default CompanyAnalysis
