/* Agent Lab · course page renderer (Explore view only).
   Course content (MODULES, WALKS, PARAMS, DEPS, UI, AR, T, LANG) comes from course-data.js,
   copied verbatim from the course. File lists and zip sizes come from files.js.
   The lesson, quiz and project renderers below are the course's own, unchanged. */

const PAGE = document.body.dataset.page;          // "home" or a module id like "m3"
const KEY = "agent-lab-site-v1";
const modUrl = id => "/agent-lab/" + id + "/";

/* ============ STATE: language + project checkboxes stay on this device; quiz answers are not saved ============ */
let S = { lang: null, build: {} };
try { const raw = localStorage.getItem(KEY); if (raw) S = Object.assign(S, JSON.parse(raw)); } catch(e){}
S.quiz = {}; S.done = {};
function persist(){ try { localStorage.setItem(KEY, JSON.stringify({ lang:S.lang, build:S.build })); } catch(e){} }
(function(){
  const q = new URLSearchParams(location.search).get("lang");
  if (q === "ar" || q === "en") { S.lang = q; persist(); }
  if (S.lang !== "ar" && S.lang !== "en") S.lang = /^ar\b/i.test(navigator.language || "") ? "ar" : "en";
})();

/* ============ STRINGS for the page around the course (the course's own strings live in UI) ============ */
const XS = {
  en: {
    byline:"Free course · by Yaman Arab", showModules:"All modules", allModules:"All modules", onThisPage:"On this page",
    overview:"Overview", lessons:"Lessons", downloads:"Downloads",
    kicker:"Free course · JavaScript · English and Arabic",
    start:"Start with Module 00", getProject:"Download the project",
    mapTitle:"Course map", mapP:"14 modules and a capstone. Every module adds one feature to DocBot.",
    dlTitle:"Downloads", dlP:"Everything you need to build along with the course. Free, no sign-up.",
    docbotT:"DocBot, module by module",
    docbotP:"Every lesson file from Modules 00–11 in its real place and ready to run, with the sample documents, the eval set and a Docker setup for the databases.",
    starterT:"DocBot starter project",
    starterP:"The finished DocBot from Modules 12–13, plus everything to practice with: sample documents in English and Arabic, an orders CSV, 32 eval questions and prompt-injection test material.",
    snippetsT:"Every code example", snippetsP:n=>"All the code from the lessons, one file per lesson, in course order ("+n+" files).",
    docsT:"Sample documents",
    docsP:"The files DocBot reads, searches and cites: policies of Acme Home, a fictional store, in English and Arabic. Click a file to read it.",
    readme:"Read the README", zip:"Download .zip", docsZip:"Download the documents (.zip)",
    practice:"Practice files", showFiles:n=>"Show the "+n+" files",
    pr:{
      m1:"Put these documents in a docs/ folder and ask DocBot about them.",
      m3:"Index these documents and search them by meaning. schema.sql and docker-compose.yml start pgvector for you.",
      m4:"Chunk these documents and ask questions over them. billing.md has invoice codes like INV-20931 for trying hybrid search.",
      m5:"32 golden questions written for the sample documents, including Arabic ones and questions DocBot should say it doesn't know.",
      m10:"23 sample orders for DocBot to analyze inside the sandbox.",
      m11:"A poisoned document and injection prompts. Only put them in docs/ while you red-team."
    },
    projectFiles:"Project files", projectFilesP:"The finished project for Modules 12–13, and every code example from the course.",
    projectFilesEarly:"DocBot as you build it in Modules 00–11: every lesson file in its real place, ready to run.",
    moduleCode:"Code from this module", moduleCodeP:n=>n+(n===1?" file":" files")+", one per lesson. Every code block below also has its own download button.",
    moduleZip:"Download this module's code (.zip)",
    download:"Download", close:"Close", loading:"Loading…", loadFail:"Couldn't load this file. Use the download button instead.",
    footBy:"Agent Lab is a free course by", portfolio:"Portfolio", name:"Yaman Arab"
  },
  ar: {
    byline:"كورس مجاني · من يمان عرب", showModules:"كل الوحدات", allModules:"كل الوحدات", onThisPage:"بهالصفحة",
    overview:"نظرة عامة", lessons:"الدروس", downloads:"التنزيلات",
    kicker:"كورس مجاني · JavaScript · بالعربي والإنكليزي",
    start:"ابدأ بالوحدة 00", getProject:"نزّل المشروع",
    mapTitle:"خريطة الكورس", mapP:"14 وحدة ومشروع نهائي. كل وحدة بتضيف ميزة وحدة لـ DocBot.",
    dlTitle:"التنزيلات", dlP:"كل شي بتحتاجه لتبني مع الكورس. مجاني، وبدون تسجيل.",
    docbotT:"DocBot وحدة بوحدة",
    docbotP:"كل ملفات الدروس من الوحدات 00–11 بمكانها الحقيقي وجاهزة تشتغل، مع المستندات التجريبية ومجموعة الـ eval وإعدادات Docker للـ databases.",
    starterT:"مشروع DocBot الجاهز",
    starterP:"DocBot الكامل من الوحدات 12–13، ومعه كل شي لتتمرّن: مستندات تجريبية بالعربي والإنكليزي، ملف طلبات CSV، 32 سؤال eval، ومواد لاختبار الـ prompt injection.",
    snippetsT:"كل أمثلة الكود", snippetsP:n=>"كل كود الدروس، ملف لكل درس، بنفس ترتيب الكورس ("+n+" ملف).",
    docsT:"مستندات تجريبية",
    docsP:"الملفات اللي DocBot بيقراها وبيبحث فيها وبيستشهد فيها: سياسات متجر وهمي اسمه Acme Home، بالعربي والإنكليزي. اضغط على أي ملف لتقراه.",
    readme:"اقرا الـ README", zip:"نزّل ملف zip", docsZip:"نزّل المستندات (zip)",
    practice:"ملفات للتمرين", showFiles:n=>"اعرض الـ "+n+" ملف",
    pr:{
      m1:"حطّ هالمستندات بمجلد docs/ واسأل DocBot عنها.",
      m3:"أرشف هالمستندات وابحث فيها بالمعنى. schema.sql و docker-compose.yml بيشغّلولك pgvector.",
      m4:"قطّع هالمستندات واسأل عليها. billing.md فيه أرقام فواتير متل INV-20931 لتجرّب الـ hybrid search.",
      m5:"32 سؤال golden مكتوبين على المستندات التجريبية، منهن أسئلة بالعربي وأسئلة لازم DocBot يقول إنو ما بيعرف جوابها.",
      m10:"23 طلب تجريبي ليحلّلهن DocBot جوّا الـ sandbox.",
      m11:"مستند ملغوم وprompts هجوم. ما تحطّهن بـ docs/ إلا وقت تختبر الهجمات."
    },
    projectFiles:"ملفات المشروع", projectFilesP:"المشروع الكامل للوحدات 12–13، وكل أمثلة الكود من الكورس.",
    projectFilesEarly:"DocBot متل ما بتبنيه بالوحدات 00–11: كل ملف درس بمكانه الحقيقي، وجاهز يشتغل.",
    moduleCode:"كود هالوحدة", moduleCodeP:n=>n+" ملف، واحد لكل درس. وكل بلوك كود تحت إلو زر تنزيل خاص فيه.",
    moduleZip:"نزّل كود هالوحدة (zip)",
    download:"نزّل", close:"سكّر", loading:"عم يحمّل…", loadFail:"ما قدرنا نحمّل هالملف. استخدم زر التنزيل.",
    footBy:"Agent Lab كورس مجاني من", portfolio:"البورتفوليو", name:"يمان عرب"
  }
};
const X = (k, ...a) => { const v = XS[LANG][k] !== undefined ? XS[LANG][k] : XS.en[k]; return typeof v === "function" ? v(...a) : v; };

