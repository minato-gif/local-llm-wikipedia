/* Local LLM Wiki v10.3.1
 * Robust continuous-research status renderer.
 * Does not depend on wrapping staticPage().
 */
(()=>{
  const STATUS_CLASS = "research-status";
  const STATUS_MARK = "data-v1031-research-status";

  const safe = v => {
    try { return esc(v ?? ""); }
    catch (_) {
      return String(v ?? "").replace(/[&<>"']/g,c=>({
        "&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;","'":"&#39;"
      }[c]));
    }
  };

  const fmt = v => v ? safe(v) : "未実施";

  const historyDates = (history, changedOnly=false) => {
    const dates = (Array.isArray(history) ? history : [])
      .filter(x => x && (!changedOnly || x.changed))
      .map(x => x.date)
      .filter(Boolean);
    return dates.length ? dates.join(" / ") : "なし";
  };

  const researchBox = item => {
    if (!item) return "";
    return `<div class="notice ${STATUS_CLASS}" ${STATUS_MARK}="1">
      <b>継続調査ステータス</b><br>
      初回掲載: ${fmt(item.first_published)}<br>
      最終調査: ${fmt(item.last_researched)}<br>
      最終更新: ${fmt(item.last_updated)}<br>
      更新回数: ${Number(item.update_count || 0)}回<br>
      追加調査: ${safe(historyDates(item.research_history, false))}<br>
      追加更新: ${safe(historyDates(item.research_history, true))}
      ${item.latest_findings
        ? `<hr><b>最新の追加調査</b><br>${safe(item.latest_findings)}`
        : ""}
    </div>`;
  };

  function currentRoute(){
    return location.hash || "#/";
  }

  function getStaticMaintenance(){
    const maintenance = window.MAINTENANCE || {};
    return maintenance[currentRoute()] || null;
  }

  function getCurrentModelEntry(){
    const route = currentRoute();
    if (!route.startsWith("#/article/")) return null;

    const id = decodeURIComponent(route.split("/").slice(2).join("/"));
    try {
      if (typeof DB === "undefined" || !DB || !Array.isArray(DB.entries)) return null;
      return DB.entries.find(e => e && e.id === id && e.category === "モデル") || null;
    } catch (_) {
      return null;
    }
  }

  function modelMaintenance(entry){
    if (!entry) return null;
    return {
      first_published: entry.first_published || entry.date || "",
      last_researched: entry.last_researched || "",
      last_updated: entry.last_updated || entry.date || "",
      update_count: entry.update_count || 0,
      research_history: entry.research_history || [],
      latest_findings: entry.latest_findings || ""
    };
  }

  function removeOldStatus(article){
    article.querySelectorAll(`.${STATUS_CLASS}, [${STATUS_MARK}]`).forEach(node => node.remove());
  }

  function insertStatus(article, item){
    if (!article || !item) return false;

    removeOldStatus(article);

    const wrapper = document.createElement("div");
    wrapper.innerHTML = researchBox(item).trim();
    const box = wrapper.firstElementChild;
    if (!box) return false;

    // User requested the research dates directly below the publication/reference date.
    const meta = article.querySelector(":scope > .meta");
    if (meta) {
      meta.insertAdjacentElement("afterend", box);
      return true;
    }

    const h1 = article.querySelector(":scope > h1");
    if (h1) {
      h1.insertAdjacentElement("afterend", box);
      return true;
    }

    article.prepend(box);
    return true;
  }

  function applyResearchStatus(){
    const app = document.querySelector("#app");
    if (!app) return;

    const article = app.querySelector(".article");
    if (!article) return;

    // Evergreen/static pages have priority.
    const staticItem = getStaticMaintenance();
    if (staticItem) {
      insertStatus(article, staticItem);
      return;
    }

    // Then individual model articles.
    const modelEntry = getCurrentModelEntry();
    if (modelEntry) {
      insertStatus(article, modelMaintenance(modelEntry));
      return;
    }

    // Avoid leaving a stale box behind when navigating SPA routes.
    removeOldStatus(article);
  }

  let scheduled = false;
  function scheduleApply(){
    if (scheduled) return;
    scheduled = true;
    queueMicrotask(()=>{
      scheduled = false;
      applyResearchStatus();
    });
  }

  // Existing wiki.js renders #app after fetch and on every hash change.
  // MutationObserver makes the injection independent of staticPage()/render implementation details.
  const app = document.querySelector("#app");
  if (app) {
    const observer = new MutationObserver(scheduleApply);
    observer.observe(app, {childList:true});
  }

  window.addEventListener("hashchange", ()=>setTimeout(applyResearchStatus, 0));
  window.addEventListener("pageshow", ()=>setTimeout(applyResearchStatus, 0));
  document.addEventListener("DOMContentLoaded", ()=>setTimeout(applyResearchStatus, 0));

  // Covers the initial asynchronous DB fetch/render in wiki.js.
  setTimeout(applyResearchStatus, 100);
  setTimeout(applyResearchStatus, 500);
})();
