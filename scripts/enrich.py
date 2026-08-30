#!/usr/bin/env python3
import json, re
from datetime import datetime, timezone, timedelta
from pathlib import Path
from urllib.parse import quote
import requests

ROOT = Path(__file__).resolve().parents[1]
DB = ROOT / "docs/data/wiki.json"
JST = timezone(timedelta(hours=9))
NOW = datetime.now(JST)
S = requests.Session()
S.headers.update({"User-Agent":"LocalLLMWikiBot/2.0","Accept":"application/json,text/plain,*/*"})
BACKFILL_DAYS = 14

def get_json(url, params=None):
    try:
        r=S.get(url,params=params,timeout=30); r.raise_for_status()
        x=r.json(); return x if isinstance(x,dict) else {}
    except Exception as e:
        print("[WARN]",url,e); return {}

def get_text(url, limit=5000):
    try:
        r=S.get(url,timeout=30); r.raise_for_status()
        return re.sub(r"\\s+"," ",r.text).strip()[:limit]
    except Exception:
        return ""

def human_bytes(v):
    try: n=int(v)
    except: return ""
    x=float(n)
    for u in ["B","KB","MB","GB","TB"]:
        if x<1024 or u=="TB":
            return f"{x:.1f} {u}" if u!="B" else f"{int(x)} B"
        x/=1024

def quant(name):
    s=name.upper()
    for pat in [r"(Q\\d(?:_[A-Z0-9]+)*)",r"((?:IQ|TQ)\\d(?:_[A-Z0-9]+)*)",r"(BF16|F16|F32|FP16|FP32|FP8|INT8|INT4)"]:
        m=re.search(pat,s)
        if m: return m.group(1)
    return ""

def context_len(cfg, card):
    keys=["max_position_embeddings","model_max_length","max_sequence_length","seq_length","n_positions","context_length"]
    for obj in [cfg,cfg.get("text_config",{}) if isinstance(cfg,dict) else {},card]:
        if not isinstance(obj,dict): continue
        for k in keys:
            v=obj.get(k)
            if isinstance(v,(int,float)) and v>0: return int(v)
    return None

def model_id(entry):
    url=entry.get("source_url","")
    if "huggingface.co/" in url:
        p=url.split("huggingface.co/",1)[1].split("?",1)[0].strip("/").split("/")
        if len(p)>=2: return "/".join(p[:2])
    t=re.sub(r"^Hugging Face:\\s*","",entry.get("title","")).strip()
    return t if "/" in t else ""

def recent(entry):
    try:
        d=datetime.fromisoformat(entry.get("date","")).replace(tzinfo=JST)
        return (NOW-d).total_seconds() <= BACKFILL_DAYS*86400
    except: return False

