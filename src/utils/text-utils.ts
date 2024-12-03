import { toast } from "sonner"
import * as pdfParse from 'pdf-parse'
import * as mammoth from 'mammoth'

// テキストを文章単位で切り詰める関数
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  
  // 最後の完全な文で切る
  const lastPeriod = text.lastIndexOf('.', maxLength);
  if (lastPeriod === -1) return text.slice(0, maxLength);
  
  return text.slice(0, lastPeriod + 1);
}

// 重要な情報を抽出する関数
function extractKeyInformation(text: string): string {
  const sections: string[] = [];
  
  // 経歴書や職務経歴書の重要なセクションを探す
  const keyPhrases = [
    '職務経歴', '業務経験', 'スキル', '資格', '学歴',
    '開発環境', '技術スタック', 'プロジェクト', '案件',
    '単価', '期間', '勤務地', '面談'
  ];
  
  // テキストを行に分割
  const lines = text.split('\n');
  let currentSection = '';
  
  lines.forEach(line => {
    // 重要なセクションを見つけた場合
    if (keyPhrases.some(phrase => line.includes(phrase))) {
      if (currentSection) {
        sections.push(currentSection);
      }
      currentSection = line + '\n';
    } else if (currentSection && line.trim()) {
      currentSection += line + '\n';
    }
  });
  
  if (currentSection) {
    sections.push(currentSection);
  }
  
  // 抽出したセクションを結合
  return sections.join('\n\n');
}

// PDFファイルを読み込む関数
async function readPDFContent(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const uint8Array = new Uint8Array(arrayBuffer);
  const data = await pdfParse(uint8Array);
  return data.text;
}

// Wordファイルを読み込む関数
async function readWordContent(file: File): Promise<string> {
  const arrayBuffer = await file.arrayBuffer();
  const result = await mammoth.extractRawText({ arrayBuffer });
  return result.value;
}

// ファイルの内容を読み込む関数
export async function readFileContent(file: File): Promise<string> {
  try {
    let text = '';
    const fileType = file.type.toLowerCase();
    
    // ファイルタイプに応じて適切な処理を実行
    if (fileType === 'application/pdf') {
      text = await readPDFContent(file);
    } else if (
      fileType === 'application/msword' || 
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document'
    ) {
      text = await readWordContent(file);
    } else {
      // その他のファイルタイプはテキストとして読み込む
      text = await file.text();
    }
    
    // 重要な情報を抽出
    const extractedInfo = extractKeyInformation(text);
    
    // 15,000文字に制限（トークン数を考慮）
    const truncated = truncateText(extractedInfo, 15000);
    
    if (truncated.length < extractedInfo.length) {
      toast.warning("ファイルが大きいため、重要な部分のみを処理します");
    }
    
    return truncated;
  } catch (error) {
    console.error('Error reading file:', error);
    toast.error("ファイルの読み込みに失敗しました: " + (error instanceof Error ? error.message : '不明なエラー'));
    throw new Error('ファイルの読み込みに失敗しました');
  }
}

// 補足情報を処理する関数
export function processSupplementaryInfo(info: string): string {
  if (!info) return '';
  
  // 補足情報を3,000文字に制限（トークン数を考慮）
  const truncated = truncateText(info, 3000);
  if (truncated.length < info.length) {
    toast.warning("補足情報が大きいため、一部のみを処理します");
  }
  return truncated;
}