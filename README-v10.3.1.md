# Local LLM Wiki v10.3.1 — 継続調査表示修正

## 差し替えるファイル
- `docs/assets/wiki-v10.3.js`

## 変更内容
v10.3では `staticPage()` を後から上書きして継続調査ステータスを差し込んでいました。
環境によっては常設ページの描画処理へフックできず、`maintenance.js` にデータがあっても表示されないことがありました。

v10.3.1では `staticPage()` への依存を廃止し、

- `#app` を `MutationObserver` で監視
- SPAのページ描画完了後に現在の `location.hash` を確認
- `window.MAINTENANCE[route]` を直接取得
- `.article > .meta` の直後へ継続調査ステータスをDOM挿入
- モデル個別記事も同じ方式で対応
- 二重挿入を自動削除
- ページ移動時の古い表示も除去

する方式へ変更しています。

## 反映後
GitHubへ `docs/assets/wiki-v10.3.js` を上書きしてCommitしてください。
GitHub PagesのDeploy完了後、対象ページをCtrl+F5で再読み込みしてください。

Monthly Wiki MaintenanceやDaily Local LLM Researchを再実行する必要はありません。
既に `maintenance.js` に保存されている調査結果がそのまま表示されます。

AdSense、index.html、Daily/Monthly workflowには変更ありません。
