import { supabase } from "@/integrations/supabase/client";
import { toast } from "@/components/ui/use-toast";
import { MAX_FILE_SIZE } from "@/utils/constants";

export interface FileProcessingResult {
  success: boolean;
  text: string;
  error?: string;
}

export async function processFile(file: File): Promise<FileProcessingResult> {
  try {
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('ファイルサイズが大きすぎます（上限: 10MB）');
    }

    const formData = new FormData();
    formData.append('file', file);

    const { data, error } = await supabase.functions.invoke('process-document', {
      body: formData
    });

    if (error) throw error;
    if (!data.success) throw new Error(data.error);

    return {
      success: true,
      text: data.text
    };

  } catch (error) {
    console.error('Error processing file:', error);
    toast({
      variant: "destructive",
      title: "エラーが発生しました",
      description: error instanceof Error ? error.message : "ファイルの処理中にエラーが発生しました"
    });

    return {
      success: false,
      text: "",
      error: error instanceof Error ? error.message : "Unknown error occurred"
    };
  }
}