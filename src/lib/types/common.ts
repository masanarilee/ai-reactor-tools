export interface TalentSummaryResult {
  summary: string;
  concerns: string;
  questions: string;
  careerPlan: string;
}

export interface FileUploadResult {
  success: boolean;
  filePath?: string;
  error?: string;
}