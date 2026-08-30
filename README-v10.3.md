# Local LLM Wiki v10.3 — 継続調査システム

## 新規追加
- `scripts/refresh_recent.py`
- `scripts/monthly_refresh.py`
- `.github/workflows/monthly-maintenance.yml`
- `docs/data/maintenance.js`
- `docs/assets/wiki-v10.3.js`

## 置き換え
- `.github/workflows/daily-research.yml`
- `scripts/healthcheck.py`
- `docs/index.html`

## 新規モデル記事
掲載後7日間は毎朝のDaily Researchで再調査します。

表示:
- 初回掲載
- 最終調査
- 最終更新
- 更新回数
- 追加調査日
- 追加更新日

差分判定は downloads / likes の単純増減を除外し、
ライセンス、元モデル、アーキテクチャ、コンテキスト長、量子化、
GGUF構成、ランタイム対応、用途評価、メモリ目安などを対象にします。

## 常設ページの定期調査
月次:
- 主要ローカルLLMモデル
- 主要ローカルLLMモデル比較
- 自分のPCでどのモデルが動く？
- モデルをダウンロードするとき何を選べばいい？
- トラブルシューティング

90日ごと:
- ローカルLLM用語集

毎月1日 09:30 JST に `Monthly Wiki Maintenance` が実行されます。
最近の一次情報由来ニュースをGeminiで再評価し、実質的な変化がある時だけ
`latest_findings / last_updated / update_count` を更新します。
変化がない場合も `last_researched` は更新されます。

## 追加で継続監視するポイント
- LM Studio / Ollama / llama.cpp の互換性・大型更新
- ライセンス変更
- コンテキスト長
- 新しい量子化形式
- GPUバックエンド（CUDA / ROCm / Vulkan / Metal）
- ハードウェア目安
- トラブルシューティングに影響する破壊的変更
- 用語集に追加すべき新用語

## AdSense
既存のAdSenseコードは `docs/index.html` に維持しています。

## 反映後のテスト
1. Actions → Daily Local LLM Research → Run workflow
2. モデル記事で継続調査ステータスを確認
3. Actions → Monthly Wiki Maintenance → Run workflow
4. 主要モデル/比較ページで継続調査ステータスを確認
