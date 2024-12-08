import { readWordContent } from "@/utils/word-utils";

export const readFileContent = async (file: File): Promise<string> => {
  try {
    if (file.type === 'application/msword' || 
        file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document') {
      return await readWordContent(file);
    }
    
    // PDFやその他のファイルタイプの処理は既存のSupabase Functionを使用
    const formData = new FormData();
    formData.append('file', file);

    const response = await fetch('/api/process-document', {
      method: 'POST',
      body: formData
    });

    const data = await response.json();
    if (!data.success) {
      throw new Error(data.error || 'ファイルの処理に失敗しました');
    }

    return data.text;
  } catch (error) {
    console.error('Error reading file:', error);
    throw new Error('ファイルの読み込みに失敗しました: ' + error.message);
  }
};