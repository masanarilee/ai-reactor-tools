import * as mammoth from 'mammoth'
import { MAX_FILE_SIZE } from './constants'

export async function readWordContent(file: File): Promise<string> {
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