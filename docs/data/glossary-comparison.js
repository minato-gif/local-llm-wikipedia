window.STATIC_PAGES = window.STATIC_PAGES || [];

window.STATIC_PAGES.push({
  route:"#/guide/glossary",
  title:"ローカルLLM用語集",
  summary:"GGUF、MoE、KVキャッシュ、GPUオフロード、コンテキスト長など、ローカルLLMでよく見る言葉を初心者向けにまとめた用語集です。",
  keywords:["用語集","AI","LLM","モデル","パラメータ","B","Dense","MoE","Expert","推論","ランタイム","llama.cpp","LM Studio","Ollama","GGUF","safetensors","量子化","Q4","Q5","Q8","VRAM","RAM","GPU","GPUオフロード","コンテキスト","トークン","トークナイザー","KVキャッシュ","Flash Attention","CUDA","ROCm","Vulkan","Metal","FP16","BF16","FP8","INT4","MTP","Speculative Decoding","Tool Calling","Function Calling","Agent","マルチモーダル","Embedding","Fine-tuning","LoRA","Open Weight","ライセンス","Temperature","Top P","Prompt"],
  html:`<article class="article">
    <h1>ローカルLLM用語集</h1>
    <p class="lead">ローカルLLMの記事やモデル配布ページを見ていると、知らない言葉が次々に出てきます。このページでは「厳密な論文の定義」よりも、<b>実際にローカルLLMを使うとき何を意味するのか</b>を優先して説明します。</p>

    <div class="notice"><b>使い方</b><br>
    サイト上部の検索欄に「GGUF」「KVキャッシュ」「MoE」のように入力すると、この用語集も検索対象になります。</div>

    <div class="glossary-nav">
      <a href="#basic-terms">基本</a>
      <a href="#model-terms">モデル構造</a>
      <a href="#file-terms">ファイル・量子化</a>
      <a href="#runtime-terms">実行・ハードウェア</a>
      <a href="#generation-terms">生成設定</a>
      <a href="#agent-terms">機能・エージェント</a>
    </div>

    <section id="basic-terms" class="glossary-section">
      <h2>AI・LLMの基本</h2>
      <div class="term"><h3>AI <span class="alias">Artificial Intelligence / 人工知能</span></h3><p>人間が行う判断、認識、文章生成などをコンピューターで行わせる技術の総称です。LLMはAIの一種です。</p></div>
      <div class="term"><h3>LLM <span class="alias">Large Language Model / 大規模言語モデル</span></h3><p>大量の文章などを学習し、文章生成、質問回答、要約、翻訳、コード生成などを行うAIモデルです。</p></div>
      <div class="term"><h3>モデル</h3><p>AIが学習した結果を保存したデータです。ローカルLLMでは、Gemma、Qwen、Llamaなどの「モデル」をPCへダウンロードして使います。</p></div>
      <div class="term"><h3>パラメータ</h3><p>モデルが学習によって調整した大量の数値です。モデル名の「12B」「27B」などはパラメータ規模を示します。</p></div>
      <div class="term"><h3>B <span class="alias">Billion</span></h3><p>10億を表します。12Bなら約120億、27Bなら約270億パラメータです。</p></div>
      <div class="term"><h3>トークン</h3><p>LLMが文章を処理するときの細かな単位です。日本語では1文字＝1トークンとは限らず、単語や文字の一部に分割されます。</p></div>
      <div class="term"><h3>トークナイザー</h3><p>文章をトークンへ分解したり、トークンを文章へ戻したりする仕組みです。モデルごとに方式が異なる場合があります。</p></div>
      <div class="term"><h3>コンテキスト長 <span class="alias">Context Length / Context Window</span></h3><p>モデルが一度の会話や処理で参照できるトークン量の上限です。長いほど大量の文章を扱えますが、メモリ使用量も増えやすくなります。</p></div>
      <div class="term"><h3>Open Weight / オープンウェイト</h3><p>学習済みモデルの重みをダウンロードできる形で公開することです。「オープンウェイト」と「完全なオープンソース」は同じ意味ではありません。</p></div>
      <div class="term"><h3>ライセンス</h3><p>モデルをどのような条件で利用・改変・再配布できるかを定めた規約です。商用利用できるかどうかもモデルごとに異なります。</p></div>
    </section>

    <section id="model-terms" class="glossary-section">
      <h2>モデル構造</h2>
      <div class="term"><h3>Denseモデル</h3><p>推論時に基本的にモデル全体のパラメータを使う一般的な構造です。12B Denseなら、おおむね12B規模全体を使って計算します。</p></div>
      <div class="term"><h3>MoE <span class="alias">Mixture of Experts</span></h3><p>巨大なモデルを複数の「専門家（Expert）」に分け、入力ごとに一部だけを動かす構造です。たとえば「30B total / 3B active」なら、重み全体は30B級でも1トークンの計算で使う部分は約3Bです。</p></div>
      <div class="term"><h3>Expert / エキスパート</h3><p>MoEモデル内部にある複数の専門ネットワークです。毎回すべてを使うのではなく、必要なExpertが選択されます。</p></div>
      <div class="term"><h3>Active Parameters / アクティブパラメータ</h3><p>MoEモデルが1トークンを処理するとき実際に使うパラメータ規模です。ただし、モデルの全重みを保存・ロードするためのメモリは別途必要です。</p></div>
      <div class="term"><h3>マルチモーダル</h3><p>文章だけでなく、画像、音声、動画など複数種類の情報を扱えるモデルや仕組みです。</p></div>
      <div class="term"><h3>MTP <span class="alias">Multi-Token Prediction</span></h3><p>次の1トークンだけではなく、複数の将来トークンを予測する仕組みです。推論高速化やSpeculative Decodingと組み合わせられる場合があります。</p></div>
      <div class="term"><h3>Embedding / 埋め込み</h3><p>文章などを数値ベクトルへ変換したものです。意味の近さを比較できるため、文書検索やRAGでよく使われます。</p></div>
    </section>

    <section id="file-terms" class="glossary-section">
      <h2>モデルファイル・量子化</h2>
      <div class="term"><h3>GGUF</h3><p>llama.cpp系で広く使われているモデルファイル形式です。量子化済みモデルの配布で非常によく見かけます。</p></div>
      <div class="term"><h3>safetensors</h3><p>Hugging Faceなどで広く使われるモデル重みの保存形式です。元モデルやGPUサーバー向け配布でよく使われます。</p></div>
      <div class="term"><h3>量子化 <span class="alias">Quantization</span></h3><p>モデルの数値を低い精度で保存・計算し、ファイル容量と必要メモリを減らす技術です。ローカルLLMを家庭用PCで動かすうえで特に重要です。</p></div>
      <div class="term"><h3>Q4 / Q5 / Q6 / Q8</h3><p>GGUFでよく見る量子化の大まかな精度区分です。数字が小さいほど軽くなりやすく、数字が大きいほど容量は増えますが品質を保ちやすくなります。迷ったらQ4〜Q5が定番です。</p></div>
      <div class="term"><h3>INT4 / INT8</h3><p>4bit整数、8bit整数などを使う量子化表現です。INT4は特に大きくメモリを削減できます。</p></div>
      <div class="term"><h3>FP16 / BF16</h3><p>16bit浮動小数点形式です。量子化版より大きい一方、学習済みモデルの高い精度を保ちやすく、GPUサーバーや高VRAM環境でよく使われます。</p></div>
      <div class="term"><h3>FP8</h3><p>8bit浮動小数点形式です。対応GPUではメモリ削減と高速化を狙えますが、ハードウェアやランタイム側の対応が必要です。</p></div>
      <div class="term"><h3>AWQ / GPTQ / EXL2</h3><p>主にGPU推論で使われる量子化方式・形式です。GGUF以外にも、目的やランタイムに応じてさまざまな量子化方式があります。</p></div>
    </section>

    <section id="runtime-terms" class="glossary-section">
      <h2>推論・ハードウェア</h2>
      <div class="term"><h3>推論 <span class="alias">Inference</span></h3><p>学習済みモデルを使って実際に回答を生成する処理です。モデルをPCでチャットに使うのも推論です。</p></div>
      <div class="term"><h3>推論ランタイム</h3><p>モデルを実際にCPU/GPUで動かすソフトウェア部分です。llama.cppなどが代表例です。</p></div>
      <div class="term"><h3>llama.cpp</h3><p>CPUやさまざまなGPUでLLMを実行できる代表的なオープンソース推論エンジンです。GGUF形式の中心的なランタイムです。</p></div>
      <div class="term"><h3>LM Studio</h3><p>モデル検索、ダウンロード、チャット、設定、ローカルAPIサーバーなどをGUIで扱えるアプリです。初心者がローカルLLMを始める方法の一つです。</p></div>
      <div class="term"><h3>Ollama</h3><p>ローカルモデルを簡単なコマンドで取得・実行し、APIとして利用できる環境です。開発ツールとの連携でもよく使われます。</p></div>
      <div class="term"><h3>VRAM</h3><p>GPUに搭載された専用メモリです。ローカルLLMでは「どのサイズのモデルをどのくらいGPUへ載せられるか」を決める重要な要素です。</p></div>
      <div class="term"><h3>RAM</h3><p>PC本体のメモリです。VRAMに収まりきらないモデルをCPU側へ置くときやCPU推論で重要になります。</p></div>
      <div class="term"><h3>GPUオフロード</h3><p>モデルの全部または一部をGPUへ載せて計算させることです。VRAMに入りきらない部分をRAM/CPU側へ残す構成もできます。</p></div>
      <div class="term"><h3>KVキャッシュ <span class="alias">KV Cache</span></h3><p>過去のトークンを効率よく参照するために保存するデータです。コンテキスト長を増やすほど大きくなり、VRAM/RAM使用量へ影響します。</p></div>
      <div class="term"><h3>Flash Attention</h3><p>Attention計算を効率化し、速度やメモリ使用量を改善する技術です。モデル、GPU、ランタイムによって対応状況が異なります。</p></div>
      <div class="term"><h3>CUDA</h3><p>NVIDIA GPU向けの計算プラットフォームです。NVIDIA製GPUでローカルLLMを高速化する際によく使われます。</p></div>
      <div class="term"><h3>ROCm</h3><p>AMD GPU向けのGPU計算プラットフォームです。</p></div>
      <div class="term"><h3>Vulkan</h3><p>さまざまなGPUで利用できる低レベルのグラフィックス・計算APIです。llama.cppなどで推論バックエンドとして利用されることがあります。</p></div>
      <div class="term"><h3>Metal</h3><p>Apple製デバイス向けのGPU計算・グラフィックスAPIです。Apple Silicon MacでのローカルLLM高速化に使われます。</p></div>
    </section>

    <section id="generation-terms" class="glossary-section">
      <h2>プロンプト・生成設定</h2>
      <div class="term"><h3>Prompt / プロンプト</h3><p>モデルへ渡す指示や質問です。「この文章を要約して」のような入力全体を指します。</p></div>
      <div class="term"><h3>System Prompt / システムプロンプト</h3><p>会話の基本ルールや役割をモデルへ伝える特別な指示です。通常のユーザー入力より前に適用されます。</p></div>
      <div class="term"><h3>Temperature</h3><p>出力のランダムさを調整する設定です。低いほど安定し、高いほど多様な表現が出やすくなります。</p></div>
      <div class="term"><h3>Top P</h3><p>次のトークン候補を確率の合計で絞るサンプリング設定です。Temperatureと合わせて出力傾向を調整します。</p></div>
      <div class="term"><h3>Seed / シード</h3><p>乱数の初期値です。同じモデル・設定・実装でSeedを固定すると、出力を再現しやすくなる場合があります。</p></div>
      <div class="term"><h3>Speculative Decoding</h3><p>小さな補助モデルなどで複数トークンを先読みし、大きなモデルがまとめて確認することで生成を高速化する手法です。</p></div>
    </section>

    <section id="agent-terms" class="glossary-section">
      <h2>機能・エージェント</h2>
      <div class="term"><h3>Tool Calling / Function Calling</h3><p>LLMが「この関数・ツールを使うべき」と判断し、外部プログラムへ構造化された指示を出す機能です。</p></div>
      <div class="term"><h3>Agent / エージェント</h3><p>LLMが目標に向けて計画し、必要に応じて検索、コード実行、ファイル操作などのツールを使いながら複数ステップで作業する仕組みです。</p></div>
      <div class="term"><h3>RAG <span class="alias">Retrieval-Augmented Generation</span></h3><p>回答前に外部文書を検索し、その情報をLLMへ渡して回答させる方法です。社内文書や個人資料を扱う用途でよく使われます。</p></div>
      <div class="term"><h3>Fine-tuning / ファインチューニング</h3><p>既存モデルを追加データで再学習し、特定分野や出力傾向へ適応させることです。</p></div>
      <div class="term"><h3>LoRA</h3><p>モデル本体すべてを再学習せず、小さな追加パラメータだけを学習する効率的なファインチューニング手法です。</p></div>
    </section>

    <h2>関連ページ</h2>
    <p><a href="#/guide/basics">はじめてのローカルLLM</a> · <a href="#/guide/hardware">自分のPCでどのモデルが動く？</a> · <a href="#/guide/compare">モデル比較</a></p>
  </article>`
});

