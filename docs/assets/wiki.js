let DB={site:{},entries:[]};
const STATIC=window.STATIC_PAGES||[];

const $=s=>document.querySelector(s);
const esc=s=>String(s??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#39;'}[c]));
const articleUrl=id=>`#/article/${encodeURIComponent(id)}`;

async function load(){
  DB=await fetch('data/wiki.json',{cache:'no-store'}).then(r=>r.json());
  buildCats();
  render();
}

function buildCats(){
  const cats=[...new Set(DB.entries.map(x=>x.category).filter(Boolean))].sort();
  $('#cats').innerHTML=cats.map(c=>`<a href="#/category/${encodeURIComponent(c)}">${esc(c)}</a>`).join('');
}

function list(entries){
  if(!entries.length)return '<p>該当する記事はありません。</p>';
  return entries.map(e=>`<article class="entry">
    <div class="meta">${esc(e.date)} · ${esc(e.source)}</div>
    <h3><a href="${articleUrl(e.id)}">${esc(e.title)}</a></h3>
    <p>${esc(e.summary)}</p>
    <span class="badge priority-${esc(e.priority)}">重要度 ${esc(e.priority)}</span>
    <span class="badge">${esc(e.category)}</span>
    ${(e.tags||[]).map(t=>`<span class="badge">${esc(t)}</span>`).join('')}
  </article>`).join('');
}

function home(){
  const latest=[...DB.entries].sort((a,b)=>b.date.localeCompare(a.date)).slice(0,12);
  const high=latest.filter(x=>x.priority==='高').slice(0,5);
  return `<div class="article">
    <h1>${esc(DB.site.title)}</h1>
    <p class="lead">${esc(DB.site.description)}</p>

    <div class="notice"><b>最終自動更新:</b> ${esc(DB.site.last_updated)}<br>
    GitHub Actions が毎日公式ソースを巡回し、重要な新着だけを追加します。</div>

    <h2>はじめての方へ</h2>
    <div class="grid">
      <div class="card"><h3><a href="#/guide/basics">ローカルLLM入門</a></h3><p>LLM、モデル、推論ランタイム、量子化、VRAMなどをやさしく解説。</p></div>
      <div class="card"><h3><a href="#/guide/models">主要モデル一覧</a></h3><p>Gemma 4、Qwen、gpt-oss、Llama、DeepSeekなど現在の主要モデルを紹介。</p></div>
      <div class="card"><h3><a href="#/guide/hardware">自分のPCでどのモデルが動く？</a></h3><p>VRAM 8GB / 12GB / 16GB / 24GB / 32GB以上を目安に、現実的なモデルサイズを紹介。</p></div>
      <div class="card"><h3><a href="#/about">このサイトについて</a></h3><p>自動更新の仕組み、編集方針、AI要約について。</p></div>
    </div>

    <h2>注目記事</h2>
    <div class="grid">${high.map(e=>`<div class="card"><h3><a href="${articleUrl(e.id)}">${esc(e.title)}</a></h3><p>${esc(e.summary)}</p></div>`).join('') || '<p>現在ありません。</p>'}</div>
    <h2>最近の更新</h2>${list(latest)}
  </div>`;
}

function article(e){
 return `<article class="article">
   <h1>${esc(e.title)}</h1>
   <div class="meta">掲載日: ${esc(e.date)}</div>
   <aside class="infobox">
    <div class="title">${esc(e.title)}</div>
    <div class="row"><b>情報源</b><span>${esc(e.source)}</span></div>
    <div class="row"><b>カテゴリ</b><span>${esc(e.category)}</span></div>
    <div class="row"><b>重要度</b><span>${esc(e.priority)}</span></div>
   </aside>
   <p class="lead">${esc(e.summary)}</p>
   <h2>ローカル利用者への影響</h2><p>${esc(e.impact)}</p>
   <h2>詳細</h2><p>${esc(e.details)}</p>
   <h2>タグ</h2><p>${(e.tags||[]).map(t=>`<span class="badge">${esc(t)}</span>`).join('')}</p>
   ${e.source_url?`<div class="sourcebox"><b>出典</b><br><a target="_blank" rel="noopener" href="${e.source_url}">${esc(e.source_url)}</a></div>`:''}
 </article>`;
}

function staticPage(route){
  const p=STATIC.find(x=>x.route===route);
  return p?p.html:null;
}

function render(){
 const h=location.hash||'#/';
 let html='';
 const staticHtml=staticPage(h);
 if(staticHtml) html=staticHtml;
 else if(h==='#/'||h==='#') html=home();
 else if(h==='#/recent')html=`<div class="article"><h1>最近の更新</h1>${list([...DB.entries].sort((a,b)=>b.date.localeCompare(a.date)))}</div>`;
 else if(h==='#/priority/high')html=`<div class="article"><h1>重要度: 高</h1>${list(DB.entries.filter(x=>x.priority==='高').sort((a,b)=>b.date.localeCompare(a.date)))}</div>`;
 else if(h.startsWith('#/category/')){
   const c=decodeURIComponent(h.split('/').slice(2).join('/'));
   html=`<div class="article"><h1>カテゴリ: ${esc(c)}</h1>${list(DB.entries.filter(x=>x.category===c).sort((a,b)=>b.date.localeCompare(a.date)))}</div>`;
 }else if(h.startsWith('#/article/')){
   const id=decodeURIComponent(h.split('/').slice(2).join('/'));
   const e=DB.entries.find(x=>x.id===id);
   html=e?article(e):'<div class="article"><h1>ページが見つかりません</h1></div>';
 }else html=home();
 $('#app').innerHTML=html;
 window.scrollTo(0,0);
 $('#side').classList.remove('open');
}

$('#menuBtn').onclick=()=>$('#side').classList.toggle('open');
window.addEventListener('hashchange',render);

$('#search').addEventListener('input',ev=>{
 const q=ev.target.value.trim().toLowerCase();
 const r=$('#results');
 if(!q){r.style.display='none';return}

 const newsHits=DB.entries
   .filter(e=>JSON.stringify(e).toLowerCase().includes(q))
   .slice(0,8)
   .map(e=>`<a class="hit" href="${articleUrl(e.id)}"><b>${esc(e.title)}</b><small>${esc(e.summary)}</small></a>`);

 const pageHits=STATIC
   .filter(p=>`${p.title} ${p.summary} ${(p.keywords||[]).join(' ')}`.toLowerCase().includes(q))
   .slice(0,5)
   .map(p=>`<a class="hit" href="${p.route}"><b>${esc(p.title)}</b><small>${esc(p.summary)}</small></a>`);

 r.innerHTML=[...pageHits,...newsHits].join('')||'<div class="hit">該当なし</div>';
 r.style.display='block';
});

document.addEventListener('click',ev=>{if(!ev.target.closest('.search'))$('#results').style.display='none'});
load();