/* which practice files each module links to ("docs" = every sample document) */
const PRACTICE = {
  m1:["docs"],
  m3:["docs","docbot-starter/sql/schema.sql","docbot-starter/docker-compose.yml"],
  m4:["docs"],
  m5:["docbot-starter/tests/evals/golden.json","docs"],
  m10:["docbot-starter/data/orders.csv"],
  m11:["docbot-starter/attacks/poisoned-review.md","docbot-starter/attacks/injection-tests.json"]
};
const PROJECT_DL = ["m12","m13"];

/* ============ COURSE RENDERERS (verbatim from the course) ============ */
function loc(m){
  const A = LANG === "ar" && AR[m.id]; if (!A) return m;
  return Object.assign({}, m, {
    title:A.title || m.title, tag:A.tag || m.tag, week:A.week || m.week, builds:A.builds || m.builds,
    lessons: m.lessons.map((L,i)=>{ const a = (A.lessons && A.lessons[i]) || {};
      return Object.assign({}, L, { t:a.t||L.t, p:a.p||L.p, a:a.a||L.a, terms:a.terms||L.terms, try:a.try||L.try,
        note:a.note||L.note, noteLabel:a.noteLabel||L.noteLabel, code: L.code ? Object.assign({}, L.code, { label:a.codeLabel||L.code.label }) : L.code }); }),
    quiz: m.quiz.map((q,i)=>{ const a = (A.quiz && A.quiz[i]) || {}; return Object.assign({}, q, { q:a.q||q.q, o:a.o||q.o, why:a.why||q.why }); }),
    project: A.project || m.project
  });
}
const V = i => loc(MODULES[i]);
function arPart(k, kind){ const A = LANG === "ar" && AR[k.split(".")[0]]; return A && A[kind] && A[kind][k]; }
function walkFor(k){
  const w = WALKS[k]; if (!w) return null;
  const a = arPart(k, "walks"); return a ? w.map((x,j)=>[x[0], (a[j] && a[j][1]) || x[1]]) : w;
}
function paramsFor(k){
  const p = PARAMS[k]; if (!p) return null;
  const a = arPart(k, "params"); if (!a) return p;
  return p.map((f,j)=>[f[0], f[1].map((r,n)=>{ const t = a[j] && a[j][1] && a[j][1][n]; return [r[0], (t && t[1]) || r[1], (t && t[2]) || r[2]]; })]);
}
function steps(m){ const s = m.lessons.map((_,i)=>"l"+i); if (m.quiz.length) s.push("quiz"); s.push("project"); return s; }
const stepLabel = (s,short) => s==="quiz" ? T("stepQuiz") : s==="project" ? (short?T("stepBuild"):T("stepProject")) : (+s.slice(1)+1)+"";
const KW = "import|from|const|let|await|async|function|return|if|else|for|of|while|new|export|default|true|false|null|try|catch|finally|throw|with|SELECT|FROM|WHERE|ORDER|BY|LIMIT|CREATE|TABLE|EXTENSION|IF|NOT|EXISTS|INDEX|ON|USING|AS|PRIMARY|KEY|DESC";
const esc = s => String(s).replace(/[&<>"]/g,c=>({"&":"&amp;","<":"&lt;",">":"&gt;",'"':"&quot;"}[c]));
function hl(src, lang){
  const com = lang==="sql" ? "--[^\\n]*" : (lang==="yaml"||lang==="bash") ? "#[^\\n]*" : "\\/\\/[^\\n]*|<!--[\\s\\S]*?-->";
  const str = (lang==="yaml"||lang==="bash"||lang==="sql") ? "\"(?:\\\\.|[^\"\\\\\\n])*\"" : "\"(?:\\\\.|[^\"\\\\\\n])*\"|'(?:\\\\.|[^'\\\\\\n])*'";
  const re = new RegExp("("+com+")|("+str+")|\\b(\\d[\\d_.]*)\\b|\\b("+KW+")\\b","g");
  let out="", last=0, m;
  while ((m = re.exec(src))){
    out += esc(src.slice(last, m.index));
    out += '<span class="tk-'+(m[1]?"c":m[2]?"s":m[3]?"n":"k")+'">'+esc(m[0])+'</span>';
    last = re.lastIndex;
  }
  return out + esc(src.slice(last));
}
let codeSeq = 0; const CODE = {};
let SNIP = null;   // the lesson's snippet file while it renders, so its code block also offers a download
function codeBlock(c){
  const id = "cb"+(codeSeq++); CODE[id] = c.src;
  const dl = SNIP ? '<a href="'+FILES.base+SNIP+'" download>'+esc(X("download"))+'</a>' : '';
  return '<div class="code"><div class="ch"><span>'+T("example")+esc(c.label)+'</span><span class="acts">'+dl+'<button data-copy="'+id+'">'+T("copy")+'</button></span></div><pre><code>'+hl(c.src, c.lang)+'</code></pre></div>';
}
function lessonHTML(m, i, withMark){
  const L = m.lessons[i], k = m.id+".l"+i, on = !!S.done[k];
  const P = paramsFor(k), W = walkFor(k);
  return '<div class="lesson">'+
    '<div class="eyebrow">'+T("lessonOf", i+1, m.lessons.length)+'</div>'+
    '<h3 class="lt">'+esc(L.t)+'</h3>'+ L.p +
    (L.a ? '<div class="analogy"><span class="lab">'+T("thinkLike")+'</span>'+esc(L.a)+'</div>' : '')+
    (L.terms ? '<dl class="terms"><span class="lab">'+T("words")+'</span>'+L.terms.map(t=>'<div><dt>'+esc(t[0])+':</dt> <dd>'+esc(t[1])+'</dd></div>').join("")+'</dl>' : '')+
    (L.install ? '<div class="code inst"><div class="ch"><span>'+T("installFirst")+'</span><button data-copy="'+(function(){const id="in"+k;CODE[id]=L.install.split("\n").map(l=>l.replace(/\s+#.*$/,"").trim()).filter(Boolean).join("\n");return id;})()+'">'+T("copy")+'</button></div><pre><code>'+hl(L.install,"bash")+'</code></pre></div>' : '')+
    depsHTML(k, L)+
    (L.code ? codeBlock(L.code) : '')+
    (P ? '<div class="params"><span class="lab">'+T("params")+'</span>'+P.map(f=>'<div class="pf"><code class="fn">'+esc(f[0])+'</code><dl>'+f[1].map(r=>'<div><dt><code>'+esc(r[0])+'</code><small>'+esc(r[1])+'</small></dt><dd>'+esc(r[2])+'</dd></div>').join("")+'</dl></div>').join("")+'</div>' : '')+
    (W ? '<div class="walk"><span class="lab">'+T("how")+'</span><ol>'+W.map(w=>'<li><code>'+esc(w[0])+'</code><span>'+esc(w[1])+'</span></li>').join("")+'</ol></div>' : '')+
    (L.try ? '<div class="try"><span class="lab">'+T("tryIt")+'</span>'+L.try+'</div>' : '')+
    (L.note ? '<div class="note-box"><span class="lab">'+esc(L.noteLabel || T("noteDefault"))+'</span>'+L.note+'</div>' : '')+
    (withMark ? '<button class="mark '+(on?"on":"")+'" data-mark="'+k+'">'+(on?T("completed"):T("markComplete"))+'</button>' : '')+
  '</div>';
}
function quizHTML(m){
  const right = m.quiz.filter((q,i)=>S.quiz[m.id+"."+i]===q.a).length;
  return '<div class="lesson"><div class="eyebrow">'+T("check")+'</div><h3 class="lt">'+T("quiz")+'</h3>'+
    '<div class="score">'+T("score", right, m.quiz.length, right===m.quiz.length)+'</div>'+
    m.quiz.map((q,i)=>{
      const k=m.id+"."+i, pick=S.quiz[k], answered=pick!==undefined, ok=pick===q.a;
      return '<div class="q"><p class="qt">'+(i+1)+'. '+esc(q.q)+'</p><div class="opts">'+
        q.o.map((o,j)=>'<button class="opt '+(answered&&j===pick?(ok?"right":"wrong"):"")+'" data-q="'+k+'" data-j="'+j+'"'+(ok?' disabled':'')+'>'+esc(o)+'</button>').join("")+
        '</div>'+(answered?'<div class="why '+(ok?"ok":"no")+'">'+(ok?T("correct")+esc(q.why):T("notQuite"))+'</div>':'')+'</div>';
    }).join("")+'</div>';
}
function projectHTML(m){
  return '<div class="lesson"><div class="eyebrow">'+esc(m.builds)+'</div><h3 class="lt">'+(m.capstone?T("shipChecklist"):T("buildIt"))+'</h3>'+
    '<div class="proj"><span class="lab">'+T("project")+'</span>'+esc(m.project.text)+'</div>'+
    (m.capstone?'':'<div class="eyebrow" style="margin-bottom:2px">'+T("doneWhen")+'</div>')+
    m.project.done.map((d,i)=>{ const k=m.id+"."+i, on=!!S.build[k];
      return '<label class="check '+(on?"on":"")+'"><input type="checkbox" id="b-'+k+'" data-b="'+k+'"'+(on?" checked":"")+'><span>'+esc(d)+'</span></label>'; }).join("")+'</div>';
}
function stepHTML(m,s,withMark){ return s==="quiz"?quizHTML(m):s==="project"?projectHTML(m):lessonHTML(m,+s.slice(1),withMark); }

/* ============ PAGE PIECES ============ */
const kb = n => Math.max(1, Math.round(n / 1024)) + " KB";
const fileName = p => p.split("/").pop();
const smooth = () => matchMedia("(prefers-reduced-motion: reduce)").matches ? "auto" : "smooth";

function fileChip(p){
  const tag = /\/docs\/[^/]+\.md$/.test(p) ? ' <i>'+(/-ar\.md$/.test(p) ? "AR" : "EN")+'</i>' : '';
  return '<button class="file-chip" data-file="'+esc(p)+'">'+esc(fileName(p))+tag+'</button>';
}
const docChips = () => '<div class="file-chips">'+FILES.docs.map(fileChip).join("")+'</div>';
const zipBtn = (z, label, pri) => '<a class="btn'+(pri?' pri':'')+'" href="'+z.href+'" download><ion-icon name="download-outline" aria-hidden="true"></ion-icon>'+esc(label)+' <small>'+kb(z.size)+'</small></a>';
const readmeBtn = (project = "docbot-starter") => '<button class="btn" data-file="'+project+'/README.md">'+esc(X("readme"))+'</button>';

let filesOpen = null;   // long file lists start folded on small screens; the reader's choice survives re-renders
document.addEventListener("toggle", e=>{ if (e.target.classList && e.target.classList.contains("fb-files")) filesOpen = e.target.open; }, true);

function filesBox(m){
  let rows = "";
  const P = PRACTICE[m.id];
  if (P){
    const list = P.flatMap(p => p==="docs" ? FILES.docs : [p]);
    const chips = '<div class="file-chips">'+list.map(fileChip).join("")+'</div>';
    const open = filesOpen === null ? matchMedia("(min-width: 1024px)").matches : filesOpen;
    rows += '<div class="fb-row"><span class="lab">'+esc(X("practice"))+'</span><p>'+esc(X("pr")[m.id])+'</p>'+
      (list.length > 4 ? '<details class="fb-files"'+(open?' open':'')+'><summary>'+esc(X("showFiles", list.length))+'</summary>'+chips+'</details>' : chips)+
      (P.includes("docs") ? '<div class="dl-row">'+zipBtn(FILES.zips.docs, X("docsZip"))+'</div>' : '')+'</div>';
  }
  if (PROJECT_DL.includes(m.id)) rows += '<div class="fb-row"><span class="lab">'+esc(X("projectFiles"))+'</span><p>'+esc(X("projectFilesP"))+'</p>'+
    '<div class="dl-row">'+zipBtn(FILES.zips.starter, X("starterT"), true)+zipBtn(FILES.zips.snippets, X("snippetsT"))+readmeBtn()+'</div></div>';
  else if (m.id !== "cap") rows += '<div class="fb-row"><span class="lab">'+esc(X("projectFiles"))+'</span><p>'+esc(X("projectFilesEarly"))+'</p>'+
    '<div class="dl-row">'+zipBtn(FILES.zips.docbot, X("docbotT"), true)+readmeBtn("docbot")+'</div></div>';
  const n = (FILES.snippets[m.id] || []).length, z = FILES.zips.modules[m.id];
  if (n && z) rows += '<div class="fb-row"><span class="lab">'+esc(X("moduleCode"))+'</span><p>'+esc(X("moduleCodeP", n))+'</p><div class="dl-row">'+zipBtn(z, X("moduleZip"))+'</div></div>';
  return rows ? '<div class="files-box">'+rows+'</div>' : '';
}

function traceHTML(){
  const rows = [[T("tr")[0], T("trQ")], [T("tr")[1], 'search_docs("refund")'], [T("tr")[2], '→ refunds.md: "30 days…"'], [T("tr")[3], T("trA")]];
  return '<div class="trace" aria-label="'+esc(T("traceAria"))+'"><div class="t-h">'+esc(T("trH"))+'</div>'+
    rows.map(r=>'<div class="s"><span class="k">'+esc(r[0])+'</span><span class="v">'+esc(r[1])+'</span></div>').join("")+'</div>';
}

const footHTML = () => '<footer class="site-foot"><span>'+esc(X("footBy"))+' <a href="/">'+esc(X("name"))+'</a></span>'+
  '<a href="/">'+esc(X("portfolio"))+'</a><a href="https://www.linkedin.com/in/yaman-arab-7047ab205" target="_blank" rel="noopener">LinkedIn</a>'+
  '<a href="https://github.com/Yaman-cyber" target="_blank" rel="noopener">GitHub</a></footer>';

/* ============ LANDING ============ */
function renderHome(){
  const cards = MODULES.map((x,i)=>{ const v = V(i);
    return '<li><a class="mod-card" href="'+modUrl(x.id)+'"><span class="icon-box">'+x.n+'</span><span class="mc-body">'+
      '<span class="eyebrow">'+T("module", x.n)+' · '+esc(v.week)+'</span><span class="mc-t">'+esc(v.title)+'</span>'+
      '<span class="mc-p">'+esc(v.tag)+'</span><span class="mc-b">◆ '+esc(v.builds)+'</span></span></a></li>'; }).join("");
  const total = Object.values(FILES.snippets).reduce((n,a)=>n+a.length, 0);
  document.getElementById("app").innerHTML =
    '<section class="hero"><div><span class="eyebrow kicker">'+esc(X("kicker"))+'</span>'+
      '<h1 class="hero-h1">'+T("heroH1")+'</h1><p class="hero-p">'+T("heroP")+'</p>'+
      '<div class="cta"><a class="btn pri" href="'+modUrl("m0")+'">'+esc(X("start"))+'</a>'+
      '<a class="btn" href="#downloads"><ion-icon name="download-outline" aria-hidden="true"></ion-icon>'+esc(X("getProject"))+'</a></div></div>'+
      traceHTML()+'</section>'+
    '<section class="section-block" aria-labelledby="map-t"><h2 class="h2 article-title" id="map-t">'+esc(X("mapTitle"))+'</h2>'+
      '<p>'+esc(X("mapP"))+'</p><ul class="mod-grid">'+cards+'</ul></section>'+
    '<section class="section-block" id="downloads" aria-labelledby="dl-t"><h2 class="h2 article-title" id="dl-t">'+esc(X("dlTitle"))+'</h2>'+
      '<p>'+esc(X("dlP"))+'</p><div class="dl-grid">'+
      '<div class="dl-card"><h3>'+esc(X("docbotT"))+'</h3><p>'+esc(X("docbotP"))+'</p><div class="dl-row">'+zipBtn(FILES.zips.docbot, X("zip"), true)+readmeBtn("docbot")+'</div></div>'+
      '<div class="dl-card"><h3>'+esc(X("starterT"))+'</h3><p>'+esc(X("starterP"))+'</p><div class="dl-row">'+zipBtn(FILES.zips.starter, X("zip"), true)+readmeBtn()+'</div></div>'+
      '<div class="dl-card wide"><h3>'+esc(X("snippetsT"))+'</h3><p>'+esc(X("snippetsP", total))+'</p><div class="dl-row">'+zipBtn(FILES.zips.snippets, X("zip"))+'</div></div>'+
      '<div class="dl-card wide"><h3>'+esc(X("docsT"))+'</h3><p>'+esc(X("docsP"))+'</p>'+docChips()+'<div class="dl-row">'+zipBtn(FILES.zips.docs, X("docsZip"))+'</div></div>'+
    '</div></section>'+footHTML();
  document.title = LANG === "ar" ? "Agent Lab · " + T("heroH1").replace(/<[^>]+>/g, "") : TITLE;
}

/* ============ MODULE PAGE (the course's Explore view) ============ */
let modsOpen = false;   // the "All modules" list above a module
function renderModule(i){
  const m = V(i), st = steps(m), snips = FILES.snippets[m.id] || [];
  const chips = MODULES.map((x,j)=>'<a href="'+modUrl(x.id)+'"'+(j===i?' class="on" aria-current="page"':'')+'><b>'+x.n+'</b>'+esc(V(j).title)+'</a>').join("");
  const list = MODULES.map((x,j)=>{ const v = V(j);
    return '<a class="mod-link'+(j===i?' on':'')+'" href="'+modUrl(x.id)+'"><span class="icon-box">'+x.n+'</span><span>'+esc(v.title)+'<small>'+esc(v.week)+'</small></span></a>'; }).join("");
  const nav = '<div class="mod-nav"><div class="chips-row">'+
      '<button class="all-btn" data-allmods aria-expanded="'+modsOpen+'" aria-controls="mods-panel"><ion-icon name="list-outline" aria-hidden="true"></ion-icon>'+esc(X("allModules"))+'</button>'+
      '<nav class="chips" aria-label="'+esc(T("modulesAria"))+'">'+chips+'</nav></div>'+
    '<div class="mods-panel" id="mods-panel"'+(modsOpen?'':' hidden')+'>'+list+'</div></div>';
  const head = '<header class="mod-head"><span class="eyebrow">'+T("module", m.n)+' · '+esc(m.week)+'</span>'+
    '<h1 class="h2 article-title">'+esc(m.title)+'</h1><p class="tagline">'+esc(m.tag)+'</p>'+
    '<div class="builds">◆ '+esc(m.builds)+'</div>'+
    '<div class="tools">'+m.tools.map(t=>'<span class="'+(t[1]?"deep":"")+'">'+esc(t[0])+'</span>').join("")+'</div></header>';
  const jump = st.map(s=>'<a href="#'+m.id+'-'+s+'" data-jump="'+m.id+'-'+s+'">'+(s[0]==="l"?stepLabel(s):stepLabel(s,true))+'</a>').join("");
  const outline = st.map(s=>{
    const t = s[0]==="l" ? stepLabel(s)+". "+m.lessons[+s.slice(1)].t : s==="quiz" ? T("quiz") : m.capstone ? T("shipChecklist") : T("buildIt");
    return '<a href="#'+m.id+'-'+s+'" data-jump="'+m.id+'-'+s+'">'+esc(t)+'</a>'; }).join("");
  const body = st.map(s=>{ SNIP = s[0]==="l" ? snips[+s.slice(1)] : null;
    return '<section class="sec" id="'+m.id+'-'+s+'">'+stepHTML(m,s,false)+'</section>'; }).join("");
  SNIP = null;
  const prev = i>0 ? '<a class="btn" href="'+modUrl(MODULES[i-1].id)+'">'+esc(T("prev", V(i-1).title))+'</a>' : '<span></span>';
  const next = i<MODULES.length-1 ? '<a class="btn pri" href="'+modUrl(MODULES[i+1].id)+'">'+esc(T("nextTo", V(i+1).title))+'</a>' : '<span></span>';
  const files = filesBox(m);
  // small screens: files on top + sticky lesson chips; wide screens: a side column with the outline and the files
  document.getElementById("app").innerHTML = nav + head +
    '<div class="mod-layout"><div class="mod-main">'+
      '<div class="files-top">'+files+'</div>'+
      '<nav class="jump" aria-label="'+esc(T("jumpAria"))+'">'+jump+'</nav>'+body+
      '<div class="foot">'+prev+next+'</div></div>'+
    '<aside class="mod-aside"><nav class="outline" aria-label="'+esc(X("onThisPage"))+'"><span class="lab">'+esc(X("onThisPage"))+'</span>'+outline+'</nav>'+files+'</aside></div>'+
    footHTML();
  document.title = LANG === "ar" ? T("module", m.n)+" · "+m.title+" | Agent Lab" : TITLE;
}

/* ============ YOU ARE HERE: highlight the lesson on screen ============ */
let spyId = null, spyQueued = false;
const fullyVisible = el => { const r = el.getBoundingClientRect(); return r.height > 0 && r.top >= 0 && r.bottom <= innerHeight; };
function spy(){
  spyQueued = false;
  const secs = document.querySelectorAll("#app .sec"); if (!secs.length) return;
  let cur = secs[0].id;
  for (const s of secs) { if (s.getBoundingClientRect().top <= 150) cur = s.id; else break; }
  if (cur === spyId) return;
  spyId = cur;
  document.querySelectorAll("#app [data-jump]").forEach(a => { const on = a.dataset.jump === cur; a.classList.toggle("on", on); on ? a.setAttribute("aria-current", "location") : a.removeAttribute("aria-current"); });
  const chip = document.querySelector('#app .jump [data-jump="'+cur+'"]');
  if (chip && fullyVisible(chip.parentElement)) chip.scrollIntoView({ block: "nearest", inline: "center" });   // keep the active chip in view
}
addEventListener("scroll", () => { if (!spyQueued){ spyQueued = true; requestAnimationFrame(spy); } }, { passive: true });

/* ============ CHROME: language, sidebar, navbar ============ */
function applyLang(){
  const root = document.documentElement;
  root.lang = LANG; root.dir = LANG === "ar" ? "rtl" : "ltr";
  document.querySelectorAll("[data-x]").forEach(el=>{ el.textContent = X(el.dataset.x); });
  const lb = document.getElementById("lang");
  lb.setAttribute("aria-label", T("langBtnLabel")); lb.title = T("langBtnLabel"); lb.lang = LANG === "ar" ? "en" : "ar";
  lb.querySelector(".lang-code").textContent = LANG === "ar" ? "EN" : "AR";   // the language it switches to
}
function renderSidebar(){
  const list = document.getElementById("modlist");
  list.setAttribute("aria-label", T("allModulesAria"));
  list.innerHTML = MODULES.map((x,i)=>{ const v = V(i), on = x.id===PAGE;
    return '<a class="mod-link'+(on?' on':'')+'" href="'+modUrl(x.id)+'"'+(on?' aria-current="page"':'')+'><span class="icon-box">'+x.n+'</span>'+
      '<span>'+esc(v.title)+'<small>'+esc(v.week)+'</small></span></a>'; }).join("");
}

let traceI = 0, traceTimer = null;
function startTrace(){
  const rows = () => [...document.querySelectorAll(".trace .s")];
  if (!rows().length) return;
  if (matchMedia("(prefers-reduced-motion: reduce)").matches){ rows().forEach(r=>r.classList.add("on")); return; }
  const tick = () => { const r = rows(); r.forEach((el,j)=>el.classList.toggle("on", j<=traceI)); traceI = (traceI+1)%(r.length+1); };
  tick(); if (!traceTimer) traceTimer = setInterval(tick, 1100);
}

const TITLE = document.title;
function render(keep){
  const y = scrollY; codeSeq = 0;
  LANG = S.lang;
  applyLang(); renderSidebar();
  const i = MODULES.findIndex(m=>m.id===PAGE);
  i >= 0 ? renderModule(i) : renderHome();
  startTrace();
  if (keep) scrollTo({top:y});
  spyId = null; spy();
  if (!keep) showCurrentModule();
}
function showCurrentModule(){   // current module first in the row of module pills
  const cur = document.querySelector("#app .chips .on");
  if (cur && fullyVisible(cur.parentElement)) cur.scrollIntoView({ block: "nearest", inline: "start" });
}
document.fonts?.ready.then(showCurrentModule);   // pill widths change once the web fonts arrive

/* ============ FILE VIEWER ============ */
const viewer = document.getElementById("viewer");
const langOf = p => /\.(js|json)$/.test(p) ? "js" : /\.sql$/.test(p) ? "sql" : /\.ya?ml$/.test(p) ? "yaml" : /\.sh$/.test(p) ? "bash" : null;
async function openFile(path){
  const name = fileName(path), lang = langOf(path);
  viewer.innerHTML = '<div class="vh"><code>'+esc(path)+'</code>'+
    '<a class="btn" href="'+FILES.base+path+'" download="'+esc(name)+'"><ion-icon name="download-outline" aria-hidden="true"></ion-icon>'+esc(X("download"))+'</a>'+
    '<button class="btn" data-close>'+esc(X("close"))+'</button></div><pre'+(lang?'':' class="text"')+'><code>'+esc(X("loading"))+'</code></pre>';
  viewer.setAttribute("aria-label", name);
  viewer.showModal();
  const out = viewer.querySelector("pre code");
  try {
    const res = await fetch(FILES.base + path);
    if (!res.ok) throw new Error(res.status);
    const src = await res.text();
    out.innerHTML = lang ? hl(src, lang) : esc(src);
  } catch(_){ out.textContent = X("loadFail"); }
}
viewer.addEventListener("click", e=>{ if (e.target === viewer) viewer.close(); });

/* ============ EVENTS ============ */
document.addEventListener("click", async e=>{
  const t = e.target.closest("button,a"); if (!t) return;
  if (t.id==="lang"){
    S.lang = S.lang==="ar" ? "en" : "ar"; persist();
    const u = new URL(location.href); if (S.lang==="ar") u.searchParams.set("lang","ar"); else u.searchParams.delete("lang");
    history.replaceState(null, "", u); render(true); return; }
  if (t.hasAttribute("data-sidebar-btn")){ t.closest(".sidebar").classList.toggle("active"); return; }
  if (t.hasAttribute("data-allmods")){ modsOpen = !modsOpen; t.setAttribute("aria-expanded", modsOpen); document.getElementById("mods-panel").hidden = !modsOpen; return; }
  if (t.hasAttribute("data-close")){ viewer.close(); return; }
  if (t.dataset.file){ e.preventDefault(); openFile(t.dataset.file); return; }
  if (t.dataset.ref){ const [mi,li] = t.dataset.ref.split(".").map(Number); const id = MODULES[mi].id+"-l"+li;
    if (MODULES[mi].id===PAGE) document.getElementById(id)?.scrollIntoView({behavior:smooth()});
    else location.href = modUrl(MODULES[mi].id)+"#"+id;
    return; }
  if (t.dataset.jump){ e.preventDefault(); const el = document.getElementById(t.dataset.jump);
    if (el){ el.scrollIntoView({behavior:smooth()}); history.replaceState(null, "", "#"+t.dataset.jump); }
    return; }
  if (t.dataset.q){ S.quiz[t.dataset.q] = +t.dataset.j; render(true); return; }
  if (t.dataset.copy){ const src=CODE[t.dataset.copy];
    try { await navigator.clipboard.writeText(src); t.textContent=T("copied"); }
    catch(_){ const pre=t.closest(".code").querySelector("pre"); const r=document.createRange(); r.selectNodeContents(pre); const sel=getSelection(); sel.removeAllRanges(); sel.addRange(r); t.textContent=T("selected"); }
    setTimeout(()=>t.textContent=T("copy"),1400); return; }
});
document.addEventListener("change", e=>{
  const k = e.target.dataset.b; if (!k) return;
  if (e.target.checked) S.build[k]=true; else delete S.build[k];
  persist(); render(true);
});

render();
if (location.hash) document.getElementById(decodeURIComponent(location.hash.slice(1)))?.scrollIntoView();
