window.STATIC_PAGES = window.STATIC_PAGES || [];
window.STATIC_PAGES.push({
  route:"#/guide/hardware",
  title:"自分のPCでどのモデルが動く？",
  summary:"GPUのVRAMやPCのRAMから、ローカルLLMで現実的に動かしやすいモデルサイズと量子化の目安を初心者向けに説明します。",
  keywords:["VRAM","RAM","8GB","12GB","16GB","24GB","32GB","48GB","64GB","80GB","GPU","NVIDIA","GeForce","RTX","Apple Silicon","統合メモリ","Q4","Q5","Q8","GGUF","GPUオフロード","コンテキスト長","KVキャッシュ","Gemma 4","Qwen3.8","gpt-oss","Nemotron"],
  html:`<article class="article">
    <h1>自分のPCでどのモデルが動く？</h1>
    <div class="meta">基準日: 2026-08-26</div>
    <p class="lead">「このモデル、私のPCで動くの？」を判断するための初心者向けガイドです。まずはGPUの<b>VRAM容量</b>を確認し、次にモデルの量子化サイズ、RAM、コンテキスト長を見ていけば、おおよその判断ができます。</p>

    <div class="notice"><b>先に結論</b><br>
    NVIDIAなどの専用GPUを使う場合、まず<b>VRAM容量</b>を見るのが一番簡単です。<br>
    ただし「モデルファイルがVRAMより小さい＝必ず全部GPUに入る」という意味ではありません。モデル本体以外にもKVキャッシュや計算用バッファが必要なので、少し余裕を残すのが安全です。</div>

    <h2>まず、自分のVRAMを確認しよう</h2>
    <h3>Windows</h3>
    <p><b>タスク マネージャー → パフォーマンス → GPU → 専用GPUメモリ</b>を確認します。たとえば「専用GPUメモリ 16.0 GB」と表示されれば、VRAM 16GB級です。</p>
    <h3>NVIDIA GPU</h3>
    <p>コマンドプロンプトやPowerShellで <code>nvidia-smi</code> を実行すると、GPU名とVRAM容量を確認できます。</p>
    <h3>Apple Silicon</h3>
    <p>MacのMシリーズはCPUとGPUが<b>統合メモリ</b>を共有します。32GB搭載Macなら「GPU専用32GB」ではなく、macOSや他のアプリも含めて32GBを共有するため、モデルには全容量を使えません。</p>

    <h2>VRAM別：ざっくり何が動く？</h2>
    <p>以下は<b>GGUFのQ4前後を中心にした実用目安</b>です。モデルの構造、画像入力の有無、コンテキスト長、ランタイムによって必要量は変わります。</p>

    <div class="grid">
      <div class="card"><h3>VRAM 8GB</h3><span class="badge">入門向け</span><p><b>7B〜8B級のQ4</b>が扱いやすいゾーンです。12B級も強めの量子化や一部RAMへのオフロードで動かせる場合がありますが、速度やコンテキスト長に妥協が必要です。</p><p>おすすめ方針：小型モデルのQ4/Q5、コンテキスト4K〜8K程度から。</p></div>
      <div class="card"><h3>VRAM 12GB</h3><span class="badge">かなり遊べる</span><p><b>10B〜14B級のQ4</b>が現実的です。小型モデルならQ5/Q8も選びやすくなります。20B級はQ4でも全GPU搭載は厳しいことが多く、RAM併用向けです。</p><p>おすすめ方針：12B前後を中心に、品質重視ならQ5も検討。</p></div>
      <div class="card"><h3>VRAM 16GB</h3><span class="badge">人気の実用帯</span><p><b>12B〜20B級</b>が強いゾーンです。GoogleはGemma 4 12Bを16GB VRAM/統合メモリでローカル実行できるサイズとして案内しています。OpenAIのgpt-oss-20bも16GBメモリでの動作を公式に想定しています。</p><p>Qwen3.8 27BのQ4は約17〜19GB級なので、16GB VRAMへ完全に載せるより、RAMへの一部オフロードを使う構成が現実的です。</p></div>
      <div class="card"><h3>VRAM 24GB</h3><span class="badge">27B〜32B級が本命</span><p><b>20B〜32B級のQ4</b>がかなり現実的になります。Qwen3.8 27BのQ4系はおおむね16〜19GB台のGGUFがあり、中程度のコンテキストを含めても24GB級GPUで扱いやすいサイズです。</p><p>ただし30B級MoEでも、量子化方式によって25GBを超えることがあるため、「30Bなら必ず24GBに入る」とは限りません。</p></div>
      <div class="card"><h3>VRAM 32GB</h3><span class="badge">大型ローカルAI</span><p><b>30B級を高めの量子化で扱いやすい</b>ゾーンです。Nemotron 3.5 Lightning 30B A3Bには20GB台前半〜半ばの4bit GGUFがあり、RTX 5090級の32GB GPUは代表的なローカル実行環境の一つです。</p><p>27B級ならQ5/Q6も視野に入り、コンテキスト長にも余裕を持たせやすくなります。</p></div>
      <div class="card"><h3>VRAM 48GB</h3><span class="badge">ワークステーション級</span><p><b>40B〜50B級Q4</b>や、30B級の高品質量子化が扱いやすくなります。70B級Q4も構成次第で射程に入りますが、長いコンテキストを使うと余裕がなくなりやすいため、64GB級や複数GPUの方が安心です。</p></div>
      <div class="card"><h3>VRAM 64GB以上</h3><span class="badge">70B級</span><p><b>70B級Q4</b>を現実的に扱える領域です。大きなコンテキスト、Q5以上、画像モデルなどを使うほど追加メモリが必要になります。</p></div>
      <div class="card"><h3>80GB級</h3><span class="badge">データセンター級</span><p>単一80GB GPUでは、OpenAIが<b>gpt-oss-120b</b>を動かせる構成として公式に案内しています。一般家庭向けというより、H100/A100級や大型ワークステーションの世界です。</p></div>
    </div>

    <h2>おすすめモデルの具体例</h2>
    <div class="grid">
      <div class="card"><h3>Gemma 4 12B</h3><span class="badge">16GB級</span><p>Googleが16GB VRAMまたは統合メモリでのローカル利用を明示。画像・音声も扱えるため、16GB級PCの分かりやすい基準モデルです。</p></div>
      <div class="card"><h3>gpt-oss-20b</h3><span class="badge">16GB級</span><p>OpenAIが16GBメモリで動作可能と案内。ネイティブMXFP4量子化で、推論やツール利用を重視するモデルです。</p></div>
      <div class="card"><h3>Qwen3.8 27B Q4</h3><span class="badge">24GB推奨</span><p>Q4系GGUFは約16〜19GB台。16GBでもRAM併用なら動かせますが、24GB級GPUの方が余裕があります。</p></div>
      <div class="card"><h3>Nemotron 3.5 Lightning</h3><span class="badge">32GB級</span><p>30B A3BのMoEモデル。4bit GGUFは20GB台のものがあり、RTX 5090級はNVIDIAが紹介するローカル環境の一つです。</p></div>
      <div class="card"><h3>gpt-oss-120b</h3><span class="badge">80GB級</span><p>OpenAI公式では単一80GB GPUでの実行を想定。家庭用GPUを大きく超えるサイズです。</p></div>
    </div>

    <h2>量子化はどれを選べばいい？</h2>
    <div class="grid">
      <div class="card"><h3>Q4</h3><p><b>迷ったらまずここ。</b>容量と品質のバランスが良く、ローカルLLMで最も使いやすい選択肢の一つです。</p></div>
      <div class="card"><h3>Q5 / Q6</h3><p>VRAM/RAMに余裕があるなら候補。Q4より大きくなりますが、品質をなるべく維持したい場合に向きます。</p></div>
      <div class="card"><h3>Q8</h3><p>かなり大きい代わりに高品質。VRAMが十分あるモデルや、品質優先の用途向けです。</p></div>
      <div class="card"><h3>Q2 / Q3</h3><p>どうしてもメモリに収めたいときの選択肢。サイズは減りますが、品質低下が目立ちやすいため、最初の選択にはあまりおすすめしません。</p></div>
    </div>

    <h2>なぜ「モデルファイルのサイズ」だけでは判断できない？</h2>
    <p>推論時のメモリには大きく分けて、<b>モデルの重み</b>、会話履歴を保持する<b>KVキャッシュ</b>、一時的な<b>計算バッファ</b>などがあります。llama.cppでも、モデル本体とは別にKVキャッシュとcompute bufferが確保されます。</p>
    <p>そのため、たとえば18GBのGGUFを24GB GPUへ載せる場合、「6GB余るから必ず大丈夫」とは限りません。画像入力や長いコンテキストを使う場合は追加メモリが増えます。</p>

    <h2>コンテキスト長を増やすとメモリも増える</h2>
    <p>コンテキスト長は、AIが一度に覚えておける文章量のようなものです。4K、8K、32K、128Kなどがあります。</p>
    <p>長くするほどKVキャッシュが大きくなり、VRAM/RAMを多く使います。モデルがギリギリしか入らないときは、まずコンテキスト長を短くするのが定番の対処法です。</p>

    <h2>VRAMに入りきらなくても動かせる？</h2>
    <p><b>はい。</b> llama.cppやLM Studioでは、モデルの一部をGPU、一部をCPU/RAMで処理する「GPUオフロード」が使えます。</p>
    <p>たとえば16GB GPUで18GB級のモデルを使うこと自体は可能です。ただし全てをGPUに載せた場合より遅くなるため、快適性はRAM速度やCPU性能にも左右されます。</p>

    <h2>RAMはどのくらい必要？</h2>
    <div class="grid">
      <div class="card"><h3>RAM 16GB</h3><p>小型モデル中心。OSやブラウザも使うため余裕は少なめです。</p></div>
      <div class="card"><h3>RAM 32GB</h3><p>ローカルLLM入門〜16GB GPU構成との組み合わせで扱いやすい容量。</p></div>
      <div class="card"><h3>RAM 64GB</h3><p>24〜32GB GPUで大型モデルを部分オフロードしたり、複数モデルを扱う場合に便利。</p></div>
      <div class="card"><h3>RAM 128GB以上</h3><p>GPUに収まらない大型モデルやCPU推論、巨大GGUFを試す上級者向け。</p></div>
    </div>

    <h2>LM Studioならロード前に見積もれる</h2>
    <p>LM StudioのCLIでは、モデルを実際にロードせずに必要メモリを推定できます。</p>
    <div class="notice"><code>lms load --estimate-only &lt;model_key&gt;</code></div>
    <p>コンテキスト長やGPUオフロード設定も含めて推定できるので、「このモデルをダウンロードしたけど入るか不安」という場合に便利です。</p>

    <h2>初心者向けの選び方</h2>
    <div class="notice"><b>① 自分のVRAM容量を確認</b><br>↓<br><b>② そのVRAM帯より少し小さいQ4モデルを選ぶ</b><br>↓<br><b>③ コンテキストは4K〜8K程度から始める</b><br>↓<br><b>④ 余裕があればQ5や長いコンテキストへ上げる</b></div>

    <h2>早見：最初のおすすめ</h2>
    <p><b>8GB → 7B/8B Q4</b><br>
    <b>12GB → 10B〜14B Q4</b><br>
    <b>16GB → 12B〜20B級。Gemma 4 12B / gpt-oss-20b</b><br>
    <b>24GB → 27B〜32B Q4。Qwen3.8 27Bが候補</b><br>
    <b>32GB → 30B級をより余裕を持って。Nemotron 3.5 Lightningなど</b><br>
    <b>64GB+ → 70B級Q4</b><br>
    <b>80GB → gpt-oss-120b級</b></p>

    <h2>公式・参考情報</h2>
    <div class="sourcebox">
      <a target="_blank" rel="noopener" href="https://developers.googleblog.com/gemma-4-12b-the-developer-guide/">Google — Gemma 4 12B Developer Guide</a><br>
      <a target="_blank" rel="noopener" href="https://openai.com/index/introducing-gpt-oss/">OpenAI — Introducing gpt-oss</a><br>
      <a target="_blank" rel="noopener" href="https://lmstudio.ai/docs/cli/local-models/load">LM Studio — lms load / memory estimation</a><br>
      <a target="_blank" rel="noopener" href="https://huggingface.co/ggml-org/Qwen3.8-27B-GGUF">ggml-org — Qwen3.8-27B GGUF</a><br>
      <a target="_blank" rel="noopener" href="https://developer.nvidia.com/blog/nvidia-nemotron-3-5-lightning-delivers-fast-accurate-specialized-task-execution-for-long-running-agents/">NVIDIA — Nemotron 3.5 Lightning</a>
    </div>

    <h2>次に読む</h2>
    <p><a href="#/guide/models">主要ローカルLLMモデルを見る →</a><br><a href="#/guide/basics">ローカルLLMの基本用語に戻る →</a></p>
  </article>`
});