window.STATIC_PAGES.push({
  route:"#/guide/compare",
  title:"主要ローカルLLMモデル比較",
  summary:"Gemma 4、Qwen3.8、gpt-oss、Nemotron、Llama 4、Mistral Small 4、DeepSeek V4、MiniMax M2.1、Kimi K2.5を用途や規模で比較します。",
  keywords:["モデル比較","比較","おすすめ","Gemma 4","Qwen3.8","gpt-oss","Nemotron 3.5 Lightning","Llama 4 Scout","Mistral Small 4","DeepSeek V4 Flash","MiniMax M2.1","Kimi K2.5","マルチモーダル","コーディング","推論","エージェント","ローカル向き"],
  html:`<article class="article">
    <h1>主要ローカルLLMモデル比較</h1>
    <div class="meta">基準日: 2026-08-26</div>
    <p class="lead">「結局どれを選べばいい？」を考えるための比較ページです。単純なベンチマーク順位ではなく、<b>ローカルでの扱いやすさ、得意分野、モデル規模、マルチモーダル対応</b>を中心に整理します。</p>

    <div class="notice"><b>比較表の「ローカル向き」について</b><br>
    これは各社の公式評価ではなく、モデル規模、公式のハードウェア案内、一般的な量子化サイズなどからLocal LLM Wikipediaが付けた実用目安です。実際に動くかどうかは量子化、VRAM/RAM、コンテキスト長、ランタイムで変わります。</div>

    <h2>主要モデル比較表</h2>
    <div class="table-wrap">
      <table class="compare-table">
        <thead>
          <tr><th>モデル</th><th>開発元</th><th>規模</th><th>入力</th><th>得意分野</th><th>ローカル向き</th></tr>
        </thead>
        <tbody>
          <tr><td><b>Gemma 4 12B</b></td><td>Google</td><td>12B Dense</td><td>テキスト・画像・音声</td><td>汎用、マルチモーダル、ローカルAI</td><td class="rating">★★★★★</td></tr>
          <tr><td><b>Qwen3.8 27B</b></td><td>Qwen</td><td>27B</td><td>テキスト・画像</td><td>汎用、創作、コード、画像理解</td><td class="rating">★★★★☆</td></tr>
          <tr><td><b>gpt-oss-20b</b></td><td>OpenAI</td><td>21B total / 3.6B active</td><td>テキスト</td><td>推論、ツール利用、エージェント</td><td class="rating">★★★★★</td></tr>
          <tr><td><b>Nemotron 3.5 Lightning</b></td><td>NVIDIA</td><td>30B total / 3B active</td><td>テキスト中心</td><td>高速エージェント、反復的な専門タスク</td><td class="rating">★★★★☆</td></tr>
          <tr><td><b>Llama 4 Scout</b></td><td>Meta</td><td>109B total / 17B active</td><td>テキスト・画像</td><td>長文脈、画像理解、汎用</td><td class="rating">★★☆☆☆</td></tr>
          <tr><td><b>Mistral Small 4</b></td><td>Mistral AI</td><td>119B total / 約6.5B active</td><td>テキスト・画像</td><td>会話、推論、コード、画像</td><td class="rating">★★☆☆☆</td></tr>
          <tr><td><b>DeepSeek V4-Flash</b></td><td>DeepSeek</td><td>284B total / 13B active</td><td>テキスト</td><td>推論、コード、エージェント、長文脈</td><td class="rating">★☆☆☆☆</td></tr>
          <tr><td><b>MiniMax M2.1</b></td><td>MiniMax</td><td>229B</td><td>テキスト</td><td>コーディング、ツール利用、長時間エージェント</td><td class="rating">★☆☆☆☆</td></tr>
          <tr><td><b>Kimi K2.5</b></td><td>Moonshot AI</td><td>1T total / 32B active</td><td>テキスト・画像</td><td>画像理解、コード、エージェント、Thinking</td><td class="rating">★☆☆☆☆</td></tr>
        </tbody>
      </table>
    </div>
    <p class="compare-note">★が多いほど「一般的な個人PCで量子化して試しやすい」という意味です。モデル性能の順位ではありません。</p>

    <h2>目的別に選ぶなら</h2>
    <div class="grid choice-grid">
      <div class="card"><h3>まずローカルLLMを試したい</h3><p><b>Gemma 4 12B</b>。Googleが16GB VRAMまたは統合メモリでのローカル利用を案内しており、サイズと機能のバランスが分かりやすい候補です。</p></div>
      <div class="card"><h3>幅広く何でもやりたい</h3><p><b>Qwen3.8 27B</b>。文章、創作、コード、画像理解まで幅広く、量子化版も見つけやすいモデルです。</p></div>
      <div class="card"><h3>推論・ツール利用を重視</h3><p><b>gpt-oss-20b</b>。21B total / 3.6B activeで、OpenAIは16GBメモリでのローカル利用を想定しています。</p></div>
      <div class="card"><h3>RTX 5090級で高速エージェント</h3><p><b>Nemotron 3.5 Lightning</b>。30B total / 3B activeで、高頻度の専門タスクを高速に処理するエージェント用途を重視しています。</p></div>
      <div class="card"><h3>超長文・巨大モデルを試したい</h3><p><b>Llama 4 Scout</b>や<b>DeepSeek V4</b>。非常に長いコンテキストや大規模MoEを扱えますが、個人PCでは難易度が一気に上がります。</p></div>
      <div class="card"><h3>画像も使う巨大エージェント</h3><p><b>Kimi K2.5</b>。1T total / 32B activeのネイティブマルチモーダルMoEで、画像理解とエージェント機能を統合しています。</p></div>
    </div>

    <h2>モデルごとの短評</h2>
    <h3>Gemma 4 12B</h3>
    <p>12B Denseの中型モデルで、画像・音声を扱えるのが大きな特徴です。Googleは16GB VRAMまたは統合メモリのローカルPCを明確に意識しており、「家庭用PCでマルチモーダル」を試したい人に向いています。</p>

    <h3>Qwen3.8 27B</h3>
    <p>27B級で、テキストと画像を扱います。Apache 2.0で公開され、Hugging FaceではGGUFなどコミュニティ量子化も豊富です。16GB VRAMではRAM併用になりやすく、24GB級から扱いやすくなります。</p>

    <h3>gpt-oss-20b</h3>
    <p>OpenAIのオープンウェイト推論モデル。21B total / 3.6B active、128Kコンテキストで、Apache 2.0です。OpenAIは16GBメモリで動作可能なローカル・オンデバイス用途を公式に想定しています。</p>

    <h3>Nemotron 3.5 Lightning</h3>
    <p>NVIDIAの30B MoE・3B activeモデル。長時間稼働するAIエージェントの中で、ツール呼び出しや結果処理など大量の専門タスクを高速にこなす用途へ最適化されています。</p>

    <h3>Llama 4 Scout</h3>
    <p>109B total / 17B activeのマルチモーダルMoE。MetaはInt4で単一H100へ収まると案内しています。10Mトークン級の長大なコンテキストが大きな特徴ですが、家庭用GPUではかなり大型です。</p>

    <h3>Mistral Small 4</h3>
    <p>119B total / 約6.5B active。会話、推論、コーディング、画像理解を1モデルへ統合し、256Kコンテキストを持ちます。Mistralは24GB VRAM GPUでも4bit・32Kコンテキストならオフライン利用例を案内していますが、CPUオフロード前提を含む上級者向けです。</p>

    <h3>DeepSeek V4-Flash</h3>
    <p>284B total / 13B active。1Mコンテキスト、推論、エージェント、コードを重視した巨大モデルです。重みは公開されていますが、家庭用単一GPUで気軽に扱うサイズではありません。</p>

    <h3>MiniMax M2.1</h3>
    <p>229B級で、コーディング、ツール利用、指示追従、長時間の計画実行を強く意識しています。重みは公開されていますが、ローカルでは大容量RAMや複数GPUを使う上級構成向けです。</p>

    <h3>Kimi K2.5</h3>
    <p>1T total / 32B active、256Kコンテキストの巨大マルチモーダルMoEです。ネイティブINT4量子化を採用し、画像理解、コーディング、ツール利用、Thinkingモードを統合しています。</p>

    <h2>迷ったときの順番</h2>
    <div class="notice">
      <b>① 自分のVRAMを確認</b><br>
      ↓<br>
      <b>② 「自分のPCでどのモデルが動く？」でサイズ帯を決める</b><br>
      ↓<br>
      <b>③ この比較ページで用途に合うモデルを選ぶ</b><br>
      ↓<br>
      <b>④ 最初はQ4前後の量子化から試す</b>
    </div>

    <h2>関連ページ</h2>
    <p><a href="#/guide/hardware">自分のPCでどのモデルが動く？</a> · <a href="#/guide/models">主要モデルの詳しい説明</a> · <a href="#/guide/glossary">用語集</a></p>

    <h2>主な公式出典</h2>
    <div class="sourcebox">
      <a target="_blank" rel="noopener" href="https://developers.googleblog.com/gemma-4-12b-the-developer-guide/">Google: Gemma 4 12B</a><br>
      <a target="_blank" rel="noopener" href="https://huggingface.co/Qwen/Qwen3.8-27B">Qwen: Qwen3.8-27B</a><br>
      <a target="_blank" rel="noopener" href="https://openai.com/index/introducing-gpt-oss/">OpenAI: gpt-oss</a><br>
      <a target="_blank" rel="noopener" href="https://developer.nvidia.com/topics/ai/nemotron">NVIDIA: Nemotron</a><br>
      <a target="_blank" rel="noopener" href="https://ai.meta.com/blog/llama-4-multimodal-intelligence/">Meta: Llama 4</a><br>
      <a target="_blank" rel="noopener" href="https://mistral.ai/news/mistral-small-4/">Mistral AI: Mistral Small 4</a><br>
      <a target="_blank" rel="noopener" href="https://api-docs.deepseek.com/news/news260424/">DeepSeek: V4 Preview</a><br>
      <a target="_blank" rel="noopener" href="https://huggingface.co/MiniMaxAI/MiniMax-M2.1">MiniMax: M2.1</a><br>
      <a target="_blank" rel="noopener" href="https://huggingface.co/moonshotai/Kimi-K2.5">Moonshot AI: Kimi K2.5</a>
    </div>
  </article>`
});
