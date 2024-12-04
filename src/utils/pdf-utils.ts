import { getDocument, GlobalWorkerOptions, version } from "pdfjs-dist"
import { MAX_FILE_SIZE } from './constants'
import { toast } from "sonner"

// PDFワーカーの初期化
if (typeof window !== 'undefined' && 'Worker' in window) {
  try {
    const workerUrl = new URL(
      'pdfjs-dist/build/pdf.worker.min.js',
      import.meta.url,
    )
    GlobalWorkerOptions.workerSrc = workerUrl.href
    console.log('PDF Worker initialized with URL:', workerUrl.href)
  } catch (error) {
    console.error('PDF Worker initialization error:', error)
    // フォールバックとしてビルトインワーカーを使用
    GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${version}/pdf.worker.min.js`
    console.warn('Using fallback PDF worker')
  }
}

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

    console.log('Reading PDF file:', file.name)

    // ファイルをArrayBufferとして読み込む
    const arrayBuffer = await file.arrayBuffer()
    if (!arrayBuffer || arrayBuffer.byteLength === 0) {
      throw new Error('ファイルの読み込みに失敗しました')
    }

    console.log('PDF ArrayBuffer loaded, size:', arrayBuffer.byteLength)

    // PDFドキュメントの読み込み
    const pdf = await getDocument({
      data: arrayBuffer,
      cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@latest/cmaps/',
      cMapPacked: true,
    }).promise

    console.log('PDF document loaded, pages:', pdf.numPages)

    let text = ''

    // 全ページのテキストを抽出
    for (let pageNumber = 1; pageNumber <= pdf.numPages; pageNumber++) {
      try {
        console.log(`Processing page ${pageNumber}/${pdf.numPages}`)
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
        console.error(`ページ${pageNumber}の処理中にエラー:`, pageError)
        toast.warning(`ページ${pageNumber}の処理中にエラーが発生しましたが、続行します`)
      }
    }

    if (!text.trim()) {
      throw new Error('PDFからテキストを抽出できませんでした')
    }

    console.log('PDF text extraction completed')
    toast.success("PDFファイルの読み込みが完了しました")
    return text

  } catch (error) {
    console.error('Error reading PDF:', error)
    const errorMessage = error instanceof Error ? error.message : 'PDFファイルの読み込みに失敗しました'
    throw new Error(errorMessage)
  }
}