#!/usr/bin/env python3
"""Build crawlable HTML pages from the wiki data used by the browser UI.

The source data remains the single source of truth.  This script is run by the
GitHub Pages workflow and writes a fully rendered site into the deployment
directory, so readers and search crawlers do not need JavaScript to see it.
"""

from __future__ import annotations

import argparse
import hashlib
import html
import json
import re
import shutil
from datetime import datetime, timezone
from email.utils import format_datetime
from pathlib import Path
from urllib.parse import quote


ROOT = Path(__file__).resolve().parents[1]
SOURCE_DOCS = ROOT / "docs"
BASE_URL = "https://localllmwiki.com"
SITE_NAME = "Local LLM Wiki"


def esc(value: object) -> str:
    return html.escape(str(value if value is not None else ""), quote=True)


def read_json(path: Path) -> dict:
    return json.loads(path.read_text(encoding="utf-8"))


def decode_js_string(value: str) -> str:
    return json.loads(f'"{value}"')


def load_static_pages() -> list[dict]:
    pages: list[dict] = []
    pattern = re.compile(
        r'route\s*:\s*"(?P<route>(?:\\.|[^"\\])*)"\s*,.*?'
        r'title\s*:\s*"(?P<title>(?:\\.|[^"\\])*)"\s*,.*?'
        r'summary\s*:\s*"(?P<summary>(?:\\.|[^"\\])*)"\s*,.*?'
        r'html\s*:\s*`(?P<html>.*?)`\s*[,}]',
        re.S,
    )
    for path in sorted((SOURCE_DOCS / "data").glob("*.js")):
        if path.name == "maintenance.js":
            continue
        text = path.read_text(encoding="utf-8")
        for match in pattern.finditer(text):
            pages.append(
                {
                    "route": decode_js_string(match.group("route")),
                    "title": decode_js_string(match.group("title")),
                    "summary": decode_js_string(match.group("summary")),
                    "html": match.group("html"),
                }
            )
    if not pages:
        raise RuntimeError("No evergreen pages were found in docs/data/*.js")
    return pages


def route_to_path(route: str) -> str:
    route = route.removeprefix("#") or "/"
    if route.startswith("/article/"):
        route = "/articles/" + route.removeprefix("/article/")
    if route.startswith("/category/"):
        prefix, value = "/category/", route.removeprefix("/category/")
        route = prefix + category_slug(value)
    return route if route.endswith("/") else route + "/"


def category_slug(category: str) -> str:
    known = {
        "モデル": "models",
        "モデル・技術": "model-technology",
        "推論ランタイム": "inference-runtimes",
        "フロントエンド": "frontends",
        "フロントエンド・ランタイム": "frontends-runtimes",
        "運用": "operations",
    }
    return known.get(category, "category-" + hashlib.sha1(category.encode("utf-8")).hexdigest()[:10])


def clean_internal_links(fragment: str) -> str:
    fragment = fragment.replace("Local LLM Wikipedia", SITE_NAME)

    def replace(match: re.Match[str]) -> str:
        return f'href="{route_to_path(match.group(1))}"'

    return re.sub(r'href="(#[^"]+)"', replace, fragment)


def article_text_length(entry: dict) -> int:
    return sum(len(str(entry.get(key, ""))) for key in ("summary", "impact", "details"))


def is_publishable(entry: dict) -> bool:
    """Conservative editorial gate for index and sitemap inclusion.

    Data is never deleted.  Thin placeholders and pre-release duplicates remain
    available as noindex pages, but are not promoted as standalone articles.
    """
    title = str(entry.get("title", ""))
    source_url = str(entry.get("source_url", ""))
    if not entry.get("curated") or not source_url:
        return False
    if article_text_length(entry) < 280:
        return False
    if "リリース候補" in title or re.search(r"(?:-|/)rc\d*\b", source_url, re.I):
        return False
    return True


def list_html(entries: list[dict]) -> str:
    if not entries:
        return "<p>該当する記事はありません。</p>"
    rows = []
    for entry in entries:
        tags = "".join(f'<span class="badge">{esc(tag)}</span>' for tag in entry.get("tags", [])[:5])
        rows.append(
            '<article class="entry">'
            f'<div class="meta">{esc(entry.get("date"))} · {esc(entry.get("source"))}</div>'
            f'<h3><a href="/articles/{quote(str(entry["id"]), safe="")}/">{esc(entry.get("title"))}</a></h3>'
            f'<p>{esc(entry.get("summary"))}</p>'
            f'<span class="badge priority-{esc(entry.get("priority"))}">重要度 {esc(entry.get("priority"))}</span>'
            f'<span class="badge">{esc(entry.get("category"))}</span>{tags}'
            "</article>"
        )
    return "".join(rows)


