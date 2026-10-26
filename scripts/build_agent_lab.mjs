#!/usr/bin/env node
/*
  Builds the Agent Lab course pages under /agent-lab.

    node scripts/build_agent_lab.mjs                       # rebuild pages, zips, file list, sitemap
    node scripts/build_agent_lab.mjs --from agent-lab.html # first refresh the course content from the course HTML

  --from copies the course's data block (MODULES … AR) into agent-lab/assets/course-data.js
  byte for byte, so the site always shows exactly what the course says.
  Needs Node 18+ and the `zip` command (macOS / Linux).
*/
import fs from "node:fs";
import os from "node:os";
import path from "node:path";
import vm from "node:vm";
import crypto from "node:crypto";
import { execSync } from "node:child_process";
import { fileURLToPath } from "node:url";

const ROOT = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const LAB = path.join(ROOT, "agent-lab");
const SITE = "https://yaman-cyber.github.io";
const DATA_FILE = path.join(LAB, "assets", "course-data.js");

/* ---------- 1. course content ---------- */
const fromIdx = process.argv.indexOf("--from");
if (fromIdx > 0) {
  const lines = fs.readFileSync(process.argv[fromIdx + 1], "utf8").split("\n");
  const start = lines.findIndex(l => l.startsWith("const MODULES = ["));
  const end = lines.findIndex(l => l.startsWith("const AR = {"));
  if (start < 0 || end < start) throw new Error("Could not find the MODULES … AR block in " + process.argv[fromIdx + 1]);
  fs.writeFileSync(DATA_FILE,
    "/* Agent Lab course content, copied verbatim from the course by scripts/build_agent_lab.mjs. Do not edit by hand. */\n" +
    lines.slice(start, end + 1).join("\n") + "\n");
  console.log("course-data.js refreshed (" + (end - start + 1) + " lines)");
}
const ctx = {};
vm.createContext(ctx);
vm.runInContext(fs.readFileSync(DATA_FILE, "utf8") + "\n;globalThis.__d = { MODULES, UI };", ctx);
const { MODULES, UI } = ctx.__d;

const FILES_DIR = path.join(LAB, "files");
const folderOf = m => "module-" + (m.id === "cap" ? "capstone" : m.n);

/* ---------- 1b. snippets: one file per lesson, "// <code label>" then the lesson's code, always in sync ---------- */
let synced = 0;
for (const m of MODULES) {
  const dir = path.join(FILES_DIR, "snippets", folderOf(m));
  fs.mkdirSync(dir, { recursive: true });
  m.lessons.forEach((L, i) => {
    const prefix = "lesson-" + String(i + 1).padStart(2, "0") + "-";
    const ext = { bash: ".sh", sql: ".sql", yaml: ".yaml" }[L.code.lang] || ".js";
    const slug = L.t.toLowerCase().replace(/[^a-z0-9]+/g, "-").replace(/^-|-$/g, "").slice(0, 40).replace(/-$/, "");
    const file = fs.readdirSync(dir).find(f => f.startsWith(prefix)) || prefix + slug + ext;
    const text = "// " + L.code.label + "\n" + L.code.src + "\n";
    const p = path.join(dir, file);
    if (!fs.existsSync(p) || fs.readFileSync(p, "utf8") !== text) { fs.writeFileSync(p, text); synced++; }
  });
}
if (synced) console.log("snippets updated:", synced);

/* ---------- 2. zips (fixed timestamps + sorted entries, so rebuilding doesn't change them) ---------- */
const DL = path.join(LAB, "downloads");
const STAMP = new Date("2026-10-26T00:00:00Z");
fs.rmSync(DL, { recursive: true, force: true });
fs.mkdirSync(path.join(DL, "modules"), { recursive: true });

