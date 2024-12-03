import { toast } from "sonner"
import * as PDFJS from 'pdfjs-dist'
import * as mammoth from 'mammoth'
import * as XLSX from 'xlsx'

// PDFJSワーカーを初期化
const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB
const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB

// PDFワーカーの設定
const workerSrc = `https://cdnjs.cloudflare.com/ajax/libs/pdf.js/${PDFJS.version}/pdf.worker.min.js`;
PDFJS.GlobalWorkerOptions.workerSrc = workerSrc;

// PDFファイルを読み込む関数
async function readPDFContent(file: File): Promise<string> {
  try {
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('ファイルサイズが大きすぎます（上限: 10MB）');
    }

    const arrayBuffer = await file.arrayBuffer();
    const loadingTask = PDFJS.getDocument({ data: arrayBuffer });
    const pdf = await loadingTask.promise;
    let text = '';
    
    const totalPages = pdf.numPages;
    for (let i = 1; i <= totalPages; i++) {
      const page = await pdf.getPage(i);
      const content = await page.getTextContent();
      const pageText = content.items
        .filter((item: any) => 'str' in item)
        .map((item: any) => item.str)
        .join(' ');
      text += pageText + '\n';

      // 進捗状況の通知
      if (totalPages > 1) {
        toast.info(`PDFの処理中... (${i}/${totalPages}ページ)`);
      }
    }
    
    return text;
  } catch (error) {
    console.error('Error reading PDF:', error);
    throw new Error('PDFファイルの読み込みに失敗しました');
  }
}

// Wordファイルを読み込む関数
async function readWordContent(file: File): Promise<string> {
  try {
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('ファイルサイズが大きすぎます（上限: 10MB）');
    }

    const arrayBuffer = await file.arrayBuffer();
    const result = await mammoth.extractRawText({ arrayBuffer });
    return result.value;
  } catch (error) {
    console.error('Error reading Word document:', error);
    throw new Error('Wordファイルの読み込みに失敗しました');
  }
}

// Excelファイルを読み込む関数
async function readExcelContent(file: File): Promise<string> {
  try {
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('ファイルサイズが大きすぎます（上限: 10MB）');
    }

    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: 'array' });
    let text = '';

    const totalSheets = workbook.SheetNames.length;
    workbook.SheetNames.forEach((sheetName, index) => {
      const worksheet = workbook.Sheets[sheetName];
      text += `Sheet: ${sheetName}\n`;
      text += XLSX.utils.sheet_to_csv(worksheet) + '\n\n';

      // 進捗状況の通知
      if (totalSheets > 1) {
        toast.info(`Excelの処理中... (${index + 1}/${totalSheets}シート)`);
      }
    });

    return text;
  } catch (error) {
    console.error('Error reading Excel file:', error);
    throw new Error('Excelファイルの読み込みに失敗しました');
  }
}

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

    // ファイルサイズのチェック
    if (file.size > MAX_FILE_SIZE) {
      throw new Error('ファイルサイズが大きすぎます（上限: 10MB）');
    }

    let text = '';
    const fileType = file.type.toLowerCase();
    const fileName = file.name.toLowerCase();
    
    // ファイルタイプとファイル名の拡張子に基づいて処理を決定
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
    toast.error(error instanceof Error ? error.message : "ファイルの読み込みに失敗しました");
    throw error;
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