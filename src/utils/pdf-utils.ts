import { toast } from "sonner"
import * as PDFJS from 'pdfjs-dist'
import { MAX_FILE_SIZE } from './constants'

// Initialize PDF.js worker
import pdfjsWorker from 'pdfjs-dist/build/pdf.worker.entry'
PDFJS.GlobalWorkerOptions.workerSrc = pdfjsWorker;

export async function readPDFContent(file: File): Promise<string> {
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