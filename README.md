# Local LLM Wikipedia

ローカルLLMとAI業界の重要動向を **毎日自動収集 → 差分判定 → 記事化 → Git commit → GitHub Pagesへ再公開** する静的Wikiです。

公開時には `scripts/generate_static.py` が、常設ガイドと公開基準を満たした記事を通常URLのHTMLへ変換します。各ページはJavaScriptなしでも本文を読めるため、検索エンジンからも個別ページとして認識できます。

## 完全自動化の流れ

1. GitHub Actions が毎日 08:00 JST に起動
2. 公式ソースを巡回
3. 前回までに掲載済みのURLを除外
4. 新着情報を `docs/data/wiki.json` に追加
5. 日次記事を自動生成
6. 変更があれば bot が commit / push
7. GitHub Pages が自動再デプロイ

## 公開URLと品質ゲート

- 常設ガイド: `/guide/models/` など
- 新着記事: `/articles/<記事ID>/`
- 記事一覧: `/articles/`
- `sitemap.xml`、`robots.txt`、RSS、canonical、構造化データを公開時に自動生成
- 編集済み・出典あり・本文量が基準以上の記事だけを一覧とサイトマップに掲載
- 薄いプレースホルダーやリリース候補は削除せず、`noindex` の保管ページとして残す

## 主な監視対象

- llama.cpp
- Ollama
- llama-cpp-python
- KoboldCpp
- ExLlamaV2
- MLX / MLX-LM
- LM Studio changelog
- Hugging Face Blog
- Hugging Face上の主要ローカルLLMモデル動向
- OpenAI / Anthropic / Google DeepMind / Meta AI / Mistral / xAI の公式ニュース
- TypeSafe AIなど、新しいモデル設計や推論方式を発表する新興開発元

監視対象は `sources.json` で増減できます。

## 公開方法

このフォルダを GitHub の **public repository** に push してください。

その後:

1. GitHub repository → **Settings**
2. **Pages**
3. Source を **GitHub Actions** にする
4. Actions を有効化

以後は自動です。

## 時刻

`.github/workflows/daily-research.yml`

```yaml
- cron: "0 23 * * *"
```

UTC 23:00 = 日本時間 翌日 08:00 です。

## 手動実行

GitHub → Actions → `Daily Local LLM Research` → `Run workflow`

## AI要約について

APIキー無しでも動くよう、標準では公式リリース本文・説明文から安全に短く要約します。

任意で OpenAI API を使いたい場合は repository secret に `OPENAI_API_KEY` を追加すると、
より自然な日本語要約を生成できる拡張ポイントを `scripts/research.py` に用意しています。

※ ChatGPT Plus契約とOpenAI API料金は別です。APIキー無しでも本システムは動作します。
