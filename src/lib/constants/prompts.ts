export const PROMPTS = {
  TALENT: {
    SUMMARY: `注意：ハルシネーションを極力避けてください。
以下の職務経歴書と面談メモから、人材サマリを作成してください：
面談メモのみの場合でも可能な限りフォーマットに沿ってアウトプットをしてください。

職務経歴書：
{resume}

補足情報：
{supplementaryInfo}

以下の形式で情報を整理して出力してください：

【ID】
【年齢】歳
【性別】
【国籍】
【所属】弊社個人事業主
【住まい】
【稼働形態】
【稼動開始日】
【稼働率】
【稼働例】
【希望単金】
【経験スキル】
【希望案件】
【NG案件】
【経験コメント】
【お人柄】`,

    COUNSELING: `
経歴書を読み取るか補足情報の内容を分析して、次の形式で情報を整理してください：
アウトプットは‐や*等の記載を避けタイトルと回答を分ける際には【】と・を利用してください。

【人材要約】
・経験、スキル、強みを簡潔に要約
・キャリアの方向性や特徴を分析

【懸念点】
・スキルギャップや改善が必要な領域
・キャリアパスにおける潜在的な課題

【質問例】
・キャリアの方向性を明確にするための質問(複数)
・スキルの詳細を深堀りする質問(複数)

【キャリアプラン】
・短期的な目標（1-2年）
・中期的な目標（3-5年）
・長期的なキャリアビジョン

#補足情報
{supplementaryInfo}

{fileContent}`
  },
  JOB: {
    SUMMARY: `注意：ハルシネーションが発生しないよう注意してください。
以下の案件情報から、案件サマリを作成してください：
案件情報がなくても案件情報メモの内容を元になるべく下記のフォーマットでアウトプットしてください。

案件情報：
{fileContent}

案件情報メモ：
{supplementaryInfo}

以下の形式で情報を整理して出力してください：

【案件概要】
【業務内容】
【必須スキル】
【歓迎スキル】
【開発環境】
【期間】
【単金】
【精算】
【面談回数】
【備考】`
  },
  COMPANY: {
    ANALYSIS: `
【分析リクエスト】
■会社名：{companyName}
■事業部名：{divisionName}
■企業URL：{websiteUrl}
■支援テーマ：{targetService}

【企業分析レポート】
1. 企業概要
企業の基本情報をまとめてください
2. 市場環境
対象企業や対象事業の市場状況をまとめてください
3. 課題仮説
- 1,2を考慮して企業が抱える可能性のある課題を分析（支援テーマに依存せず広い範囲で行う）
- このセクションでは支援テーマに影響されてはならない

4. 提案内容（支援テーマに基づく）
- ここでのみ支援テーマを考慮し、提案を行う
- 提案の方向性
- 想定される施策例

【分析基準】
・企業URLから確認できる情報や確実性の高い情報のみを表示
・課題仮説（セクション3）は支援テーマに依存しない
・提案内容（セクション4）のみ支援テーマに基づく
・推測による記載は「～と推察されます」等を明記
・絶対にハルシネーションを起こさない`
  },
  SCOUT: {
    MAIL: `
以下の情報を元に、スカウトメールを作成してください：

【企業情報】
会社名：{companyName}
担当者名：{recruiterName}

【候補者情報】
{resumeContent}

【案件情報】
{jobContent}

以下の形式でメールを作成してください：

件名：
本文：

【作成基準】
・フレンドリーかつ専門的な口調を維持
・候補者のスキルと案件のマッチングを具体的に説明
・個人情報の取り扱いに注意
・返信や面談のアクションを促す
・絶対にハルシネーションを起こさない`
  }
};