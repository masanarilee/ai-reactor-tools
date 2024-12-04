import { TextInput } from "@/components/TextInput"
import { Button } from "@/components/ui/button"
import { RotateCcw, FileText } from "lucide-react"
import { LoadingSpinner } from "@/components/LoadingSpinner"
import { CompanyAnalysisData } from "@/pages/CompanyAnalysis"

interface CompanyInputSectionProps {
  companyData: CompanyAnalysisData
  setCompanyData: (data: CompanyAnalysisData) => void
  isProcessing: boolean
  onProcess: () => void
  onReset: () => void
}

export const CompanyInputSection = ({
  companyData,
  setCompanyData,
  isProcessing,
  onProcess,
  onReset,
}: CompanyInputSectionProps) => {
  return (
    <div className="flex flex-col gap-6 p-6 bg-white rounded-lg shadow-sm">
      <div className="text-left h-[60px] flex items-center">
        <h3 className="text-base font-medium text-[#1E3D59]">企業情報入力</h3>
      </div>
      <TextInput
        label="企業名"
        value={companyData.companyName}
        onChange={(e) => setCompanyData({ ...companyData, companyName: e.target.value })}
        placeholder="企業名を入力してください"
        align="left"
      />
      <TextInput
        label="事業部名"
        value={companyData.divisionName}
        onChange={(e) => setCompanyData({ ...companyData, divisionName: e.target.value })}
        placeholder="事業部名を入力してください"
        align="left"
      />
      <TextInput
        label="提供サービス"
        value={companyData.targetService}
        onChange={(e) => setCompanyData({ ...companyData, targetService: e.target.value })}
        placeholder="提供サービスを入力してください"
        align="left"
      />
      <div className="flex gap-4 justify-end">
        <Button
          onClick={onProcess}
          className="w-32 h-10 bg-[#1E3D59] hover:bg-[#17A2B8] relative"
          disabled={isProcessing}
        >
          {isProcessing ? (
            <LoadingSpinner />
          ) : (
            <>
              <FileText className="w-4 h-4 mr-2" />
              分析生成
            </>
          )}
        </Button>
        <Button
          variant="outline"
          onClick={onReset}
          className="w-32 h-10"
          disabled={isProcessing}
        >
          <RotateCcw className="w-4 h-4 mr-2" />
          リセット
        </Button>
      </div>
    </div>
  )
}