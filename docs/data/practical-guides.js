window.STATIC_PAGES = window.STATIC_PAGES || [];

window.STATIC_PAGES.push({
  route:"#/guide/start",
  title:"ローカルLLMの始め方",
  summary:"LM Studioを例に、インストール、モデル選び、ダウンロード、ロード、最初のチャットまでを初心者向けに順番に説明します。",
  keywords:["始め方","初心者","LM Studio","インストール","Discover","モデル","ダウンロード","ロード","チャット","GGUF","Q4","ローカルAI"],
  html:`<article class="article">
    <h1>ローカルLLMの始め方</h1>
    <div class="meta">基準日: 2026-08-26</div>
    <p class="lead">ローカルLLMを初めて使う人向けに、<b>「何を入れて、何をダウンロードして、どこを押せば会話できるのか」</b>を順番に説明します。ここではGUIで分かりやすいLM Studioを例にします。</p>

    <div class="notice"><b>最短ルート</b><br>
      ① LM Studioを入れる → ② 自分のPCに合うモデルを選ぶ → ③ Q4前後をダウンロード → ④ モデルをロード → ⑤ Chatで話しかける
    </div>

    <h2>0. まず「ローカルLLM」とは？</h2>
    <p>ChatGPTなどのクラウドAIとは違い、モデルファイルを自分のPCへ保存し、自分のCPU/GPU/RAMを使ってAIを動かします。モデルを取得した後は、構成によってはインターネットへ文章を送らずに使えます。</p>
    <p>まだ「モデル」「GGUF」「量子化」が分からなくても大丈夫です。先に実際に動かしてから覚えても問題ありません。</p>

    <h2>1. 自分のPCをざっくり確認</h2>
    <p>WindowsでNVIDIA GPUを使っているなら、まず<b>VRAM容量</b>を確認しましょう。タスクマネージャー → パフォーマンス → GPUで確認できます。</p>
    <p>LM Studio公式ではWindows x64環境でAVX2対応CPUが必要で、RAM 16GB以上、専用VRAM 4GB以上が推奨されています。MacはApple Siliconが対象です。</p>
    <p><a href="#/guide/hardware">→ 自分のPCでどのモデルが動く？</a></p>

    <h2>2. LM Studioをインストール</h2>
    <p>LM Studio公式サイトからWindows / macOS / Linux版を入手してインストールします。初回起動後は、モデルを探すための<b>Discover</b>画面を使います。</p>

    <h2>3. 最初のモデルを探す</h2>
    <p>Discoverでモデル名を検索します。たとえばGemma、Qwen、gpt-ossなどです。最初は「一番強い巨大モデル」より、<b>自分のメモリに余裕を持って収まるモデル</b>を選ぶ方が快適です。</p>

    <div class="grid">
      <div class="card"><h3>VRAM 8〜12GB</h3><p>7B〜12B前後のQ4から始めると扱いやすいです。</p></div>
      <div class="card"><h3>VRAM 16GB</h3><p>12B〜20B級が選択肢。モデル構造や量子化によってはさらに大きいモデルもRAM併用で使えます。</p></div>
      <div class="card"><h3>VRAM 24GB+</h3><p>20B〜32B級Q4など、大型モデルの選択肢がかなり広がります。</p></div>
    </div>

    <h2>4. 量子化は何を選ぶ？</h2>
    <p>同じモデル名でも、<code>Q4_K_M</code>、<code>Q5_K_M</code>、<code>Q8_0</code>など複数のダウンロード候補が出ることがあります。</p>
    <p>LM Studio公式は、PCに余裕があるなら<b>4-bit以上</b>の選択肢を推奨しています。初心者ならまず<b>Q4_K_M前後</b>を基準にすると、容量と品質のバランスを取りやすいです。</p>
    <p><a href="#/guide/download">→ モデルをダウンロードするとき何を選べばいい？</a></p>

    <h2>5. モデルをロード</h2>
    <p>ダウンロードが終わったらChat画面を開き、モデルローダーからモデルを選びます。「ロード」はモデルをRAMやVRAMへ配置して、実際に推論できる状態にすることです。</p>
    <p>最初はコンテキスト長を4K〜8K程度にしておくと、メモリ不足を起こしにくくなります。GPU offloadはLM Studioの自動設定から始めて構いません。</p>

    <h2>6. 話しかけてみる</h2>
    <p>ロードできたらChat欄へ普通に質問を書くだけです。</p>
    <div class="example-box"><b>最初のテスト例</b><br>
      「こんにちは。あなたができることを日本語で3つ教えてください。」<br><br>
      「この文章を100文字以内で要約してください。」<br><br>
      「Pythonで1から100まで足し算するコードを書いてください。」
    </div>

    <h2>7. 慣れてきたら</h2>
    <div class="grid">
      <div class="card"><h3>モデルを比較する</h3><p><a href="#/guide/compare">モデル比較</a>から、自分の用途に合うモデルを探します。</p></div>
      <div class="card"><h3>大きいモデルを試す</h3><p>Q4→Q5や、より大きなモデルへ少しずつ広げます。</p></div>
      <div class="card"><h3>APIで他アプリと連携</h3><p>LM StudioはローカルAPIサーバーやOpenAI互換エンドポイントも提供しています。</p></div>
    </div>

    <h2>うまく動かないとき</h2>
    <p>モデルがロードできない、生成が遅い、GPUを使わないといった問題は珍しくありません。</p>
    <p><a href="#/guide/troubleshoot">→ ローカルLLM トラブルシューティング</a></p>

    <h2>公式情報</h2>
    <div class="sourcebox">
      <a target="_blank" rel="noopener" href="https://lmstudio.ai/docs/app/basics">LM Studio: Get started</a><br>
      <a target="_blank" rel="noopener" href="https://lmstudio.ai/docs/app/system-requirements">LM Studio: System Requirements</a><br>
      <a target="_blank" rel="noopener" href="https://lmstudio.ai/docs/app/basics/download-model">LM Studio: Download an LLM</a>
    </div>
  </article>`
});

