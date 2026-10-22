# ハーネスカテゴリ追加

- 調査日: 2026-10-22
- 対象: Strata（ユーザーに正式名を確認済み）、LM Studio Bionic、OpenCode、Cline、Aider、Goose
- 分類: モデル・ツール・文脈・作業継続をつなぐ実行基盤という意味で「ハーネス」を採用。アプリ自体と内部のハーネス実装は厳密には同一ではないため、カテゴリの対象を「ハーネスを備える利用者向けアプリ」と説明した。
- Strataは推論エンジンと内蔵エージェントの両面を明記。LM Studio本体と別アプリのBionicを区別した。

## 内容と出典

6件の常設型アプリ解説をwiki.jsonに追加。公開日は本サイトでの記事公開日であり、アプリの発売日ではない。概要、ローカル接続、権限、通信、導入時の注意、未検証範囲、公式資料リンクを掲載した。比較ガイドとカテゴリページを相互リンクし、全生成ページのサイドバーへ追加した。

根拠は各記事のreferencesに記録。主な調査先:

- Strata: https://github.com/Niko1221/Strata と docs/SAFETY.md
- Bionic: https://lmstudio.ai/docs/bionic と /agent/code-project、/models
- OpenCode: https://opencode.ai/docs/ と /providers/、/permissions/。1系と2系で権限形式が異なる点も併記
- Cline: https://docs.cline.bot/cline-overview と /running-models-locally/overview、https://cline.bot/
- Aider: https://aider.chat/docs/usage.html と /docs/llms/ollama.html
- Goose: https://github.com/aaif-goose/goose と documentation/docs/getting-started/providers.md、guides/managing-tools配下の権限資料
- 用語の補助: https://www.anthropic.com/research/effective-harnesses-for-long-running-agents

実機インストール、モデル互換性、処理速度、作業完了率、権限制御の独立検証は実施していない。比較欄の用途提案を編集上の判断として区別し、性能順位や安全性を断定していない。

## 実装と確認

- 非モデル記事でもarticle_sectionsを表示し、app_metaの表を追加。従来のモデル仕様・量子化表と混同しない。
- 旧SPA側の表示も対応。既存128記事のデータが変更されていないことを比較確認。
- 公開生成: 常設12ページ、公開60記事、noindex 74記事、サイトマップ83 URL。
- 6件の自動テスト: カテゴリ・サイドバー、公開判定、出典表示、モデル記事の節の重複防止、HTMLエスケープ、内部リンク・サイトマップ・ページ内アンカー。すべて成功。
- 検査で発見した用語集のアンカー破損も修正。SPAルートの #/ だけを変換し、#basic-terms等のページ内リンクは保持。
- 公開処理でテストを先に実行し、失敗時は配信しない構成にした。

確認手順: `python -B -m unittest discover -s tests -v`、`python -B scripts/healthcheck.py`、変更JavaScriptの`node --check`、`git diff --check`。
