#!/usr/bin/env python3
import json, math, re
from datetime import datetime, timezone, timedelta
from pathlib import Path
from urllib.parse import quote
import requests

ROOT = Path(__file__).resolve().parents[1]
DB = ROOT / "docs/data/wiki.json"
JST = timezone(timedelta(hours=9))
NOW = datetime.now(JST)
S = requests.Session()
S.headers.update({"User-Agent":"LocalLLMWikiBot/2.1","Accept":"application/json,text/plain,*/*"})
BACKFILL_DAYS = 14
ENRICHMENT_VERSION = 101

def get_json(url, params=None):
    try:
        r=S.get(url,params=params,timeout=30); r.raise_for_status()
        x=r.json(); return x if isinstance(x,dict) else {}
    except Exception as e:
        print("[WARN]",url,e); return {}

def get_text(url, limit=5000):
    try:
        r=S.get(url,timeout=30); r.raise_for_status()
        return re.sub(r"\s+"," ",r.text).strip()[:limit]
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

def round_half(x):
    return math.ceil(float(x)*2)/2

def quant(name):
    s=name.upper()
    for pat in [r"((?:IQ|TQ)\d(?:_[A-Z0-9]+)*)",r"(Q\d(?:_[A-Z0-9]+)*)",r"(BF16|F16|F32|FP16|FP32|FP8|INT8|INT4)"]:
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
    t=re.sub(r"^Hugging Face:\s*","",entry.get("title","")).strip()
    return t if "/" in t else ""

def recent(entry):
    try:
        d=datetime.fromisoformat(entry.get("date","")).replace(tzinfo=JST)
        return (NOW-d).total_seconds() <= BACKFILL_DAYS*86400
    except: return False

def quant_options(files):
    grouped={}
    for f in files:
        q=f.get("quantization") or ""
        if not q: continue
        g=grouped.setdefault(q,{"quantization":q,"size_bytes":0,"files":[]})
        if f.get("size_bytes"): g["size_bytes"] += int(f["size_bytes"])
        g["files"].append(f.get("name",""))
    out=[]
    for q,g in grouped.items():
        g["size"]=human_bytes(g["size_bytes"]) if g["size_bytes"] else ""
        out.append(g)
    out.sort(key=lambda x:(x["size_bytes"]==0,x["size_bytes"] or 0,x["quantization"]))
    return out

def choose_quant(options, order):
    by={x["quantization"].upper():x for x in options}
    for q in order:
        if q in by: return by[q]
    return None

def quant_recommendation(options):
    if not options: return {}
    balanced=choose_quant(options,["Q4_K_M","Q4_K_S","IQ4_XS","Q5_K_M","Q4_0"])
    quality=choose_quant(options,["Q5_K_M","Q6_K","Q8_0","Q5_K_S","Q4_K_M"])
    lowmem=choose_quant(options,["IQ3_M","Q3_K_M","Q3_K_S","IQ4_XS","Q4_K_S","Q4_K_M"])
    out={"method":"ファイル名と容量に基づく一般的なGGUF選択目安。品質や速度はモデルごとに異なります。"}
    if balanced:
        out["balanced"]={**balanced,"label":"バランス重視","reason":"容量・品質のバランスを取りやすい候補として選定。実際の品質はモデルごとに異なります。"}
    if quality:
        out["quality"]={**quality,"label":"品質重視","reason":"比較的情報保持量の多い候補。必要メモリは増えます。"}
    if lowmem:
        out["low_memory"]={**lowmem,"label":"省メモリ重視","reason":"比較的容量の小さい実用候補。品質低下とのトレードオフがあります。"}
    return out

def memory_estimate(rec):
    if not rec: return {}
    chosen=rec.get("balanced") or rec.get("quality") or rec.get("low_memory")
    if not chosen or not chosen.get("size_bytes"): return {}
    gib=chosen["size_bytes"]/(1024**3)
    return {
        "basis_quantization":chosen.get("quantization",""),
        "model_file_size_gib":round(gib,2),
        "system_ram_min_gib":round_half(gib*1.15+2),
        "system_ram_recommended_gib":round_half(gib*1.35+4),
        "full_gpu_vram_rough_gib":round_half(gib*1.15+1),
        "note":"概算です。コンテキスト長、KVキャッシュ、GPUオフロード率、ランタイム実装で必要量は変わります。特に長いコンテキストでは追加メモリが必要です。"
    }

def runtime_support(readme, tags, has_gguf):
    text=(readme+" "+" ".join(tags)).lower()
    out=[]
    def add(name,status,basis): out.append({"name":name,"status":status,"basis":basis})
    if "llama.cpp" in text or "llama-cpp" in text:
        add("llama.cpp","明示あり","モデルカードまたはタグ内にllama.cpp関連記載があります。")
    elif has_gguf:
        add("llama.cpp","有力候補","GGUF形式のため候補になりますが、このアーキテクチャへの対応バージョン確認が必要です。")
    if "lm studio" in text or "lmstudio" in text:
        add("LM Studio","明示あり","モデルカード内にLM Studio関連記載があります。")
    elif has_gguf:
        add("LM Studio","互換候補","GGUFを扱えますが、新しいアーキテクチャではLM Studio側の対応確認が必要です。")
    if "ollama" in text:
        add("Ollama","明示あり","モデルカード内にOllama関連記載があります。")
    elif has_gguf:
        add("Ollama","インポート候補","GGUFを取り込める場合がありますが、モデルアーキテクチャとテンプレートの対応確認が必要です。")
    if "koboldcpp" in text or "kobold cpp" in text:
        add("KoboldCpp","明示あり","モデルカード内にKoboldCpp関連記載があります。")
    elif has_gguf:
        add("KoboldCpp","互換候補","GGUF系ランタイムですが、アーキテクチャ対応状況の確認が必要です。")
    for name,needles in [("vLLM",["vllm"]),("MLX",["mlx"]),("Transformers",["transformers"]),("SGLang",["sglang"])]:
        if any(n in text for n in needles):
            add(name,"明示あり","モデルカードまたはタグ内に関連記載があります。")
    return out

