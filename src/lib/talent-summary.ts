import { toast } from "sonner"

export async function generateTalentSummary(fileContent: string, supplementaryInfo: string) {
  try {
    const prompt = `
以下の経歴書と補足情報から、人材サマリを生成してください。
できるだけ具体的な情報を含め、以下の項目に分けて記載してください：

- 基本情報（年齢、性別、最終学歴）
- 技術スキル
- 業務経験
- 強み
- 特記事項

経歴書：
${fileContent}

補足情報：
${supplementaryInfo}
`

    const response = await fetch('https://api.anthropic.com/v1/messages', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'x-api-key': import.meta.env.VITE_CLAUDE_API_KEY,
        'anthropic-version': '2023-06-01'
      },
      body: JSON.stringify({
        model: 'claude-3-opus-20240229',
        max_tokens: 2000,
        messages: [{ role: 'user', content: prompt }]
      })
    });

    if (!response.ok) {
      throw new Error('API request failed');
    }

    const data = await response.json();
    return data.content[0].text;
  } catch (error) {
    console.error('Error:', error);
    toast.error("サマリの生成に失敗しました。");
    throw error;
  }
}