import { getDocument } from 'pdfjs-dist'
import { MAX_FILE_SIZE } from './constants'
import { toast } from "sonner"

// PDFファイルの検証
const validatePdfFile = (file: File): boolean => {
  // ファイルタイプとサイズの検証
  const isPdf = file.type === 'application/pdf' || file.name.toLowerCase().endsWith('.pdf')
  const isValidSize = file.size > 0 && file.size <= MAX_FILE_SIZE

  if (!isPdf) {
    toast.error("PDFファイル形式ではありません")
    return false
  }

  if (!isValidSize) {
    toast.error(`ファイルサイズは${MAX_FILE_SIZE / (1024 * 1024)}MB以下にしてください`)
    return false
  }

  return true
}

export async function readPDFContent(file: File): Promise<string> {
  try {
    if (!file) {
      throw new Error('ファイルが選択されていません')
    }

    if (!validatePdfFile(file)) {
      throw new Error('無効なPDFファイルです')
    }

    // ファイルをArrayBufferとして読み込む
    const arrayBuffer = await file.arrayBuffer()
    if (!arrayBuffer || arrayBuffer.byteLength === 0) {
      throw new Error('ファイルの読み込みに失敗しました')
    }

    // PDFドキュメントの読み込み
    const pdf = await getDocument({
      data: arrayBuffer,
      cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.11.174/cmaps/',
      cMapPacked: true,
    }).promise

    let text = ''

    // 全ページのテキストを抽出
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
      try {
        const page = await pdf.getPage(pageNumber)
        const content = await page.getTextContent()
        
        // テキストアイテムを結合
        const pageText = content.items
          .filter((item: any) => 'str' in item && typeof item.str === 'string')
          .map((item: any) => item.str)
          .join(' ')

        text += pageText + '\n'

        // メモリリークを防ぐためにページを解放
        await page.cleanup()
      } catch (pageError) {
        console.error(`ページ${pageNumber}の処理中にエラーが発生:`, pageError)
        toast.warning(`ページ${pageNumber}の処理中にエラーが発生しましたが、続行します`)
      }
    }

    if (!text.trim()) {
      throw new Error('PDFからテキストを抽出できませんでした')
    }

    toast.success("PDFファイルの読み込みが完了しました")
    return text

  } catch (error) {
    console.error('Error reading PDF:', error)
    const errorMessage = error instanceof Error ? error.message : 'PDFファイルの読み込みに失敗しました'
    throw new Error(errorMessage)
  }
}