def use_case_eval(mid, readme, tags, pipeline, context):
    text=(mid+" "+readme+" "+" ".join(tags)+" "+str(pipeline)).lower()
    out=[]
    def add(label,rating,basis): out.append({"label":label,"rating":rating,"basis":basis})
    if any(x in text for x in ["conversational","chat","instruct","assistant"]):
        add("チャット","高","モデル名・タグ・モデルカードにチャット/Instruction系の手掛かりがあります。")
    elif "text-generation" in text:
        add("チャット","中","text-generation用途は確認できますが、対話最適化の程度はモデルカードで要確認です。")
    else:
        add("チャット","情報不足","対話用途を裏付ける明確な情報を取得できませんでした。")
    if any(x in text for x in ["coder","coding","codegen","code generation","programming"]):
        add("コーディング","高","コード生成・Coder系の記載があります。")
    else:
        add("コーディング","情報不足","コード特化を示す明確な記載を取得できませんでした。")
    if any(x in text for x in ["reasoning","thinking","math","r1","chain-of-thought"]):
        add("推論・数学","高","Reasoning/Thinking/Math系の記載があります。")
    else:
        add("推論・数学","情報不足","推論特化を示す明確な記載を取得できませんでした。")
    if "japanese" in text or "日本語" in text:
        add("日本語","高","日本語対応を示す記載があります。")
    elif "multilingual" in text:
        add("日本語","中","多言語対応の記載はありますが、日本語品質は個別確認が必要です。")
    else:
        add("日本語","情報不足","日本語対応を直接裏付ける情報を取得できませんでした。")
    if any(x in text for x in ["tool calling","tool-calling","function calling","function-calling","agent"]):
        add("ツール利用・エージェント","高","Tool/Function CallingまたはAgent系の記載があります。")
    else:
        add("ツール利用・エージェント","情報不足","ツール利用を裏付ける明確な情報を取得できませんでした。")
    if any(x in text for x in ["vision","multimodal","image-text","vlm","image understanding"]):
        add("画像理解・マルチモーダル","高","Vision/Multimodal系の記載があります。")
    else:
        add("画像理解・マルチモーダル","情報不足","画像入力対応を裏付ける明確な情報を取得できませんでした。")
    if context:
        rating="高" if context>=65536 else "中" if context>=32768 else "標準"
        add("長文コンテキスト",rating,f"config/APIから最大コンテキスト長 {context:,} tokens を確認。実用上の推奨値はメモリ量で変わります。")
    return out

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
    readme=get_text(f"https://huggingface.co/{mid}/resolve/main/README.md",5000)
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
    ctx=context_len(cfg,card)
    options=quant_options(files)
    rec=quant_recommendation(options)
    mem=memory_estimate(rec)
    runtimes=runtime_support(readme,tags,bool(files) or "gguf" in [t.lower() for t in tags])
    uses=use_case_eval(mid,readme,tags,api.get("pipeline_tag") or card.get("pipeline_tag") or "",ctx)
    meta={
      "model_id":mid,"author":api.get("author") or mid.split("/")[0],"license":license_name,
      "base_model":str(base or ""),"architectures":[str(x) for x in arch[:6]],
      "model_type":str(cfg.get("model_type") or ""),"context_length":ctx,
      "pipeline_tag":str(api.get("pipeline_tag") or card.get("pipeline_tag") or ""),
      "library_name":str(api.get("library_name") or card.get("library_name") or ""),
      "downloads":int(api.get("downloads") or 0),"likes":int(api.get("likes") or 0),
      "last_modified":str(api.get("lastModified") or ""),"quantizations":qs[:20],
      "quantization_options":options[:30],"quantization_recommendation":rec,
      "memory_estimate":mem,"runtime_support":runtimes,"use_case_evaluation":uses,
      "gguf_file_count":len(files),"gguf_files":files[:30],
      "hardware_hint":hardware,"runtime_hint":runtime
    }
    entry["model_meta"]=meta
    entry["enrichment_version"]=ENRICHMENT_VERSION
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
        facts=[
          f"model_id={mid}",f"license={license_name or '不明'}",f"base_model={base or '不明'}",
          f"architecture={', '.join(meta['architectures']) or meta['model_type'] or '不明'}",
          f"context_length={meta['context_length'] or '不明'}",f"downloads={meta['downloads']:,}",
          f"likes={meta['likes']:,}",f"quantizations={', '.join(qs) or '不明'}"
        ]
        if rec.get("balanced"): facts.append("recommended_quantization="+rec["balanced"].get("quantization",""))
        if mem: facts.append("memory_estimate="+json.dumps(mem,ensure_ascii=False))
        if readme: facts.append("model_card="+readme[:3000])
        entry["details"]="\n".join(facts)
    return True

def main():
    db=json.loads(DB.read_text(encoding="utf-8")); changed=0
    for e in db.get("entries",[]):
        if e.get("source")!="Hugging Face Models": continue
        if e.get("enrichment_version",0)>=ENRICHMENT_VERSION: continue
        if e.get("curated") and not recent(e): continue
        print("[INFO] enriching",e.get("title"))
        if enrich(e): changed+=1
    if changed:
        DB.write_text(json.dumps(db,ensure_ascii=False,indent=2),encoding="utf-8")
    print(f"[OK] enriched {changed} entries")

if __name__=="__main__": main()
