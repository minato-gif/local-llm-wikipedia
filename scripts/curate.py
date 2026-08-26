#!/usr/bin/env python3
import json, os, re
from datetime import datetime, timezone, timedelta
from pathlib import Path
import requests

DB = Path(__file__).resolve().parents[1] / "docs/data/wiki.json"
TODAY = datetime.now(timezone(timedelta(hours=9))).date().isoformat()
MODEL = os.getenv("GEMINI_MODEL", "gemini-3.5-flash-lite")

# 1日あたりの記事数。重要ニュースを中心に最大5件まで掲載する。
MAX_ITEMS, MIN_SCORE = 5, 4

MAJOR_MODEL_FAMILIES = [
    "qwen", "deepseek", "gemma", "mistral", "llama", "nemotron", "phi",
    "minimax", "glm", "kimi", "liquid", "falcon", "command-r", "granite",
]

MAJOR_TOOLS = ["lm studio", "ollama"]

QUANT_TERMS = [
    "quantization", "quantized", "quant", "gguf", "awq", "gptq", "exl2",
    "4bit", "4-bit", "8bit", "8-bit", "fp4", "fp8", "int4", "int8",
]

GPU_TERMS = [
    "cuda", "rocm", "vulkan", "metal", "gpu", "flash attention",
    "flash-attention", "kv cache", "kv-cache", "tensor core", "offload",
]

IMPORTANT_CHANGE_TERMS = [
    "security", "vulnerability", "breaking", "breaking change", "license",
    "deprecated", "migration", "compatibility", "multimodal", "vision",
    "tool calling", "context", "performance", "faster", "speedup",
]

LOW = [
    "docs:", "documentation", "typo", "formatting", "lint", "test:",
    "tests:", "ci:", "chore:", "refactor", "cleanup", "readme",
]


def cut(s, n):
    s = re.sub(r"\s+", " ", s or "").strip()
    return s if len(s) <= n else s[: n - 1].rstrip() + "…"


def metric(text, key):
    m = re.search(rf"{re.escape(key)}\s*[=:]\s*([\d,]+)", text, re.I)
    if not m:
        return 0
    try:
        return int(m.group(1).replace(",", ""))
    except ValueError:
        return 0


def classify(e):
    title = e.get("title", "")
    source = e.get("source", "")
    category = e.get("category", "")
    text = f"{title} {e.get('summary', '')} {e.get('details', '')}".lower()
    source_l = source.lower()

    is_major_tool = any(x in source_l or x in text for x in MAJOR_TOOLS)
    is_model = category == "モデル" or "hugging face models" in source_l
    is_major_model = is_model and any(x in text for x in MAJOR_MODEL_FAMILIES)
    is_quant = any(x in text for x in QUANT_TERMS)
    is_gpu = any(x in text for x in GPU_TERMS)
    is_versioned_release = bool(re.search(r"\bv?\d+\.\d+(?:\.\d+)?\b", title, re.I))
    is_release = any(x in text for x in ["release", "released", "launch", "announc", "introducing"])
    is_llama_nightly = bool(re.search(r"llama\.cpp:\s*b\d+\b", title, re.I))
    is_critical = any(x in text for x in ["security", "vulnerability", "breaking", "license", "deprecated"])

    if is_major_model:
        bucket = "主要モデル"
    elif is_major_tool:
        bucket = "LM Studio / Ollama"
    elif is_quant:
        bucket = "量子化"
    elif is_gpu:
        bucket = "GPU高速化"
    elif is_critical:
        bucket = "重要変更"
    else:
        bucket = "その他"

    return {
        "text": text,
        "source_l": source_l,
        "is_major_tool": is_major_tool,
        "is_model": is_model,
        "is_major_model": is_major_model,
        "is_quant": is_quant,
        "is_gpu": is_gpu,
        "is_versioned_release": is_versioned_release,
        "is_release": is_release,
        "is_llama_nightly": is_llama_nightly,
        "is_critical": is_critical,
        "bucket": bucket,
    }


