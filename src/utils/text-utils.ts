import { toast } from "sonner"

// テキストを文章単位で切り詰める関数
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  
  // maxLengthまでの最後のピリオドを探す
  const lastPeriod = text.lastIndexOf('.', maxLength);
  if (lastPeriod === -1) return text.slice(0, maxLength);
  
  return text.slice(0, lastPeriod + 1);
}

// ファイルの内容を読み込む関数
export async function readFileContent(file: File): Promise<string> {
  try {
    const text = await file.text();
    // ファイルサイズを25,000文字に制限
    const truncated = truncateText(text, 25000);
    if (truncated.length < text.length) {
      toast.warning("ファイルが大きすぎるため、一部のみを処理します");
    }
    return truncated;
  } catch (error) {
    console.error('Error reading file:', error);
    throw new Error('ファイルの読み込みに失敗しました');
  }
}

// 補足情報を処理する関数
export function processSupplementaryInfo(info: string): string {
  if (!info) return '';
  
  // 補足情報を5,000文字に制限
  const truncated = truncateText(info, 5000);
  if (truncated.length < info.length) {
    toast.warning("補足情報が大きすぎるため、一部のみを処理します");
  }
  return truncated;
}