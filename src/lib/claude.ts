import { toast } from "@/components/ui/use-toast"

export async function askClaude(prompt: string) {
  try {
    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': process.env.CLAUDE_API_KEY || '',
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-opus-20240229',
        max_tokens: 1000,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    return data.content[0].text;
  } catch (error) {
    toast({
      variant: "destructive",
      title: "エラーが発生しました",
      description: "AI応答の取得に失敗しました。しばらく待ってから再度お試しください。"
    });
    throw error;
  }
}