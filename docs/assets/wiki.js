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

function staticKind(route){
  if(route==='#/about') return 'サイト情報';
  if(route.includes('troubleshoot')) return 'トラブル解決';
  if(route.includes('download')) return 'モデル選び';
  if(route.includes('/start')) return '始め方';
  if(route.includes('glossary')) return '用語集';
  if(route.includes('compare')) return '比較';
  if(route.includes('models')) return 'モデル解説';
  if(route.includes('hardware')) return 'ハードウェア';
  if(route.includes('basics')) return '入門';
  return '解説';
}

function contentIndex(){
  const permanent=STATIC.filter(p=>p.route && p.title);
  const news=[...DB.entries]
    .filter(e=>e.id!=='welcome-2026-08-26')
    .sort((a,b)=>b.date.localeCompare(a.date));

  return `<div class="article">
    <h1>記事一覧</h1>
    <p class="lead">Local LLM Wikipedia に現在掲載されているコンテンツをまとめて確認できます。常設の解説記事と、毎日自動更新されるニュース記事を分けて表示します。</p>

    <div class="notice">
      <b>現在の掲載数</b><br>
      常設解説ページ: ${permanent.length}件<br>
      自動収集ニュース: ${news.length}件
    </div>

    <h2>常設解説記事</h2>
    <p>初心者向けガイド、モデル解説、比較記事などです。新しい解説ページを追加すると、この一覧にも自動で表示されます。</p>
    <div class="content-list">
      ${permanent.map((p,i)=>`<article class="content-row">
        <div class="content-no">${i+1}</div>
        <div>
          <div class="meta"><span class="badge">${esc(staticKind(p.route))}</span></div>
          <h3><a href="${esc(p.route)}">${esc(p.title)}</a></h3>
          <p>${esc(p.summary||'')}</p>
        </div>
      </article>`).join('')}
    </div>

    <h2>自動収集ニュース</h2>
    <p>GitHub Actionsが公式情報を巡回し、重要と判断したニュースを日本語で整理した記事です。</p>
    ${news.length?list(news):'<p>現在、ニュース記事はありません。</p>'}
  </div>`;
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
      <div class="card"><h3><a href="#/guide/hardware">自分のPCでどのモデルが動く？</a></h3><p>VRAM容量から、現実的に使いやすいモデルサイズと量子化を判断。</p></div>
      <div class="card"><h3><a href="#/guide/glossary">ローカルLLM用語集</a></h3><p>GGUF、MoE、KVキャッシュ、GPUオフロードなどを初心者向けに辞書形式で解説。</p></div>
      <div class="card"><h3><a href="#/guide/compare">モデル比較</a></h3><p>主要モデルを規模、用途、マルチモーダル、ローカル向きなどで横比較。</p></div>
      <div class="card"><h3><a href="#/articles">記事一覧</a></h3><p>このWikiに追加済みの解説記事と自動収集ニュースをまとめて確認。</p></div>
    </div>

    <h2>実践ガイド</h2>
    <div class="grid">
      <div class="card"><h3><a href="#/guide/start">ローカルLLMの始め方</a></h3><p>LM Studioを例に、インストールから最初のチャットまで順番に解説。</p></div>
      <div class="card"><h3><a href="#/guide/download">モデルをダウンロードするとき何を選べばいい？</a></h3><p>Instruct、GGUF、Q4_K_Mなど、モデル選択画面の見方を解説。</p></div>
      <div class="card"><h3><a href="#/guide/troubleshoot">トラブルシューティング</a></h3><p>ロード失敗、VRAM不足、遅い、GPUを使わない、API接続などを症状別に確認。</p></div>
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
 else if(h==='#/articles') html=contentIndex();
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
   .slice(0,10)
   .map(p=>`<a class="hit" href="${p.route}"><b>${esc(p.title)}</b><small>${esc(p.summary)}</small></a>`);

 r.innerHTML=[...pageHits,...newsHits].join('')||'<div class="hit">該当なし</div>';
 r.style.display='block';
});

document.addEventListener('click',ev=>{if(!ev.target.closest('.search'))$('#results').style.display='none'});
load();
