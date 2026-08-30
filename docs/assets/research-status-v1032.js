/* Local LLM Wiki v10.3.2.1
 * Safe research-status generator + compact layout.
 * No MutationObserver. Finite retries only.
 */
(()=>{
  const MARK = "data-research-status-v10321";

  const escHtml = v => String(v ?? "").replace(/[&<>"']/g,c=>({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[c]));

  const routeNow = () => location.hash || "#/";

  function historyDates(history, changedOnly=false){
    const xs=(Array.isArray(history)?history:[])
      .filter(x=>x && (!changedOnly || x.changed))
      .map(x=>x.date)
      .filter(Boolean);
    return xs.length ? xs.join(" / ") : "なし";
  }

  function staticData(){
    const m=window.MAINTENANCE || {};
    return m[routeNow()] || null;
  }

  function modelData(){
    const route=routeNow();
    if(!route.startsWith("#/article/")) return null;
    try{
      const id=decodeURIComponent(route.split("/").slice(2).join("/"));
      if(typeof DB==="undefined" || !DB || !Array.isArray(DB.entries)) return null;
      const e=DB.entries.find(x=>x && x.id===id && x.category==="モデル");
      if(!e) return null;
      return {
        first_published:e.first_published || e.date || "",
        last_researched:e.last_researched || "",
        last_updated:e.last_updated || e.date || "",
        update_count:e.update_count || 0,
        research_history:e.research_history || [],
        latest_findings:e.latest_findings || ""
      };
    }catch(_){
      return null;
    }
  }

  function currentData(){
    return staticData() || modelData();
  }

  function value(v, fallback="未実施"){
    return v ? escHtml(v) : fallback;
  }

  function makeBox(d){
    const box=document.createElement("div");
    box.className="notice research-status";
    box.setAttribute(MARK,"1");
    box.innerHTML=`
      <div class="research-title">継続調査ステータス</div>

      <div class="research-summary-grid">
        <div class="research-summary-item">
          <span class="research-summary-label">初回掲載</span>
          <span class="research-summary-value">${value(d.first_published)}</span>
        </div>
        <div class="research-summary-item">
          <span class="research-summary-label">最終調査</span>
          <span class="research-summary-value">${value(d.last_researched)}</span>
        </div>
        <div class="research-summary-item">
          <span class="research-summary-label">最終更新</span>
          <span class="research-summary-value">${value(d.last_updated)}</span>
        </div>
        <div class="research-summary-item">
          <span class="research-summary-label">更新回数</span>
          <span class="research-summary-value">${Number(d.update_count||0)}回</span>
        </div>
      </div>

      <div class="research-history-row">
        <div class="research-history-label">追加調査</div>
        <div>${escHtml(historyDates(d.research_history,false))}</div>
      </div>

      <div class="research-history-row">
        <div class="research-history-label">追加更新</div>
        <div>${escHtml(historyDates(d.research_history,true))}</div>
      </div>

      ${d.latest_findings ? `
        <div class="research-latest">
          <div class="research-latest-title">最新の追加調査</div>
          <div>${escHtml(d.latest_findings)}</div>
        </div>` : ""}
    `;
    return box;
  }

  function clearBoxes(){
    document.querySelectorAll(`[${MARK}], #app .research-status`).forEach(x=>x.remove());
  }

  function renderStatus(){
    const app=document.querySelector("#app");
    if(!app) return false;

    const article=app.querySelector(".article");
    if(!article) return false;

    const data=currentData();

    clearBoxes();
    if(!data) return true;

    const box=makeBox(data);

    const meta=article.querySelector(":scope > .meta");
    if(meta){
      meta.insertAdjacentElement("afterend",box);
      return true;
    }

    const h1=article.querySelector(":scope > h1");
    if(h1){
      h1.insertAdjacentElement("afterend",box);
      return true;
    }

    article.prepend(box);
    return true;
  }

  let retryToken=0;

  function scheduleRender(){
    const token=++retryToken;
    let tries=0;

    const attempt=()=>{
      if(token!==retryToken) return;
      tries++;

      const done=renderStatus();
      if(!done && tries<20){
        setTimeout(attempt,250);
      }
    };

    setTimeout(attempt,0);
  }

  // wiki.js has already registered its hashchange handler before this file loads.
  // We run after it via setTimeout, with finite retries for the initial async DB fetch.
  window.addEventListener("hashchange",scheduleRender);
  window.addEventListener("pageshow",scheduleRender);

  if(document.readyState==="loading"){
    document.addEventListener("DOMContentLoaded",scheduleRender,{once:true});
  }else{
    scheduleRender();
  }
})();
