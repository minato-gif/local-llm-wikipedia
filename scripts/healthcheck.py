#!/usr/bin/env python3
import json
from pathlib import Path

root = Path(__file__).resolve().parents[1]
db = json.loads((root/"docs/data/wiki.json").read_text(encoding="utf-8"))
assert isinstance(db.get("entries"), list)
assert db.get("site", {}).get("title")
for e in db["entries"]:
    for key in ["id","date","title","source","category","priority","summary","impact","details","tags"]:
        assert key in e, f"missing {key}: {e.get('title')}"
print(f"healthcheck OK: {len(db['entries'])} entries")
