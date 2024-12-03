import { toast } from "sonner"
import { supabase } from "@/integrations/supabase/client"

export async function generateTalentSummary(file: File, supplementaryInfo: string) {
  try {
    console.log('Generating summary for file:', file.name);
    
    if (!file) {
      throw new Error('ファイルが見つかりません');
    }

    const prompt = `
Excel,PDF,Wordの職務経歴書を読み取るか面談メモの内容を分析して、次の形式で情報を整理してください：
必要な情報を抽出し、該当するフィールドに入力します。
入力が不要な項目（例：日本国籍の場合は【国籍】項目を削除）に関しては、その行を削除します。
【経験スキル】は箇条書きにしてわかりやすく、【経験コメント】は本人が経験してきた内容をアピールするための文章をですます調でわかりやすく記載します。
また、面談メモの情報も参考にしてください。

＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝
【ID】
【年齢】歳
【性別】
【国籍】（日本籍の場合は削除）
【所属】弊社個人事業主
【住まい】
　　完全フルリモート：道府県のみ記載（都内の方は市区町村）
　　出社できる方：最寄り駅まで記載
【稼働形態】フルリモート、一部リモート（割合）、常駐
【稼動開始日】月 
【稼働率】20～100％　週1～5日
【稼働例】例：1日8h稼働×3日　水木金
【希望単金】
【経験スキル】
　工程：
　言語：
　FW：
　DB：
【希望案件】
　・
　・
【NG案件】
　・
　・
【経験コメント】
　・
　・
【お人柄】
　・

＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝＝

#面談メモ
${supplementaryInfo}

ファイル名：${file.name}
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
    toast.error("サマリの生成に失敗しました。" + (error as Error).message);
    throw error;
  }
}