window.STATIC_PAGES = [
{
  route:"#/guide/basics",
  title:"はじめてのローカルLLM",
  summary:"LLM、モデル、推論ランタイム、量子化、VRAMなどを、AIに詳しくない人向けにやさしく説明します。",
  keywords:["初心者","LLM","モデル","推論ランタイム","量子化","GGUF","VRAM","RAM","LM Studio","Ollama","llama.cpp"],
  html:`<article class="article">
    <h1>はじめてのローカルLLM</h1>
    <p class="lead">「ローカルLLMに興味はあるけれど、モデル、GGUF、量子化、推論ランタイム……知らない言葉ばかり」という人向けの入門ページです。できるだけ専門用語を使わずに説明します。</p>

    <div class="notice"><b>最初にこれだけ</b><br>
    ローカルLLMは、インターネット上のAIサービスへ文章を送る代わりに、<b>自分のPCの中でAIモデルを動かす</b>使い方です。</div>

    <h2>LLMとは？</h2>
    <p><b>LLM（Large Language Model / 大規模言語モデル）</b>は、大量の文章などから言葉のパターンを学習したAIです。質問への回答、文章作成、要約、翻訳、プログラミングなどを行えます。</p>
    <p>かなり大ざっぱに例えるなら、LLMは「とても大量の文章を読んで、次にどんな言葉が来るかを予測するのが得意になった仕組み」です。</p>

    <h2>「モデル」とは？</h2>
    <p>モデルは、AIが学習した結果をまとめた<b>巨大なデータ</b>です。人間にたとえるなら「知識や考え方が入った脳」に近い存在です。</p>
    <div class="grid">
      <div class="card"><h3>Gemma</h3><p>Googleが公開しているモデルファミリー。</p></div>
      <div class="card"><h3>Qwen</h3><p>Alibaba系のQwenチームが公開しているモデルファミリー。</p></div>
      <div class="card"><h3>Llama</h3><p>Metaが公開しているオープンウェイトモデルファミリー。</p></div>
    </div>
    <p>同じシリーズでも「小さいモデル」「大きいモデル」「会話向け」「画像も読めるモデル」など、いくつもの種類があります。</p>

    <h2>パラメータ数の「B」って何？</h2>
    <p>モデル名にある <b>12B、27B、70B</b> などのBは、Billion（10億）を表します。12Bなら約120億パラメータ、27Bなら約270億パラメータです。</p>
    <p>一般には大きなモデルほど高性能になりやすい一方、必要なメモリも増えます。ただし最近は<b>MoE（Mixture of Experts）</b>という、巨大なモデルの一部だけを使って計算する方式もあるため、「総パラメータ数だけ」で重さを判断できない場合があります。</p>

    <h2>推論ランタイムとは？</h2>
    <p>「推測ランタイム」ではなく、通常は<b>推論（すいろん）ランタイム</b>と呼びます。</p>
    <p>モデルが「AIの脳」だとすると、推論ランタイムは<b>その脳をPC上で実際に動かすエンジン</b>です。</p>
    <div class="grid">
      <div class="card"><h3>llama.cpp</h3><p>GGUFモデルをCPUやGPUで動かす代表的な推論エンジン。</p></div>
      <div class="card"><h3>Ollama</h3><p>モデルの取得や実行、API化を簡単に扱えるローカルLLM環境。</p></div>
      <div class="card"><h3>LM Studio</h3><p>モデル検索・ダウンロード・チャット・ローカルAPIなどをGUIで扱いやすくしたアプリ。</p></div>
    </div>

    <h2>量子化とは？</h2>
    <p>高性能なLLMは、そのままだと非常に大きなメモリを必要とします。そこでモデルの数値表現を軽くして容量を減らすのが<b>量子化</b>です。</p>
    <p>イメージとしては「巨大な高画質画像を、見た目をなるべく保ちながら圧縮する」ことに近いです。Q4、Q5、Q8、4bitなどの表記をよく見かけます。</p>
    <p>強く圧縮するほど必要メモリは減りますが、精度が少し低下する場合があります。</p>

    <h2>GGUFとは？</h2>
    <p><b>GGUF</b>は、llama.cpp系のランタイムで広く使われているモデルファイル形式です。ローカルLLMでは、量子化済みGGUFをダウンロードして使う方法がとても一般的です。</p>

    <h2>VRAMとRAM</h2>
    <div class="grid">
      <div class="card"><h3>VRAM</h3><p>GPUに搭載されている高速な専用メモリ。モデルをGPUへ多く載せられるほど高速に動かしやすくなります。</p></div>
      <div class="card"><h3>RAM</h3><p>PC本体のメモリ。VRAMへ収まりきらないモデルの一部をRAM側で扱う構成もあります。</p></div>
    </div>

    <h2>結局、何があれば始められる？</h2>
    <p>初心者なら、最初は難しく考えなくても大丈夫です。</p>
    <div class="notice">
      <b>① LM Studioなどをインストール</b><br>
      ↓<br>
      <b>② 自分のPCで動かせるモデルを選ぶ</b><br>
      ↓<br>
      <b>③ ダウンロードしてチャットする</b>
    </div>
    <p>慣れてきたら、量子化方式、コンテキスト長、GPUオフロード、API、エージェントなどを少しずつ覚えていけば十分です。</p>

    <h2>次に読む</h2>
    <p><a href="#/guide/models">現在の主要ローカルLLMモデルを見る →</a></p>
  </article>`
},
{
  route:"#/guide/models",
  title:"主要ローカルLLMモデル",
  summary:"2026年8月時点で注目されている主要なオープンウェイト／ローカルLLMモデルを初心者向けに紹介します。",
  keywords:["Gemma 4","Qwen3.8","DeepSeek V4","Mistral Small 4","Nemotron 3.5","Llama 4","MiniMax M2.1","Kimi K2.5","gpt-oss"],
  html:`<article class="article">
    <h1>主要ローカルLLMモデル</h1>
    <div class="meta">基準日: 2026-08-26</div>
    <p class="lead">ローカルLLMで名前を見かけることが多い主要モデルを、特徴と「どのくらいローカル向きか」という観点から紹介します。ここではファミリー全体ではなく、現在注目度の高い代表モデルを中心に扱います。</p>

    <div class="notice"><b>注意</b><br>
    「オープンウェイト＝普通のPCで簡単に動く」とは限りません。数百B〜1T級の巨大モデルは、量子化しても非常に大きく、高性能GPUや複数GPU、巨大RAM構成が必要になることがあります。</div>

    <h2>比較早見表</h2>
    <div class="grid">
      <div class="card"><h3>Gemma 4 12B</h3><span class="badge">ローカル向き: 高</span><span class="badge">マルチモーダル</span><p>Google。12Bのdenseモデル。画像・音声を扱え、16GB級のVRAM/統合メモリを意識したローカルAIモデル。</p></div>
      <div class="card"><h3>Qwen3.8 27B</h3><span class="badge">ローカル向き: 高</span><span class="badge">画像+テキスト</span><p>Qwen。27B級で、量子化版の選択肢が豊富。チャット、創作、コード、画像理解まで幅広く使われる。</p></div>
      <div class="card"><h3>gpt-oss-20b</h3><span class="badge">ローカル向き: 高</span><span class="badge">推論</span><p>OpenAI。21B総パラメータ、3.6B active。公式に16GBメモリでのローカル利用を想定。</p></div>
      <div class="card"><h3>Nemotron 3.5 Lightning</h3><span class="badge">ローカル向き: 高〜中</span><span class="badge">30B / 3B active</span><p>NVIDIA。高速なエージェント用途を重視。公式にRTX 5090 + GGUF Q4_K_M構成が案内されている。</p></div>
      <div class="card"><h3>Llama 4 Scout</h3><span class="badge">ローカル向き: 中〜低</span><span class="badge">MoE</span><p>Meta。109B総パラメータ、17B active。画像対応と非常に長いコンテキストが特徴。</p></div>
      <div class="card"><h3>Mistral Small 4</h3><span class="badge">ローカル向き: 低</span><span class="badge">119B / 約6B active</span><p>Mistral AI。会話・推論・画像・コーディングを1モデルへ統合。高性能だが公式推奨構成はサーバー級。</p></div>
      <div class="card"><h3>DeepSeek V4-Flash</h3><span class="badge">ローカル向き: 低</span><span class="badge">284B / 13B active</span><p>DeepSeek。1Mコンテキストとエージェント能力を重視。重みは公開されるが家庭用PCにはかなり大きい。</p></div>
      <div class="card"><h3>MiniMax M2.1</h3><span class="badge">ローカル向き: 低</span><span class="badge">229B</span><p>MiniMax。コーディング、ツール利用、長い手順をこなすエージェント用途が中心。ローカル配備ガイドも公開。</p></div>
      <div class="card"><h3>Kimi K2.5</h3><span class="badge">ローカル向き: 低</span><span class="badge">1T / 32B active</span><p>Moonshot AI。画像理解とエージェント用途を統合した巨大MoEモデル。ネイティブINT4量子化に対応。</p></div>
    </div>

    <h2>Gemma 4</h2>
    <p><b>Gemma 4</b>はGoogleのオープンモデルファミリーです。代表的なGemma 4 12Bはdense型のマルチモーダルモデルで、画像だけでなく音声入力にも対応します。Googleは16GBのVRAMまたは統合メモリを持つノートPC級でもローカル実行できるサイズとして紹介しています。</p>
    <p>「巨大モデルは難しいけれど、画像・音声・エージェント的な機能も試したい」という人に特に分かりやすい候補です。</p>
    <div class="sourcebox"><b>公式情報</b><br>
      <a target="_blank" rel="noopener" href="https://developers.googleblog.com/gemma-4-12b-the-developer-guide/">Google: Gemma 4 12B Developer Guide</a>
    </div>

    <h2>Qwen3.8</h2>
    <p><b>Qwen3.8</b>はQwenチームの現行主要ファミリーです。27B版は画像とテキストを扱うモデルとして公開され、Apache 2.0ライセンスです。Hugging Faceでは公式27Bモデルに加えて、多数のGGUFや低精度量子化版が作られており、ローカルLLM界隈で非常に使いやすいモデルの一つです。</p>
    <p>文章生成、創作、コード、画像理解などを1つのモデルで幅広く試したい人に向いています。</p>
    <div class="sourcebox"><b>公式情報</b><br>
      <a target="_blank" rel="noopener" href="https://huggingface.co/collections/Qwen/qwen38">Qwen3.8 Official Collection</a>
    </div>

    <h2>gpt-oss</h2>
    <p><b>gpt-oss-20b / 120b</b>はOpenAIのオープンウェイト推論モデルです。20bは21B総パラメータ・約3.6B activeで、公式に16GBメモリでのローカル利用を想定しています。120bは117B総パラメータ・約5.1B activeで、単一80GB GPUを想定する上位版です。</p>
    <p>テキスト専用ですが、推論、ツール利用、エージェント用途を重視しており、llama.cpp、Ollama、LM Studioなど幅広いローカル環境に対応しています。</p>
    <div class="sourcebox"><b>公式情報</b><br>
      <a target="_blank" rel="noopener" href="https://openai.com/index/introducing-gpt-oss/">OpenAI: Introducing gpt-oss</a>
    </div>

    <h2>NVIDIA Nemotron 3.5 Lightning</h2>
    <p><b>Nemotron 3.5 Lightning 30B A3B</b>は、30B総パラメータのうち約3Bを動かすMoE系モデルです。長時間動き続けるエージェントや、特定作業を高速にこなすサブエージェントを強く意識しています。</p>
    <p>NVIDIAはGGUF Q4_K_MならRTX 5090上でllama.cppを使った単一GPU実行を案内しており、最新の高性能PCで試しやすい大型モデルの一つです。</p>
    <div class="sourcebox"><b>公式情報</b><br>
      <a target="_blank" rel="noopener" href="https://developer.nvidia.com/topics/ai/nemotron">NVIDIA Nemotron</a>
    </div>

    <h2>Llama 4</h2>
    <p><b>Llama 4 Scout / Maverick</b>はMetaのネイティブマルチモーダルMoEモデルです。Scoutは109B総パラメータ・17B activeで最大10Mコンテキスト、Maverickは約400B総パラメータ・17B activeです。</p>
    <p>ローカルLLMとしてはかなり大型で、一般的な16〜24GB GPUよりもハイエンド構成向けです。ScoutはMeta公式ではInt4で単一H100に収まるとされています。</p>
    <div class="sourcebox"><b>公式情報</b><br>
      <a target="_blank" rel="noopener" href="https://ai.meta.com/blog/llama-4-multimodal-intelligence/">Meta: The Llama 4 herd</a>
    </div>

    <h2>Mistral Small 4</h2>
    <p><b>Mistral Small 4</b>は、会話、推論、エージェント型コーディング、画像理解を一つにまとめた119B総パラメータ・約6B activeのMoEモデルです。256Kコンテキストを持ち、Apache 2.0で公開されています。</p>
    <p>名前はSmallですが、公式の最小構成は複数のH100/H200級GPUで、家庭用PCから見るとかなり大型です。</p>
    <div class="sourcebox"><b>公式情報</b><br>
      <a target="_blank" rel="noopener" href="https://mistral.ai/news/mistral-small-4/">Mistral AI: Introducing Mistral Small 4</a>
    </div>

    <h2>DeepSeek V4</h2>
    <p><b>DeepSeek V4</b>にはProとFlashがあり、Flashは284B総パラメータ・13B active、Proは1.6T総パラメータ・49B activeと非常に巨大です。1Mコンテキストを標準とし、エージェントやコーディング能力を重視しています。</p>
    <p>オープンウェイトではありますが、家庭用の単一GPUで気軽に動かすモデルというより、大容量RAM・複数GPU・高度な量子化を使う上級者向けです。</p>
    <div class="sourcebox"><b>公式情報</b><br>
      <a target="_blank" rel="noopener" href="https://api-docs.deepseek.com/news/news260424/">DeepSeek: V4 Preview Release</a>
    </div>

    <h2>MiniMax M2.1</h2>
    <p><b>MiniMax M2.1</b>はコーディング、ツール利用、指示追従、長い手順をこなすエージェント用途を強く意識した229B級モデルです。重みが公開され、SGLang、vLLM、Transformers、KTransformersなどでのローカル配備ガイドも用意されています。</p>
    <p>量子化版も存在しますが、モデル自体が非常に大きいため、主に高性能ワークステーション向けです。</p>
    <div class="sourcebox"><b>公式情報</b><br>
      <a target="_blank" rel="noopener" href="https://huggingface.co/MiniMaxAI/MiniMax-M2.1">MiniMax M2.1 Official Model Card</a>
    </div>

    <h2>Kimi K2.5</h2>
    <p><b>Kimi K2.5</b>はMoonshot AIのネイティブマルチモーダル・エージェントモデルです。1T総パラメータ・32B activeという巨大MoE構成で、256Kコンテキスト、画像理解、コーディング、ツール利用を統合しています。</p>
    <p>ネイティブINT4量子化を採用していますが、それでも非常に大規模なため、ローカルでは上級者・サーバー環境向けです。</p>
    <div class="sourcebox"><b>公式情報</b><br>
      <a target="_blank" rel="noopener" href="https://huggingface.co/moonshotai/Kimi-K2.5">Kimi K2.5 Official Model Card</a>
    </div>

    <h2>どれを選べばいい？</h2>
    <div class="grid">
      <div class="card"><h3>まず試したい</h3><p>Gemma 4 12B、Qwen3.8 27B、gpt-oss-20bなど、量子化して一般的な高性能PCで扱いやすいモデルから。</p></div>
      <div class="card"><h3>RTX 5090級</h3><p>Nemotron 3.5 Lightningなど、最新GPU向け最適化が明確なモデルも候補。</p></div>
      <div class="card"><h3>超大型モデルを試したい</h3><p>Llama 4、Mistral Small 4、DeepSeek V4、MiniMax、Kimiなど。複数GPUや大容量RAMを想定。</p></div>
    </div>
  </article>`
},
{
  route:"#/about",
  title:"このサイトについて",
  summary:"Local LLM Wikipediaの目的、自動更新の仕組み、編集方針、AI要約の扱いについて説明します。",
  keywords:["サイトについて","運営","編集方針","自動更新","GitHub Actions","Gemini","出典","免責事項"],
  html:`<article class="article">
    <h1>このサイトについて</h1>
    <p class="lead"><b>Local LLM Wikipedia</b>は、変化の速いローカルLLMの世界を「あとから調べやすい形」で記録するための、日本語の知識ベースです。</p>

    <h2>このサイトの目的</h2>
    <p>ローカルLLMの情報は、GitHub、Hugging Face、公式ブログ、SNSなど多くの場所に分散しています。さらに更新が非常に速いため、「今どのモデルがあるのか」「この更新は自分に関係するのか」が分かりにくくなりがちです。</p>
    <p>そこで本サイトでは、重要な情報を自動収集し、初心者にも読める日本語に整理して蓄積します。</p>

    <h2>何を掲載する？</h2>
    <div class="grid">
      <div class="card"><h3>主要モデル</h3><p>Gemma、Qwen、Llama、DeepSeek、Mistral、Nemotronなどの重要な新規公開・大型更新。</p></div>
      <div class="card"><h3>ローカル実行環境</h3><p>LM Studio、Ollama、llama.cppなどの大きな変更。</p></div>
      <div class="card"><h3>高速化・軽量化</h3><p>GGUF、量子化、CUDA、ROCm、Vulkan、Metal、GPUオフロードなど。</p></div>
    </div>

    <h2>自動更新の仕組み</h2>
    <p>GitHub Actionsが毎日定期的に公式ソースを巡回し、新着情報を収集します。その後、掲載価値を判定して重要なニュースを最大5件程度に絞り、日本語に整理してWikiへ反映します。</p>
    <div class="notice">
      公式情報を収集<br>↓<br>
      重複を除外<br>↓<br>
      重要度を判定<br>↓<br>
      Geminiで日本語要約<br>↓<br>
      GitHub Pagesへ自動公開
    </div>

    <h2>編集方針</h2>
    <p>公式ブログ、公式GitHub Releases、開発元のモデルカードなどの<b>一次情報を最優先</b>します。出所不明の噂、リーク、検証できない性能値は原則として掲載しません。</p>
    <p>細かなCI修正、typo、ドキュメント変更、影響の小さいnightlyなどは除外し、「ローカルLLM利用者にとって意味のある変化」を優先します。</p>

    <h2>AIによる要約について</h2>
    <p>ニュース記事の整理・日本語要約にはGemini APIを利用しています。AIは入力された公式情報をもとに要点を短く整理しますが、誤解や要約ミスが起きる可能性はあります。</p>
    <p>重要な設定変更やモデル導入を行う場合は、各記事に掲載している<b>公式出典を必ず確認</b>してください。</p>

    <h2>初心者向け情報も扱います</h2>
    <p>このサイトは詳しい利用者だけを対象にしていません。「LLMって何？」「モデルって何？」「自分のPCで動くの？」という段階から読めるページも増やしていきます。</p>
    <p><a href="#/guide/basics">はじめてのローカルLLM →</a></p>

    <h2>更新頻度</h2>
    <p>ニュース収集は原則として毎日実行されます。ただし、重要な新情報がない日は記事を無理に追加しません。</p>

    <h2>免責事項</h2>
    <p>本サイトは技術情報の整理を目的としており、掲載内容の正確性・完全性を保証するものではありません。ソフトウェアやモデルの利用条件、ライセンス、ハードウェア要件は変更される場合があります。</p>

    <div class="sourcebox"><b>プロジェクト</b><br>
      <a target="_blank" rel="noopener" href="https://github.com/minato-gif/local-llm-wikipedia">GitHub: minato-gif/local-llm-wikipedia</a>
    </div>
  </article>`
}
];