def score(e):
    c = classify(e)
    text = c["text"]
    s = 1

    # 1. 主要モデルの新規公開・大きな更新を最優先。
    if c["is_major_model"]:
        s += 6
        if c["is_release"]:
            s += 3

        downloads = metric(text, "downloads")
        likes = metric(text, "likes")
        if downloads >= 10000:
            s += 4
        elif downloads >= 1000:
            s += 3
        elif downloads >= 100:
            s += 1
        if likes >= 100:
            s += 3
        elif likes >= 20:
            s += 2
        elif likes >= 3:
            s += 1

    # 2. LM Studio / Ollama の大型アップデートを優先。
    if c["is_major_tool"]:
        s += 6
        if c["is_versioned_release"]:
            s += 4
        if c["is_release"]:
            s += 2

    if c["is_versioned_release"] and not c["is_major_tool"]:
        s += 3
    if c["is_release"] and not c["is_major_model"]:
        s += 2

    # 3. 量子化・GPU高速化はローカル利用への実益が大きいので強く加点。
    if c["is_quant"]:
        s += 5
    if c["is_gpu"]:
        s += 5

    # セキュリティ・互換性・ライセンス等の重要変更。
    for term in IMPORTANT_CHANGE_TERMS:
        if term in text:
            s += 2
    s = min(s, 18)

    if any(x in text for x in LOW):
        s -= 5

    # llama.cpp の bNNNN nightly は原則掲載しない。
    if c["is_llama_nightly"]:
        s -= 8
        if c["is_critical"]:
            s += 6

    # Hugging Face の小規模GGUF変換を抑制。
    if c["is_model"] and not c["is_major_model"]:
        downloads = metric(text, "downloads")
        likes = metric(text, "likes")
        if downloads < 1000 and likes < 20:
            s -= 4

    return s


def fallback(e, s):
    raw = f"{e.get('title', '')} {e.get('summary', '')} {e.get('details', '')}".lower()
    product = e.get("source", "関連ツール").replace("GitHub Releases / ", "")
    c = classify(e)

    if c["is_major_model"]:
        summary = "主要ローカルLLM候補として注目度の高いモデル更新が公開されました。モデル規模、ライセンス、量子化方式、対応ランタイムを確認する価値があります。"
    elif c["is_major_tool"]:
        summary = f"{product}でローカルLLM利用者への影響が大きいアップデートが公開されました。モデル互換性や推論機能、実行環境に関係する変更を含む可能性があります。"
    elif c["is_quant"]:
        summary = f"{product}で量子化やモデル圧縮に関する重要な更新が公開されました。モデル容量、VRAM/RAM使用量、推論品質とのバランスに関係します。"
    elif c["is_gpu"]:
        summary = f"{product}でGPU推論や高速化に関係する重要な更新が公開されました。CUDA、ROCm、Vulkan、Metalなどの対応環境への影響を確認してください。"
    elif any(k in raw for k in ["security", "vulnerability"]):
        summary = f"{product}でセキュリティに関係する更新が公開されました。利用中の場合は影響範囲と更新手順を公式情報で確認することを推奨します。"
    elif any(k in raw for k in ["breaking", "deprecated", "migration"]):
        summary = f"{product}で互換性や移行に関係する変更が公開されました。既存環境を更新する前に設定やモデル形式への影響を確認してください。"
    else:
        summary = f"{product}でローカルLLM利用者に影響する重要な更新が公開されました。実用面で確認する価値がある内容として選定しています。"

    impact = "ローカル環境で同じモデルやランタイムを利用している場合、更新前に公式情報で互換性、必要VRAM/RAM、対応バックエンドを確認することを推奨します。"
    z = dict(e)
    z.update(
        priority="高" if s >= 9 else "中",
        summary=cut(summary, 320),
        impact=cut(impact, 260),
        details="重要点を日本語で要約しています。完全な技術変更は出典の公式ページを参照してください。",
        curated=True,
        editorial_bucket=c["bucket"],
        summary_method="ルールベース日本語要約",
    )
    return z


