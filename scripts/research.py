#!/usr/bin/env python3
from __future__ import annotations

import hashlib
import html
import json
import re
import time
from datetime import datetime, timezone, timedelta
from pathlib import Path
from urllib.parse import urljoin, urlsplit, urlunsplit

import requests
from bs4 import BeautifulSoup
from dateutil import parser as dateparser

ROOT = Path(__file__).resolve().parents[1]
DB_PATH = ROOT / "docs/data/wiki.json"
SOURCES_PATH = ROOT / "sources.json"
JST = timezone(timedelta(hours=9))
NOW = datetime.now(JST)
TODAY = NOW.date().isoformat()

UA = "LocalLLMWikipediaBot/1.0 (+GitHub Actions; research bot)"
SESSION = requests.Session()
SESSION.headers.update({"User-Agent": UA, "Accept": "application/vnd.github+json"})

KEYWORDS_HIGH = [
    "breaking", "security", "license", "deprecated", "breaking change",
    "gguf", "cuda", "rocm", "vulkan", "metal", "quant", "quantization",
    "multimodal", "vision", "tool calling", "context", "flash attention",
]
LOCAL_TERMS = [
    "llama", "local", "gguf", "quant", "inference", "mlx", "cuda", "rocm",
    "vulkan", "ollama", "lm studio", "cpu", "gpu", "agent", "multimodal",
]

INDUSTRY_TERMS = [
    "model", "llm", "ai", "agent", "reasoning", "inference", "training",
    "architecture", "multimodal", "context", "open weight", "open-weight",
    "launch", "release", "introducing", "safety", "alignment", "compute",
    "モデル", "推論", "学習", "エージェント", "アーキテクチャ",
]

def clean_text(text: str, max_len: int = 900) -> str:
    text = html.unescape(text or "")
    text = BeautifulSoup(text, "html.parser").get_text(" ")
    text = re.sub(r"\s+", " ", text).strip()
    if len(text) > max_len:
        text = text[:max_len].rsplit(" ", 1)[0] + "…"
    return text

def summarize(text: str, max_chars: int = 240) -> str:
    text = clean_text(text, 1000)
    if not text:
        return "公式情報が更新されました。詳細は出典を確認してください。"
    parts = re.split(r"(?<=[。.!?])\s+", text)
    out = ""
    for p in parts:
        if not p:
            continue
        if len(out) + len(p) + 1 > max_chars:
            break
        out += (" " if out else "") + p
    return out or text[:max_chars] + ("…" if len(text) > max_chars else "")

def priority(text: str, fallback: str) -> str:
    t = text.lower()
    score = sum(k in t for k in KEYWORDS_HIGH)
    if score >= 2:
        return "高"
    return fallback

def stable_id(url: str, title: str) -> str:
    digest = hashlib.sha1((url + "|" + title).encode()).hexdigest()[:12]
    return f"{TODAY}-{digest}"

def github_release_entries(source: dict) -> list[dict]:
    repo = source["repo"]
    url = f"https://api.github.com/repos/{repo}/releases?per_page=8"
    try:
        r = SESSION.get(url, timeout=30)
        r.raise_for_status()
        releases = r.json()
    except Exception as e:
        print(f"[WARN] GitHub {repo}: {e}")
        return []

    out = []
    for rel in releases:
        published = rel.get("published_at") or rel.get("created_at")
        try:
            dt = dateparser.parse(published).astimezone(JST)
        except Exception:
            continue

        # Search a 3-day window so delayed Actions runs do not miss updates.
        if (NOW - dt).total_seconds() > 3 * 86400:
            continue

        title = rel.get("name") or rel.get("tag_name") or f"{source['name']} release"
        body = clean_text(rel.get("body") or "", 1400)
        html_url = rel.get("html_url") or f"https://github.com/{repo}/releases"
        text = f"{title} {body}"
        summary = summarize(body or f"{source['name']} の新しいリリース {title} が公開されました。")

        out.append({
            "id": stable_id(html_url, title),
            "date": dt.date().isoformat(),
            "title": f"{source['name']}: {title}",
            "source": f"GitHub Releases / {repo}",
            "source_url": html_url,
            "category": source["category"],
            "priority": priority(text, source.get("priority", "中")),
            "summary": summary,
            "impact": infer_impact(text, source["name"]),
            "details": body or "公式リリースページを参照してください。",
            "tags": tags_for(text, [source["name"], "GitHub Release"]),
        })
    return out