window.STATIC_PAGES.push({
  route:"#/guide/download",
  title:"モデルをダウンロードするとき何を選べばいい？",
  summary:"InstructとBase、GGUFとsafetensors、Q4_K_MやQ5_K_Mなど、モデル配布ページで何を選べばいいかを初心者向けに説明します。",
  keywords:["ダウンロード","選び方","Instruct","Chat","Base","GGUF","safetensors","MLX","量子化","Q4_K_M","Q5_K_M","Q8_0","4bit","Hugging Face","モデルカード","ライセンス"],
  html:`<article class="article">
    <h1>モデルをダウンロードするとき何を選べばいい？</h1>
    <p class="lead">Hugging FaceやLM Studioでモデルを探すと、同じ名前なのにファイルが大量に並びます。このページでは<b>「普通にチャットしたい人は結局どれを選ぶ？」</b>という視点で説明します。</p>

    <div class="notice"><b>迷ったときの基本</b><br>
      会話用途なら <b>Instruct / Chat</b> → WindowsやLinuxのLM Studioならまず<b>GGUF</b> → 量子化は<b>Q4_K_M前後</b> → 自分のVRAM/RAMに余裕を残す。
    </div>

    <h2>モデル名を分解してみよう</h2>
    <div class="example-box"><code>Qwen3.8-27B-Instruct-Q4_K_M.gguf</code><br><br>
      <b>Qwen3.8</b> = モデルのシリーズ<br>
      <b>27B</b> = パラメータ規模<br>
      <b>Instruct</b> = 指示・会話向け調整済み<br>
      <b>Q4_K_M</b> = 量子化方式<br>
      <b>GGUF</b> = ファイル形式
    </div>

    <h2>① BaseとInstruct / Chat</h2>
    <div class="grid">
      <div class="card"><h3>Instruct / Chat</h3><p><b>普通に会話したいならこちら。</b>質問への回答、指示追従、文章作成などがしやすいように調整されています。</p></div>
      <div class="card"><h3>Base</h3><p>学習直後に近い基礎モデル。追加学習や研究用途では重要ですが、初心者の通常チャットにはInstruct版の方が扱いやすいことが多いです。</p></div>
    </div>

    <h2>② GGUF / safetensors / MLX</h2>
    <div class="grid">
      <div class="card"><h3>GGUF</h3><p>llama.cpp系で広く使われる形式。Windows/LinuxのLM Studioやllama.cppでローカルLLMを始めるときの定番です。</p></div>
      <div class="card"><h3>safetensors</h3><p>元モデルやPyTorch/Transformers系でよく使われます。複数ファイルに分割される場合もあり、初心者がLM Studioで使うならGGUFの方が分かりやすいことが多いです。</p></div>
      <div class="card"><h3>MLX</h3><p>Apple Silicon向け。LM StudioはMacでMLXモデルにも対応しています。</p></div>
    </div>

    <h2>③ Q4_K_M、Q5_K_M、Q8_0は何が違う？</h2>
    <p>量子化が軽いほどファイルサイズとメモリ使用量を削減できますが、情報を圧縮するため品質が少し落ちる可能性があります。</p>
    <div class="table-wrap">
      <table class="compare-table">
        <thead><tr><th>量子化</th><th>特徴</th><th>初心者向け判断</th></tr></thead>
        <tbody>
          <tr><td><b>Q3系</b></td><td>かなり軽い。メモリ節約を優先。</td><td>どうしてもQ4が入らない場合。</td></tr>
          <tr><td><b>Q4_K_M</b></td><td>サイズと品質のバランスが良い定番。</td><td><b>迷ったらまず候補。</b></td></tr>
          <tr><td><b>Q5_K_M</b></td><td>Q4より大きいが、品質を少し重視。</td><td>VRAM/RAMに余裕があるなら。</td></tr>
          <tr><td><b>Q6系</b></td><td>さらに大きい。</td><td>メモリに十分余裕がある場合。</td></tr>
          <tr><td><b>Q8_0</b></td><td>かなり大きいが高精度。</td><td>小型モデルや大容量メモリ向け。</td></tr>
        </tbody>
      </table>
    </div>
    <p class="compare-note">量子化方式はモデルや変換方法によって種類が異なります。「Q4_K_Mが全モデルで絶対に最良」という意味ではありません。</p>

    <h2>④ モデルサイズは「ファイルがVRAM以下」だけで決めない</h2>
    <p>推論にはモデル本体だけでなくKVキャッシュや計算用バッファも必要です。たとえばVRAM 16GBに15.8GBのモデルを入れようとすると、余裕不足でロードできない場合があります。</p>
    <p><a href="#/guide/hardware">→ 自分のPCでどのモデルが動く？</a></p>

    <h2>⑤ モデルカードを確認する</h2>
    <p>ダウンロード前に、開発元、対応言語、コンテキスト長、ライセンス、用途、必要なランタイムなどを確認します。</p>
    <p><b>ダウンロード数が多い＝必ず自分に最適</b>ではありません。公式モデルまたは信頼できる量子化配布元かどうかも確認しましょう。</p>

    <h2>⑥ マルチモーダルモデルは追加ファイルが必要な場合がある</h2>
    <p>画像を扱うモデルでは、手動運用時に画像エンコーダーやprojector相当の追加ファイルが必要になる場合があります。LM Studioの対応モデルではアプリ側が扱いやすくしていることもありますが、手動でllama.cppを使う場合はモデルカードを確認してください。</p>

    <h2>⑦ ライセンスも見る</h2>
    <p>「無料でダウンロードできる」ことと「何に使ってもよい」ことは別です。商用利用、再配布、派生モデル公開などの条件はモデルごとに異なります。</p>

    <h2>結局、初心者なら？</h2>
    <div class="notice">
      <b>普通のチャット用途</b><br>
      Instruct / Chat版<br>
      ＋ GGUF<br>
      ＋ Q4_K_M前後<br>
      ＋ 自分のVRAMに余裕を持って収まるサイズ
    </div>

    <h2>LM Studioなら選択肢を絞りやすい</h2>
    <p>LM StudioのDiscoverではHugging Face上の対応モデルを検索でき、同じモデルの量子化違いも選べます。公式ドキュメントでも、可能なら4-bit以上を選ぶよう案内されています。</p>

    <h2>公式情報</h2>
    <div class="sourcebox">
      <a target="_blank" rel="noopener" href="https://lmstudio.ai/docs/app/basics/download-model">LM Studio: Download an LLM</a><br>
      <a target="_blank" rel="noopener" href="https://lmstudio.ai/docs/cli/local-models/get">LM Studio: lms get</a><br>
      <a target="_blank" rel="noopener" href="https://github.com/ggml-org/llama.cpp">llama.cpp</a>
    </div>
  </article>`
});

