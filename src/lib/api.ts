// src/lib/api.ts
import { toast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"

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

export function generatePrompt(data: { 
  companyName: string;
  targetService: string;
  websiteUrl?: string;
}): string {
  return `
企業名：${data.companyName}
支援テーマ：${data.targetService}
${data.websiteUrl ? `企業URL：${data.websiteUrl}` : ''}

上記の企業について以下の項目を分析してください：

【企業概要】
・企業の事業内容、特徴、強みを簡潔に説明

【市場環境】
・業界の現状と課題
・競合状況
・市場機会

【課題仮説】
・想定される経営課題や組織課題
・改善が必要な領域

【提案内容】
・課題解決に向けた具体的な提案
・期待される効果
`;
}
