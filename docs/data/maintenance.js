window.MAINTENANCE = {
  "#/guide/models": {
    "title": "主要ローカルLLMモデル",
    "first_published": "2026-08-26",
    "cadence_days": 30,
    "last_researched": "2026-10-01",
    "last_updated": "2026-10-01",
    "update_count": 2,
    "facts": [
      "llama.cpp v0.4.1がリリースされ、Maple 20B-A1BやTencent Hy 4、Spark2.5のサポート追加、ggml v0.24.0への更新、API変更などが実施された。",
      "Ollama v0.35.0がリリースされ、Jev APIベースの意思決定モデル（Bespoke Labs Nimbleなど）のサポートが追加された。",
      "Qwen3.8-27Bをベースに三値量子化（1.76 bit/weight）と262Kコンテキストに対応した「Ternary Bonsai 2 27B」およびその各種派生・MTPヘッド統合モデルが公開された。",
      "GLM-5.3-Flashの非検閲版（abliterated）や、PrismML等の三値化モデルを活用した各種GGUFモデルが複数登場した。"
    ],
    "latest_findings": "今回の調査期間では、ローカルLLMランタイムの主要なアップデートおよび新規モデル・量子化方式の展開が確認されました。まず、llama.cpp v0.4.1がリリースされ、Maple 20B-A1BやTencent Hy 4などの新規モデルアーキテクチャへの対応と、ggml v0.24.0への更新が行われました。また、Ollama v0.35.0ではJev APIベースの決定モデルサポートが追加されています。モデル面では、Qwen3.8-27Bを基盤に重みを{-1, 0, +1}の三値に制限して大幅に軽量化した「Ternary Bonsai 2 27B」や、マルチトークン予測（MTP）ヘッドを統合した派生GGUFファイル、GLM-5.3-Flashの非検閲版などが多数公開され、ローカル実行における選択肢がさらに拡張されました。",
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
      }
    ]
  },
  "#/guide/compare": {
    "title": "主要ローカルLLMモデル比較",
    "first_published": "2026-08-26",
    "cadence_days": 30,
    "last_researched": "2026-10-01",
    "last_updated": "2026-10-01",
    "update_count": 2,
    "facts": [
      "llama.cpp v0.4.1がリリースされ、Maple 20B-A1BやTencent Hy 4などの新規モデルサポートやggml v0.24.0へのアップデートが行われた。",
      "Ollama v0.35.0がリリースされ、TypeSafeのJev APIに基づく決定モデル（Decision models）のサポートや構造化された判断処理機能が追加された。",
      "Ollama v0.34.1がリリースされ、Apple Silicon上でのMLX safetensorsを用いたモデル作成が正式対応となった。",
      "KoboldCpp v1.121がリリースされ、Minimax H3のメディアリファレンス対応や各種ツール呼び出しの修正が行われた。",
      "PrismMLよりQwen3.8 27Bを基盤とする三値化モデル「Ternary Bonsai 2 27B」が公開され、モデル容量約5.9GBで262KコンテキストやGGUF版でのローカル実行に対応した。"
    ],
    "latest_findings": "今回の定期再調査では、主要ランタイムおよび注目モデルのアップデートが複数確認された。llama.cpp v0.4.1およびggml v0.24.0のリリースによる新規モデルアーキテクチャのサポートやコア機能の改善、Ollama v0.35.0による決定モデル（Decision models）のサポートやv0.34.1でのMLX safetensors作成の正式対応、KoboldCpp v1.121によるMinimax H3のメディアリファレンス対応が行われている。また、PrismMLによる三値量子化された「Ternary Bonsai 2 27B」など、軽量かつ長コンテキストに対応するローカル向けGGUFモデルの選択肢がさらに拡充した。",
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
      }
    ]
  },
  "#/guide/hardware": {
    "title": "自分のPCでどのモデルが動く？",
    "first_published": "2026-08-26",
    "cadence_days": 30,
    "last_researched": "2026-10-01",
    "last_updated": "2026-10-01",
    "update_count": 2,
    "facts": [
      "llama.cpp v0.4.0およびv0.4.1がリリースされ、Qwen3.8-Flash-Next、Nemotron-3-Puzzle、Maple 20B-A1B、Tencent Hy 4、Spark2.5等の新モデルアーキテクチャがサポートされた",
      "KoboldCpp v1.121がリリースされ、Minimax H3のメディアリファレンス対応やツール呼び出しの修正が追加された",
      "Ollama v0.34.1がリリースされ、Apple SiliconにおけるMLX safetensorsを用いたモデル作成が正式対応となった",
      "PrismMLからQwen3.8 27Bをベースにした3値量子化モデル「Ternary Bonsai 2 27B」がGGUF形式などで公開された"
    ],
    "latest_findings": "直近の調査期間において、ローカルLLMランタイムおよび周辺ツールの主要なアップデートが複数確認されました。まず、llama.cppはv0.4.0およびv0.4.1へとバージョンアップし、Qwen3.8-Flash-NextやMaple 20B-A1B、Tencent Hy 4、Spark2.5などの新規モデルサポートやコア機能の改善が行われました。Ollama v0.34.1では、Apple Silicon環境でのMLX safetensorsを利用したモデル作成が実験的機能から正式に対応となりました。また、KoboldCpp v1.121のリリースによりMinimax H3のメディアリファレンス対応や各種ツール呼び出しの修正が行われています。モデル面では、PrismMLによるQwen3.8 27Bベースの3値量子化モデル「Ternary Bonsai 2 27B」およびその関連するドラフトモデルが公開され、ローカル環境での効率的な実行や推測デコードの選択肢がさらに拡充されています。",
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
      }
    ]
  },
  "#/guide/download": {
    "title": "モデルをダウンロードするとき何を選べばいい？",
    "first_published": "2026-08-26",
    "cadence_days": 30,
    "last_researched": "2026-10-01",
    "last_updated": "2026-10-01",
    "update_count": 2,
    "facts": [
      "PrismML社より、Qwen3.8-27Bを基盤として重みを{-1, 0, +1}に三値化したモデル「Ternary-Bonsai-2-27B」が公開され、GGUF版も利用可能になった",
      "Ollama v0.35.0がリリースされ、TypeSafeのJev APIベースの意思決定モデル（選択肢や確率を返す構造化処理モデル）がサポートされた",
      "Ollama v0.34.1がリリースされ、Apple SiliconにおけるMLX safetensorsを用いたモデル作成が正式対応となった",
      "llama.cpp v0.4.1がリリースされ、Maple 20B-A1B、Tencent Hy 4、Spark2.5等の新しいモデルアーキテクチャのサポートやggmlのv0.24.0へのアップデートが実施された",
      "KoboldCpp v1.121がリリースされ、Minimax H3のメディアリファレンス対応やツール呼び出しの修正が行われた"
    ],
    "latest_findings": "今回の再調査では、モデル選択やランタイム環境に関する重要なアップデートが複数確認されました。まずモデル面では、PrismMLがQwen3.8-27Bをベースに重みを三値化した「Ternary-Bonsai-2-27B」を公開し、大幅な軽量化とGGUF形式でのローカル実行が可能となっています。ランタイム側では、Ollamaがv0.34.1でMLX safetensorsのモデル作成を正式サポートしたほか、v0.35.0で確率や選択肢を返す意思決定モデル（Jev API等）への対応を果たしました。また、llama.cpp v0.4.1ではMaple 20B-A1Bなどの新規アーキテクチャが追加され、KoboldCpp v1.121ではMinimax H3のメディアリファレンス対応など、多様なモデルや機能を選択・運用するための環境整備が進んでいます。",
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
      }
    ]
  },
  "#/guide/troubleshoot": {
    "title": "トラブルシューティング",
    "first_published": "2026-08-26",
    "cadence_days": 30,
    "last_researched": "2026-10-01",
    "last_updated": "2026-10-01",
    "update_count": 2,
    "facts": [
      "KoboldCpp v1.121がリリースされ、Minimax H3のメディアリファレンス対応やKimi・Deepseek V4 Flashのツール呼び出しの修正が行われた",
      "Ollama v0.35.0がリリースされ、Jev APIベースの決定モデル（Decision models）や`/v1/systemone`エンドポイントがサポートされた",
      "Ollama v0.40.0-rc0が公開され、Apple Silicon環境で対応モデルの実行にMLXランタイムがデフォルト採用されるようになった"
    ],
    "latest_findings": "最近のアップデートでは、ローカルLLMランタイムの機能拡張や新モデル対応が進行しています。KoboldCpp v1.121ではMinimax H3のメディアリファレンス対応やツール呼び出しの修正が行われました。Ollamaではv0.35.0でJev APIベースの意思決定モデル（Decision models）がサポートされたほか、v0.40.0リリース候補（rc0）においてApple Silicon環境でのMLXランタイムのデフォルト採用が開始されるなど、プラットフォームごとの実行効率化が進められています。",
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
