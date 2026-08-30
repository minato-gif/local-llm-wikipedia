/* Local LLM Wiki v10: detailed news article renderer */
(()=>{
  if(typeof article!=="function") return;
  const oldArticle=article;

  const safe=v=>esc(v??"");
  const specRows=(m)=>{
    if(!m)return "";
    const rows=[];
    const add=(k,v)=>{if(v!==undefined&&v!==null&&String(v).trim()!=="")rows.push(`<tr><th>${safe(k)}</th><td>${safe(v)}</td></tr>`)};
    add("モデルID",m.model_id); add("配布者",m.author); add("元モデル",m.base_model);
    add("ライセンス",m.license); add("アーキテクチャ",(m.architectures||[]).join(", ")||m.model_type);
    add("コンテキスト長",m.context_length?`${Number(m.context_length).toLocaleString()} tokens`:"");
    add("用途タグ",m.pipeline_tag); add("ライブラリ",m.library_name);
    add("Downloads",m.downloads!==undefined?Number(m.downloads).toLocaleString():"");
    add("Likes",m.likes!==undefined?Number(m.likes).toLocaleString():"");
    add("GGUFファイル数",m.gguf_file_count); add("量子化",(m.quantizations||[]).join(", "));
    return rows.length?`<h2>主な仕様</h2><div class="table-wrap"><table class="compare-table"><tbody>${rows.join("")}</tbody></table></div>`:"";
  };
  const fileTable=(m)=>{
    const fs=(m&&m.gguf_files)||[];
    if(!fs.length)return "";
    return `<h2>GGUFファイル</h2><div class="table-wrap"><table class="compare-table">
      <thead><tr><th>量子化</th><th>ファイル</th><th>容量</th></tr></thead>
      <tbody>${fs.map(f=>`<tr><td>${safe(f.quantization||"—")}</td><td>${safe(f.name||"")}</td><td>${safe(f.size||"—")}</td></tr>`).join("")}</tbody>
    </table></div>`;
  };
  const sections=e=>(Array.isArray(e.article_sections)?e.article_sections:[])
    .filter(s=>s&&s.title&&s.text).map(s=>`<h2>${safe(s.title)}</h2><p>${safe(s.text)}</p>`).join("");

  article=function(e){
    if(!e.model_meta&&!e.article_sections)return oldArticle(e);
    const src=(typeof safeHref==="function"?safeHref(e.source_url):e.source_url)||"";
    return `<article class="article">
      <h1>${safe(e.title)}</h1>
      <div class="meta">掲載日: ${safe(e.date)} · 一次情報による詳細調査済み</div>
      <aside class="infobox">
        <div class="title">${safe(e.title)}</div>
        <div class="row"><b>情報源</b><span>${safe(e.source)}</span></div>
        <div class="row"><b>カテゴリ</b><span>${safe(e.category)}</span></div>
        <div class="row"><b>重要度</b><span>${safe(e.priority)}</span></div>
      </aside>
      <p class="lead">${safe(e.summary)}</p>
      ${sections(e)}
      ${specRows(e.model_meta)}
      ${fileTable(e.model_meta)}
      <h2>ローカル利用者への影響</h2><p>${safe(e.impact)}</p>
      <h2>詳細</h2><p>${safe(e.details)}</p>
      <h2>タグ</h2><p>${(e.tags||[]).map(t=>`<span class="badge">${safe(t)}</span>`).join("")}</p>
      ${src?`<div class="sourcebox"><b>出典</b><br><a target="_blank" rel="noopener noreferrer" href="${safe(src)}">${safe(src)}</a></div>`:""}
    </article>`;
  };
})();
