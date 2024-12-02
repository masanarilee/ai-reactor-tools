import { toast } from "@/components/ui/use-toast"
import { supabase } from "@/integrations/supabase/client"

export async function askClaude(prompt: string) {
  try {
    const { data, error } = await supabase.functions.invoke('ask-claude', {
      body: { prompt }
    })

    if (error) throw error
    return data.text

  } catch (error) {
    toast({
      variant: "destructive",
      title: "エラーが発生しました",
      description: "AI応答の取得に失敗しました。しばらく待ってから再度お試しください。"
    })
    throw error
  }
}