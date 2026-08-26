# Local LLM Wikipedia

ローカルLLM関連の最新情報を **毎日自動収集 → 差分判定 → 記事化 → Git commit → GitHub Pagesへ再公開** する静的Wikiです。

## 完全自動化の流れ

1. GitHub Actions が毎日 08:00 JST に起動
2. 公式ソースを巡回
3. 前回までに掲載済みのURLを除外
4. 新着情報を `docs/data/wiki.json` に追加
5. 日次記事を自動生成
6. 変更があれば bot が commit / push
7. GitHub Pages が自動再デプロイ

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
