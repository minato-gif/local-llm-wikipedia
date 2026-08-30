#!/usr/bin/env python3
import json, re
from pathlib import Path

root = Path(__file__).resolve().parents[1]
db = json.loads((root/"docs/data/wiki.json").read_text(encoding="utf-8"))
assert isinstance(db.get("entries"), list)
assert db.get("site", {}).get("title")

for e in db["entries"]:
    for key in ["id","date","title","source","category","priority","summary","impact","details","tags"]:
        assert key in e, f"missing {key}: {e.get('title')}"
    if e.get("research_history") is not None:
        assert isinstance(e["research_history"], list)
        for h in e["research_history"]:
            assert h.get("date")
            assert isinstance(h.get("changed"), bool)

mfile = root/"docs/data/maintenance.js"
if mfile.exists():
    text = mfile.read_text(encoding="utf-8")
    m = re.search(r"window\.MAINTENANCE\s*=\s*(\{.*\})\s*;?\s*$", text, re.S)
    assert m, "invalid maintenance.js"
    maintenance = json.loads(m.group(1))
    for route, item in maintenance.items():
        assert route.startswith("#/")
        assert item.get("title")
        assert isinstance(item.get("research_history", []), list)

print(f"healthcheck OK: {len(db['entries'])} entries")