def web_page_entry(source: dict) -> list[dict]:
    """Generic fallback: detect a page's newest visible update links.
    Conservative by design: only emit links that visibly contain a current/recent date.
    """
    try:
        r = SESSION.get(source["url"], timeout=30)
        r.raise_for_status()
        soup = BeautifulSoup(r.text, "html.parser")
    except Exception as e:
        print(f"[WARN] Web {source['name']}: {e}")
        return []

    out = []
    candidates = []
    for a in soup.find_all("a", href=True):
        label = clean_text(a.get_text(" "), 250)
        href = urljoin(source["url"], a["href"])
        if len(label) < 8:
            continue

        low_href = href.lower()
        # Source-specific article/release links. Seen-URL tracking handles deduplication.
        if "lmstudio.ai" in source["url"]:
            if "/changelog/" not in low_href or low_href.rstrip("/") == source["url"].lower().rstrip("/"):
                continue
        elif "huggingface.co/blog" in source["url"]:
            if "/blog/" not in low_href or low_href.rstrip("/") == source["url"].lower().rstrip("/"):
                continue
        else:
            blob = f"{label} {href}"
            if str(NOW.year) not in blob:
                continue

        candidates.append((label, href))

    seen = set()
    for label, href in candidates[:15]:
        if href in seen:
            continue
        seen.add(href)
        low = label.lower()
        if not any(k in low for k in LOCAL_TERMS) and "LM Studio" not in source["name"]:
            continue
        out.append({
            "id": stable_id(href, label),
            "date": TODAY,
            "title": f"{source['name']}: {label}",
            "source": source["name"],
            "source_url": href,
            "category": source["category"],
            "priority": priority(label, source.get("priority", "中")),
            "summary": summarize(label),
            "impact": infer_impact(label, source["name"]),
            "details": "公式ページ上で新しい更新候補を検出しました。詳細は出典を確認してください。",
            "tags": tags_for(label, [source["name"]]),
        })
    return out


def canonicalize_url(url: str) -> str:
    parts = urlsplit(url)
    return urlunsplit((parts.scheme, parts.netloc, parts.path, "", ""))


def parsed_date(value: str | None) -> datetime | None:
    if not value:
        return None
    try:
        dt = dateparser.parse(value)
    except Exception:
        return None
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    return dt.astimezone(JST)


def article_date(soup: BeautifulSoup) -> datetime | None:
    for attrs in (
        {"property": "article:published_time"},
        {"name": "datePublished"},
        {"name": "date"},
        {"itemprop": "datePublished"},
    ):
        tag = soup.find("meta", attrs=attrs)
        dt = parsed_date(tag.get("content")) if tag else None
        if dt:
            return dt

    time_tag = soup.find("time", datetime=True)
    dt = parsed_date(time_tag.get("datetime")) if time_tag else None
    if dt:
        return dt

    def find_json_date(value):
        if isinstance(value, dict):
            if value.get("datePublished"):
                return value["datePublished"]
            for child in value.values():
                found = find_json_date(child)
                if found:
                    return found
        elif isinstance(value, list):
            for child in value:
                found = find_json_date(child)
                if found:
                    return found
        return None

    for script in soup.find_all("script", type="application/ld+json"):
        try:
            value = json.loads(script.string or script.get_text())
        except Exception:
            continue
        dt = parsed_date(find_json_date(value))
        if dt:
            return dt

    text = clean_text(soup.get_text(" "), 5000)
    patterns = [
        r"\b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{1,2},\s+20\d{2}\b",
        r"\b20\d{2}-\d{2}-\d{2}\b",
    ]
    for pattern in patterns:
        match = re.search(pattern, text, re.I)
        dt = parsed_date(match.group(0)) if match else None
        if dt:
            return dt
    return None


def date_from_text(text: str) -> datetime | None:
    patterns = [
        r"\b(?:Jan(?:uary)?|Feb(?:ruary)?|Mar(?:ch)?|Apr(?:il)?|May|Jun(?:e)?|Jul(?:y)?|Aug(?:ust)?|Sep(?:tember)?|Oct(?:ober)?|Nov(?:ember)?|Dec(?:ember)?)\s+\d{1,2},\s+20\d{2}\b",
        r"\b20\d{2}-\d{2}-\d{2}\b",
    ]
    for pattern in patterns:
        match = re.search(pattern, text, re.I)
        dt = parsed_date(match.group(0)) if match else None
        if dt:
            return dt
    return None