def static_kind(route: str) -> str:
    labels = {
        "about": "サイト情報",
        "troubleshoot": "トラブル解決",
        "download": "モデル選び",
        "/start": "始め方",
        "glossary": "用語集",
        "compare": "比較",
        "models": "モデル解説",
        "hardware": "ハードウェア",
        "basics": "入門",
    }
    return next((label for key, label in labels.items() if key in route), "解説")


def home_html(site: dict, entries: list[dict]) -> str:
    latest = sorted(entries, key=lambda item: item.get("date", ""), reverse=True)[:10]
    high = [item for item in latest if item.get("priority") == "高"][:4]
    cards = [
        ("/guide/basics/", "はじめてのローカルLLM", "専門用語を避けながら、モデル・量子化・VRAMの基本を解説します。"),
        ("/guide/models/", "主要ローカルLLMモデル", "現在の主要モデルと、ローカル環境で扱うときの特徴を整理します。"),
        ("/guide/hardware/", "自分のPCでどのモデルが動く？", "VRAM・RAM容量から現実的なモデルサイズを判断します。"),
        ("/guide/compare/", "モデル比較", "用途、規模、実行しやすさを横並びで比較します。"),
        ("/guide/download/", "モデルの選び方", "GGUFやQ4_K_Mなど、ダウンロード画面の見方を説明します。"),
        ("/guide/troubleshoot/", "トラブルシューティング", "ロード失敗、VRAM不足、速度低下などを症状別に確認します。"),
    ]
    card_html = "".join(
        f'<div class="card"><h3><a href="{url}">{esc(title)}</a></h3><p>{esc(text)}</p></div>'
        for url, title, text in cards
    )
    high_html = "".join(
        f'<div class="card"><h3><a href="/articles/{quote(str(item["id"]), safe="")}/">{esc(item["title"])}</a></h3>'
        f'<p>{esc(item["summary"])}</p></div>'
        for item in high
    ) or "<p>現在、重要度「高」の新着記事はありません。</p>"
    return f'''<div class="article">
<h1>{SITE_NAME}</h1>
<p class="lead">{esc(site.get("description", ""))}</p>
<div class="notice"><b>最終更新:</b> {esc(site.get("last_updated", ""))}<br>公式情報と一次情報を基に、常設ガイドと厳選した新着情報を掲載しています。</div>
<h2>はじめての方へ</h2><div class="grid">{card_html}</div>
<h2>注目記事</h2><div class="grid">{high_html}</div>
<h2>最近の更新</h2>{list_html(latest)}
</div>'''


def content_index_html(static_pages: list[dict], entries: list[dict]) -> str:
    evergreen = []
    for page in static_pages:
        evergreen.append(
            '<article class="content-row">'
            f'<div><div class="meta"><span class="badge">{esc(static_kind(page["route"]))}</span></div>'
            f'<h3><a href="{route_to_path(page["route"])}">{esc(page["title"])}</a></h3>'
            f'<p>{esc(page["summary"])}</p></div></article>'
        )
    return f'''<div class="article">
<h1>記事一覧</h1>
<p class="lead">常設の解説記事と、一次情報を確認して公開基準を満たした新着記事をまとめています。</p>
<div class="notice"><b>現在の掲載数</b><br>常設解説ページ: {len(static_pages)}件<br>公開中の新着記事: {len(entries)}件</div>
<h2>常設解説記事</h2><div class="content-list">{"".join(evergreen)}</div>
<h2>新着記事</h2>{list_html(sorted(entries, key=lambda item: item.get("date", ""), reverse=True))}
</div>'''


def table(rows: list[tuple[str, object]]) -> str:
    body = "".join(f"<tr><th>{esc(label)}</th><td>{esc(value) if value not in (None, '') else '情報不足'}</td></tr>" for label, value in rows)
    return f'<div class="table-wrap"><table class="compare-table"><tbody>{body}</tbody></table></div>'


