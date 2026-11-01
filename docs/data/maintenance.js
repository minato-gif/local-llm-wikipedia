window.MAINTENANCE = {
  "#/guide/models": {
    "title": "主要ローカルLLMモデル",
    "first_published": "2026-08-26",
    "cadence_days": 30,
    "last_researched": "2026-11-01",
    "last_updated": "2026-11-01",
    "update_count": 3,
    "facts": [
      "Mistral AIが1兆パラメータのオープンウェイト・マルチモーダルモデル「Mistral Large 4 (Le Chonk)」を公開した。",
      "Ollama v0.40.8〜v0.40.12がリリースされ、コーディング特化MoEモデル「Flint」やLiquid AIのトライハイブリッド「LFM3」シリーズ、d1決定モデルのサポートが追加された。",
      "GoogleのGemmaベースのMoEモデル「FINAL-Bench/POCKET-26B-GGUF」や、180Bの大規模MoE「POCKET-Darwin-180B-GGUF」などの新しいGGUFモデルが公開された。",
      "Ternary-Bonsai-2-27Bなどの三値量子化モデルをベースにした非検閲版LoRAや、MTPヘッド統合モデル、MLX形式への変換版が複数登場した。"
    ],
    "latest_findings": "今回の再調査期間において、ローカルLLMおよび関連エコシステムには複数の重要な進展が見られました。まず、Mistral AIから1兆パラメータ規模のフラグシップ・マルチモーダルオープンウェイトモデル「Mistral Large 4」が公開され、セルフホスト運用の選択肢が大きく広がりました。また、ランタイム側ではOllamaがv0.40.x台のアップデートを重ね、コーディング向けMoE「Flint」やLiquid AIの「LFM3」シリーズ、決定モデルなどの新アーキテクチャのサポートを追加しています。さらに、GoogleのGemmaやPrism MLの三値量子化モデル「Ternary-Bonsai-2」系列をベースにした多様なGGUF量子化バリアント、アブリレーション済みモデル、MTPヘッド統合版、およびMLX形式の派生版が多数公開され、オンデバイスや多様なハードウェア環境での実行効率がさらに向上しています。",
    "research_history": [
      {
        "date": "2026-08-31",
        "changed": true,
        "changes": [
          "定期調査による内容更新"
        ]
      },
      {
        "date": "2026-10-01",
        "changed": true,
        "changes": [
          "定期調査による内容更新"
        ]
      },
      {
        "date": "2026-11-01",
        "changed": true,
        "changes": [
          "定期調査による内容更新"
        ]
      }
    ]
  },
  "#/guide/compare": {
    "title": "主要ローカルLLMモデル比較",
    "first_published": "2026-08-26",
    "cadence_days": 30,
    "last_researched": "2026-11-01",
    "last_updated": "2026-11-01",
    "update_count": 3,
    "facts": [
      "Mistral AIが1兆パラメータのネイティブ・マルチモーダルモデル「Mistral Large 4（Le Chonk）」のオープンウェイト版を公開し、コストと性能のバランスを調整できる3つの推論モードを備える。",
      "Ollama v0.40.8およびv0.40.12がリリースされ、コーディング特化のMoEモデル「Flint」やLiquid AIのトライハイブリッドアーキテクチャモデル「LFM3」シリーズ、d1意思決定モデルのサポートが追加された。",
      "KoboldCpp v1.124がリリースされ、audio.cpp統合によりYuE2による音楽生成機能やBreezeTTS 2、Qwen3-TTSなどの音声合成機能が利用可能になった。",
      "GoogleのGemmaベースのMoEモデル「FINAL-Bench/POCKET-26B-GGUF」や、約180Bパラメータの大規模な「FINAL-Bench/POCKET-Darwin-180B-GGUF」などのGGUFモデルが公開された。",
      "三値量子化ベースモデル「Ternary-Bonsai-2-27B」およびその派生版について、拒絶方向を解除したLoRAアダプターやMTPドラフトヘッドをバンドルした効率的なGGUF版・MLX形式版の公開が相次いだ。"
    ],
    "latest_findings": "今回の調査期間では、大規模なオープンウェイトモデルの公開やランタイムの主要なアップデートが確認されました。モデル面では、Mistral AIが1兆パラメータを持つマルチモーダルモデル「Mistral Large 4」を公開したほか、GemmaベースのMoEモデル「POCKET-26B-GGUF」や大型の「POCKET-Darwin-180B-GGUF」などが登場しています。また、三値量子化モデル「Ternary-Bonsai-2-27B」関連の改良版や非検閲化LoRA、MTPヘッドを統合したGGUF版が多数公開されました。ランタイム関連では、Ollamaがv0.40.8およびv0.40.12をリリースし、コーディング特化の「Flint」やLiquid AIの「LFM3」シリーズ、d1意思決定モデルへの対応を進めました。さらにKoboldCpp v1.124ではaudio.cppが統合され、YuE2による音楽生成や各種音声合成機能が新たにサポートされるなど、ローカル実行エコシステム全体の機能拡張が進んでいます。",
    "research_history": [
      {
        "date": "2026-08-31",
        "changed": true,
        "changes": [
          "定期調査による内容更新"
        ]
      },
      {
        "date": "2026-10-01",
        "changed": true,
        "changes": [
          "定期調査による内容更新"
        ]
      },
      {
        "date": "2026-11-01",
        "changed": true,
        "changes": [
          "定期調査による内容更新"
        ]
      }
    ]
  },
  "#/guide/hardware": {
    "title": "自分のPCでどのモデルが動く？",
    "first_published": "2026-08-26",
    "cadence_days": 30,
    "last_researched": "2026-11-01",
    "last_updated": "2026-11-01",
    "update_count": 3,
    "facts": [
      "llama.cpp v0.6.0がリリースされ、GLM-5.3-Flashなどの新モデルサポートや拡張バッチAPI「llama_batch_ext」が実装された",
      "KoboldCpp v1.124がリリースされ、YuE2による音楽生成やBreezeTTS 2、Qwen3-TTSなどの音声合成・音楽生成機能が統合された",
      "PrismMLなどの3値量子化モデル「Ternary Bonsai 2 27B」およびその派生・量子化バリアント（MTPヘッド統合版やApple Silicon向けMLX形式など）の公開が広がった",
      "Laguna-XS-2.1 APEX GGUFやK2-Horizon-MoVA-36B-A4Bなど、MoEや長コンテキストを持つ新モデルのGGUF量子化版が多数登場した"
    ],
    "latest_findings": "直近の調査期間において、ローカルLLMを取り巻くランタイムやモデルのエコシステムに重要なアップデートが確認されました。まず、llama.cppはv0.6.0にアップデートされ、GLM-5.3-Flashのサポートや拡張バッチAPIが追加されています。また、KoboldCppはv1.124へ更新され、audio.cpp統合によるYuE2を用いた音楽生成やQwen3-TTS等の音声合成機能が利用可能になりました。モデル面では、PrismMLの3値量子化モデル「Ternary Bonsai 2 27B」およびその派生バリアント（MTP対応版やApple Silicon向けMLX形式など）の公開が活発化しているほか、Laguna-XS-2.1 APEXやK2-Horizon-MoVA-36B-A4BといったMoE・長コンテキストモデルのGGUF量子化版も登場し、自分のPCで実行可能な選択肢やハードウェア要件の幅がさらに広がっています。",
    "research_history": [
      {
        "date": "2026-08-31",
        "changed": true,
        "changes": [
          "定期調査による内容更新"
        ]
      },
      {
        "date": "2026-10-01",
        "changed": true,
        "changes": [
          "定期調査による内容更新"
        ]
      },
      {
        "date": "2026-11-01",
        "changed": true,
        "changes": [
          "定期調査による内容更新"
        ]
      }
    ]
  },
  "#/guide/download": {
    "title": "モデルをダウンロードするとき何を選べばいい？",
    "first_published": "2026-08-26",
    "cadence_days": 30,
    "last_researched": "2026-11-01",
    "last_updated": "2026-11-01",
    "update_count": 3,
    "facts": [
      "Mistral AIより、1兆パラメータ規模を持つオープンウェイト・マルチモーダルモデル「Mistral Large 4」が公開された",
      "GemmaベースのMoEモデル「FINAL-Bench/POCKET-26B-GGUF」および180Bの大規模モデル「FINAL-Bench/POCKET-Darwin-180B-GGUF」が公開された",
      "Liquid AIのトライハイブリッドアーキテクチャを採用した小型モデル「LFM3」シリーズやコーディング用MoEモデル「Flint」などがOllamaでサポートされた",
      "三値量子化モデル「Ternary-Bonsai-2-27B」に関して、拒否反応を除去したアブリレーション版や非検閲化LoRAアダプター、Apple Silicon向けMLX形式などの派生版が多数公開された",
      "KoboldCpp v1.124がリリースされ、audio.cpp統合による音楽生成（YuE2）や音声合成（BreezeTTS 2、Qwen3-TTS等）機能が追加された"
    ],
    "latest_findings": "今回の再調査では、オープンウェイトの超大型モデルから小型の効率的モデルまで幅広い新規モデルとランタイムのアップデートが確認されました。まずMistral AIから1兆パラメータ規模のマルチモーダルモデル「Mistral Large 4」が公開され、ローカル展開の選択肢がさらに広がりました。また、GoogleのGemmaベースのMoEモデルであるPOCKETファミリー（26Bおよび180B）のGGUF版や、三値量子化された「Ternary-Bonsai-2-27B」シリーズの非検閲版・LoRAアダプター、MLX形式への対応が進んでいます。ランタイム関連では、Ollamaがv0.40.x台へアップデートされ、Liquid AIのLFM3シリーズやコーディング用MoE「Flint」などの新アーキテクチャをサポートしました。さらに、KoboldCpp v1.124ではaudio.cppの統合により音楽生成や音声合成機能が新たに利用可能になるなど、ローカル環境における実行の幅が大きく拡張されています。",
    "research_history": [
      {
        "date": "2026-08-31",
        "changed": true,
        "changes": [
          "定期調査による内容更新"
        ]
      },
      {
        "date": "2026-10-01",
        "changed": true,
        "changes": [
          "定期調査による内容更新"
        ]
      },
      {
        "date": "2026-11-01",
        "changed": true,
        "changes": [
          "定期調査による内容更新"
        ]
      }
    ]
  },
  "#/guide/troubleshoot": {
    "title": "トラブルシューティング",
    "first_published": "2026-08-26",
    "cadence_days": 30,
    "last_researched": "2026-11-01",
    "last_updated": "2026-11-01",
    "update_count": 3,
    "facts": [
      "KoboldCpp v1.124がリリースされ、audio.cpp統合によるYuE2音楽生成やBreezeTTS 2、Qwen3-TTSなどの音声合成機能に対応した",
      "Ollama v0.40.12がリリースされ、Liquid AIのLFM3モデルシリーズやd1意思決定モデルのサポート、Apple SiliconでのGemma 4などの高速化が行われた",
      "Ollama v0.40.5〜v0.40.10にて、NVIDIA Nemotron 3.5シリーズ（Super / Bolt）やコーディング向けMoEモデル「Flint」のサポートが追加された",
      "llama.cpp v0.6.0がリリースされ、拡張バッチAPI「llama_batch_ext」の追加やGLM-5.3-Flash等の新モデル、意思決定モデル向けサーバーAPIの実装が行われた"
    ],
    "latest_findings": "直近の再調査期間において、主要なローカルLLMランタイムおよびモデル関連で重要なアップデートが多数確認されました。KoboldCpp v1.124ではaudio.cppが統合され、YuE2による音楽生成やBreezeTTS 2、Qwen3-TTSといった音声合成・クローン機能が利用可能になりました。Ollamaはv0.40.x系へのアップデートを重ね、v0.40.5でNVIDIA Nemotron 3.5シリーズ、v0.40.8でコーディング向けMoEモデル「Flint」、v0.40.12でLiquid AIのLFM3シリーズおよびd1意思決定モデルのサポートを順次追加しています。また、バックエンドであるllama.cppもv0.6.0へとメジャーアップデートされ、拡張バッチAPI「llama_batch_ext」の導入や意思決定モデル向けサーバーAPIの実装など、推論効率と機能拡張が進められています。",
    "research_history": [
      {
        "date": "2026-08-31",
        "changed": true,
        "changes": [
          "定期調査による内容更新"
        ]
      },
      {
        "date": "2026-10-01",
        "changed": true,
        "changes": [
          "定期調査による内容更新"
        ]
      },
      {
        "date": "2026-11-01",
        "changed": true,
        "changes": [
          "定期調査による内容更新"
        ]
      }
    ]
  },
  "#/guide/glossary": {
    "title": "ローカルLLM用語集",
    "first_published": "2026-08-26",
    "cadence_days": 90,
    "last_researched": "2026-08-31",
    "last_updated": "2026-08-31",
    "update_count": 1,
    "facts": [
      "KoboldCpp v1.120がリリースされ、DirectIO（--usedirectio）対応によるmlockとmmapの併用が可能になり、Qwen3.8-Flash-NextやLing-3.0-flashモデルがサポートされた",
      "llama.cpp v0.3.0がリリースされ、dots3-noteやGLM-4.5-AirのMTP対応、DeepSeek 4向けテンソル分割、Metalカーネルの最適化が行われた",
      "NVIDIA Nemotron-3.5-Lightning-30B-A3BのGGUF版がggml-orgより公開され、ローカル環境での効率的な推論に対応した"
    ],
    "latest_findings": "直近の調査期間において、ローカルLLM関連の主要ツールおよびモデルに重要なアップデートが確認されました。ランタイム側では、KoboldCpp v1.120がリリースされ、DirectIOによるモデルロード機能（mlockとmmapの併用）が追加されたほか、Qwen3.8-Flash-NextやLing-3.0-flashなどの新モデル形式がサポートされました。また、llama.cpp v0.3.0では、dots3-noteやGLM-4.5-AirのMTP（複数トークン予測）対応、DeepSeek 4向けテンソル分割、Metal環境での並列コンパイルによるカーネル最適化が実装されています。モデル側では、NVIDIAのNemotron-3.5-Lightning-30B-A3BのGGUF版が公開され、ローカル環境での実行互換性が強化されています。",
    "research_history": [
      {
        "date": "2026-08-31",
        "changed": true,
        "changes": [
          "定期調査による内容更新"
        ]
      }
    ]
  }
};
