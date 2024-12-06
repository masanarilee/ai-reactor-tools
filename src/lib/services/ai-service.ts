import { supabase } from "@/integrations/supabase/client";
import { handleError } from "@/lib/utils/error-handler";
import { PROMPTS } from "@/lib/constants/prompts";

interface AIRequestOptions {
  model?: string;
  max_tokens?: number;
  temperature?: number;
}

export async function queryAI(prompt: string, options: AIRequestOptions = {}) {
  try {
    const { data, error } = await supabase.functions.invoke('ask-claude', {
      body: { 
        prompt,
        options: {
          model: options.model || 'gpt-4o-mini',
          max_tokens: options.max_tokens || 4096,
          temperature: options.temperature || 0.7
        }
      }
    });

    if (error) throw error;
    return data.text;

  } catch (error) {
    handleError(error, "AI応答の取得に失敗しました");
    throw error;
  }
}

export function generateTalentPrompt(resume: string, supplementaryInfo: string) {
  return PROMPTS.TALENT.SUMMARY
    .replace('{resume}', resume)
    .replace('{supplementaryInfo}', supplementaryInfo);
}

export function generateJobPrompt(fileContent: string, supplementaryInfo: string) {
  return PROMPTS.JOB.SUMMARY
    .replace('{fileContent}', fileContent)
    .replace('{supplementaryInfo}', supplementaryInfo);
}

export function generateCompanyAnalysisPrompt(params: {
  companyName: string;
  divisionName: string;
  websiteUrl: string;
  targetService: string;
}) {
  return PROMPTS.COMPANY.ANALYSIS
    .replace('{companyName}', params.companyName)
    .replace('{divisionName}', params.divisionName)
    .replace('{websiteUrl}', params.websiteUrl)
    .replace('{targetService}', params.targetService);
}