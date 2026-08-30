#!/usr/bin/env python3
from __future__ import annotations
import hashlib, json, os, re
from datetime import datetime, timezone, timedelta
from pathlib import Path
import requests

ROOT = Path(__file__).resolve().parents[1]
DB_PATH = ROOT / "docs/data/wiki.json"
OUT_PATH = ROOT / "docs/data/maintenance.js"
JST = timezone(timedelta(hours=9))
TODAY = datetime.now(JST).date().isoformat()
MODEL = os.getenv("GEMINI_MODEL", "gemini-3.5-flash-lite")
KEY = os.getenv("GEMINI_API_KEY", "").strip()

TARGETS = {
    "#/guide/models": {
        "title": "主要ローカルLLMモデル",
        "first_published": "2026-08-26",
        "cadence_days": 30,
        "topics": ["モデル", "主要モデル", "ライセンス", "コンテキスト", "マルチモーダル"],
    },
    "#/guide/compare": {
        "title": "主要ローカルLLMモデル比較",
        "first_published": "2026-08-26",
        "cadence_days": 30,
        "topics": ["モデル", "比較", "量子化", "ローカル向き", "主要モデル"],
    },
    "#/guide/hardware": {
        "title": "自分のPCでどのモデルが動く？",
        "first_published": "2026-08-26",
        "cadence_days": 30,
        "topics": ["GPU高速化", "量子化", "VRAM", "RAM", "CUDA", "ROCm", "Vulkan"],
    },
    "#/guide/download": {
        "title": "モデルをダウンロードするとき何を選べばいい？",
        "first_published": "2026-08-26",
        "cadence_days": 30,
        "topics": ["量子化", "GGUF", "モデル"],
    },
    "#/guide/troubleshoot": {
        "title": "トラブルシューティング",
        "first_published": "2026-08-26",
        "cadence_days": 30,
        "topics": ["LM Studio / Ollama", "GPU高速化", "重要変更", "量子化"],
    },
    "#/guide/glossary": {
        "title": "ローカルLLM用語集",
        "first_published": "2026-08-26",
        "cadence_days": 90,
        "topics": ["量子化", "GPU高速化", "主要モデル", "重要変更"],
    },
}

def load_state():
    if not OUT_PATH.exists():
        return {}
    text = OUT_PATH.read_text(encoding="utf-8")
    m = re.search(r"window\.MAINTENANCE\s*=\s*(\{.*\})\s*;?\s*$", text, re.S)
    return json.loads(m.group(1)) if m else {}

def save_state(state):
    OUT_PATH.write_text(
        "window.MAINTENANCE = " + json.dumps(state, ensure_ascii=False, indent=2) + ";\n",
        encoding="utf-8",
    )

def due(info):
    last = info.get("last_researched")
    if not last:
        return True
    try:
        a = datetime.fromisoformat(last).date()
        b = datetime.fromisoformat(TODAY).date()
        return (b-a).days >= int(info.get("cadence_days", 30))
    except Exception:
        return True

def relevant_entries(db, topics):
    out = []
    for e in db.get("entries", []):
        blob = " ".join([
            str(e.get("category","")), str(e.get("editorial_bucket","")),
            str(e.get("title","")), " ".join(e.get("tags") or [])
        ])
        if any(t.lower() in blob.lower() for t in topics):
            out.append({
                "date": e.get("date"), "title": e.get("title"),
                "summary": e.get("summary"), "details": e.get("details"),
                "source": e.get("source"), "source_url": e.get("source_url")
            })
    return sorted(out, key=lambda x: x.get("date") or "", reverse=True)[:30]

def gemini_review(title, previous_facts, entries):
    if not KEY:
        return None
    prompt = f"""あなたはLocal LLM Wikiの保守編集者です。
ページ「{title}」の定期再調査をします。
以下は直近の一次情報由来ニュースです。以前の調査結果と比較し、
このページに反映すべき実質的な変化だけを抽出してください。

以前のfacts:
{json.dumps(previous_facts, ensure_ascii=False)}

最近の情報:
{json.dumps(entries, ensure_ascii=False)}

ルール:
- 入力にない事実を作らない
- ダウンロード数やlikesだけの変化は無視
- 新モデル、主要版、ライセンス、コンテキスト長、量子化、主要ランタイム対応、
  推奨ハードウェア、破壊的変更など読者に意味のある変化を重視
- 実質的な変化がなければ changed=false
- JSONのみ

{{"changed":true,"facts":["短い事実1","短い事実2"],"summary":"追加調査で判明した変更点を日本語で200〜400字"}}
"""
    try:
        r = requests.post(
            f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent",
            headers={"x-goog-api-key":KEY},
            json={"contents":[{"role":"user","parts":[{"text":prompt}]}],
                  "generationConfig":{"temperature":0.1,"responseMimeType":"application/json","maxOutputTokens":2048}},
            timeout=60,
        )
        r.raise_for_status()
        return json.loads(r.json()["candidates"][0]["content"]["parts"][0]["text"])
    except Exception as ex:
        print("[WARN] Gemini monthly review failed:", ex)
        return None

def main():
    db = json.loads(DB_PATH.read_text(encoding="utf-8"))
    state = load_state()
    changed_pages = 0

    for route, cfg in TARGETS.items():
        item = state.setdefault(route, {
            "title": cfg["title"],
            "first_published": cfg["first_published"],
            "cadence_days": cfg["cadence_days"],
            "last_researched": "",
            "last_updated": cfg["first_published"],
            "update_count": 0,
            "facts": [],
            "latest_findings": "",
            "research_history": [],
        })
        item["cadence_days"] = cfg["cadence_days"]
        if not due(item):
            continue

        entries = relevant_entries(db, cfg["topics"])
        review = gemini_review(cfg["title"], item.get("facts") or [], entries)
        item["last_researched"] = TODAY

        changed = bool(review and review.get("changed"))
        if changed:
            item["facts"] = review.get("facts") or []
            item["latest_findings"] = review.get("summary") or ""
            item["last_updated"] = TODAY
            item["update_count"] = int(item.get("update_count") or 0) + 1
            changed_pages += 1

        hist = item.setdefault("research_history", [])
        hist.append({
            "date": TODAY,
            "changed": changed,
            "changes": ["定期調査による内容更新"] if changed else [],
        })
        item["research_history"] = hist[-12:]

    save_state(state)
    print(f"[OK] monthly/periodic maintenance complete; updated_pages={changed_pages}")

if __name__ == "__main__":
    main()