def enrich(entry):
    mid=model_id(entry)
    if not mid: return False
    api=get_json("https://huggingface.co/api/models/"+quote(mid,safe="/"),{"blobs":"true"})
    if not api: return False
    card=api.get("cardData") or {}
    cfg=api.get("config") or {}
    raw=get_json(f"https://huggingface.co/{mid}/resolve/main/config.json")
    if raw:
        z=dict(cfg); z.update(raw); cfg=z
    tags=[str(x) for x in (api.get("tags") or [])]
    license_name=str(card.get("license") or "")
    if not license_name:
        for t in tags:
            if t.startswith("license:"): license_name=t.split(":",1)[1]; break
    base=card.get("base_model") or card.get("base_models") or ""
    if isinstance(base,list): base=", ".join(str(x) for x in base[:5])
    arch=cfg.get("architectures") or []
    if isinstance(arch,str): arch=[arch]
    files=[]
    for f in api.get("siblings") or []:
        if not isinstance(f,dict): continue
        name=f.get("rfilename","")
        if not name.lower().endswith(".gguf"): continue
        lfs=f.get("lfs") if isinstance(f.get("lfs"),dict) else {}
        size=f.get("size") or lfs.get("size")
        try: size_i=int(size) if size is not None else None
        except: size_i=None
        files.append({"name":name,"quantization":quant(name),"size_bytes":size_i,"size":human_bytes(size_i)})
    files.sort(key=lambda x:(x["size_bytes"] is None,x["size_bytes"] or 0,x["name"]))
    qs=list(dict.fromkeys(x["quantization"] for x in files if x["quantization"]))
    sizes=[x["size_bytes"] for x in files if x["size_bytes"]]
    if sizes:
        hardware=f"確認できたGGUFのファイル容量は {human_bytes(min(sizes))}〜{human_bytes(max(sizes))}。実際の推論ではKVキャッシュ等も必要なため、VRAM/RAMには追加の余裕が必要です。"
    else:
        hardware="GGUF容量をAPIから確認できませんでした。対象ファイルの容量とランタイム側のメモリ見積もりを確認してください。"
    runtime="GGUF形式はllama.cpp系ランタイムで利用されます。ただし新しいアーキテクチャではランタイム側の対応が必要なため、LM Studio / llama.cppの対応状況を確認してください。" if files or "gguf" in [t.lower() for t in tags] else ""
    meta={
      "model_id":mid,"author":api.get("author") or mid.split("/")[0],"license":license_name,
      "base_model":str(base or ""),"architectures":[str(x) for x in arch[:6]],
      "model_type":str(cfg.get("model_type") or ""),"context_length":context_len(cfg,card),
      "pipeline_tag":str(api.get("pipeline_tag") or card.get("pipeline_tag") or ""),
      "library_name":str(api.get("library_name") or card.get("library_name") or ""),
      "downloads":int(api.get("downloads") or 0),"likes":int(api.get("likes") or 0),
      "last_modified":str(api.get("lastModified") or ""),"quantizations":qs[:20],
      "gguf_file_count":len(files),"gguf_files":files[:30],
      "hardware_hint":hardware,"runtime_hint":runtime
    }
    entry["model_meta"]=meta
    entry["enrichment_version"]=10
    sections=[{"title":"何が公開された？","text":f"Hugging Face上の「{mid}」が更新されています。確認時点の指標は downloads={meta['downloads']:,}、likes={meta['likes']:,} です。"}]
    bits=[]
    if meta["base_model"]: bits.append("元モデルは "+meta["base_model"])
    if meta["architectures"]: bits.append("アーキテクチャは "+", ".join(meta["architectures"]))
    if meta["pipeline_tag"]: bits.append("用途タグは "+meta["pipeline_tag"])
    if bits: sections.append({"title":"モデルの特徴","text":"。".join(bits)+"。"})
    if qs: sections.append({"title":"量子化・ファイル構成","text":f"ファイル名から判別できた量子化は {', '.join(qs)}。GGUFファイルは {len(files)} 件確認できました。"})
    sections.append({"title":"どんなPCなら使えそう？","text":hardware})
    if runtime: sections.append({"title":"LM Studio / llama.cppで使える？","text":runtime})
    warnings=[]
    if not license_name: warnings.append("ライセンス情報をAPIから確定できませんでした")
    if not meta["context_length"]: warnings.append("コンテキスト長をconfig/APIから確定できませんでした")
    if warnings: sections.append({"title":"注意点","text":"。".join(warnings)+"。"})
    entry["article_sections"]=sections
    if not entry.get("curated"):
        readme=get_text(f"https://huggingface.co/{mid}/resolve/main/README.md",3000)
        facts=[
          f"model_id={mid}",f"license={license_name or '不明'}",f"base_model={base or '不明'}",
          f"architecture={', '.join(meta['architectures']) or meta['model_type'] or '不明'}",
          f"context_length={meta['context_length'] or '不明'}",f"downloads={meta['downloads']:,}",
          f"likes={meta['likes']:,}",f"quantizations={', '.join(qs) or '不明'}"
        ]
        if readme: facts.append("model_card="+readme)
        entry["details"]="\\n".join(facts)
    return True

def main():
    db=json.loads(DB.read_text(encoding="utf-8")); changed=0
    for e in db.get("entries",[]):
        if e.get("source")!="Hugging Face Models": continue
        if e.get("enrichment_version",0)>=10: continue
        if e.get("curated") and not recent(e): continue
        print("[INFO] enriching",e.get("title"))
        if enrich(e): changed+=1
    if changed:
        DB.write_text(json.dumps(db,ensure_ascii=False,indent=2),encoding="utf-8")
    print(f"[OK] enriched {changed} entries")

if __name__=="__main__": main()
