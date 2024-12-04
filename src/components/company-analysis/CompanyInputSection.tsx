import { TextInput } from "@/components/TextInput"
import { Button } from "@/components/ui/button"
import { RotateCcw, FileText } from "lucide-react"
import LoadingDots from "@/components/LoadingDots"
import { CompanyAnalysisData } from "@/pages/CompanyAnalysis"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"

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
        label="企業名 *"
        value={companyData.companyName}
        onChange={(e) => setCompanyData({ ...companyData, companyName: e.target.value })}
        placeholder="企業名を入力してください"
        align="left"
      />
      <div className="space-y-2 text-left">
        <Label className="text-base font-medium text-[#1E3D59]">企業HP</Label>
        <Input
          type="url"
          placeholder="https://example.com"
          value={companyData.websiteUrl}
          onChange={(e) => setCompanyData({ ...companyData, websiteUrl: e.target.value })}
          className="bg-white"
        />
      </div>
      <TextInput
        label="事業部名"
        value={companyData.divisionName}
        onChange={(e) => setCompanyData({ ...companyData, divisionName: e.target.value })}
        placeholder="事業部名を入力してください（任意）"
        align="left"
      />
      <TextInput
        label="支援テーマ *"
        value={companyData.targetService}
        onChange={(e) => setCompanyData({ ...companyData, targetService: e.target.value })}
        placeholder="支援テーマを入力してください"
        align="left"
      />
      <div className="flex gap-4 justify-end">
        <Button
          onClick={onProcess}
          className="w-32 h-10 bg-gradient-to-r from-[#1E3D59] to-[#17A2B8] hover:opacity-90 relative"
          disabled={isProcessing}
        >
          {isProcessing ? (
            <LoadingDots />
          ) : (
            <>
              <FileText className="w-4 h-4 mr-2" />
              Generate
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
          Reset
        </Button>
      </div>
    </div>
  )
}
