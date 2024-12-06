import { supabase } from "@/integrations/supabase/client";

export async function askClaude(prompt: string): Promise<string> {
  try {
    const { data, error } = await supabase.functions.invoke('ask-claude', {
      body: { prompt }
    });

    if (error) throw error;
    return data.text;

  } catch (error) {
    console.error('Error calling Claude:', error);
    throw error;
  }
}