import { toast } from "sonner"
import { supabase } from "@/integrations/supabase/client"
import { readFileContent } from "@/utils/text-utils"
import { PROMPTS } from "@/lib/constants/prompts"

export interface TalentSummaryResult {
  summary: string;
  concerns: string;
  questions: string;
  careerPlan: string;
}

const generateTalentPrompt = (fileContent: string, supplementaryInfo: string) => {
  return PROMPTS.TALENT.SUMMARY
    .replace('{resume}', fileContent)
    .replace('{supplementaryInfo}', supplementaryInfo)
}

const generateJobPrompt = (fileContent: string, supplementaryInfo: string) => {
  return PROMPTS.JOB.SUMMARY
    .replace('{fileContent}', fileContent)
    .replace('{supplementaryInfo}', supplementaryInfo)
}

const generateCounselingPrompt = (fileContent: string, supplementaryInfo: string) => {
  return PROMPTS.TALENT.COUNSELING
    .replace('{fileContent}', fileContent ? `#経歴書の内容\n${fileContent}` : '')
    .replace('{supplementaryInfo}', supplementaryInfo)
}

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

    const prompt = generateTalentPrompt(fileContent, supplementaryInfo.trim());
    console.log('Generated prompt:', prompt); // デバッグ用

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
    console.log('AI response:', data.text); // デバッグ用
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

    const prompt = generateJobPrompt(fileContent, supplementaryInfo);

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

export async function generateCounselingReport(file: File | null, supplementaryInfo: string): Promise<TalentSummaryResult> {
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

    const prompt = generateCounselingPrompt(fileContent, supplementaryInfo);

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

    return extractSections(data.text);
  } catch (error) {
    console.error('Error in generateCounselingReport:', error);
    toast.error("カウンセリングレポートの生成に失敗しました。" + (error instanceof Error ? error.message : '不明なエラーが発生しました'));
    throw error;
  }
}

function extractSections(text: string): TalentSummaryResult {
  const sections = {
    summary: extractSection(text, "【人材要約】", "【懸念点】"),
    concerns: extractSection(text, "【懸念点】", "【質問例】"),
    questions: extractSection(text, "【質問例】", "【キャリアプラン】"),
    careerPlan: extractSection(text, "【キャリアプラン】", "#補足情報")
  };

  return sections;
}

function extractSection(text: string, startSection: string, endSection: string): string {
  const startIndex = text.indexOf(startSection);
  if (startIndex === -1) return "";
  
  const endIndex = text.indexOf(endSection, startIndex);
  const sectionContent = endIndex === -1 
    ? text.slice(startIndex + startSection.length)
    : text.slice(startIndex + startSection.length, endIndex);
  
  return sectionContent
    .split('\n')
    .map(line => line.trim())
    .filter(line => line && !line.startsWith(startSection))
    .join('\n')
    .trim();
}