import { toast } from "sonner"
import { supabase } from "@/integrations/supabase/client"

export async function generateTalentSummary(file: File | null, supplementaryInfo: string) {
  try {
    if (!file && !supplementaryInfo) {
      throw new Error('職務経歴書または面談メモのいずれかが必要です');
    }

    let fileContent = '';
    if (file) {
      fileContent = await readFileContent(file);
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

${file ? `ファイル名：${file.name}` : ''}
${fileContent ? `#職務経歴書の内容\n${fileContent}` : ''}`

    const { data, error } = await supabase.functions.invoke('ask-claude', {
      body: { prompt }
    })

    if (error) throw error
    return data.text

  } catch (error) {
    console.error('Error generating summary:', error);
    toast.error("サマリの生成に失敗しました。" + (error instanceof Error ? error.message : '不明なエラーが発生しました'));
    throw error;
  }
}

export async function generateJobSummary(file: File | null, supplementaryInfo: string) {
  try {
    if (!file && !supplementaryInfo) {
      throw new Error('案件情報/求人票または案件情報のいずれかが必要です');
    }

    let fileContent = '';
    if (file) {
      fileContent = await readFileContent(file);
    }

    const prompt = `
メッセージが送信された場合や求人情報が添付された場合、URLが貼り付けられた場合はその内容を読み取って以下の#フォーマット に沿って#案件 をアウトプットしてください。
また、複数の案件情報が含まれた情報をインプットした場合は、複数の案件情報をアウトプットしてください

■商流：
■案件名：
■案件概要：

■開発環境：

■必須スキル：

■歓迎スキル：

■期間：
■勤務地：
■募集人数：
■単価：
■精算幅：
■面談回数：
■就業時間：
■年齢：
■支払いサイト：
■備考：

#案件情報
${supplementaryInfo}

${file ? `ファイル名：${file.name}` : ''}
${fileContent ? `#添付ファイルの内容\n${fileContent}` : ''}`

    const { data, error } = await supabase.functions.invoke('ask-claude', {
      body: { prompt }
    })

    if (error) throw error
    return data.text

  } catch (error) {
    console.error('Error generating job summary:', error);
    toast.error("案件サマリの生成に失敗しました。" + (error instanceof Error ? error.message : '不明なエラーが発生しました'));
    throw error;
  }
}

async function readFileContent(file: File): Promise<string> {
  const text = await file.text();
  return text;
}