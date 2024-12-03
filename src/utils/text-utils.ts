import { toast } from "sonner"
import { readPDFContent } from './pdf-utils'
import { readWordContent } from './word-utils'
import { readExcelContent } from './excel-utils'
import { MAX_FILE_SIZE } from './constants'

// テキストを文章単位で切り詰める関数
export function truncateText(text: string, maxLength: number): string {
  if (text.length <= maxLength) return text;
  const lastPeriod = text.lastIndexOf('.', maxLength);
  if (lastPeriod === -1) return text.slice(0, maxLength);
  return text.slice(0, lastPeriod + 1);
}

function extractKeyInformation(text: string): string {
  const sections: string[] = [];
  
  const keyPhrases = [
    '職務経歴', '業務経験', 'スキル', '資格', '学歴',
    '開発環境', '技術スタック', 'プロジェクト', '案件',
    '単価', '期間', '勤務地', '面談'
  ];
  
  const lines = text.split('\n');
  let currentSection = '';
  
  lines.forEach(line => {
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
  
  return sections.join('\n\n');
}

// ファイルの内容を読み込む関数
export async function readFileContent(file: File): Promise<string> {
  try {
    if (!file) {
      throw new Error('ファイルが選択されていません');
    }

    if (file.size > MAX_FILE_SIZE) {
      throw new Error('ファイルサイズが大きすぎます（上限: 10MB）');
    }

    let text = '';
    const fileType = file.type.toLowerCase();
    const fileName = file.name.toLowerCase();
    
    if (fileType === 'application/pdf' || fileName.endsWith('.pdf')) {
      text = await readPDFContent(file);
      toast.success("PDFファイルの読み込みが完了しました");
    } else if (
      fileType === 'application/msword' || 
      fileType === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
      fileName.endsWith('.doc') || 
      fileName.endsWith('.docx')
    ) {
      text = await readWordContent(file);
      toast.success("Wordファイルの読み込みが完了しました");
    } else if (
      fileType === 'application/vnd.ms-excel' ||
      fileType === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
      fileType === 'application/octet-stream' ||
      fileName.endsWith('.xls') ||
      fileName.endsWith('.xlsx')
    ) {
      text = await readExcelContent(file);
      toast.success("Excelファイルの読み込みが完了しました");
    } else {
      throw new Error('対応していないファイル形式です');
    }
    
    const extractedInfo = extractKeyInformation(text);
    const truncated = truncateText(extractedInfo, 15000);
    if (truncated.length < extractedInfo.length) {
      toast.warning("ファイルが大きいため、重要な部分のみを処理します");
    }
    
    return truncated;
  } catch (error) {
    console.error('Error reading file:', error);
    toast.error(error instanceof Error ? error.message : "ファイルの読み込みに失敗しました");
    throw error;
  }
}

// 補足情報を処理する関数
export function processSupplementaryInfo(info: string): string {
  if (!info) return '';
  
  const truncated = truncateText(info, 3000);
  if (truncated.length < info.length) {
    toast.warning("補足情報が大きいため、一部のみを処理します");
  }
  return truncated;
}