#!/usr/bin/env python3
from __future__ import annotations
import copy, hashlib, json, re
from datetime import datetime, timezone, timedelta
from pathlib import Path
import requests

import enrich

ROOT = Path(__file__).resolve().parents[1]
DB_PATH = ROOT / "docs/data/wiki.json"
JST = timezone(timedelta(hours=9))
TODAY = datetime.now(JST).date().isoformat()
FOLLOW_DAYS = 7

def canonical(obj):
    return json.dumps(obj, ensure_ascii=False, sort_keys=True, separators=(",", ":"))

def substantive_snapshot(e):
    m = copy.deepcopy(e.get("model_meta") or {})
    for k in ["downloads", "likes", "last_modified"]:
        m.pop(k, None)
    return {
        "model_meta": m,
        "article_sections": e.get("article_sections") or [],
    }

def fingerprint(e):
    return hashlib.sha256(canonical(substantive_snapshot(e)).encode()).hexdigest()

def within_follow_window(e):
    try:
        first = datetime.fromisoformat(e.get("first_published") or e.get("date")).date()
        now = datetime.fromisoformat(TODAY).date()
        return 0 <= (now-first).days <= FOLLOW_DAYS
    except Exception:
        return False

def add_history(e, changed, changes):
    hist = e.setdefault("research_history", [])
    if hist and hist[-1].get("date") == TODAY:
        hist[-1] = {"date": TODAY, "changed": changed, "changes": changes}
    else:
        hist.append({"date": TODAY, "changed": changed, "changes": changes})
    e["research_history"] = hist[-20:]

def compare_changes(before, after):
    labels = {
        "license": "ライセンス",
        "base_model": "元モデル",
        "architectures": "アーキテクチャ",
        "context_length": "コンテキスト長",
        "quantizations": "量子化",
        "gguf_file_count": "GGUFファイル数",
        "runtime_support": "対応ランタイム",
        "use_case_evaluation": "用途評価",
        "memory_estimate": "必要メモリ目安",
        "quantization_recommendation": "推奨量子化",
    }
    b = before.get("model_meta") or {}
    a = after.get("model_meta") or {}
    out = []
    for key, label in labels.items():
        if canonical(b.get(key)) != canonical(a.get(key)):
            out.append(label)
    return out or ["モデル詳細"]

def refresh_hf(e):
    before = substantive_snapshot(e)
    before_fp = fingerprint(e)
    ok = enrich.enrich(e)
    if not ok:
        return False, []
    after_fp = fingerprint(e)
    changed = before_fp != after_fp
    changes = compare_changes(before, substantive_snapshot(e)) if changed else []
    return changed, changes

def refresh_generic_source(e):
    url = e.get("source_url", "")
    if not url.startswith("https://"):
        return False, []
    try:
        r = requests.get(url, timeout=30, headers={"User-Agent":"LocalLLMWikiBot/2.3"})
        r.raise_for_status()
        text = re.sub(r"\s+", " ", re.sub(r"<[^>]+>", " ", r.text)).strip()[:30000]
        fp = hashlib.sha256(text.encode()).hexdigest()
    except Exception as ex:
        print("[WARN] generic refresh", url, ex)
        return False, []
    old = e.get("source_fingerprint")
    e["source_fingerprint"] = fp
    return bool(old and old != fp), ["出典ページ"] if old and old != fp else []

def main():
    db = json.loads(DB_PATH.read_text(encoding="utf-8"))
    touched = 0
    updated = 0

    for e in db.get("entries", []):
        if e.get("category") != "モデル":
            continue

        e.setdefault("first_published", e.get("date", TODAY))
        e.setdefault("last_updated", e.get("date", TODAY))
        e.setdefault("update_count", 0)

        if not within_follow_window(e):
            continue
        if e.get("last_researched") == TODAY:
            continue

        if e.get("source") == "Hugging Face Models":
            changed, changes = refresh_hf(e)
        else:
            changed, changes = refresh_generic_source(e)

        e["last_researched"] = TODAY
        add_history(e, changed, changes)
        touched += 1

        if changed:
            e["last_updated"] = TODAY
            e["update_count"] = int(e.get("update_count") or 0) + 1
            updated += 1

    if touched:
        DB_PATH.write_text(json.dumps(db, ensure_ascii=False, indent=2), encoding="utf-8")
    print(f"[OK] follow-up researched={touched}, substantively updated={updated}")

if __name__ == "__main__":
    main()
