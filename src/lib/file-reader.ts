import * as XLSX from 'xlsx';
import * as mammoth from 'mammoth';
import * as pdfjsLib from 'pdfjs-dist';
import { PDFDocumentProxy } from 'pdfjs-dist';

// Initialize pdf.js worker
if (typeof window !== 'undefined') {
  const worker = new Worker(
    new URL('pdfjs-dist/build/pdf.worker.mjs', import.meta.url)
  );
  pdfjsLib.GlobalWorkerOptions.workerPort = worker;
}

export const readFileContent = async (file: File): Promise<string> => {
  try {
    console.log('Reading file:', file.name);
    console.log('File type:', file.type);

    // PDFファイルの処理
    if (file.type === 'application/pdf') {
      const arrayBuffer = await file.arrayBuffer();
      
      try {
        const pdf = await pdfjsLib.getDocument({
          data: arrayBuffer,
          useSystemFonts: true
        }).promise;
        
        let fullText = '';
        
        // Extract text from all pages
        for (let i = 1; i <= pdf.numPages; i++) {
          const page = await pdf.getPage(i);
          const textContent = await page.getTextContent();
          const pageText = textContent.items
            .map((item: any) => item.str)
            .join(' ');
          fullText += pageText + '\n';
        }
        
        console.log('PDF content length:', fullText.length);
        return fullText;
      } catch (pdfError) {
        console.error('PDF processing error:', pdfError);
        throw new Error('PDFファイルの処理中にエラーが発生しました: ' + (pdfError as Error).message);
      }
    }

    // Excelファイルの処理
    if (file.type === 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' ||
        file.type === 'application/vnd.ms-excel') {
      const arrayBuffer = await file.arrayBuffer();
      const workbook = XLSX.read(arrayBuffer, { type: 'array' });
      const worksheet = workbook.Sheets[workbook.SheetNames[0]];
      const text = XLSX.utils.sheet_to_txt(worksheet);
      console.log('Excel content length:', text.length);
      return text;
    }

    // Word文書の処理
    if (file.type === 'application/vnd.openxmlformats-officedocument.wordprocessingml.document' ||
        file.type === 'application/msword') {
      const arrayBuffer = await file.arrayBuffer();
      const result = await mammoth.extractRawText({ arrayBuffer });
      console.log('Word content length:', result.value.length);
      return result.value;
    }

    // その他のテキストファイル
    const text = await new Promise<string>((resolve, reject) => {
      const reader = new FileReader();
      reader.onload = (event) => {
        if (event.target?.result) {
          resolve(event.target.result as string);
        } else {
          reject(new Error('ファイルの読み込みに失敗しました'));
        }
      };
      reader.onerror = () => {
        console.error('File reading error:', reader.error);
        reject(new Error('ファイルの読み込みに失敗しました'));
      };
      reader.readAsText(file);
    });

    console.log('Text content length:', text.length);
    return text;

  } catch (error) {
    console.error('Error reading file:', error);
    throw new Error('ファイルの読み込みに失敗しました: ' + (error as Error).message);
  }
};