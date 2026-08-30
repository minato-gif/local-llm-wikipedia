# v10 自動ニュース詳細化

追加:
- scripts/enrich.py
- docs/assets/wiki-v10.js

置換:
- .github/workflows/daily-research.yml
- docs/index.html

AdSenseコードは docs/index.html にそのまま維持しています。

反映後、Actions → Daily Local LLM Research → Run workflow を一度手動実行してください。
直近14日以内のHugging Face記事も再調査されるため、現在の薄いモデル記事も詳細化対象になります。