function makeZip(srcDir, rootName, outFile) {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "agent-lab-"));
  const stage = path.join(tmp, rootName);
  fs.cpSync(srcDir, stage, { recursive: true, filter: s => path.basename(s) !== ".DS_Store" });
  const walk = d => fs.readdirSync(d, { withFileTypes: true }).flatMap(e => {
    const p = path.join(d, e.name);
    fs.utimesSync(p, STAMP, STAMP);
    return e.isDirectory() ? walk(p) : [path.relative(tmp, p)];
  });
  const list = walk(stage).sort().join("\n");
  execSync('zip -X -q "' + outFile + '" -@', { cwd: tmp, input: list, env: { ...process.env, TZ: "UTC" } });
  fs.rmSync(tmp, { recursive: true, force: true });
  return { href: "/" + path.relative(ROOT, outFile).split(path.sep).join("/"), size: fs.statSync(outFile).size };
}

const zips = {
  docbot: makeZip(path.join(FILES_DIR, "docbot"), "docbot", path.join(DL, "docbot-modules-00-11.zip")),
  starter: makeZip(path.join(FILES_DIR, "docbot-starter"), "docbot-starter", path.join(DL, "docbot-starter.zip")),
  snippets: makeZip(path.join(FILES_DIR, "snippets"), "snippets", path.join(DL, "agent-lab-snippets.zip")),
  docs: makeZip(path.join(FILES_DIR, "docbot-starter", "docs"), "docs", path.join(DL, "docbot-sample-docs.zip")),
  modules: {},
};

/* ---------- 3. file list for the page ---------- */
const snippets = {};
for (const m of MODULES) {
  const dir = path.join(FILES_DIR, "snippets", folderOf(m));
  snippets[m.id] = fs.readdirSync(dir).filter(f => f.startsWith("lesson-")).sort().map(f => "snippets/" + folderOf(m) + "/" + f);
  if (snippets[m.id].length !== m.lessons.length) throw new Error(m.id + ": expected one snippet per lesson");
  zips.modules[m.id] = makeZip(dir, folderOf(m), path.join(DL, "modules", "agent-lab-" + folderOf(m) + ".zip"));
}
const DOC_ORDER = ["refunds", "shipping", "warranty", "company-faq", "billing", "privacy", "assembly-and-installation", "expenses-policy"];
const rank = f => { const i = DOC_ORDER.indexOf(f.replace(/(-ar)?\.md$/, "")); return (i < 0 ? 99 : i) * 2 + (/-ar\.md$/.test(f) ? 1 : 0); };
const docs = fs.readdirSync(path.join(FILES_DIR, "docbot-starter", "docs")).filter(f => f.endsWith(".md"))
  .sort((a, b) => rank(a) - rank(b) || a.localeCompare(b)).map(f => "docbot-starter/docs/" + f);
fs.writeFileSync(path.join(LAB, "assets", "files.js"),
  "/* Published course files and download sizes. Generated by scripts/build_agent_lab.mjs. */\n" +
  "const FILES = " + JSON.stringify({ base: "/agent-lab/files/", docs, snippets, zips }) + ";\n");

/* ---------- 4. pages ---------- */
const esc = s => String(s).replace(/[&<>"]/g, c => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;" }[c]));
const plain = s => String(s).replace(/<[^>]+>/g, "").replace(/\s+/g, " ").trim();
const ver = crypto.createHash("sha1")
  .update(["course-data.js", "files.js", "app.js", "course.css"].map(f => fs.readFileSync(path.join(LAB, "assets", f))).join(""))
  .digest("hex").slice(0, 8);
const author = { "@type": "Person", name: "Yaman Arab", url: SITE + "/" };

