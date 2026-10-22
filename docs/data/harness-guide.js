window.STATIC_PAGES = window.STATIC_PAGES || [];

window.STATIC_PAGES.push({
  route:"#/guide/harnesses",
  title:"ハーネスとは？ Strataなど6アプリの比較・選び方",
  summary:"モデル実行と作業管理の違いから、Strata、Bionic、OpenCode、Cline、Aider、Gooseを比較します。ローカル接続・権限・外部通信を確認するガイドです。",
  keywords:["ハーネス","Strata","Bionic","OpenCode","Cline","Aider","Goose","エージェント"],
  html:`<article class="article">
    <h1>ハーネスとは？ Strataなど6アプリの比較・選び方</h1>
    <p class="lead">モデルが文章を返すだけでなく、ファイルを調べ、編集し、テスト結果を見て次の作業を考える。その一連の動作を支える仕組みが「エージェント・ハーネス」です。このカテゴリでは、ハーネスを備えた、利用者が直接使えるアプリを紹介します。</p>
    <p class="compare-note">公式資料の調査日: 2026年10月22日。以下は機能・接続方法を資料から整理した比較です。インストールや作業品質の実測比較は行っておらず、順位や性能保証を示すものではありません。</p>

    <h2>モデル・推論エンジン・ハーネスの違い</h2>
    <div class="table-wrap"><table class="compare-table">
      <thead><tr><th scope="col">役割</th><th scope="col">担当すること</th><th scope="col">見分けるポイント</th></tr></thead>
      <tbody>
        <tr><th scope="row">モデル</th><td>入力から回答やツール実行の指示を生成する</td><td>学習済みの重み。モデル単体が直接PCを操作するわけではない</td></tr>
        <tr><th scope="row">推論エンジン／サーバー</th><td>モデルを読み込み、生成処理を行い、APIなどで応答する</td><td>Ollama・llama.cppなど。モデルを動かす側</td></tr>
        <tr><th scope="row">ハーネス</th><td>会話の文脈、ツール実行、権限、結果の受渡し、作業の継続を管理する</td><td>「調べる→実行する→結果を見る」をつなぐ側。単なるチャット画面とは異なる</td></tr>
      </tbody>
    </table></div>
    <p>「ハーネス」は単一の製品規格ではなく、含まれる機能も製品ごとに違います。ひとつのアプリが複数の役割を持つ場合もあります。Strataは推論基盤と内蔵エージェントを備えるため、ハーネスとしての面と、他アプリへモデルを提供する面を分けて紹介します。<a href="https://www.anthropic.com/research/effective-harnesses-for-long-running-agents" target="_blank" rel="noopener noreferrer">Anthropicの技術解説</a>も、ツール利用や文脈管理を備える実行基盤としてハーネスを説明しています。</p>

    <h2>6アプリを役割で比べる</h2>
    <div class="table-wrap"><table class="compare-table">
      <caption>公式資料に基づく機能比較。用途欄は当サイトによる選び方の提案です。</caption>
      <thead><tr><th scope="col">アプリ・個別記事</th><th scope="col">役割／使い方</th><th scope="col">ローカル推論</th><th scope="col">導入直後の確認</th></tr></thead>
      <tbody>
        <tr><th scope="row"><a href="/articles/2026-10-22-strata-harness/">Strata</a></th><td>推論エンジンと作業エージェントをまとめて用意したい</td><td>内蔵エンジン。外部アプリへAPIも提供</td><td>対応GPU・メモリ条件、Manual／Plan／Bypass</td></tr>
        <tr><th scope="row"><a href="/articles/2026-10-22-bionic-harness/">LM Studio Bionic</a></th><td>画面からコード・文書・ファイルの作業を頼みたい</td><td>Localを選ぶ。Remote／Cloudとは別</td><td>推論先、Allow coding、対象フォルダ</td></tr>
        <tr><th scope="row"><a href="/articles/2026-10-22-opencode-harness/">OpenCode</a></th><td>推論基盤と作業用アプリを独立して選びたい</td><td>LM Studio・Ollama・llama.cpp等へ接続</td><td>利用中の版、操作のallow／ask／deny</td></tr>
        <tr><th scope="row"><a href="/articles/2026-10-22-cline-harness/">Cline</a></th><td>計画と実行を切り替え、承認しながら進めたい</td><td>Ollama・LM Studio等へ接続</td><td>Plan／Act、自動承認の範囲</td></tr>
        <tr><th scope="row"><a href="/articles/2026-10-22-aider-harness/">Aider</a></th><td>ターミナルで対象ファイルとGit差分を見ながら修正したい</td><td>Ollama等へ接続</td><td>対象ファイル、文脈長、Gitの変更内容</td></tr>
        <tr><th scope="row"><a href="/articles/2026-10-22-goose-harness/">Goose</a></th><td>モデルと拡張ツールを組み合わせたい</td><td>Ollama・LM Studio等へ接続</td><td>既定の自律モード、拡張ごとの権限</td></tr>
      </tbody>
    </table></div>
    <p>LM Studio本体はモデル管理・チャット・API提供を担い、MCPツールも利用できますが、Bionicは別アプリです。「LM Studioが入っている」と「Bionicの作業エージェントを使っている」は同じではありません。<a href="https://lmstudio.ai/docs/app" target="_blank" rel="noopener noreferrer">LM Studio本体の公式資料</a>と<a href="https://lmstudio.ai/docs/bionic" target="_blank" rel="noopener noreferrer">Bionicの公式資料</a>を分けて確認してください。</p>

    <h2>選ぶ順番</h2>
    <ol>
      <li><b>任せる仕事をひとつ決める。</b> コード修正、文書整理、調査など、最初に試す課題を小さくします。</li>
      <li><b>モデル実行側を決める。</b> 内蔵エンジンか、既存のOllama・LM Studioなどかを選びます。モデルがメモリに収まるかは<a href="/guide/hardware/">ハードウェアガイド</a>も参照してください。</li>
      <li><b>作業権限と通信を確認する。</b> 編集・コマンド・Web・追加ツールを分け、最初は必要な範囲だけ許可します。</li>
      <li><b>同じ課題で結果を比べる。</b> 単に応答したかではなく、差分が正しいか、テストに通るか、人の修正が何回必要かを見ます。</li>
    </ol>

    <h2>「ローカルだから安全」とは限らない</h2>
    <div class="content-callout"><b>推論先と、操作できる範囲は別です。</b><br>ローカルモデルでも、エージェントにはファイルの変更やコマンド実行ができます。また、Web検索・MCP・外部APIなどを使えば端末外との通信が発生し得ます。承認機能は、OSやコンテナによる隔離と同じではありません。</div>
    <ul>
      <li>最初は複製した作業フォルダを使い、認証情報や重要な原本を渡さない。</li>
      <li>モデル名と推論先を確認する。localhostのAPIでも、その先がクラウド推論の場合がある。</li>
      <li>全操作の自動承認を急いで有効にせず、実行内容と差分を確認する。</li>
      <li>外部の文書やWebページに含まれる命令を、作業指示として実行していないか注意する。</li>
      <li>変更後にテストを行う。モデルの「完了しました」だけを完了条件にしない。</li>
    </ul>

    <h2>この比較で分からないこと</h2>
    <p>同じモデルでも量子化、コンテキスト長、ツール形式、アプリ側の指示で結果は変わります。本調査だけでは最速・最高品質のアプリは決められません。価格、対応OS、インストーラー、機能は更新されるため、導入時には各記事末尾の公式資料で再確認してください。</p>
    <p><a href="/category/harnesses/">ハーネスの個別記事を読む</a> · <a href="/guide/troubleshoot/">接続やメモリで困ったとき</a></p>
  </article>`
});