window.STATIC_PAGES.push({
  route:"#/guide/troubleshoot",
  title:"ローカルLLM トラブルシューティング",
  summary:"モデルがロードできない、VRAM不足、生成が遅い、GPUを使わない、変な回答が出る、APIにつながらない場合の確認ポイントを症状別にまとめます。",
  keywords:["トラブル","エラー","ロード失敗","OOM","VRAM不足","遅い","GPUを使わない","CUDA","コンテキスト","KVキャッシュ","API","localhost","1234","LM Studio","llama.cpp","異常な回答","文字化け"],
  html:`<article class="article">
    <h1>ローカルLLM トラブルシューティング</h1>
    <p class="lead">ローカルLLMは、モデル・量子化・GPU・ランタイム・コンテキスト長の組み合わせで動作が大きく変わります。症状ごとに、まず確認する場所をまとめます。</p>

    <div class="notice"><b>困ったら最初にやること</b><br>
      ① エラーメッセージを保存 → ② モデル名・量子化・VRAM/RAMを確認 → ③ コンテキスト長を下げる → ④ 小さいモデルで再確認 → ⑤ ランタイムやGPUドライバを更新
    </div>

    <h2>モデルがロードできない / OOM / メモリ不足</h2>
    <p><b>最も多い原因は、モデル＋KVキャッシュ＋計算バッファがメモリに収まっていないことです。</b></p>
    <ol class="steps">
      <li>Q5/Q8ならQ4など、より軽い量子化を試す。</li>
      <li>コンテキスト長を128Kなどから8K・4Kへ下げる。</li>
      <li>他のモデルをアンロードし、VRAMを使うゲームや画像生成ソフトを閉じる。</li>
      <li>GPU offloadを減らし、一部をRAM/CPU側へ逃がす。</li>
      <li>それでも無理なら一段小さいモデルへ変更する。</li>
    </ol>
    <p>LM Studio CLIでは <code>lms load --estimate-only &lt;model&gt;</code> でロード前にメモリ見積もりができます。見積もりはコンテキスト長やGPU offloadなども考慮します。</p>

    <h2>生成がものすごく遅い</h2>
    <div class="grid">
      <div class="card"><h3>モデルが大きすぎる</h3><p>RAM/CPUへ大量にオフロードしていると、全GPU実行より大幅に遅くなる場合があります。</p></div>
      <div class="card"><h3>GPU offloadが少ない</h3><p>VRAMに余裕があるならGPUへ載せる割合を増やします。</p></div>
      <div class="card"><h3>コンテキストが巨大</h3><p>長すぎる会話や128K級設定は処理量とメモリを増やします。</p></div>
      <div class="card"><h3>バックグラウンド負荷</h3><p>画像生成、ゲーム、動画処理などGPU/CPUを使うアプリを閉じて比較します。</p></div>
    </div>
    <p>対応モデル・ランタイムではFlash Attentionが速度・メモリ使用量を改善する場合があります。</p>

    <h2>GPUを使っていないように見える</h2>
    <ol class="steps">
      <li>モデルロード設定のGPU offloadが0/offになっていないか確認。</li>
      <li>NVIDIAなら <code>nvidia-smi</code> でVRAM使用量を確認。</li>
      <li>LM Studioのランタイムが現在のGPUへ対応しているか確認。</li>
      <li>GPUドライバを更新。</li>
      <li>非常に小さいモデルではGPU使用率が目立たない場合もあるため、VRAM使用量も見る。</li>
    </ol>

    <h2>回答が変 / 同じ文を繰り返す / 意味不明</h2>
    <p>原因は必ずしも「モデル性能が低い」だけではありません。</p>
    <ul>
      <li><b>Baseモデル</b>を普通のチャット用途で使っていないか確認。</li>
      <li>モデルに合わないchat templateを使っていないか確認。</li>
      <li>コンテキスト上限を超えていないか確認。</li>
      <li>Temperatureなど生成設定を極端な値から標準付近へ戻す。</li>
      <li>非常に強い量子化を使っているならQ4/Q5などを試す。</li>
      <li>ランタイムが新しいモデルアーキテクチャへ対応しているか確認。</li>
    </ul>

    <h2>モデルが一覧に出ない / 読み込めない</h2>
    <ul>
      <li>ファイル形式が現在のランタイムに対応しているか確認。</li>
      <li>GGUF、MLX、safetensorsを取り違えていないか確認。</li>
      <li>新しいモデルの場合、LM Studio / llama.cppランタイムを更新。</li>
      <li>手動配置した場合はモデルディレクトリやimport方法を確認。</li>
      <li>ダウンロードが途中で壊れていないか再確認。</li>
    </ul>

    <h2>LM Studio自体が起動しない</h2>
    <p>公式要件を確認します。Windows x64ではAVX2対応CPUが必要です。LM StudioはRAM 16GB以上、専用VRAM 4GB以上を推奨しています。macOS版はApple Siliconが対象です。</p>

    <h2>APIにつながらない</h2>
    <p>LM StudioのDeveloper画面でローカルサーバーが起動しているか確認します。CLIなら <code>lms server start</code> です。標準例では <code>http://localhost:1234</code> を使います。</p>
    <div class="example-box"><b>OpenAI互換APIの例</b><br>
      Base URL: <code>http://localhost:1234/v1</code><br>
      Chat Completions: <code>POST /v1/chat/completions</code>
    </div>
    <ul>
      <li>サーバーが起動しているか。</li>
      <li>ポート番号を変更していないか。</li>
      <li>呼び出し側が <code>/v1</code> を必要としているか。</li>
      <li>モデル名/identifierが一致しているか。</li>
      <li>別PCから接続する場合、localhostではなくネットワーク設定が必要。</li>
    </ul>
    <p><b>注意:</b> サーバーをLANへ公開するときは認証やbind設定に注意してください。LM Studio公式もlocalhost以外へbindする場合は認証を推奨しています。</p>

    <h2>ダウンロードが失敗する</h2>
    <ul>
      <li>空きディスク容量を確認。</li>
      <li>ネットワークを確認し、再試行。</li>
      <li>保存先フォルダへの書き込み権限を確認。</li>
      <li>同じモデルを別の量子化で試している場合、古い大容量ファイルが残っていないか確認。</li>
    </ul>

    <h2>原因が分からないときの記録</h2>
    <p>人に質問するときは、次の情報があると原因を特定しやすくなります。</p>
    <div class="example-box">
      OS / GPU名 / VRAM / RAM<br>
      使用アプリとバージョン<br>
      モデル名 / 量子化<br>
      コンテキスト長<br>
      GPU offload設定<br>
      エラーメッセージ全文
    </div>

    <h2>公式情報</h2>
    <div class="sourcebox">
      <a target="_blank" rel="noopener" href="https://lmstudio.ai/docs/app/system-requirements">LM Studio: System Requirements</a><br>
      <a target="_blank" rel="noopener" href="https://lmstudio.ai/docs/cli/local-models/load">LM Studio: lms load / memory estimate</a><br>
      <a target="_blank" rel="noopener" href="https://lmstudio.ai/docs/developer/core/server">LM Studio: Local API Server</a><br>
      <a target="_blank" rel="noopener" href="https://lmstudio.ai/docs/developer/openai-compat">LM Studio: OpenAI Compatibility</a>
    </div>
  </article>`
});