function page({ id, title, ogTitle, desc, url, jsonld, fallback }) {
  const home = id === "home";
  const img = SITE + "/agent-lab/og/" + id + ".png";
  const modLinks = MODULES.map(m =>
    `<a class="mod-link${m.id === id ? " on" : ""}" href="/agent-lab/${m.id}/"><span class="icon-box">${m.n}</span><span>${esc(m.title)}<small>${esc(m.week)}</small></span></a>`).join("\n            ");
  return `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>${esc(title)}</title>
    <meta name="description" content="${esc(desc)}" />
    <meta name="author" content="Yaman Arab" />
    <meta name="robots" content="index, follow, max-image-preview:large" />
    <link rel="canonical" href="${url}" />

    <meta property="og:type" content="website" />
    <meta property="og:site_name" content="Agent Lab · Yaman Arab" />
    <meta property="og:title" content="${esc(ogTitle)}" />
    <meta property="og:description" content="${esc(desc)}" />
    <meta property="og:url" content="${url}" />
    <meta property="og:image" content="${img}" />
    <meta property="og:image:width" content="1200" />
    <meta property="og:image:height" content="630" />
    <meta property="og:image:alt" content="${esc(ogTitle)}" />
    <meta property="og:locale" content="en_US" />
    <meta property="og:locale:alternate" content="ar_AR" />
    <meta name="twitter:card" content="summary_large_image" />
    <meta name="twitter:title" content="${esc(ogTitle)}" />
    <meta name="twitter:description" content="${esc(desc)}" />
    <meta name="twitter:image" content="${img}" />
    <meta name="theme-color" content="#1e1e1f" />

    <script type="application/ld+json">${JSON.stringify(jsonld).replace(/</g, "\\u003c")}</script>

    <link rel="shortcut icon" href="/assets/images/logo.ico" type="image/x-icon" />
    <link rel="stylesheet" href="/assets/css/style.css" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600&family=Cairo:wght@400;500;600;700&family=JetBrains+Mono:wght@400;500;600&display=swap" rel="stylesheet" />
    <link rel="stylesheet" href="/agent-lab/assets/course.css?v=${ver}" />
  </head>

  <body class="course-page" data-page="${id}">
    <main>
      <aside class="sidebar" data-sidebar>
        <div class="sidebar-info">
          <figure class="avatar-box">
            <img src="/assets/images/my-avatar.webp" alt="Yaman Arab" width="80" />
          </figure>

          <div class="info-content">
            <p class="name" title="Agent Lab">Agent Lab</p>
            <p class="title" data-x="byline">Free course · by Yaman Arab</p>
          </div>

          <button class="info_more-btn" data-sidebar-btn>
            <span data-x="showModules">Show modules</span>
            <ion-icon name="chevron-down"></ion-icon>
          </button>
        </div>

        <div class="sidebar-info_more">
          <div class="separator"></div>

          <nav class="mod-list" id="modlist" aria-label="All modules">
            ${modLinks}
          </nav>

          <div class="separator"></div>

          <ul class="social-list">
            <li class="social-item">
              <a href="https://www.linkedin.com/in/yaman-arab-7047ab205" target="_blank" rel="noopener" class="social-link" aria-label="LinkedIn"><ion-icon name="logo-linkedin"></ion-icon></a>
            </li>
            <li class="social-item">
              <a href="https://github.com/Yaman-cyber" target="_blank" rel="noopener" class="social-link" aria-label="GitHub"><ion-icon name="logo-github"></ion-icon></a>
            </li>
            <li class="social-item">
              <a href="/" class="social-link" aria-label="Portfolio"><ion-icon name="person-outline"></ion-icon></a>
            </li>
          </ul>
        </div>
      </aside>

      <div class="main-content">
        <nav class="navbar">
          <ul class="navbar-list">
            <li class="navbar-item"><a class="navbar-link${home ? " active" : ""}" href="/agent-lab/" data-x="overview">Overview</a></li>
            <li class="navbar-item"><a class="navbar-link${home ? "" : " active"}" href="/agent-lab/m0/" data-x="lessons">Lessons</a></li>
            <li class="navbar-item"><a class="navbar-link" href="/agent-lab/#downloads" data-x="downloads">Downloads</a></li>
            <li class="navbar-item"><button class="navbar-link lang-btn" id="lang" lang="ar" aria-label="العربية" title="العربية"><ion-icon name="language-outline" aria-hidden="true"></ion-icon><span class="lang-code">AR</span></button></li>
          </ul>
        </nav>

        <article class="course active" id="app">
${fallback}
        </article>
      </div>
    </main>

    <dialog class="viewer" id="viewer"></dialog>

    <script src="/agent-lab/assets/course-data.js?v=${ver}"></script>
    <script src="/agent-lab/assets/files.js?v=${ver}"></script>
    <script src="/agent-lab/assets/app.js?v=${ver}"></script>
    <script type="module" src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.esm.js"></script>
    <script nomodule src="https://unpkg.com/ionicons@5.5.2/dist/ionicons/ionicons.js"></script>
  </body>
</html>
`;
}