def model_details(entry: dict) -> str:
    meta = entry.get("model_meta")
    if not isinstance(meta, dict):
        return ""
    sections = "".join(
        f'<h2>{esc(section.get("title"))}</h2><p>{esc(section.get("text"))}</p>'
        for section in entry.get("article_sections", [])
        if section.get("title") and section.get("text")
    )
    specs = table(
        [
            ("モデルID", meta.get("model_id")),
            ("配布者", meta.get("author")),
            ("元モデル", meta.get("base_model")),
            ("ライセンス", meta.get("license")),
            ("アーキテクチャ", ", ".join(meta.get("architectures", [])) or meta.get("model_type")),
            ("コンテキスト長", f'{meta["context_length"]:,} tokens' if meta.get("context_length") else "情報不足"),
            ("用途タグ", meta.get("pipeline_tag")),
            ("Downloads", f'{meta["downloads"]:,}' if meta.get("downloads") is not None else "情報不足"),
            ("Likes", f'{meta["likes"]:,}' if meta.get("likes") is not None else "情報不足"),
            ("量子化", ", ".join(meta.get("quantizations", [])) or "情報不足"),
        ]
    )
    recommendation = meta.get("quantization_recommendation", {})
    quant_rows = []
    for key, label in (("balanced", "バランス重視"), ("quality", "品質重視"), ("low_memory", "省メモリ重視")):
        item = recommendation.get(key) or {}
        value = item.get("quantization", "情報不足")
        if item.get("size"):
            value += f' ({item["size"]})'
        quant_rows.append((label, value))
    memory = meta.get("memory_estimate", {})
    memory_rows = [
        ("基準量子化", memory.get("basis_quantization", "情報不足")),
        ("モデルファイル容量", f'{memory["model_file_size_gib"]} GiB' if memory.get("model_file_size_gib") is not None else "概算不能"),
        ("最低RAM目安", f'{memory["system_ram_min_gib"]} GiB' if memory.get("system_ram_min_gib") is not None else "概算不能"),
        ("推奨RAM目安", f'{memory["system_ram_recommended_gib"]} GiB' if memory.get("system_ram_recommended_gib") is not None else "概算不能"),
        ("フルGPUオフロード時VRAM目安", f'{memory["full_gpu_vram_rough_gib"]} GiB' if memory.get("full_gpu_vram_rough_gib") is not None else "概算不能"),
    ]
    runtime = meta.get("runtime_support", [])
    runtime_html = "".join(
        f'<tr><td>{esc(item.get("name"))}</td><td><b>{esc(item.get("status", "情報不足"))}</b></td><td>{esc(item.get("basis", "一次情報から確認できませんでした"))}</td></tr>'
        for item in runtime
    )
    uses = meta.get("use_case_evaluation", [])
    use_html = "".join(
        f'<tr><td>{esc(item.get("label"))}</td><td><b>{esc(item.get("rating", "情報不足"))}</b></td><td>{esc(item.get("basis", "一次情報から確認できませんでした"))}</td></tr>'
        for item in uses
    )
    files = meta.get("gguf_files", [])
    files_html = "".join(
        f'<tr><td>{esc(item.get("quantization", "情報不足"))}</td><td>{esc(item.get("name"))}</td><td>{esc(item.get("size", "情報不足"))}</td></tr>'
        for item in files
    )
    return f'''{sections}
<h2>主な仕様</h2>{specs}
<h2>推奨量子化</h2><p class="compare-note">一般的なGGUF選択の目安であり、モデル固有の品質保証ではありません。</p>{table(quant_rows)}
<h2>必要メモリ目安</h2><p class="compare-note">モデルファイル容量を基準にした概算です。コンテキスト長などで必要量は変わります。</p>{table(memory_rows)}
<h2>対応ランタイム</h2><div class="table-wrap"><table class="compare-table"><thead><tr><th>ランタイム</th><th>判定</th><th>根拠</th></tr></thead><tbody>{runtime_html or '<tr><td colspan="3">情報不足</td></tr>'}</tbody></table></div>
<h2>用途評価</h2><div class="table-wrap"><table class="compare-table"><thead><tr><th>用途</th><th>評価</th><th>根拠</th></tr></thead><tbody>{use_html or '<tr><td colspan="3">情報不足</td></tr>'}</tbody></table></div>
<h2>GGUFファイル</h2><div class="table-wrap"><table class="compare-table"><thead><tr><th>量子化</th><th>ファイル</th><th>容量</th></tr></thead><tbody>{files_html or '<tr><td colspan="3">情報不足</td></tr>'}</tbody></table></div>'''


