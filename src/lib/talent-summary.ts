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
以下の職務経歴書と面談メモから、人材サマリを作成してください：
面談メモのみの場合でも可能な限りフォーマットに沿ってアウトプットをしてください。

職務経歴書：
${fileContent ? fileContent : '提供なし'}

面談メモ：
${supplementaryInfo ? supplementaryInfo : '提供なし'}

以下の形式で情報を整理して出力してください。
【経験コメント】と【お人柄】の部分は「です・ます」調で記載してください：

【ID】
【年齢】歳
【性別】
【国籍】
【所属】弊社個人事業主
【住まい】
【稼働形態】
【稼動開始日】
【稼働率】
【稼働例】
【希望単金】
【経験スキル】
【希望案件】
【NG案件】
【経験コメント】
【お人柄】`

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
あなたは求人情報を整理して案件サマリを作成する専門家です。
以下の情報から、案件の詳細を抽出・整理し、フォーマットに沿ってまとめてください。
著作権に配慮しながら、事実に基づいて情報を整理してください。

以下のフォーマットで出力してください：

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

export async function generateCounselingReport(file: File | null, supplementaryInfo: string) {
  try {
    if (!file && !supplementaryInfo) {
      throw new Error('経歴書または補足情報のいずれかが必要です');
    }

    let fileContent = '';
    if (file) {
      fileContent = await readFileContent(file);
    }

    const prompt = `
経歴書を読み取るか補足情報の内容を分析して、次の形式で情報を整理してください：

1. 人材要約：
- 経験、スキル、強みを簡潔に要約
- キャリアの方向性や特徴を分析

2. 懸念点：
- キャリアパスにおける潜在的な課題
- スキルギャップや改善が必要な領域
- 市場価値向上のための提案

3. 質問例：
- キャリアの方向性を明確にするための質問
- スキル向上に関する具体的な質問
- 将来のキャリアプランに関する質問

4. キャリアプラン：
- 短期的な目標（1-2年）
- 中期的な目標（3-5年）
- 長期的なキャリアビジョン
- 具体的なアクションプラン

#補足情報
${supplementaryInfo}

${file ? `ファイル名：${file.name}` : ''}
${fileContent ? `#経歴書の内容\n${fileContent}` : ''}`

    const { data, error } = await supabase.functions.invoke('ask-claude', {
      body: { prompt }
    })

    if (error) throw error

    // Split the response into sections
    const sections = data.text.split(/\d\.\s+/);
    return {
      summary: sections[1]?.trim() || '',
      concerns: sections[2]?.trim() || '',
      questions: sections[3]?.trim() || '',
      careerPlan: sections[4]?.trim() || ''
    };

  } catch (error) {
    console.error('Error generating counseling report:', error);
    toast.error("カウンセリングレポートの生成に失敗しました。" + (error instanceof Error ? error.message : '不明なエラーが発生しました'));
    throw error;
  }
}

async function readFileContent(file: File): Promise<string> {
  const text = await file.text();
  return text;
}