const course = { "@type": "Course", name: "Agent Lab: learn to build AI agents", url: SITE + "/agent-lab/" };
const homeDesc = "A free, hands-on course: build DocBot, an AI agent that answers questions from your documents, in plain JavaScript. " +
  "Tools, structured outputs, embeddings, RAG, evals, LangGraph.js, MCP, memory, sandboxing and prompt-injection defense. In English and Arabic.";
const pages = [{
  id: "home", dir: LAB,
  title: "Agent Lab: learn to build AI agents in JavaScript (free course) | Yaman Arab",
  ogTitle: "Agent Lab: learn to build AI agents, one small idea at a time",
  desc: homeDesc, url: SITE + "/agent-lab/",
  jsonld: { "@context": "https://schema.org", ...course, description: homeDesc, provider: author, author,
    inLanguage: ["en", "ar"], isAccessibleForFree: true, educationalLevel: "Beginner",
    teaches: MODULES.map(m => m.title),
    hasCourseInstance: { "@type": "CourseInstance", courseMode: "online", courseWorkload: "P17W" },
    offers: { "@type": "Offer", price: 0, priceCurrency: "USD", category: "Free" } },
  fallback: `          <h1 class="hero-h1">${UI.en.heroH1}</h1>
          <p>${UI.en.heroP}</p>
          <ul>
            ${MODULES.map(m => `<li><a href="/agent-lab/${m.id}/">${m.n} · ${esc(m.title)}</a>: ${esc(m.tag)}</li>`).join("\n            ")}
          </ul>
          <noscript><p>This course needs JavaScript to show its lessons.</p></noscript>`,
}];
for (const m of MODULES) {
  const name = m.id === "cap" ? m.title : "Module " + m.n + " · " + m.title;
  const desc = m.tag + " Lessons: " + m.lessons.map(L => plain(L.t)).join(", ") + ". Free AI agents course in JavaScript, in English and Arabic.";
  const url = SITE + "/agent-lab/" + m.id + "/";
  pages.push({
    id: m.id, dir: path.join(LAB, m.id),
    title: name + " | Agent Lab by Yaman Arab", ogTitle: name + " · Agent Lab", desc, url,
    jsonld: { "@context": "https://schema.org", "@type": "LearningResource", name, description: desc, url,
      learningResourceType: "Lesson", educationalLevel: "Beginner", inLanguage: ["en", "ar"], isAccessibleForFree: true,
      author, isPartOf: course, teaches: m.lessons.map(L => plain(L.t)) },
    fallback: `          <span class="eyebrow">Module ${esc(m.n)} · ${esc(m.week)}</span>
          <h1 class="h2 article-title">${esc(m.title)}</h1>
          <p>${esc(m.tag)}</p>
          <ol>
            ${m.lessons.map(L => `<li>${esc(plain(L.t))}</li>`).join("\n            ")}
          </ol>
          <noscript><p>This course needs JavaScript to show its lessons.</p></noscript>`,
  });
}
for (const p of pages) {
  fs.mkdirSync(p.dir, { recursive: true });
  fs.writeFileSync(path.join(p.dir, "index.html"), page(p));
}

/* ---------- 5. sitemap ---------- */
const today = new Date().toISOString().slice(0, 10);
const SITEMAP = path.join(ROOT, "sitemap.xml");
const kept = (fs.readFileSync(SITEMAP, "utf8").match(/<url>[\s\S]*?<\/url>/g) || []).filter(u => !u.includes("/agent-lab/"));
const added = pages.map(p => `<url>
    <loc>${p.url}</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>${p.id === "home" ? "0.9" : "0.7"}</priority>
  </url>`);
fs.writeFileSync(SITEMAP, '<?xml version="1.0" encoding="UTF-8"?>\n<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">\n  ' +
  kept.concat(added).join("\n  ") + "\n</urlset>\n");

console.log("pages:", pages.length, "· zips:", 4 + Object.keys(zips.modules).length, "· version", ver);
