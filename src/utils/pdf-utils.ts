import { toast } from "sonner"
import * as PDFJS from 'pdfjs-dist'
import { MAX_FILE_SIZE } from './constants'

// PDFワーカーの初期化を関数化
const initializePdfWorker = async () => {
  try {
    // npmパッケージから直接ワーカーをインポート
    const worker = await import('pdfjs-dist/build/pdf.worker.mjs');
    if (typeof window !== 'undefined' && 'Worker' in window) {
      const workerInstance = new Worker(new URL('pdfjs-dist/build/pdf.worker.mjs', import.meta.url));
      PDFJS.GlobalWorkerOptions.workerPort = workerInstance;
    }
    return true;
  } catch (error) {
    console.error('PDF Worker initialization failed:', error);
    return false;
  }
};

// PDFファイルの検証
const validatePdfFile = (file: File): boolean => {
  const validTypes = ['application/pdf', 'binary/octet-stream'];
  const hasValidType = validTypes.includes(file.type) || file.name.toLowerCase().endsWith('.pdf');
  const hasValidSize = file.size > 0 && file.size <= MAX_FILE_SIZE;
  return hasValidType && hasValidSize;
};

export async function readPDFContent(file: File): Promise<string> {
  try {
    if (!validatePdfFile(file)) {
      throw new Error('無効なPDFファイルです');
    }

    // PDFワーカーの初期化を待機
    await initializePdfWorker();

    const arrayBuffer = await file.arrayBuffer();
    if (!arrayBuffer || arrayBuffer.byteLength === 0) {
      throw new Error('ファイルの読み込みに失敗しました');
    }

    const loadingTask = PDFJS.getDocument({ 
      data: arrayBuffer,
      cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/cmaps/',
      cMapPacked: true,
    });

    const pdf = await loadingTask.promise;
    let text = '';
    
    const totalPages = pdf.numPages;
    if (totalPages === 0) {
      throw new Error('PDFページが見つかりません');
    }

    for (let i = 1; i <= totalPages; i++) {
      try {
        const page = await pdf.getPage(i);
        const content = await page.getTextContent();
        
        const pageText = content.items
          .filter((item: any) => 'str' in item && typeof item.str === 'string')
          .map((item: any) => item.str.trim())
          .filter(str => str.length > 0)
          .join(' ');

        text += pageText + '\n';

        if (totalPages > 1) {
          toast.info(`PDFの処理中... (${i}/${totalPages}ページ)`);
        }

        await page.cleanup();
      } catch (pageError) {
        console.error(`Error processing page ${i}:`, pageError);
        toast.warning(`ページ${i}の処理中にエラーが発生しましたが、続行します`);
      }
    }

    if (!text.trim()) {
      throw new Error('PDFからテキストを抽出できませんでした');
    }

    return text;
  } catch (error) {
    console.error('Error reading PDF:', error);
    const errorMessage = error instanceof Error ? error.message : 'PDFファイルの読み込みに失敗しました';
    throw new Error(errorMessage);
  }
}