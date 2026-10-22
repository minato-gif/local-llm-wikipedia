"""Regression checks for category discovery and non-model article rendering."""
from html.parser import HTMLParser
from pathlib import Path
import sys
import tempfile
import unittest
from urllib.parse import unquote, urlsplit
import xml.etree.ElementTree as ET

sys.path.insert(0, str(Path(__file__).resolve().parents[1] / "scripts"))
import generate_static as site


class Links(HTMLParser):
    def __init__(self):
        super().__init__()
        self.urls = []

    def handle_starttag(self, tag, attrs):
        self.urls.extend(value for key, value in attrs if key in ("href", "src") and value)


class HarnessSiteTests(unittest.TestCase):
    @classmethod
    def setUpClass(cls):
        cls.temp = tempfile.TemporaryDirectory(prefix="llm-wiki-tests-")
        cls.output = Path(cls.temp.name) / "public"
        cls.result = site.build(cls.output)
        cls.db = site.read_json(site.SOURCE_DOCS / "data/wiki.json")
        cls.apps = [e for e in cls.db["entries"] if e.get("category") == "ハーネス"]

    @classmethod
    def tearDownClass(cls):
        cls.temp.cleanup()

    def test_category_and_sidebar(self):
        self.assertEqual(site.category_slug("ハーネス"), "harnesses")
        self.assertEqual(site.route_to_path("#/category/ハーネス"), "/category/harnesses/")
        category = (self.output / "category/harnesses/index.html").read_text(encoding="utf-8")
        home = (self.output / "index.html").read_text(encoding="utf-8")
        self.assertIn('href="/category/harnesses/">ハーネス</a>', home)
        self.assertIn('href="/guide/harnesses/"', category)
        self.assertGreaterEqual(len(self.apps), 6)
        for entry in self.apps:
            self.assertIn(f'/articles/{entry["id"]}/', category)

    def test_apps_are_published_and_do_not_have_model_specs(self):
        sitemap = (self.output / "sitemap.xml").read_text(encoding="utf-8")
        for entry in self.apps:
            with self.subTest(entry=entry["id"]):
                self.assertTrue(site.is_publishable(entry))
                document = (self.output / "articles" / entry["id"] / "index.html").read_text(encoding="utf-8")
                self.assertIn("アプリの位置づけ", document)
                self.assertIn("導入前の確認事項", document)
                self.assertNotIn("<h2>推奨量子化</h2>", document)
                self.assertNotIn('content="noindex,follow"', document)
                self.assertIn(f'/articles/{entry["id"]}/', sitemap)
                for section in entry["article_sections"]:
                    self.assertEqual(document.count(f'<h2>{site.esc(section["title"])}</h2>'), 1)
                for ref in entry["references"]:
                    self.assertIn(site.esc(ref["url"]), document)

    def test_existing_model_sections_remain_once_before_specs(self):
        for entry in self.db["entries"]:
            if not entry.get("model_meta") or not entry.get("article_sections"):
                continue
            document = site.article_html(entry, [], [])
            section = f'<h2>{site.esc(entry["article_sections"][0]["title"])}</h2>'
            self.assertEqual(document.count(section), 1)
            self.assertLess(document.index(section), document.index("<h2>主な仕様</h2>"))

    def test_non_model_sections_and_app_values_are_escaped(self):
        entry = {"article_sections": [{"title": "<script>", "text": "<img>"}, None, {}],
                 "app_meta": {"role": "<iframe>"}}
        document = site.article_html(entry, [], [])
        self.assertIn("&lt;script&gt;", document)
        self.assertIn("&lt;img&gt;", document)
        self.assertIn("&lt;iframe&gt;", document)
        self.assertNotIn("<iframe>", document)

    def test_section_anchors_are_not_converted_to_page_routes(self):
        fragment = '<a href="#basic-terms">用語</a><a href="#/guide/harnesses">ガイド</a>'
        converted = site.clean_internal_links(fragment)
        self.assertIn('href="#basic-terms"', converted)
        self.assertIn('href="/guide/harnesses/"', converted)

    def test_generated_internal_links_and_sitemap(self):
        missing = []
        for path in self.output.rglob("*.html"):
            parser = Links()
            parser.feed(path.read_text(encoding="utf-8"))
            for value in parser.urls:
                url = urlsplit(value)
                if url.scheme or url.netloc or not url.path:
                    continue
                target = (self.output if url.path.startswith("/") else path.parent) / unquote(url.path).lstrip("/")
                if target.is_dir():
                    target /= "index.html"
                if not target.exists():
                    missing.append((str(path.relative_to(self.output)), value))
        self.assertEqual(missing, [])
        xml = ET.parse(self.output / "sitemap.xml")
        locations = [node.text for node in xml.findall(".//{*}loc")]
        self.assertEqual(len(locations), len(set(locations)))
        self.assertIn(site.BASE_URL + "/category/harnesses/", locations)
        self.assertIn(site.BASE_URL + "/guide/harnesses/", locations)


if __name__ == "__main__":
    unittest.main()