def page_meta(soup: BeautifulSoup, label: str) -> tuple[str, str, str]:
    title_tag = soup.find("meta", property="og:title")
    desc_tag = soup.find("meta", property="og:description") or soup.find("meta", attrs={"name": "description"})
    heading = soup.find("h1")
    title = clean_text(
        (title_tag.get("content") if title_tag else "")
        or (heading.get_text(" ") if heading else "")
        or label,
        240,
    )
    description = clean_text(desc_tag.get("content") if desc_tag else "", 700)
    container = soup.find("article") or soup.find("main") or soup
    paragraphs = [clean_text(p.get_text(" "), 500) for p in container.find_all("p")]
    paragraphs = [p for p in paragraphs if len(p) >= 40]
    body = clean_text(" ".join(paragraphs[:5]), 1400)
    return title, description, body


def industry_news_entries(source: dict, already_seen: set[str]) -> list[dict]:
    """Collect dated articles from official AI lab newsrooms.

    Individual article pages are opened to verify their publication date and to
    retain enough primary-source text for the editorial quality gate.
    """
    try:
        r = SESSION.get(source["url"], timeout=30)
        r.raise_for_status()
        soup = BeautifulSoup(r.text, "html.parser")
    except Exception as e:
        print(f"[WARN] Industry {source['name']}: {e}")
        return []

    hub = canonicalize_url(source["url"]).rstrip("/")
    host = urlsplit(source["url"]).netloc.lower()
    prefixes = source.get("path_prefixes", [])
    max_age = int(source.get("max_age_days", 10))
    candidates = []
    candidate_seen = set()
    for anchor in soup.find_all("a", href=True):
        label = clean_text(anchor.get_text(" "), 250)
        url = canonicalize_url(urljoin(source["url"], anchor["href"]))
        parts = urlsplit(url)
        if parts.netloc.lower() != host or url.rstrip("/") == hub:
            continue
        if prefixes and not any(parts.path.startswith(prefix) for prefix in prefixes):
            continue
        if any(token in parts.path.lower() for token in ("/rss", "/feed", "sitemap", ".xml")):
            continue
        if url in already_seen or url in candidate_seen:
            continue
        context = clean_text(anchor.parent.get_text(" ") if anchor.parent else label, 600)
        hinted_date = date_from_text(context)
        if hinted_date and NOW - hinted_date > timedelta(days=max_age):
            continue
        candidate_seen.add(url)
        candidates.append((label, url, hinted_date))
        if len(candidates) >= int(source.get("scan_limit", 18)):
            break

    out = []
    for label, url, hinted_date in candidates:
        try:
            r = SESSION.get(url, timeout=15)
            r.raise_for_status()
            article = BeautifulSoup(r.text, "html.parser")
        except Exception as e:
            print(f"[WARN] Industry article {url}: {e}")
            continue

        published = article_date(article) or hinted_date
        if not published:
            continue
        age = NOW - published
        if age < timedelta(days=-1) or age > timedelta(days=max_age):
            continue

        title, description, body = page_meta(article, label)
        text = f"{title} {description} {body}"
        if not any(term in text.lower() for term in INDUSTRY_TERMS):
            continue
        company = source.get("company", source["name"])
        summary = summarize(description or body or title)
        details = body or description or "公式発表の詳細は出典を確認してください。"
        out.append({
            "id": stable_id(url, title),
            "date": published.date().isoformat(),
            "title": title,
            "source": source["name"],
            "source_url": url,
            "category": source.get("category", "新技術・業界動向"),
            "priority": priority(text, source.get("priority", "高")),
            "summary": summary,
            "impact": f"{company}のモデル、製品、研究方針に関する公式発表です。利用可能性、ローカルLLMへの波及、開発者への影響を確認する価値があります。",
            "details": details,
            "tags": tags_for(text, [company, "AI業界動向", "公式発表"]),
        })
        if len(out) >= int(source.get("max_items", 6)):
            break
        time.sleep(0.05)
    return out

