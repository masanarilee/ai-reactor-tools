import { supabase } from "@/integrations/supabase/client"

export async function readFileContent(file: File): Promise<string> {
  try {
    const formData = new FormData()
    formData.append('file', file)

    const { data, error } = await supabase.functions.invoke('process-document', {
      body: formData
    })

    if (error) throw error
    if (!data.success) throw new Error(data.error)

    return data.text

  } catch (error) {
    console.error('Error reading file:', error)
    throw new Error('ファイルの読み込みに失敗しました: ' + error.message)
  }
}

export function processSupplementaryInfo(info: string): string {
  return info.trim().replace(/\s+/g, ' ')
}
