/* Local LLM Wiki v10.2: unified model guidance renderer */
(()=>{
  if(typeof article!=="function") return;
  const oldArticle=article;
  const safe=v=>esc(v??"");
  const MISSING="情報不足";
  const NOT_CONFIRMED="一次情報から確認できませんでした";
  const CANNOT_ESTIMATE="概算不能";

  const isModelArticle=e=>e && (e.category==="モデル" || e.model_meta || e.article_sections);

  const specRows=(m={})=>{
    const rows=[];
    const val=v=>(v!==undefined&&v!==null&&String(v).trim()!=="")?v:MISSING;
    const add=(k,v)=>rows.push(`<tr><th>${safe(k)}</th><td>${safe(val(v))}</td></tr>`);
    add("モデルID",m.model_id);
    add("配布者",m.author);
    add("元モデル",m.base_model);
    add("ライセンス",m.license);
    add("アーキテクチャ",(m.architectures||[]).join(", ")||m.model_type);
    add("コンテキスト長",m.context_length?`${Number(m.context_length).toLocaleString()} tokens`:"");
    add("用途タグ",m.pipeline_tag);
    add("ライブラリ",m.library_name);
    add("Downloads",m.downloads!==undefined?Number(m.downloads).toLocaleString():"");
    add("Likes",m.likes!==undefined?Number(m.likes).toLocaleString():"");
    add("GGUFファイル数",m.gguf_file_count!==undefined?m.gguf_file_count:"");
    add("量子化",(m.quantizations||[]).join(", "));
    return `<h2>主な仕様</h2><div class="table-wrap"><table class="compare-table"><tbody>${rows.join("")}</tbody></table></div>`;
  };

  const quantRow=(label,x)=>{
    if(!x){
      return `<tr><th>${safe(label)}</th><td><b>${MISSING}</b><br><small>${NOT_CONFIRMED}</small></td></tr>`;
    }
    return `<tr><th>${safe(x.label||label)}</th><td><b>${safe(x.quantization||MISSING)}</b>${x.size?` (${safe(x.size)})`:""}<br><small>${safe(x.reason||NOT_CONFIRMED)}</small></td></tr>`;
  };

  const quantGuide=(m={})=>{
    const r=m.quantization_recommendation||{};
    return `<h2>推奨量子化</h2>
      <p class="compare-note">以下は一般的なGGUF選択の目安です。モデル固有のベンチマークではありません。情報を確認できない場合は「情報不足」と表示します。</p>
      <div class="table-wrap"><table class="compare-table"><tbody>
        ${quantRow("バランス重視",r.balanced)}
        ${quantRow("品質重視",r.quality)}
        ${quantRow("省メモリ重視",r.low_memory)}
      </tbody></table></div>`;
  };

  const memoryGuide=(m={})=>{
    const x=m.memory_estimate||{};
    const val=(v,suffix="")=>(v!==undefined&&v!==null&&String(v).trim()!=="")?`${safe(v)}${suffix}`:CANNOT_ESTIMATE;
    return `<h2>必要メモリ目安</h2>
      <p class="compare-note">モデルファイル容量を基準にした概算です。算出材料が不足している場合は「概算不能」と表示します。</p>
      <div class="table-wrap"><table class="compare-table"><tbody>
        <tr><th>基準量子化</th><td>${x.basis_quantization?safe(x.basis_quantization):MISSING}</td></tr>
        <tr><th>モデルファイル容量</th><td>${val(x.model_file_size_gib," GiB")}</td></tr>
        <tr><th>最低RAM目安</th><td>${val(x.system_ram_min_gib," GiB")}</td></tr>
        <tr><th>推奨RAM目安</th><td>${val(x.system_ram_recommended_gib," GiB")}</td></tr>
        <tr><th>フルGPUオフロード時VRAM目安</th><td>${val(x.full_gpu_vram_rough_gib," GiB")}</td></tr>
      </tbody></table></div>
      <p><small>${safe(x.note||"コンテキスト長、KVキャッシュ、GPUオフロード率、ランタイム実装によって必要量は変わります。")}</small></p>`;
  };

  const runtimeDefaults=[
    {name:"llama.cpp"},
    {name:"LM Studio"},
    {name:"Ollama"},
    {name:"KoboldCpp"},
    {name:"vLLM"},
    {name:"MLX"},
    {name:"Transformers"},
    {name:"SGLang"}
  ];

  const runtimeGuide=(m={})=>{
    const actual=Array.isArray(m.runtime_support)?m.runtime_support:[];
    const by=new Map(actual.map(x=>[String(x.name||"").toLowerCase(),x]));
    const rows=runtimeDefaults.map(def=>{
      const x=by.get(def.name.toLowerCase());
      if(!x){
        return `<tr><td>${safe(def.name)}</td><td><b>${MISSING}</b></td><td>${NOT_CONFIRMED}</td></tr>`;
      }
      return `<tr><td>${safe(def.name)}</td><td><b>${safe(x.status||MISSING)}</b></td><td>${safe(x.basis||NOT_CONFIRMED)}</td></tr>`;
    }).join("");
    return `<h2>対応ランタイム</h2>
      <p class="compare-note">「情報不足」は非対応を意味しません。一次情報やモデルカードから確認できなかった状態です。</p>
      <div class="table-wrap"><table class="compare-table">
      <thead><tr><th>ランタイム</th><th>判定</th><th>根拠</th></tr></thead>
      <tbody>${rows}</tbody></table></div>`;
  };

  const useDefaults=[
    "チャット",
    "コーディング",
    "推論・数学",
    "日本語",
    "ツール利用・エージェント",
    "画像理解・マルチモーダル",
    "長文コンテキスト"
  ];

  const useGuide=(m={})=>{
    const actual=Array.isArray(m.use_case_evaluation)?m.use_case_evaluation:[];
    const by=new Map(actual.map(x=>[String(x.label||""),x]));
    const rows=useDefaults.map(label=>{
      const x=by.get(label);
      if(!x){
        return `<tr><td>${safe(label)}</td><td><b>${MISSING}</b></td><td>${NOT_CONFIRMED}</td></tr>`;
      }
      return `<tr><td>${safe(label)}</td><td><b>${safe(x.rating||MISSING)}</b></td><td>${safe(x.basis||NOT_CONFIRMED)}</td></tr>`;
    }).join("");
    return `<h2>用途評価</h2>
      <p class="compare-note">モデルカード・タグ・configから確認できる情報だけで評価しています。「情報不足」は不得意という意味ではありません。</p>
      <div class="table-wrap"><table class="compare-table">
      <thead><tr><th>用途</th><th>評価</th><th>根拠</th></tr></thead>
      <tbody>${rows}</tbody></table></div>`;
  };

  const fileTable=(m={})=>{
    const fs=Array.isArray(m.gguf_files)?m.gguf_files:[];
    if(!fs.length){
      return `<h2>GGUFファイル</h2><p>${MISSING} — ${NOT_CONFIRMED}</p>`;
    }
    return `<h2>GGUFファイル</h2><div class="table-wrap"><table class="compare-table">
      <thead><tr><th>量子化</th><th>ファイル</th><th>容量</th></tr></thead>
      <tbody>${fs.map(f=>`<tr><td>${safe(f.quantization||MISSING)}</td><td>${safe(f.name||MISSING)}</td><td>${safe(f.size||MISSING)}</td></tr>`).join("")}</tbody>
    </table></div>`;
  };

  const sections=e=>(Array.isArray(e.article_sections)?e.article_sections:[])
    .filter(s=>s&&s.title&&s.text)
    .map(s=>`<h2>${safe(s.title)}</h2><p>${safe(s.text)}</p>`).join("");

  article=function(e){
    if(!isModelArticle(e))return oldArticle(e);
    const m=e.model_meta||{};
    const src=(typeof safeHref==="function"?safeHref(e.source_url):e.source_url)||"";
    return `<article class="article">
      <h1>${safe(e.title)}</h1>
      <div class="meta">掲載日: ${safe(e.date)}${e.model_meta?" · 一次情報による詳細調査済み":" · 詳細情報の一部は未取得"}</div>
      <aside class="infobox">
        <div class="title">${safe(e.title)}</div>
        <div class="row"><b>情報源</b><span>${safe(e.source)}</span></div>
        <div class="row"><b>カテゴリ</b><span>${safe(e.category)}</span></div>
        <div class="row"><b>重要度</b><span>${safe(e.priority)}</span></div>
      </aside>
      <p class="lead">${safe(e.summary)}</p>
      ${sections(e)}
      ${specRows(m)}
      ${quantGuide(m)}
      ${memoryGuide(m)}
      ${runtimeGuide(m)}
      ${useGuide(m)}
      ${fileTable(m)}
      <h2>ローカル利用者への影響</h2><p>${safe(e.impact||NOT_CONFIRMED)}</p>
      <h2>詳細</h2><p>${safe(e.details||NOT_CONFIRMED)}</p>
      <h2>タグ</h2><p>${(e.tags||[]).length?(e.tags||[]).map(t=>`<span class="badge">${safe(t)}</span>`).join(""):MISSING}</p>
      ${src?`<div class="sourcebox"><b>出典</b><br><a target="_blank" rel="noopener noreferrer" href="${safe(src)}">${safe(src)}</a></div>`:`<div class="sourcebox"><b>出典</b><br>${NOT_CONFIRMED}</div>`}
    </article>`;
  };
})();
