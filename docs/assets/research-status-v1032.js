/* Local LLM Wiki v10.3.2 - research status layout only
 * Safe formatter: does not create/observe pages, does not use MutationObserver.
 * It only reformats an already-rendered .research-status box.
 */
(()=>{
  const escHtml = v => String(v ?? "").replace(/[&<>"']/g,c=>({
    "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
  }[c]));

  function getCurrentData(){
    const route = location.hash || "#/";
    const maintenance = window.MAINTENANCE || {};
    if (maintenance[route]) return maintenance[route];

    if (route.startsWith("#/article/")) {
      try {
        const id = decodeURIComponent(route.split("/").slice(2).join("/"));
        if (typeof DB !== "undefined" && DB && Array.isArray(DB.entries)) {
          const e = DB.entries.find(x=>x && x.id===id && x.category==="モデル");
          if (e) {
            return {
              first_published:e.first_published || e.date || "",
              last_researched:e.last_researched || "",
              last_updated:e.last_updated || e.date || "",
              update_count:e.update_count || 0,
              research_history:e.research_history || [],
              latest_findings:e.latest_findings || ""
            };
          }
        }
      } catch (_) {}
    }
    return null;
  }

  function dates(history, changedOnly=false){
    const xs=(Array.isArray(history)?history:[])
      .filter(x=>x && (!changedOnly || x.changed))
      .map(x=>x.date)
      .filter(Boolean);
    return xs.length ? xs.join(" / ") : "なし";
  }

  function value(v, fallback="未実施"){
    return v ? escHtml(v) : fallback;
  }

  function formatExistingStatus(){
    const box=document.querySelector("#app .research-status");
    if(!box || box.dataset.compactLayout==="1") return;

    const d=getCurrentData();
    if(!d) return;

    box.dataset.compactLayout="1";
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
        <div>${escHtml(dates(d.research_history,false))}</div>
      </div>
      <div class="research-history-row">
        <div class="research-history-label">追加更新</div>
        <div>${escHtml(dates(d.research_history,true))}</div>
      </div>

      ${d.latest_findings ? `
        <div class="research-latest">
          <div class="research-latest-title">最新の追加調査</div>
          <div>${escHtml(d.latest_findings)}</div>
        </div>` : ""}
    `;
  }

  function run(){
    setTimeout(formatExistingStatus, 0);
    setTimeout(formatExistingStatus, 120);
    setTimeout(formatExistingStatus, 500);
  }

  window.addEventListener("hashchange", run);
  window.addEventListener("pageshow", run);
  document.addEventListener("DOMContentLoaded", run);
  run();
})();
