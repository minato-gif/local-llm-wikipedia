#!/usr/bin/env python3
import json, os, re
from datetime import datetime, timezone, timedelta
from pathlib import Path
import requests

DB = Path(__file__).resolve().parents[1] / "docs/data/wiki.json"
TODAY = datetime.now(timezone(timedelta(hours=9))).date().isoformat()
MODEL = os.getenv("GEMINI_MODEL", "gemini-3.5-flash-lite")
MAX_ITEMS, MIN_SCORE = 6, 4

SIGNALS = {
 "security":6,"vulnerability":6,"breaking":5,"license":5,"deprecated":4,
 "migration":4,"introducing":4,"new model":4,"multimodal":3,"tool calling":3,
 "quantization":3,"gguf":2,"cuda":2,"rocm":2,"vulkan":2,"metal":2,
 "flash attention":3,"kv cache":3,"context":2,"performance":2,"faster":2,"support":2
}
LOW = ["docs:","documentation","typo","formatting","lint","test:","tests:","ci:","chore:","refactor"]

def cut(s,n):
    s=re.sub(r"\s+"," ",s or "").strip()
    return s if len(s)<=n else s[:n-1].rstrip()+"…"

def score(e):
    text=f"{e.get('title','')} {e.get('summary','')} {e.get('details','')}".lower()
    s=2 if any(x in e.get("source","") for x in ["llama.cpp","LM Studio","Ollama"]) else 1
    if re.search(r"\bv?\d+\.\d+(?:\.\d+)?\b",e.get("title",""),re.I): s+=4
    if any(x in text for x in ["release","released","launch","announc","introducing"]): s+=2
    s+=min(sum(v for k,v in SIGNALS.items() if k in text),8)
    if any(x in text for x in LOW): s-=3
    if re.search(r"llama\.cpp:\s*b\d+\b",e.get("title",""),re.I): s-=5
    return s

def fallback(e,s):
    raw=f"{e.get('title','')} {e.get('summary','')} {e.get('details','')}".lower()
    product=e.get("source","関連ツール").replace("GitHub Releases / ","")
    if any(k in raw for k in ["security","vulnerability"]):
        summary=f"{product}でセキュリティに関係する更新が公開されました。利用中の場合は影響範囲と更新手順を公式情報で確認することを推奨します。"
    elif any(k in raw for k in ["breaking","deprecated","migration"]):
        summary=f"{product}で互換性や移行に関係する変更が公開されました。既存環境を更新する前に設定やモデル形式への影響を確認してください。"
    elif any(k in raw for k in ["cuda","rocm","vulkan","metal","gpu"]):
        summary=f"{product}のGPU推論まわりに重要な更新が入りました。対応バックエンド、推論速度、利用可能なハードウェア構成に関係する変更です。"
    elif any(k in raw for k in ["gguf","quant","quantization"]):
        summary=f"{product}でGGUFまたは量子化に関する更新が公開されました。互換性、モデル容量、推論効率に影響する可能性があります。"
    else:
        summary=f"{product}でローカルLLM利用者に影響する重要な更新が公開されました。実用面で確認する価値がある内容として選定しています。"
    impact="ローカル環境で同じモデルやランタイムを利用している場合、更新前に公式情報で互換性と必要な変更を確認することを推奨します。"
    z=dict(e)
    z.update(
        priority="高" if s>=8 else "中",
        summary=cut(summary,320),
        impact=cut(impact,260),
        details="重要点を日本語で要約しています。完全な技術変更は出典の公式ページを参照してください。",
        curated=True,
        summary_method="ルールベース日本語要約"
    )
    return z