def article_html(entry: dict) -> str:
    tags = "".join(f'<span class="badge">{esc(tag)}</span>' for tag in entry.get("tags", [])) or "情報不足"
    researched = " · 一次情報による詳細調査済み" if entry.get("model_meta") else ""
    return f'''<article class="article">
<h1>{esc(entry.get("title"))}</h1>
<div class="meta">掲載日: {esc(entry.get("date"))}{researched}</div>
<aside class="infobox"><div class="title">{esc(entry.get("title"))}</div>
<div class="row"><b>情報源</b><span>{esc(entry.get("source"))}</span></div>
<div class="row"><b>カテゴリ</b><span>{esc(entry.get("category"))}</span></div>
<div class="row"><b>重要度</b><span>{esc(entry.get("priority"))}</span></div></aside>
<p class="lead">{esc(entry.get("summary"))}</p>
{model_details(entry)}
<h2>ローカル利用者への影響</h2><p>{esc(entry.get("impact"))}</p>
<h2>詳細</h2><p>{esc(entry.get("details"))}</p>
<h2>タグ</h2><p>{tags}</p>
<div class="sourcebox"><b>出典</b><br><a target="_blank" rel="noopener noreferrer" href="{esc(entry.get("source_url"))}">{esc(entry.get("source_url"))}</a></div>
</article>'''


def navigation(categories: list[str]) -> str:
    category_links = "".join(
        f'<a href="/category/{category_slug(category)}/">{esc(category)}</a>' for category in categories
    )
    return f'''<nav>
<a href="/">メインページ</a><a href="/articles/">記事一覧</a><a href="/guide/basics/">はじめてのローカルLLM</a>
<a href="/guide/models/">主要ローカルLLMモデル</a><a href="/guide/hardware/">自分のPCでどのモデルが動く？</a>
<a href="/guide/glossary/">ローカルLLM用語集</a><a href="/guide/compare/">モデル比較</a>
<h4>実践ガイド</h4><a href="/guide/start/">ローカルLLMの始め方</a><a href="/guide/download/">モデルをダウンロードするとき何を選べばいい？</a><a href="/guide/troubleshoot/">トラブルシューティング</a>
<h4>サイト</h4><a href="/about/">このサイトについて</a><a href="/operator.html">運営者情報</a><a href="/contact.html">お問い合わせ</a><a href="/recent/">最近の更新</a>
<h4>カテゴリ</h4>{category_links}</nav>'''


def layout(*, title: str, description: str, canonical: str, body: str, categories: list[str], schema: dict, noindex: bool = False, legacy_redirect: bool = False) -> str:
    robots = '<meta name="robots" content="noindex,follow">' if noindex else '<meta name="robots" content="index,follow,max-image-preview:large">'
    redirect = """
<script>
(()=>{const go=()=>{const h=location.hash;if(!h.startsWith('#/'))return;let p=h.slice(1);if(p.startsWith('/article/'))p='/articles/'+p.slice(9);if(!p.endsWith('/'))p+='/';location.replace(p);};addEventListener('hashchange',go);go();})();
</script>""" if legacy_redirect else ""
    schema_json = json.dumps(schema, ensure_ascii=False).replace("</", "<\\/")
    return f'''<!doctype html>
<html lang="ja"><head>
<meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1"><meta name="theme-color" content="#071427">
<title>{esc(title)}</title><meta name="description" content="{esc(description)}">{robots}
<link rel="canonical" href="{esc(canonical)}"><link rel="alternate" type="application/rss+xml" title="{SITE_NAME}" href="/feed.xml">
<meta property="og:type" content="website"><meta property="og:site_name" content="{SITE_NAME}"><meta property="og:title" content="{esc(title)}"><meta property="og:description" content="{esc(description)}"><meta property="og:url" content="{esc(canonical)}">
<link rel="icon" href="/assets/favicon.ico" sizes="any"><link rel="icon" type="image/png" sizes="32x32" href="/assets/site-icon-32.png"><link rel="apple-touch-icon" href="/assets/apple-touch-icon.png"><link rel="manifest" href="/site.webmanifest"><link rel="stylesheet" href="/assets/wiki.css"><link rel="stylesheet" href="/assets/research-status-v1032.css">
<script async src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-5222146333207141" crossorigin="anonymous"></script>
<script type="application/ld+json">{schema_json}</script>{redirect}
</head><body>
<header class="top"><button id="menuBtn" aria-label="メニュー" aria-controls="side" aria-expanded="false">☰</button><a class="brand" href="/"><img class="site-logo" src="/assets/site-icon-64.png" alt=""><span>{SITE_NAME}</span></a><div class="search"><a href="/articles/">記事を探す</a></div></header>
<div class="page"><aside id="side">{navigation(categories)}<section class="about"><b>編集方針</b><p>公式・一次情報を優先し、公開基準を満たした内容だけを一覧掲載します。</p></section></aside><main id="app">{clean_internal_links(body)}</main></div>
<footer>{SITE_NAME} — <a href="/articles/">記事一覧</a> · <a href="/about/">このサイトについて</a> · <a href="/operator.html">運営者情報</a> · <a href="/contact.html">お問い合わせ</a> · <a href="/privacy.html">プライバシーポリシー</a></footer>
<script>(()=>{{const button=document.getElementById('menuBtn');const side=document.getElementById('side');button?.addEventListener('click',()=>{{const open=side.classList.toggle('open');button.setAttribute('aria-expanded',String(open));}});side?.addEventListener('click',event=>{{if(event.target.closest('a')){{side.classList.remove('open');button?.setAttribute('aria-expanded','false');}}}});}})();</script>
</body></html>'''


