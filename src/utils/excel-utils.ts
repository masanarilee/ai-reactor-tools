import * as XLSX from 'xlsx'
import { toast } from "sonner"
import { MAX_FILE_SIZE } from './constants'

export async function readExcelContent(file: File): Promise<string> {
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