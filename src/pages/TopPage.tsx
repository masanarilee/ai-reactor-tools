import { useNavigate } from "react-router-dom"
import { Users, Briefcase, MessageCircle, Building2, Send } from "lucide-react"
import { Button } from "@/components/ui/button"
import LogoParticles from "@/components/LogoParticles"

const TopPage = () => {
  const navigate = useNavigate()

  return (
    <div className="min-h-screen w-full flex flex-col items-center justify-center bg-gradient-to-br from-blue-25 via-white to-purple-50">
      <div 
        className="cursor-pointer relative"
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
          className="px-8 py-10 text-lg font-['Noto Sans JP'] text-[#1E3D59] hover:text-[#17A2B8] 
            bg-white hover:bg-sidebar-hover-bg shadow-lg hover:shadow-xl transition-all duration-300 
            flex items-center gap-4 rounded-xl group relative"
        >
          <Users className="w-6 h-6 transition-transform duration-300 group-hover:scale-110 group-hover:text-[#17A2B8]" />
          <span className="relative">
            人材サマリ生成
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#17A2B8] transform transition-transform duration-300 origin-left scale-x-0 group-hover:scale-x-100" />
          </span>
        </Button>

        <Button
          onClick={() => navigate("/job-summary")}
          className="px-8 py-10 text-lg font-['Noto Sans JP'] text-[#1E3D59] hover:text-[#17A2B8] 
            bg-white hover:bg-sidebar-hover-bg shadow-lg hover:shadow-xl transition-all duration-300 
            flex items-center gap-4 rounded-xl group relative"
        >
          <Briefcase className="w-6 h-6 transition-transform duration-300 group-hover:scale-110 group-hover:text-[#17A2B8]" />
          <span className="relative">
            案件サマリ生成
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#17A2B8] transform transition-transform duration-300 origin-left scale-x-0 group-hover:scale-x-100" />
          </span>
        </Button>

        <Button
          onClick={() => navigate("/counseling")}
          className="px-8 py-10 text-lg font-['Noto Sans JP'] text-[#1E3D59] hover:text-[#17A2B8] 
            bg-white hover:bg-sidebar-hover-bg shadow-lg hover:shadow-xl transition-all duration-300 
            flex items-center gap-4 rounded-xl group relative"
        >
          <MessageCircle className="w-6 h-6 transition-transform duration-300 group-hover:scale-110 group-hover:text-[#17A2B8]" />
          <span className="relative">
            カウンセリング支援
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#17A2B8] transform transition-transform duration-300 origin-left scale-x-0 group-hover:scale-x-100" />
          </span>
        </Button>

        <Button
          onClick={() => navigate("/company-analysis")}
          className="px-8 py-10 text-lg font-['Noto Sans JP'] text-[#1E3D59] hover:text-[#17A2B8] 
            bg-white hover:bg-sidebar-hover-bg shadow-lg hover:shadow-xl transition-all duration-300 
            flex items-center gap-4 rounded-xl group relative"
        >
          <Building2 className="w-6 h-6 transition-transform duration-300 group-hover:scale-110 group-hover:text-[#17A2B8]" />
          <span className="relative">
            企業分析
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#17A2B8] transform transition-transform duration-300 origin-left scale-x-0 group-hover:scale-x-100" />
          </span>
        </Button>

        <Button
          onClick={() => navigate("/scout")}
          className="px-8 py-10 text-lg font-['Noto Sans JP'] text-[#1E3D59] hover:text-[#17A2B8] 
            bg-white hover:bg-sidebar-hover-bg shadow-lg hover:shadow-xl transition-all duration-300 
            flex items-center gap-4 rounded-xl group relative"
        >
          <Send className="w-6 h-6 transition-transform duration-300 group-hover:scale-110 group-hover:text-[#17A2B8]" />
          <span className="relative">
            スカウト文生成
            <span className="absolute bottom-0 left-0 w-full h-0.5 bg-[#17A2B8] transform transition-transform duration-300 origin-left scale-x-0 group-hover:scale-x-100" />
          </span>
        </Button>
      </div>
    </div>
  )
}

export default TopPage