def gemini(items):
    key = os.getenv("GEMINI_API_KEY", "").strip()
    if not key or not items:
        return None

    src = []
    for e, s in items:
        c = classify(e)
        src.append({
            "source_url": e.get("source_url", ""),
            "date": e.get("date", ""),
            "source": e.get("source", ""),
            "category": e.get("category", ""),
            "editorial_bucket": c["bucket"],
            "score": s,
            "title": cut(e.get("title", ""), 220),
            "summary": cut(e.get("summary", ""), 450),
            "details": cut(e.get("details", ""), 1200),
        })

    prompt = f"""あなたはローカルLLM専門Wikiの日本語編集者です。候補から掲載価値が高いニュースを最大{MAX_ITEMS}件選び、日本語で要約してください。

優先順位:
1. 主要モデル（Qwen、DeepSeek、Gemma、Mistral、Llama、Nemotron、Phi、MiniMax、GLM、Kimi等）の新規公開・主要版
2. LM Studio / Ollama の大型アップデート
3. 量子化・GGUF・AWQ/GPTQ/EXL2・4bit/8bit等の重要な改善
4. CUDA / ROCm / Vulkan / Metal / Flash Attention / KV cache / GPU offload等の推論高速化
5. セキュリティ、ライセンス、互換性、破壊的変更

原則除外:
CI、テスト、文書、typo、内部refactor、cleanup、影響の小さいnightly、小規模な個人GGUF変換。
候補が十分ある場合は3〜5件を目安にし、重要なニュースが少ない日は無理に5件へ水増ししないでください。
入力にない事実や性能値を足さず、誇張や煽り表現を避けてください。

JSONのみ:
{{"items":[{{"source_url":"入力と完全一致","include":true,"importance":"高または中","title_ja":"自然な日本語タイトル","summary_ja":"120〜220字の2〜3文","impact_ja":"80〜160字","details_ja":"160〜320字"}}]}}

候補:{json.dumps(src, ensure_ascii=False)}"""

    url = f"https://generativelanguage.googleapis.com/v1beta/models/{MODEL}:generateContent"
    body = {
        "contents": [{"role": "user", "parts": [{"text": prompt}]}],
        "generationConfig": {
            "temperature": 0.15,
            "responseMimeType": "application/json",
            "maxOutputTokens": 4096,
        },
    }

    try:
        r = requests.post(
            url,
            headers={"x-goog-api-key": key},
            json=body,
            timeout=60,
        )
        r.raise_for_status()
        ai = json.loads(r.json()["candidates"][0]["content"]["parts"][0]["text"]).get("items", [])
    except Exception as ex:
        print("[WARN] Gemini failed:", ex)
        return None

    by = {e.get("source_url", ""): (e, s) for e, s in items}
    out = []

    for a in ai:
        u = a.get("source_url", "")
        if not a.get("include", True) or u not in by:
            continue

        e, s = by[u]
        c = classify(e)
        z = dict(e)
        z.update(
            title=cut(a.get("title_ja") or e.get("title", ""), 180),
            summary=cut(a.get("summary_ja", ""), 320),
            impact=cut(a.get("impact_ja", ""), 260),
            details=cut(a.get("details_ja", ""), 480),
            priority=a.get("importance") if a.get("importance") in ["高", "中"] else ("高" if s >= 9 else "中"),
            curated=True,
            editorial_bucket=c["bucket"],
            summary_method=f"Gemini / {MODEL}",
        )
        out.append(z)

        if len(out) >= MAX_ITEMS:
            break

    return out


def main():
    db = json.loads(DB.read_text(encoding="utf-8"))
    entries = db.get("entries", [])

    keep = [e for e in entries if e.get("curated") or e.get("id") == "welcome-2026-08-26"]
    raw = [e for e in entries if not e.get("curated") and e.get("id") != "welcome-2026-08-26"]

    ranked = [(e, score(e)) for e in raw]
    ranked = [x for x in ranked if x[1] >= MIN_SCORE]
    ranked.sort(key=lambda x: (x[1], x[0].get("date", "")), reverse=True)

    limited = []
    counts = {}
    major_model_count = 0

    for e, s in ranked:
        src = e.get("source", "")
        c = classify(e)

        # 細かな llama.cpp nightly は、重大なセキュリティ/互換性問題を除き掲載しない。
        if c["is_llama_nightly"] and not c["is_critical"]:
            continue

        # 同じ情報源による独占を避ける。
        if counts.get(src, 0) >= 2:
            continue

        # 主要モデル記事は最大2件。モデル記事だけで埋まるのを防ぐ。
        if c["is_major_model"] and major_model_count >= 2:
            continue

        counts[src] = counts.get(src, 0) + 1
        if c["is_major_model"]:
            major_model_count += 1

        limited.append((e, s))
        if len(limited) >= MAX_ITEMS:
            break

    curated = gemini(limited)
    if curated is None:
        curated = [fallback(e, s) for e, s in limited]

    db["entries"] = curated + keep

    if raw or curated:
        db["site"]["last_updated"] = TODAY
        DB.write_text(json.dumps(db, ensure_ascii=False, indent=2), encoding="utf-8")

    print(
        f"[OK] curated={len(curated)} "
        f"removed={max(0, len(raw) - len(curated))} "
        f"mode={'Gemini' if os.getenv('GEMINI_API_KEY', '').strip() else 'fallback'}"
    )


if __name__ == "__main__":
    main()
