import { useState } from "react"
import { MainContent } from "@/components/MainContent"
import { CompanyInputSection } from "@/components/company-analysis/CompanyInputSection"
import { CompanyPreviewSection } from "@/components/company-analysis/CompanyPreviewSection"
import { useToast } from "@/components/ui/use-toast"

export interface CompanyAnalysisData {
  companyName: string
  divisionName: string
  targetService: string
}

const CompanyAnalysis = () => {
  const [companyData, setCompanyData] = useState<CompanyAnalysisData>({
    companyName: "",
    divisionName: "",
    targetService: "",
  })
  const [isProcessing, setIsProcessing] = useState(false)
  const { toast } = useToast()

  const handleProcess = async () => {
    setIsProcessing(true)
    try {
      // TODO: Implement API call for analysis generation
      setTimeout(() => {
        setIsProcessing(false)
      }, 2000)
    } catch (error) {
      toast({
        variant: "destructive",
        title: "エラーが発生しました",
        description: "もう一度お試しください",
      })
      setIsProcessing(false)
    }
  }

  const handleReset = () => {
    setCompanyData({
      companyName: "",
      divisionName: "",
      targetService: "",
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
        <CompanyPreviewSection />
      </div>
    </MainContent>
  )
}

export default CompanyAnalysis