def gemini(items):
    key=os.getenv("GEMINI_API_KEY","").strip()
    if not key or not items:
        return None

    src=[{
        "source_url":e.get("source_url",""),
        "date":e.get("date",""),
        "source":e.get("source",""),
        "category":e.get("category",""),
        "score":s,
        "title":cut(e.get("title",""),220),
        "summary":cut(e.get("summary",""),450),
        "details":cut(e.get("details",""),1200)
    } for e,s in items]

    prompt=f"""あなたはローカルLLM専門Wikiの日本語編集者です。候補から掲載価値が高いものだけを最大{MAX_ITEMS}件選び、日本語で要約してください。
掲載: 主要モデル/主要版、セキュリティ・ライセンス・互換性、GGUF/量子化/速度/VRAM-RAM効率、CUDA/ROCm/Vulkan/Metalの重要対応、主要ツールの実用的機能追加。
除外: CI、テスト、文書、typo、内部refactor、影響の小さいnightly、小規模GGUF変換。
入力にない事実や性能値を足さず、煽らないでください。
JSONのみ: {{"items":[{{"source_url":"入力と完全一致","include":true,"importance":"高または中","title_ja":"自然な日本語タイトル","summary_ja":"120〜220字の2〜3文","impact_ja":"80〜160字","details_ja":"160〜320字"}}]}}
候補:{json.dumps(src,ensure_ascii=False)}"""

    url=f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent"
    body={
        "contents":[{"role":"user","parts":[{"text":prompt}]}],
        "generationConfig":{
            "temperature":0.15,
            "responseMimeType":"application/json",
            "maxOutputTokens":4096
        }
    }

    try:
        r=requests.post(
            url,
            headers={"x-goog-api-key":key},
            json=body,
            timeout=60
        )
        r.raise_for_status()
        ai=json.loads(r.json()["candidates"][0]["content"]["parts"][0]["text"]).get("items",[])
    except Exception as ex:
        print("[WARN] Gemini failed:",ex)
        return None

    by={e.get("source_url",""):(e,s) for e,s in items}
    out=[]

    for a in ai:
        u=a.get("source_url","")
        if not a.get("include",True) or u not in by:
            continue

        e,s=by[u]
        z=dict(e)
        z.update(
            title=cut(a.get("title_ja") or e.get("title",""),180),
            summary=cut(a.get("summary_ja",""),320),
            impact=cut(a.get("impact_ja",""),260),
            details=cut(a.get("details_ja",""),480),
            priority=a.get("importance") if a.get("importance") in ["高","中"] else ("高" if s>=8 else "中"),
            curated=True,
            summary_method=f"Gemini / {MODEL}"
        )
        out.append(z)

        if len(out)>=MAX_ITEMS:
            break

    return out

def main():
    db=json.loads(DB.read_text(encoding="utf-8"))
    entries=db.get("entries",[])

    keep=[e for e in entries if e.get("curated") or e.get("id")=="welcome-2026-08-26"]
    raw=[e for e in entries if not e.get("curated") and e.get("id")!="welcome-2026-08-26"]

    ranked=[(e,score(e)) for e in raw]
    ranked=[x for x in ranked if x[1]>=MIN_SCORE]
    ranked.sort(key=lambda x:(x[1],x[0].get("date","")),reverse=True)

    limited=[]
    counts={}
    llama_nightly=False

    for e,s in ranked:
        src=e.get("source","")
        night=bool(re.search(r"llama\.cpp:\s*b\d+\b",e.get("title",""),re.I))

        if night and llama_nightly:
            continue
        if counts.get(src,0)>=2:
            continue

        counts[src]=counts.get(src,0)+1
        if night:
            llama_nightly=True

        limited.append((e,s))
        if len(limited)>=MAX_ITEMS:
            break

    curated=gemini(limited)
    if curated is None:
        curated=[fallback(e,s) for e,s in limited]

    db["entries"]=curated+keep

    if raw or curated:
        db["site"]["last_updated"]=TODAY
        DB.write_text(json.dumps(db,ensure_ascii=False,indent=2),encoding="utf-8")

    print(
        f"[OK] curated={len(curated)} "
        f"removed={max(0,len(raw)-len(curated))} "
        f"mode={'Gemini' if os.getenv('GEMINI_API_KEY','').strip() else 'fallback'}"
    )

if __name__=="__main__":
    main()