def huggingface_entries(source: dict) -> list[dict]:
    # HF public API: recently modified models matching the search term.
    params = {
        "search": source.get("query", "GGUF"),
        "sort": "lastModified",
        "direction": "-1",
        "limit": source.get("limit", 20),
        "full": "true",
    }
    try:
        r = SESSION.get("https://huggingface.co/api/models", params=params, timeout=30)
        r.raise_for_status()
        models = r.json()
    except Exception as e:
        print(f"[WARN] Hugging Face: {e}")
        return []

    out = []
    for m in models:
        modified = m.get("lastModified")
        if not modified:
            continue
        try:
            dt = dateparser.parse(modified).astimezone(JST)
        except Exception:
            continue
        if (NOW - dt).total_seconds() > 36 * 3600:
            continue

        model_id = m.get("modelId") or m.get("id")
        if not model_id:
            continue
        tags = m.get("tags") or []
        text = " ".join([model_id] + tags)
        if "gguf" not in text.lower():
            continue

        downloads = int(m.get("downloads") or 0)
        likes = int(m.get("likes") or 0)

        # Avoid flooding the wiki with every tiny conversion.
        if downloads < 100 and likes < 3:
            continue

        url = f"https://huggingface.co/{model_id}"
        out.append({
            "id": stable_id(url, model_id),
            "date": dt.date().isoformat(),
            "title": f"Hugging Face: {model_id}",
            "source": "Hugging Face Models",
            "source_url": url,
            "category": source["category"],
            "priority": "中" if downloads >= 1000 or likes >= 20 else "低",
            "summary": f"GGUF関連モデル「{model_id}」が更新。Hugging Face上の直近指標は downloads={downloads:,}, likes={likes:,}。",
            "impact": "ローカル実行候補の更新です。量子化方式、元モデル、ライセンス、対応ランタイムをモデルカードで確認してください。",
            "details": f"lastModified={modified} / downloads={downloads:,} / likes={likes:,}",
            "tags": list(dict.fromkeys(["GGUF", "Hugging Face"] + [t for t in tags if len(t) < 32][:8])),
        })
    return out[:8]

def tags_for(text: str, base: list[str]) -> list[str]:
    t = text.lower()
    rules = {
        "GGUF":"gguf", "CUDA":"cuda", "ROCm":"rocm", "Vulkan":"vulkan",
        "Metal":"metal", "量子化":"quant", "マルチモーダル":"multimodal",
        "Vision":"vision", "Tool Calling":"tool", "Context":"context",
        "Flash Attention":"flash attention",
    }
    out = list(base)
    for label, needle in rules.items():
        if needle in t:
            out.append(label)
    return list(dict.fromkeys(out))[:10]

def infer_impact(text: str, product: str) -> str:
    t = text.lower()
    impacts = []
    if any(k in t for k in ["breaking", "deprecated", "migration"]):
        impacts.append("互換性変更の可能性があるため、更新前にリリースノート確認を推奨します。")
    if any(k in t for k in ["cuda", "rocm", "vulkan", "metal", "gpu"]):
        impacts.append("GPUバックエンドや推論速度に関係する更新を含む可能性があります。")
    if any(k in t for k in ["gguf", "quant", "quantization"]):
        impacts.append("GGUFまたは量子化モデルの互換性・品質に関係する可能性があります。")
    if any(k in t for k in ["context", "kv cache", "cache"]):
        impacts.append("コンテキスト長やメモリ使用量に影響する可能性があります。")
    if not impacts:
        impacts.append(f"{product} をローカル利用している場合、更新内容を確認する価値があります。")
    return " ".join(impacts)

def main():
    db = json.loads(DB_PATH.read_text(encoding="utf-8"))
    sources = json.loads(SOURCES_PATH.read_text(encoding="utf-8"))
    seen = set(db.get("seen_urls", []))

    candidates = []
    for src in sources.get("github_releases", []):
        candidates += github_release_entries(src)
        time.sleep(0.2)
    for src in sources.get("web_pages", []):
        candidates += web_page_entry(src)
        time.sleep(0.2)
    for src in sources.get("industry_pages", []):
        candidates += industry_news_entries(src, seen)
        time.sleep(0.2)
    for src in sources.get("huggingface_queries", []):
        candidates += huggingface_entries(src)
        time.sleep(0.2)

    new_entries = []
    local_seen = set()
    for e in candidates:
        u = e.get("source_url", "")
        if u and (u in seen or u in local_seen):
            continue
        if u:
            local_seen.add(u)
        new_entries.append(e)

    # Sort newest/highest priority first.
    rank = {"高":0, "中":1, "低":2}
    new_entries.sort(key=lambda x:(x["date"], -rank.get(x["priority"], 9)), reverse=True)

    if new_entries:
        db["entries"] = new_entries + db.get("entries", [])
        db["site"]["last_updated"] = TODAY
        DB_PATH.write_text(json.dumps(db, ensure_ascii=False, indent=2), encoding="utf-8")
        print(f"[OK] Added {len(new_entries)} entries.")
    else:
        print("[OK] No new entries.")

if __name__ == "__main__":
    main()