def write_page(output: Path, route: str, document: str) -> None:
    target = output / route.strip("/") / "index.html" if route != "/" else output / "index.html"
    target.parent.mkdir(parents=True, exist_ok=True)
    target.write_text(document, encoding="utf-8", newline="\n")


def build(output: Path) -> dict:
    db = read_json(SOURCE_DOCS / "data" / "wiki.json")
    static_pages = load_static_pages()
    all_entries = db.get("entries", [])
    published = [entry for entry in all_entries if is_publishable(entry)]
    categories = sorted({str(entry.get("category")) for entry in published if entry.get("category")})

    if output.resolve() != SOURCE_DOCS.resolve():
        if output.exists():
            shutil.rmtree(output)
        shutil.copytree(SOURCE_DOCS, output)

    common_schema = {"@context": "https://schema.org", "@type": "WebSite", "name": SITE_NAME, "url": BASE_URL + "/", "inLanguage": "ja"}
    write_page(output, "/", layout(title=SITE_NAME, description=db["site"]["description"], canonical=BASE_URL + "/", body=home_html(db["site"], published), categories=categories, schema=common_schema, legacy_redirect=True))
    write_page(output, "/articles/", layout(title=f"記事一覧 - {SITE_NAME}", description="ローカルLLMの常設ガイドと、一次情報を確認した新着記事の一覧です。", canonical=BASE_URL + "/articles/", body=content_index_html(static_pages, published), categories=categories, schema={"@context": "https://schema.org", "@type": "CollectionPage", "name": "記事一覧", "url": BASE_URL + "/articles/", "inLanguage": "ja"}))

    sitemap: list[tuple[str, str]] = [(BASE_URL + "/", db["site"].get("last_updated", "")), (BASE_URL + "/articles/", db["site"].get("last_updated", ""))]
    for page in static_pages:
        route = route_to_path(page["route"])
        canonical = BASE_URL + route
        write_page(output, route, layout(title=f'{page["title"]} - {SITE_NAME}', description=page["summary"], canonical=canonical, body=page["html"], categories=categories, schema={"@context": "https://schema.org", "@type": "Article", "headline": page["title"], "description": page["summary"], "url": canonical, "inLanguage": "ja", "publisher": {"@type": "Organization", "name": SITE_NAME}}))
        sitemap.append((canonical, db["site"].get("last_updated", "")))

    recent = sorted(published, key=lambda item: item.get("date", ""), reverse=True)
    write_page(output, "/recent/", layout(title=f"最近の更新 - {SITE_NAME}", description="Local LLM Wikiの最近の更新です。", canonical=BASE_URL + "/recent/", body=f'<div class="article"><h1>最近の更新</h1>{list_html(recent)}</div>', categories=categories, schema={"@context": "https://schema.org", "@type": "CollectionPage", "name": "最近の更新", "url": BASE_URL + "/recent/"}))
    sitemap.append((BASE_URL + "/recent/", db["site"].get("last_updated", "")))

    for category in categories:
        route = f'/category/{category_slug(category)}/'
        items = [entry for entry in recent if entry.get("category") == category]
        write_page(output, route, layout(title=f"{category}の記事 - {SITE_NAME}", description=f"{category}に関するローカルLLM記事の一覧です。", canonical=BASE_URL + route, body=f'<div class="article"><h1>カテゴリ: {esc(category)}</h1>{list_html(items)}</div>', categories=categories, schema={"@context": "https://schema.org", "@type": "CollectionPage", "name": f"{category}の記事", "url": BASE_URL + route}))
        sitemap.append((BASE_URL + route, db["site"].get("last_updated", "")))

    for entry in all_entries:
        route = f'/articles/{quote(str(entry["id"]), safe="")}/'
        canonical = BASE_URL + route
        publish = is_publishable(entry)
        schema = {"@context": "https://schema.org", "@type": "Article", "headline": entry.get("title"), "description": entry.get("summary"), "datePublished": entry.get("date"), "dateModified": entry.get("last_updated", entry.get("date")), "mainEntityOfPage": canonical, "url": canonical, "inLanguage": "ja", "publisher": {"@type": "Organization", "name": SITE_NAME}}
        write_page(output, route, layout(title=f'{entry.get("title")} - {SITE_NAME}', description=entry.get("summary", ""), canonical=canonical, body=article_html(entry), categories=categories, schema=schema, noindex=not publish))
        if publish:
            sitemap.append((canonical, entry.get("last_updated", entry.get("date", ""))))

    for name in ("operator.html", "contact.html", "privacy.html"):
        sitemap.append((f"{BASE_URL}/{name}", db["site"].get("last_updated", "")))

    xml_rows = "".join(f"<url><loc>{esc(url)}</loc><lastmod>{esc(lastmod)}</lastmod></url>" for url, lastmod in sitemap)
    (output / "sitemap.xml").write_text(f'<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">{xml_rows}</urlset>\n', encoding="utf-8", newline="\n")
    (output / "robots.txt").write_text(f"User-agent: *\nAllow: /\n\nSitemap: {BASE_URL}/sitemap.xml\n", encoding="utf-8", newline="\n")
    (output / "ads.txt").write_text("google.com, pub-5222146333207141, DIRECT, f08c47fec0942fa0\n", encoding="utf-8", newline="\n")

    feed_items = []
    for entry in recent[:20]:
        link = f'{BASE_URL}/articles/{quote(str(entry["id"]), safe="")}/'
        try:
            published_at = datetime.fromisoformat(str(entry.get("date"))).replace(tzinfo=timezone.utc)
        except ValueError:
            published_at = datetime.now(timezone.utc)
        feed_items.append(f'<item><title>{esc(entry.get("title"))}</title><link>{esc(link)}</link><guid>{esc(link)}</guid><pubDate>{format_datetime(published_at)}</pubDate><description>{esc(entry.get("summary"))}</description></item>')
    (output / "feed.xml").write_text(f'<?xml version="1.0" encoding="UTF-8"?>\n<rss version="2.0"><channel><title>{SITE_NAME}</title><link>{BASE_URL}/</link><description>{esc(db["site"].get("description"))}</description><language>ja</language>{"".join(feed_items)}</channel></rss>\n', encoding="utf-8", newline="\n")

    not_found = layout(title=f"ページが見つかりません - {SITE_NAME}", description="指定されたページは見つかりませんでした。", canonical=BASE_URL + "/404.html", body='<div class="article"><h1>ページが見つかりません</h1><p>URLをご確認いただくか、<a href="/articles/">記事一覧</a>からお探しください。</p></div>', categories=categories, schema=common_schema, noindex=True)
    (output / "404.html").write_text(not_found, encoding="utf-8", newline="\n")
    return {"evergreen": len(static_pages), "published": len(published), "noindex": len(all_entries) - len(published), "urls": len(sitemap)}


def main() -> None:
    parser = argparse.ArgumentParser()
    parser.add_argument("--output", type=Path, default=SOURCE_DOCS)
    args = parser.parse_args()
    result = build(args.output)
    print(f"static site OK: {result['evergreen']} evergreen, {result['published']} published articles, {result['noindex']} noindex, {result['urls']} sitemap URLs")


if __name__ == "__main__":
    main()
