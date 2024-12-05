import { supabase } from "@/integrations/supabase/client"
import { toast } from "@/components/ui/use-toast"

export interface AnalysisResult {
  overview: string;
  marketAnalysis: string;
  challenges: string;
  proposal: string;
}

export async function askClaude(prompt: string) {
  try {
    const { data, error } = await supabase.functions.invoke('ask-claude', {
      body: { 
        prompt,
        options: {
          model: 'gpt-4',
          max_tokens: 4096,
          temperature: 0.7
        }
      }
    })

    if (error) throw error
    return data.text

  } catch (error) {
    toast({
      variant: "destructive",
      title: "エラーが発生しました",
      description: "AI応答の取得に失敗しました"
    })
    throw error
  }
}

export function parseClaudeResponse(response: string): AnalysisResult {
  const sections = response.split('【');
  const result: AnalysisResult = {
    overview: '',
    marketAnalysis: '',
    challenges: '',
    proposal: '',
  };

  sections.forEach(section => {
    if (section.includes('企業概要】')) {
      result.overview = section.split('】')[1].trim();
    } else if (section.includes('市場環境】')) {
      result.marketAnalysis = section.split('】')[1].trim();
    } else if (section.includes('課題仮説】')) {
      result.challenges = section.split('】')[1].trim();
    } else if (section.includes('提案内容】')) {
      result.proposal = section.split('】')[1].trim();
    }
  });

  return result;
}