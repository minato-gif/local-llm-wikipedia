window.MAINTENANCE = {
  "#/guide/models": {
    "title": "主要ローカルLLMモデル",
    "first_published": "2026-08-26",
    "cadence_days": 30,
    "last_researched": "2026-08-31",
    "last_updated": "2026-08-31",
    "update_count": 1,
    "facts": [
      "KoboldCpp v1.120がリリースされ、DirectIO（--usedirectio）の追加によるmlockとmmapの併用対応、Qwen3.8-Flash-NextやLing-3.0-flashモデルのサポートが行われた。",
      "NVIDIA Nemotron 3.5 Lightning 30B A3BのGGUF量子化モデルがggml-orgより公開された。",
      "llama.cpp v0.3.0がリリースされ、dots3-noteマルチモーダルモデルやGLM-4.5-AirのMTP（複数トークン予測）対応、DeepSeek 4向けのテンソル分割やMetalカーネルの最適化などが実装された。",
      "GLM-5.3-FlashやQwen3.8-27B-Cold-Fusionなどの新モデルに関連するGGUFファイルが公開された。"
    ],
    "latest_findings": "直近の調査期間において、ローカルLLM周辺のランタイムおよびモデルに関する重要なアップデートが確認されました。ランタイム側では、KoboldCpp v1.120がリリースされDirectIOによるロードや新モデル形式のサポートが追加されたほか、llama.cpp v0.3.0ではdots3-noteやGLM-4.5-AirのMTP対応、DeepSeek 4向けテンソル分割やMetal最適化が実装されました。また、モデル側ではNVIDIA-Nemotron-3.5-Lightning-30B-A3BのGGUF版や、GLM-5.3-Flash、Qwen3.8-27B派生などの新しい量子化モデルが公開され、ローカル環境における選択肢と互換性が拡張されています。",
    "research_history": [
      {
        "date": "2026-08-31",
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
    "last_researched": "2026-08-31",
    "last_updated": "2026-08-31",
    "update_count": 1,
    "facts": [
      "KoboldCpp v1.120がリリースされ、DirectIO対応やmlockとmmapの併用、Qwen3.8-Flash-NextおよびLing-3.0-flashモデルのサポートが追加された。",
      "NVIDIA Nemotron 3.5 Lightning 30B A3BのGGUF版がggml-orgより公開され、ローカル環境での効率的な推論が可能になった。",
      "llama.cpp v0.3.0がリリースされ、dots3-noteマルチモーダルモデルやGLM-4.5-AirのMTPサポート、DeepSeek 4向けのテンソル分割やMetalカーネルの最適化が行われた。",
      "GLM-5.3-FlashやQwen3.8-27B-Cold-Fusionなどの新しいGGUFモデルがHugging Face上で公開され、ローカルLLMの選択肢が拡大した。"
    ],
    "latest_findings": "直近の一次情報に基づき、主要ローカルLLM関連の重要な更新を抽出しました。ランタイム面では、KoboldCpp v1.120がDirectIOによるモデルロードやmlockとmmapの同時利用、新モデル形式のサポートを追加しました。また、llama.cpp v0.3.0ではdots3-noteやGLM-4.5-AirのMTP対応、DeepSeek 4向けテンソル分割、Metalカーネルの並列コンパイル最適化が実装されています。モデル面では、NVIDIA Nemotron-3.5-Lightning-30B-A3BのGGUF版や、GLM-5.3-Flash、Qwen3.8-27B-Cold-Fusionなどの新モデルが公開され、実行環境と対応モデルの双方が拡張されています。",
    "research_history": [
      {
        "date": "2026-08-31",
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
    "last_researched": "2026-08-31",
    "last_updated": "2026-08-31",
    "update_count": 1,
    "facts": [
      "KoboldCpp v1.120がリリースされた",
      "DirectIO（--usedirectio）の追加によりmlockとmmapの併用が可能になった",
      "Qwen3.8-Flash-NextおよびLing-3.0-flashモデル形式がサポートされた"
    ],
    "latest_findings": "KoboldCpp v1.120が新たにリリースされ、モデル読み込みモードにDirectIO（--usedirectio）が追加されたことでmlockとmmapの併用が可能になりました。また、新モデルであるQwen3.8-Flash-NextおよびLing-3.0-flash形式の完全なサポートが追加され、ローカル環境でのモデル選択肢とメモリ管理の幅が広がっています。",
    "research_history": [
      {
        "date": "2026-08-31",
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
    "last_researched": "2026-08-31",
    "last_updated": "2026-08-31",
    "update_count": 1,
    "facts": [
      "KoboldCpp v1.120がリリースされ、DirectIO（--usedirectio）によるモデル読み込みやmlockとmmapの併用が可能になった",
      "KoboldCpp v1.120でQwen3.8-Flash-NextやLing-3.0-flashなどの新しいモデル形式がサポートされた",
      "NVIDIAの「Nemotron-3.5-Lightning-30B-A3B」のGGUF量子化モデルがggml-orgより公開され、GGUF対応ランタイムでの実行が可能になった",
      "llama.cpp v0.3.0がリリースされ、dots3-noteマルチモーダルモデルやGLM-4.5-AirのMTPサポート、DeepSeek 4向けのテンソル分割などが追加された"
    ],
    "latest_findings": "直近の調査により、ローカルLLMの実行環境および対応モデルに関する重要なアップデートが確認されました。ランタイム側では、KoboldCpp v1.120においてDirectIOによるモデルロードやmlockとmmapの同時利用が可能になり、Qwen3.8-Flash-Next等の新モデル形式がサポートされました。また、llama.cpp v0.3.0ではdots3-noteやGLM-4.5-AirのMTP（複数トークン予測）に対応し、Metalカーネルの最適化なども行われています。モデル配布面では、NVIDIAの「Nemotron-3.5-Lightning-30B-A3B」のGGUF版が公開されるなど、選定や実行時に考慮すべき選択肢とランタイム機能が拡充されています。",
    "research_history": [
      {
        "date": "2026-08-31",
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
    "last_researched": "2026-08-31",
    "last_updated": "2026-08-31",
    "update_count": 1,
    "facts": [
      "KoboldCpp v1.120がリリースされ、DirectIO（--usedirectio）によるモデル読み込みモードの追加やmlock・mmapの併用が可能になった",
      "Ollama v0.33.1およびv0.33.2がリリースされ、Apple Silicon環境でのQwen3.8 Flash Nextサポート、低速ストレージでのMetal GPUタイムアウト回避、macOS版のダークモード復元や二重起動の修正が行われた"
    ],
    "latest_findings": "トラブルシューティングに関連するランタイムのアップデート情報が確認されました。KoboldCpp v1.120では、新しいモデル読み込みモードとしてDirectIO（--usedirectio）が追加され、mlockとmmapの同時利用が可能になりました。また、Ollama v0.33.1/v0.33.2では、Apple Silicon環境におけるQwen3.8 Flash Nextモデルのサポート追加や、低速ストレージ読み込み時に発生するMetal GPUタイムアウトの回避策が導入されています。さらに、macOS版でのシステムダークモードの復元や二重起動防止などの不具合修正が行われており、環境構築やトラブルシューティング時の参考情報として更新が必要です。",
    "research_history": [
      {
        "date": "2026-08-31",
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
