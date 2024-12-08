import { readWordContent } from "@/utils/word-utils";
import { supabase } from "@/integrations/supabase/client";

export const readFileContent = async (file: File): Promise<string> => {
  try {
    // Handle Word documents with mammoth
    if (file.type === 'application/msword' || 
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      return await readWordContent(file);
    }
    
    // For PDFs and other file types, use Supabase Function
    const formData = new FormData();
    formData.append('file', file);

    console.log('Calling process-document function with file:', file.name);
    const { data, error } = await supabase.functions.invoke('process-document', {
      body: formData
    });

    if (error) {
      console.error('Supabase function error:', error);
      throw error;
    }

    if (!data.success) {
      console.error('Processing error:', data.error);
      throw new Error(data.error || 'ファイルの処理に失敗しました');
    }

    console.log('File processed successfully');
    return data.text;
  } catch (error) {
    console.error('Error reading file:', error);
    throw new Error('ファイルの読み込みに失敗しました: ' + error.message);
  }
};