import { useNavigate } from "react-router-dom"
import { ArrowRight } from "lucide-react"
import { Button } from "@/components/ui/button"
import LogoParticles from "@/components/LogoParticles"

const TopPage = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-200 via-[#e6e9f0] to-[#eef1f5]">
      <div 
        className="cursor-pointer transform hover:scale-105 transition-transform duration-300 mb-4 relative"
        onClick={() => navigate("/")}
      >
        <LogoParticles />
        <span className="text-7xl font-extrabold tracking-wide font-sans">
          <span className="text-[#1E3D59] drop-shadow-lg">Biz</span>
          <span className="text-[#17A2B8] drop-shadow-lg">Assist</span>
        </span>
      </div>
      
      <p className="mt-8 mb-12 text-xl text-gray-700 font-['Noto Sans JP'] tracking-wider">
        様々な業務の支援をAIが行います
      </p>

      <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 px-8">
        <Button
          onClick={() => navigate("/talent-summary")}
          className="px-8 py-10 text-lg font-['Noto Sans JP'] bg-white text-gray-800 hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 rounded-xl"
        >
          人材要約
          <ArrowRight className="w-5 h-5" />
        </Button>

        <Button
          onClick={() => navigate("/job-summary")}
          className="px-8 py-10 text-lg font-['Noto Sans JP'] bg-white text-gray-800 hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 rounded-xl"
        >
          求人要約
          <ArrowRight className="w-5 h-5" />
        </Button>

        <Button
          onClick={() => navigate("/counseling")}
          className="px-8 py-10 text-lg font-['Noto Sans JP'] bg-white text-gray-800 hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 rounded-xl"
        >
          カウンセリング
          <ArrowRight className="w-5 h-5" />
        </Button>

        <Button
          onClick={() => navigate("/company-analysis")}
          className="px-8 py-10 text-lg font-['Noto Sans JP'] bg-white text-gray-800 hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 rounded-xl"
        >
          企業分析
          <ArrowRight className="w-5 h-5" />
        </Button>

        <Button
          onClick={() => navigate("/scout")}
          className="px-8 py-10 text-lg font-['Noto Sans JP'] bg-white text-gray-800 hover:bg-gray-50 shadow-lg hover:shadow-xl transition-all duration-300 flex items-center gap-3 rounded-xl"
        >
          スカウト
          <ArrowRight className="w-5 h-5" />
        </Button>
      </div>
    </div>
  )
}

export default TopPage