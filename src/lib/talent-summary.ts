import { toast } from "sonner"
import { supabase } from "@/integrations/supabase/client"
import { readFileContent, processSupplementaryInfo } from "@/utils/text-utils"
import { TALENT_SUMMARY_PROMPT, JOB_SUMMARY_PROMPT } from "./prompts"

export async function generateTalentSummary(file: File | null, supplementaryInfo: string) {
  try {
    if (!file && !supplementaryInfo) {
      throw new Error('職務経歴書または補足情報のいずれかが必要です');
    }

    let fileContent = '';
    if (file) {
      try {
        fileContent = await readFileContent(file);
      } catch (error) {
        console.error('Error reading file:', error);
        toast.error("ファイルの読み込みに失敗しました");
        throw error;
      }
    }
    
    const processedInfo = processSupplementaryInfo(supplementaryInfo);
    const prompt = TALENT_SUMMARY_PROMPT
      .replace('{resume}', fileContent || '提供なし')
      .replace('{supplementaryInfo}', processedInfo || '提供なし');

    const { data, error } = await supabase.functions.invoke('ask-claude', {
      body: { 
        prompt,
        options: {
          model: 'gpt-4o-mini',
          max_tokens: 4096,
          temperature: 0.7
        }
      }
    });

    if (error) {
      console.error('API Error:', error);
      throw error;
    }

    return data.text;

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
      try {
        fileContent = await readFileContent(file);
      } catch (error) {
        console.error('Error reading file:', error);
        toast.error("ファイルの読み込みに失敗しました");
        throw error;
      }
    }

    const prompt = JOB_SUMMARY_PROMPT
      .replace('{fileContent}', fileContent || '提供なし')
      .replace('{supplementaryInfo}', supplementaryInfo || '提供なし');

    const { data, error } = await supabase.functions.invoke('ask-claude', {
      body: { 
        prompt,
        options: {
          model: 'gpt-4o-mini',
          max_tokens: 4096,
          temperature: 0.7
        }
      }
    });

    if (error) throw error;
    return data.text;

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
      try {
        fileContent = await readFileContent(file);
      } catch (error) {
        console.error('Error reading file:', error);
        toast.error("ファイルの読み込みに失敗しました");
        throw error;
      }
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
      body: { 
        prompt,
        options: {
          model: 'gpt-4o-mini',
          max_tokens: 4096,
          temperature: 0.7
        }
      }
    });

    if (error) throw error;

    // Extract sections from the response
    const sections = {
      summary: extractSection(data.text, "人材要約"),
      concerns: extractSection(data.text, "懸念点"),
      questions: extractSection(data.text, "質問例"),
      careerPlan: extractSection(data.text, "キャリアプラン")
    };

    return sections;

  } catch (error) {
    console.error('Error generating counseling report:', error);
    toast.error("カウンセリングレポートの生成に失敗しました。" + (error instanceof Error ? error.message : '不明なエラーが発生しました'));
    throw error;
  }
}

// Helper function to extract sections from the response
function extractSection(text: string, sectionName: string): string {
  const sections = text.split(/\d\.\s+/);
  let content = "";
  
  switch(sectionName) {
    case "人材要約":
      content = sections[1] || "";
      break;
    case "懸念点":
      content = sections[2] || "";
      break;
    case "質問例":
      content = sections[3] || "";
      break;
    case "キャリアプラン":
      content = sections[4] || "";
      break;
  }

  // Remove section title and bullet points
  return content
    .replace(new RegExp(`${sectionName}：?\n?`), '')
    .replace(/^-\s+/gm, '')
    .trim();
}