import { toast } from "sonner"
import { supabase } from "@/integrations/supabase/client"

export async function generateTalentSummary(fileContent: string, supplementaryInfo: string) {
  try {
    console.log('Generating summary with content length:', fileContent.length);
    
    const prompt = `
以下の経歴書と補足情報から、人材サマリを生成してください。
できるだけ具体的な情報を含め、以下の項目に分けて記載してください：

- 基本情報（年齢、性別、最終学歴）
- 技術スキル
- 業務経験
- 強み
- 特記事項

経歴書：
${fileContent}

補足情報：
${supplementaryInfo}
`

    const { data, error } = await supabase.functions.invoke('ask-claude', {
      body: { prompt }
    })

    if (error) {
      console.error('Supabase function error:', error);
      throw error;
    }
    
    console.log('Summary generated successfully');
    return data.text;

  } catch (error) {
    console.error('Error generating summary:', error);
    toast.error("サマリの生成に失敗しました。");
    throw error;
  }
}