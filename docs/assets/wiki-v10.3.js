/* Local LLM Wiki v10.3: continuous research metadata */
(()=>{
  const fmt=v=>v?esc(v):"未実施";
  const historyDates=(h, changedOnly=false)=>{
    const xs=(Array.isArray(h)?h:[]).filter(x=>!changedOnly||x.changed).map(x=>x.date).filter(Boolean);
    return xs.length?xs.join(" / "):"なし";
  };

  const researchBox=(x)=>{
    if(!x)return "";
    return `<div class="notice research-status">
      <b>継続調査ステータス</b><br>
      初回掲載: ${fmt(x.first_published)}<br>
      最終調査: ${fmt(x.last_researched)}<br>
      最終更新: ${fmt(x.last_updated)}<br>
      更新回数: ${Number(x.update_count||0)}回<br>
      追加調査: ${esc(historyDates(x.research_history,false))}<br>
      追加更新: ${esc(historyDates(x.research_history,true))}
      ${x.latest_findings?`<hr><b>最新の追加調査</b><br>${esc(x.latest_findings)}`:""}
    </div>`;
  };

  if(typeof article==="function"){
    const oldArticle=article;
    article=function(e){
      let html=oldArticle(e);
      if(!e || e.category!=="モデル")return html;
      const meta={
        first_published:e.first_published||e.date,
        last_researched:e.last_researched||"",
        last_updated:e.last_updated||e.date,
        update_count:e.update_count||0,
        research_history:e.research_history||[]
      };
      const box=researchBox(meta);
      const m=html.match(/<div class="meta">[\s\S]*?<\/div>/);
      if(m) html=html.replace(m[0],m[0]+box);
      else html=html.replace(/(<h1>[\s\S]*?<\/h1>)/,"$1"+box);
      return html;
    };
  }

  if(typeof staticPage==="function"){
    const oldStaticPage=staticPage;
    staticPage=function(route){
      let html=oldStaticPage(route);
      if(!html)return html;
      const item=(window.MAINTENANCE||{})[route];
      if(!item)return html;
      return html.replace(/(<h1>[\s\S]*?<\/h1>)/,"$1"+researchBox(item));
    };
  }
})();
