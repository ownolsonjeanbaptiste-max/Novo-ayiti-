/* ============================================================
   Novo Ayiti — book.js (site router)
   ------------------------------------------------------------
   One hash-router for the whole multi-page site. Any route that
   starts with "#/" renders a dedicated page into #book-view and
   hides the homepage <main>. Plain anchors (#liv, #vizyon...)
   are ignored so the existing homepage keeps working untouched.

   Routes:
   (any non "#route-" hash) -> Home (existing homepage)
   #route-liv               -> The Book
   #route-chapit            -> Chapter Index (searchable TOC)
   #route-chapit-<id>       -> Single chapter (prev/next)
   #route-enfografik        -> Infographics
   #route-bibliyografi      -> Bibliography
   #route-glose             -> Glossary (filterable)
   #route-ote               -> About the Author
   #route-kontak            -> Contact
   ============================================================ */

import { CHAPTERS, FRONTMATTER, BACKMATTER, ANNEXES, BIBLIOGRAPHY as BOOK_BIBLIOGRAPHY, GLOSSARY as BOOK_GLOSSARY, BOOK_TITLE, BOOK_SUBTITLE } from "/book-data.js";
import {
  BOOK_PAGE,
  INFOGRAPHICS,
  AUTHOR_PAGE,
  CONTACT_PAGE,
} from "/pages-data.js";

const mount = document.getElementById("book-view");
const homeMain = document.querySelector("main");

/* ------------------------------------------------------------
   Router-link click guard.
   Route hashes use a selector-safe "#route-..." prefix (no "/"),
   so smooth-scroll helpers (incl. the v0 preview runtime) that call
   document.querySelector(hash) on anchor clicks get a harmless null
   match instead of a "not a valid selector" SyntaxError.
   We still capture these clicks to drive navigation ourselves and
   to scroll to the top; the "hashchange" listener renders the page.
   ------------------------------------------------------------ */
window.addEventListener(
  "click",
  (e) => {
    if (e.defaultPrevented || e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
      return;
    }
    const link = e.target instanceof Element ? e.target.closest('a[href^="#route-"]') : null;
    if (!link) return;
    const href = link.getAttribute("href");
    if (!href || !href.startsWith("#route-")) return;
    e.preventDefault();
    e.stopImmediatePropagation();
    if (location.hash !== href) {
      location.hash = href; // triggers "hashchange" -> route()
    } else {
      route(); // same route clicked again: re-render + scroll to top
    }
  },
  true,
);

/* ---------- helpers ---------- */
const esc = (s = "") =>
  String(s).replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");

// Preserve imported HTML structure. KPI blocks are rendered as tables rather
// than being flattened into ordinary paragraphs.
function renderKpiTable(blocks) {
  const text = blocks.map((p) => p.replace(/<[^>]+>/g, " ").replace(/\s+/g, " ").trim()).join(" ");
  const heading = "Endikatè Pèfòmans (KPI)";
  const content = text.replace(/^.*?KPI/i, "").trim();
  const targets = /(100%|Pi wo pase 99%|Ogmante|Diminye|Swiv epi rapòte|Swiv|Pi wo)/gi;
  const rows = [];
  let last = 0;
  let match;
  while ((match = targets.exec(content))) {
    const indicator = content.slice(last, match.index).trim();
    if (indicator) rows.push(`<tr><th scope="row">${esc(indicator)}</th><td>${esc(match[0])}</td></tr>`);
    last = targets.lastIndex;
  }
  const remainder = content.slice(last).trim();
  if (remainder) rows.push(`<tr><th scope="row">${esc(remainder)}</th><td></td></tr>`);
  if (!rows.length) rows.push(`<tr><td colspan="2">${esc(content)}</td></tr>`);
  return `<div class="book-table-wrap"><table class="book-table"><caption>${esc(heading)}</caption><thead><tr><th>Endikatè</th><th>Objektif</th></tr></thead><tbody>${rows.join("")}</tbody></table></div>`;
}

function renderBody(body = "") {
  const cleanBody = body.replace(/<!--[\s\S]*?-->/g, "");
  const paragraphs = [...cleanBody.matchAll(/<(p|ul|ol|h[1-6])\b[^>]*>[\s\S]*?<\/\1>/gi)].map((m) => m[0].trim());
  const output = [];
  for (let i = 0; i < paragraphs.length; i += 1) {
    const plain = paragraphs[i].replace(/<[^>]+>/g, " ");
    if (/Endikatè Pèfòmans.*KPI|ENDIKATÈ PÈFÒMANS.*KPI/i.test(plain)) {
      const block = [paragraphs[i]];
      while (i + 1 < paragraphs.length && !/<h[1-6]|^<p>(?:PLAN|Plan Aplikasyon|SEKSYON|ANALIZ|ETID KA|PWOPÒZISYON|REFERANS)/i.test(paragraphs[i + 1])) block.push(paragraphs[++i]);
      output.push(renderKpiTable(block));
    } else {
      output.push(paragraphs[i].startsWith("<") ? paragraphs[i] : `<p>${paragraphs[i].replace(/\n/g, "<br>")}</p>`);
    }
  }
  return output.join("");
}

function indexOfChapter(id) {
  return CHAPTERS.findIndex((c) => String(c.id) === String(id));
}

function breadcrumb(trail) {
  const items = trail
    .map((t, i) => {
      const last = i === trail.length - 1;
      if (last || !t.href) {
        return `<li aria-current="page"><span>${esc(t.label)}</span></li>`;
      }
      return `<li><a href="${t.href}">${esc(t.label)}</a></li>`;
    })
    .join('<li class="crumb-sep" aria-hidden="true">/</li>');
  return `<nav class="breadcrumb" aria-label="Fil dariyann"><ol>${items}</ol></nav>`;
}

const HOME_CRUMB = { label: "Akèy", href: "#top" };

function pageHead(eyebrow, title, lead) {
  return `
    <header class="page-head">
      <span class="eyebrow dark">${esc(eyebrow)}</span>
      <h1 class="section-title">${esc(title)}</h1>
      ${lead ? `<p class="page-lead">${esc(lead)}</p>` : ""}
    </header>`;
}

/* ---------- The Book cover (full uploaded wraparound cover) ---------- */
function coverMarkup() {
  return `
    <img class="book-cover-img" src="/novo-ayiti-cover.png"
      alt="Kouvèti konplè liv la ${esc(BOOK_TITLE)} pa Ownolson Jean Baptiste — do liv, do kolòn ak fas devan"
      width="1024" height="1535" loading="lazy" decoding="async" />`;
}

/* ---------- Chapter Index (searchable TOC) ---------- */
function renderIndex() {
  const parts = [...new Set(CHAPTERS.map((c) => c.part))];

  const groups = parts
    .map((part) => {
      const rows = CHAPTERS.filter((c) => c.part === part)
        .map(
          (c) => `
          <li class="toc-item"
              data-search="${esc((c.num + " " + c.title + " " + c.summary + " " + c.part).toLowerCase())}">
            <a href="#route-chapit-${c.id}">
              <span class="toc-num">${esc(c.num)}</span>
              <span class="toc-text">
                <strong>${esc(c.title)}</strong>
                <small>${esc(c.summary)}</small>
              </span>
              <span class="toc-go" aria-hidden="true">→</span>
            </a>
          </li>`
        )
        .join("");
      return `
        <section class="toc-group" data-part="${esc(part.toLowerCase())}">
          <h2 class="toc-part">${esc(part)}</h2>
          <ul class="toc-list">${rows}</ul>
        </section>`;
    })
    .join("");

  // Front matter + annexes as their own TOC groups (kind = route prefix)
  const docGroup = (label, items, kind) => {
    if (!items || !items.length) return "";
    const rows = items
      .map(
        (d) => `
          <li class="toc-item"
              data-search="${esc((d.title + " " + label).toLowerCase())}">
            <a href="#route-${kind}-${d.id}">
              <span class="toc-num" aria-hidden="true">§</span>
              <span class="toc-text"><strong>${esc(d.title)}</strong></span>
              <span class="toc-go" aria-hidden="true">→</span>
            </a>
          </li>`
      )
      .join("");
    return `
      <section class="toc-group" data-part="${esc(label.toLowerCase())}">
        <h2 class="toc-part">${esc(label)}</h2>
        <ul class="toc-list">${rows}</ul>
      </section>`;
  };

  const frontGroup = docGroup("Paj entwodiktif", FRONTMATTER, "fwontmatye");
  const backGroup = docGroup("Paj final", BACKMATTER, "bakmatye");
  // Two labeled annex groups, preserving the manuscript's A-E vs I-XL split
  const annexPrincipal = ANNEXES.filter((a) => a.group === "Anèks Prensipal");
  const annexComplement = ANNEXES.filter((a) => a.group === "Anèks Konplemantè");
  const annexGroup =
    docGroup("Anèks Prensipal", annexPrincipal, "aneks") +
    docGroup("Anèks Konplemantè", annexComplement, "aneks");

  mount.innerHTML = `
    <div class="container book-container">
      ${breadcrumb([HOME_CRUMB, { label: "Chapit yo" }])}

      <header class="book-index-head">
        <span class="eyebrow dark">Tab matyè</span>
        <h1 class="section-title">${esc(BOOK_TITLE)} — Tab matyè konplè</h1>
        <p>${esc(BOOK_SUBTITLE)}</p>

        <div class="toc-search">
          <input id="tocSearch" type="search" autocomplete="off"
                 placeholder="Chèche yon chapit, yon tèm oswa yon mo kle…"
                 aria-label="Chèche nan tab matyè a" />
          <span class="toc-count" id="tocCount"></span>
        </div>
      </header>

      <div id="tocResults">${frontGroup}${groups}${backGroup}${annexGroup}</div>
      <p id="tocEmpty" class="toc-empty" hidden>Pa gen chapit ki koresponn ak rechèch la.</p>
    </div>`;

  // Wire search
  const input = mount.querySelector("#tocSearch");
  const items = [...mount.querySelectorAll(".toc-item")];
  const groupsEls = [...mount.querySelectorAll(".toc-group")];
  const empty = mount.querySelector("#tocEmpty");
  const count = mount.querySelector("#tocCount");

  const total = items.length;
  const chapTotal = CHAPTERS.length;
  const updateCount = (n) => {
    count.textContent = n === total ? `${chapTotal} chapit` : `${n} / ${total} seksyon`;
  };
  updateCount(total);

  input.addEventListener("input", () => {
    const q = input.value.trim().toLowerCase();
    let visible = 0;
    items.forEach((li) => {
      const match = !q || li.dataset.search.includes(q);
      li.hidden = !match;
      if (match) visible++;
    });
    groupsEls.forEach((g) => {
      const anyVisible = [...g.querySelectorAll(".toc-item")].some((li) => !li.hidden);
      g.hidden = !anyVisible;
    });
    empty.hidden = visible !== 0;
    updateCount(visible);
  });
}

/* ---------- Single Chapter ---------- */
function renderChapter(id) {
  const i = indexOfChapter(id);
  if (i === -1) {
    renderNotFound();
    return;
  }
  const c = CHAPTERS[i];
  const prev = CHAPTERS[i - 1];
  const next = CHAPTERS[i + 1];

  const nav = `
    <nav class="chapter-nav" aria-label="Navigasyon chapit">
      ${
        prev
          ? `<a class="chapter-nav-btn prev" href="#route-chapit-${prev.id}">
               <span class="cn-dir">← Chapit anvan</span>
               <span class="cn-title">${esc(prev.num)}. ${esc(prev.title)}</span>
             </a>`
          : `<span class="chapter-nav-btn disabled" aria-disabled="true">
               <span class="cn-dir">← Chapit anvan</span>
               <span class="cn-title">Sa a se premye chapit la</span>
             </span>`
      }
      ${
        next
          ? `<a class="chapter-nav-btn next" href="#route-chapit-${next.id}">
               <span class="cn-dir">Pwochen chapit →</span>
               <span class="cn-title">${esc(next.num)}. ${esc(next.title)}</span>
             </a>`
          : `<span class="chapter-nav-btn disabled" aria-disabled="true">
               <span class="cn-dir">Pwochen chapit →</span>
               <span class="cn-title">Sa a se dènye chapit la</span>
             </span>`
      }
    </nav>`;

  mount.innerHTML = `
    <div class="container book-container">
      ${breadcrumb([
        HOME_CRUMB,
        { label: "Chapit yo", href: "#route-chapit" },
        { label: `Chapit ${c.num}` },
      ])}

      <article class="chapter-page">
        <header class="chapter-head">
          <span class="chapter-part">${esc(c.part)}</span>
          <span class="chapter-badge">Chapit ${esc(c.num)}</span>
          <h1>${esc(c.title)}</h1>
          <p class="chapter-summary">${esc(c.summary)}</p>
          <div class="chapter-tools"><button class="btn btn-outline" id="speakChapter" type="button">Koute Chapit la</button><button class="btn btn-ghost" id="bookmarkChapter" type="button">Sove chapit la</button><label>Vitès <select id="speechRate"><option value="0.8">0.8×</option><option value="1" selected>1×</option><option value="1.2">1.2×</option></select></label></div>
        </header>
        <div class="chapter-body">
          ${renderBody(c.body)}
        </div>
        ${nav}
        <div class="chapter-foot">
          <a class="text-link" href="#route-chapit">← Tounen nan tab matyè a</a>
          <span class="chapter-progress">${i + 1} / ${CHAPTERS.length}</span>
        </div>
        <section class="chapter-actions" aria-label="Aksyon pou lektè yo">
          <div class="download-panel"><strong>Telechaje liv la</strong><p>Vèsyon PDF la ap disponib byento.</p><span>Disponib byento</span></div>
          <form class="comment-panel" data-comment-form><label for="comment-${esc(c.id)}">Kite yon kòmantè</label><textarea id="comment-${esc(c.id)}" rows="3" placeholder="Pataje refleksyon ou sou chapit sa a…" required></textarea><button class="btn btn-outline" type="submit">Voye kòmantè a</button><small data-comment-message aria-live="polite"></small></form>
        </section>
      </article>
    </div>`;
  const audio = mount.querySelector("#speakChapter");
  const text = [...mount.querySelectorAll(".chapter-body p")].map((p) => p.textContent).join("\\n\\n");
  let utterance;
  audio?.addEventListener("click", () => {
    if (!("speechSynthesis" in window)) { audio.textContent = "Odyo pa disponib"; return; }
    if (speechSynthesis.speaking && !speechSynthesis.paused) { speechSynthesis.pause(); audio.textContent = "Kontinye"; return; }
    if (speechSynthesis.paused) { speechSynthesis.resume(); audio.textContent = "Poz"; return; }
    utterance = new SpeechSynthesisUtterance(text); utterance.lang = "ht-HT"; utterance.rate = Number(mount.querySelector("#speechRate").value); utterance.onend = () => { audio.textContent = "Koute Chapit la"; }; speechSynthesis.speak(utterance); audio.textContent = "Poz";
  });
  mount.querySelector("#speechRate")?.addEventListener("change", (e) => { if (utterance) utterance.rate = Number(e.target.value); });
  mount.querySelector("[data-comment-form]")?.addEventListener("submit", (event) => { event.preventDefault(); const message = mount.querySelector("[data-comment-message]"); message.textContent = "Mèsi. Kòmantè ou pare pou revizyon."; event.currentTarget.reset(); });
  const bookmark = mount.querySelector("#bookmarkChapter"); const key = `novo-ayiti-bookmark-${c.id}`;
  if (sessionStorage.getItem(key) === "1") bookmark.textContent = "Chapita sove";
  bookmark?.addEventListener("click", () => { const saved = sessionStorage.getItem(key) !== "1"; sessionStorage.setItem(key, saved ? "1" : "0"); bookmark.textContent = saved ? "Chapita sove" : "Sove chapit la"; });
}

/* ---------- Generic document page (front matter + annexes) ----------
   Renders a simple prose page with breadcrumb and prev/next within its
   own collection. `kind` is "fwontmatye" or "aneks" (used for routes). */
function renderDoc(collection, kind, id, sectionLabel) {
  const i = collection.findIndex((d) => String(d.id) === String(id));
  if (i === -1) { renderNotFound(); return; }
  const d = collection[i];
  const prev = collection[i - 1];
  const next = collection[i + 1];
  const linkFor = (x) => `#route-${kind}-${x.id}`;

  const nav = `
    <nav class="chapter-nav" aria-label="Navigasyon paj">
      ${
        prev
          ? `<a class="chapter-nav-btn prev" href="${linkFor(prev)}">
               <span class="cn-dir">← Anvan</span>
               <span class="cn-title">${esc(prev.title)}</span>
             </a>`
          : `<span class="chapter-nav-btn disabled" aria-disabled="true">
               <span class="cn-dir">← Anvan</span>
               <span class="cn-title">Sa a se premye paj la</span>
             </span>`
      }
      ${
        next
          ? `<a class="chapter-nav-btn next" href="${linkFor(next)}">
               <span class="cn-dir">Apre →</span>
               <span class="cn-title">${esc(next.title)}</span>
             </a>`
          : `<span class="chapter-nav-btn disabled" aria-disabled="true">
               <span class="cn-dir">Apre →</span>
               <span class="cn-title">Sa a se dènye paj la</span>
             </span>`
      }
    </nav>`;

  mount.innerHTML = `
    <div class="container book-container">
      ${breadcrumb([HOME_CRUMB, { label: "Chapit yo", href: "#route-chapit" }, { label: d.title }])}
      <article class="chapter-page">
        <header class="chapter-head">
          <span class="chapter-part">${esc(sectionLabel)}</span>
          <h1>${esc(d.title)}</h1>
        </header>
        <div class="chapter-body">
          ${renderBody(d.body)}
        </div>
        ${nav}
        <div class="chapter-foot">
          <a class="text-link" href="#route-chapit">← Tounen nan tab matyè a</a>
        </div>
      </article>
    </div>`;
}

/* ---------- The Book ---------- */
function renderBookPage() {
  const p = BOOK_PAGE;
  const parts = p.parts
    .map(
      (pt) => `
      <li class="part-card">
        <span class="part-num">Pati ${esc(pt.num)}</span>
        <h3>${esc(pt.title)}</h3>
        <p>${esc(pt.desc)}</p>
      </li>`
    )
    .join("");
  const audience = p.audience.map((a) => `<li>${esc(a)}</li>`).join("");
  const paras = p.paragraphs.map((t) => `<p>${esc(t)}</p>`).join("");

  mount.innerHTML = `
    <div class="container book-container">
      ${breadcrumb([HOME_CRUMB, { label: "Liv la" }])}

      <div class="book-hero">
        <div class="book-hero-copy">
          <span class="eyebrow dark">${esc(p.eyebrow)}</span>
          <h1 class="section-title">${esc(p.title)}</h1>
          <p class="page-lead">${esc(p.lead)}</p>
          <div class="book-hero-actions">
            <a class="btn btn-primary" href="#route-chapit">Louvri tab matyè a</a>
            <a class="btn btn-ghost" href="#route-kontak">Kontakte nou</a>
          </div>
        </div>
        <div class="book-hero-cover">${coverMarkup()}</div>
      </div>

      <section class="page-section">
        <div class="page-prose">${paras}</div>
      </section>

      <section class="page-section">
        <h2 class="page-subtitle">Estrikti liv la</h2>
        <ul class="part-grid">${parts}</ul>
      </section>

      <section class="page-section">
        <h2 class="page-subtitle">Pou ki moun liv la ye</h2>
        <ul class="audience-list">${audience}</ul>
      </section>
    </div>`;
}

/* ---------- Infographics ---------- */
function renderInfographics() {
  const g = INFOGRAPHICS;

  // Chapters per part — computed from real data
  const parts = [...new Set(CHAPTERS.map((c) => c.part))];
  const perPart = parts.map((part) => ({
    label: part,
    count: CHAPTERS.filter((c) => c.part === part).length,
  }));
  const maxCount = Math.max(...perPart.map((p) => p.count));

  const figures = g.figures
    .map(
      (f) => `
      <div class="info-figure">
        <strong>${esc(f.value)}</strong>
        <span>${esc(f.label)}</span>
      </div>`
    )
    .join("");

  const priorities = g.priorities
    .map(
      (b) => `
      <li class="bar-row">
        <span class="bar-label">${esc(b.label)}</span>
        <span class="bar-track"><span class="bar-fill" style="width:${Number(b.value)}%"></span></span>
        <span class="bar-value">${Number(b.value)}</span>
      </li>`
    )
    .join("");

  const distribution = perPart
    .map(
      (p) => `
      <li class="dist-row">
        <span class="dist-label">${esc(p.label)}</span>
        <span class="dist-bar"><span class="dist-fill" style="width:${(p.count / maxCount) * 100}%">${p.count}</span></span>
      </li>`
    )
    .join("");

  mount.innerHTML = `
    <div class="container book-container">
      ${breadcrumb([HOME_CRUMB, { label: "Enfografik" }])}
      ${pageHead(g.eyebrow, g.title, g.lead)}

      <div class="info-figures">${figures}</div>

      <section class="page-section">
        <h2 class="page-subtitle">Nivo priyorite nan vizyon an</h2>
        <ul class="bar-list">${priorities}</ul>
      </section>

      <section class="page-section">
        <h2 class="page-subtitle">Reparticyon chapit yo pa pati</h2>
        <ul class="dist-list">${distribution}</ul>
      </section>
    </div>`;
}

/* ---------- Bibliography ---------- */
function renderBibliography() {
  mount.innerHTML = `
    <div class="container book-container">
      ${breadcrumb([HOME_CRUMB, { label: "Bibliyografi" }])}
      ${pageHead("Referans", "Bibliyografi", "Sous, referans ak dokiman ki sèvi kòm baz pou plan estratejik la.")}
      <div class="chapter-body">${renderBody(BIBLIOGRAPHY)}</div>
    </div>`;
}

/* ---------- Glossary (filterable) ---------- */
function renderGlossary() {
  // Render the manuscript's real glossary (prose paragraphs) and make each
  // entry searchable. renderBody() turns the source into <p> blocks.
  const html = renderBody(GLOSSARY);
  mount.innerHTML = `
    <div class="container book-container">
      ${breadcrumb([HOME_CRUMB, { label: "Glosè" }])}
      ${pageHead("Referans", "Glosè", "Definisyon tèm kle yo pou ede tout lektè konprann plan an.")}

      <div class="toc-search glossary-search">
        <input id="glossarySearch" type="search" autocomplete="off"
               placeholder="Chèche yon tèm…" aria-label="Chèche nan glosè a" />
        <span class="toc-count" id="glossaryCount"></span>
      </div>

      <div class="chapter-body glossary-prose">${html}</div>
      <p id="glossaryEmpty" class="toc-empty" hidden>Pa gen tèm ki koresponn ak rechèch la.</p>
    </div>`;

  // Tag each rendered paragraph/list-item as a searchable glossary entry
  const input = mount.querySelector("#glossarySearch");
  const items = [...mount.querySelectorAll(".glossary-prose > p, .glossary-prose li")];
  items.forEach((el) => {
    el.classList.add("glossary-item");
    el.dataset.search = (el.textContent || "").toLowerCase();
  });
  const empty = mount.querySelector("#glossaryEmpty");
  const count = mount.querySelector("#glossaryCount");
  const total = items.length;
  const updateCount = (n) => {
    count.textContent = n === total ? `${total} tèm` : `${n} / ${total} tèm`;
  };
  updateCount(total);

  input.addEventListener("input", () => {
    const q = input.value.trim().toLowerCase();
    let visible = 0;
    items.forEach((li) => {
      const match = !q || li.dataset.search.includes(q);
      li.hidden = !match;
      if (match) visible++;
    });
    empty.hidden = visible !== 0;
    updateCount(visible);
  });
}

/* ---------- About the Author ---------- */
function renderAuthorPage() {
  const a = AUTHOR_PAGE;
  const paras = a.paragraphs.map((t) => `<p>${esc(t)}</p>`).join("");
  const highlights = a.highlights
    .map(
      (h) => `
      <li class="highlight-card">
        <span class="highlight-k">${esc(h.k)}</span>
        <span class="highlight-v">${esc(h.v)}</span>
      </li>`
    )
    .join("");

  mount.innerHTML = `
    <div class="container book-container">
      ${breadcrumb([HOME_CRUMB, { label: "Otè a" }])}

      <div class="author-page">
        <div class="author-page-visual">
          <div class="author-visual">
            <img class="author-photo" src="/author-photo.jpg" alt="Ownolson Jean Baptiste, otè Nouvo Ayiti" width="900" height="1600" loading="eager" />
            <div class="author-badge">${esc(a.badge)}</div>
          </div>
        </div>
        <div class="author-page-copy">
          <span class="eyebrow dark">${esc(a.eyebrow)}</span>
          <h1 class="section-title">${esc(a.name)}</h1>
          <p class="page-lead">${esc(a.lead)}</p>
          <div class="page-prose">${paras}</div>
          <ul class="highlight-grid">${highlights}</ul>
          <blockquote class="page-quote">${esc(a.quote)}</blockquote>
          <div class="book-hero-actions">
        <a class="btn btn-primary" href="#route-liv">Dekouvri liv la</a>
        <a class="btn btn-ghost" href="#route-kontak">Kontakte otè a</a>
          </div>
        </div>
      </div>
    </div>`;
}

/* ---------- Contact ---------- */
function renderContact() {
  const c = CONTACT_PAGE;
  const methods = c.methods
    .map(
      (m) => `
      <li class="contact-method">
        <span class="contact-k">${esc(m.k)}</span>
        <span class="contact-v">${esc(m.v)}</span>
      </li>`
    )
    .join("");

  mount.innerHTML = `
    <div class="container book-container">
      ${breadcrumb([HOME_CRUMB, { label: "Kontak" }])}
      ${pageHead(c.eyebrow, c.title, c.lead)}

      <div class="contact-grid">
        <form id="contactForm" class="contact-form" novalidate>
          <label>${esc(c.form.name)}
            <input type="text" name="name" required autocomplete="name" />
          </label>
          <label>${esc(c.form.email)}
            <input type="email" name="email" required autocomplete="email" />
          </label>
          <label>${esc(c.form.subject)}
            <input type="text" name="subject" required />
          </label>
          <label>${esc(c.form.message)}
            <textarea name="message" rows="5" required></textarea>
          </label>
          <button class="btn btn-primary" type="submit">${esc(c.form.submit)}</button>
          <small id="contactMsg" aria-live="polite"></small>
        </form>

        <aside class="contact-aside">
          <h2 class="page-subtitle">Kanal dirèk</h2>
          <ul class="contact-methods">${methods}</ul>
        </aside>
      </div>
    </div>`;

  const form = mount.querySelector("#contactForm");
  const msg = mount.querySelector("#contactMsg");
  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const data = new FormData(form);
    const name = (data.get("name") || "").toString().trim();
    const email = (data.get("email") || "").toString().trim();
    const subject = (data.get("subject") || "").toString().trim();
    const message = (data.get("message") || "").toString().trim();
    const validEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
    if (name && subject && message && validEmail) {
      msg.textContent = c.form.ok;
      msg.className = "ok";
      form.reset();
    } else {
      msg.textContent = c.form.err;
      msg.className = "err";
    }
  });
}

const PILLARS = [["jistis","Jistis","Tribinal modèn, aksè ak dwa sitwayen yo.",["jistis","tribinal"]],["sekirite","Sekirite","Polis pwofesyonèl ak pwoteksyon kominote yo.",["sekirite","polis"]],["gouvènans","Bon gouvènans","Enstitisyon solid, transparans ak responsabilite.",["gouvènans","koripsyon"]],["ekonomi","Ekonomi","Travay, antreprenarya ak pwodiksyon nasyonal.",["ekonomi","travay"]],["edikasyon","Edikasyon","Fòmasyon teknik, kalite ak rechèch.",["edikasyon","lekòl"]],["sante","Sante","Swen aksesib ak prevansyon.",["sante","sante"]],["enfrastrikti","Enfrastrikti","Wout, dlo, kouran ak transpò.",["wout","dlo","kouran"]],["agrikilti","Agrikilti","Irigasyon, pwodiksyon lokal ak manje.",["agrikilti","irigasyon"]],["anviwonman","Anviwònman","Rebwazman, dlo ak rezilyans klimatik.",["anviwònman","klima"]],["dijital","Dijitalizasyon ak inovasyon","Pòtal Leta ak sèvis piblik sou entènèt.",["dijital","DGI","ONI"]]];
function related(terms){return CHAPTERS.filter(c=>terms.some(t=>`${c.title} ${c.summary} ${c.body}`.toLowerCase().includes(t.toLowerCase())))}
function renderPillars(){mount.innerHTML=`<div class="container book-container">${breadcrumb([HOME_CRUMB,{label:"10 Pilye"}])}${pageHead("Vizyon nasyonal","10 Pilye Vizyon Nouvo Ayiti","Dis domèn estratejik ki konekte nan yon sèl vizyon.")}<div class="cards-grid">${PILLARS.map(p=>`<article class="pillar-card"><h2>${esc(p[1])}</h2><p>${esc(p[2])}</p><a class="btn btn-outline" href="#route-pilye-${p[0]}">Eksplore Pilye a</a></article>`).join("")}</div></div>`}
function renderPillar(id){const p=PILLARS.find(x=>x[0]===id);if(!p)return renderNotFound();const rows=related(p[3]);mount.innerHTML=`<div class="container book-container">${breadcrumb([HOME_CRUMB,{label:"10 Pilye",href:"#route-pilye"},{label:p[1]}])}${pageHead("Pilye estratejik",p[1],p[2])}<h2 class="page-subtitle">Chapit ki gen rapò</h2><ul class="toc-list">${rows.map(c=>`<li class="toc-item"><a href="#route-chapit-${c.id}"><span class="toc-num">${esc(c.num)}</span><span class="toc-text"><strong>${esc(c.title)}</strong><small>${esc(c.summary)}</small></span></a></li>`).join("")}</ul></div>`}
function renderVision(){mount.innerHTML=`<div class="container book-container">${breadcrumb([HOME_CRUMB,{label:"Vizyon nasyonal"}])}${pageHead("Yon sèl direksyon","Vizyon Nasyonal Nouvo Ayiti","Yon plan reflechi pou chanje fason peyi a fonksyone.")}<section class="page-section"><h2 class="page-subtitle">Objektif liv la</h2><p class="lead">${esc(BOOK_PAGE.paragraphs[0])}</p></section><section class="page-section"><h2 class="page-subtitle">Prensip fondamantal</h2><p class="lead">Transparans, responsabilite piblik, meritokrasi, respè lalwa ak patisipasyon sitwayen yo.</p></section><a class="btn btn-primary" href="#route-pilye">Eksplore 10 pilye yo</a></div>`}
function renderIndexPage(){const terms=["Agrikilti","Edikasyon","Jistis","Sekirite","Ekonomi","DGI","ONI","BRH","PNH","DINEPA","EDH"];mount.innerHTML=`<div class="container book-container">${breadcrumb([HOME_CRUMB,{label:"Endèks"}])}${pageHead("Rechèch tematik","Endèks entèaktif","Chwazi yon tèm pou wè chapit ki gen rapò.")}<ul class="toc-list">${terms.map(t=>`<li class="toc-item"><a href="#route-search-${encodeURIComponent(t)}"><span class="toc-text"><strong>${t}</strong></span><span class="toc-go">→</span></a></li>`).join("")}</ul></div>`}
function renderSearch(q){const term=decodeURIComponent(q).toLowerCase(),rows=CHAPTERS.filter(c=>`${c.title} ${c.summary} ${c.body}`.toLowerCase().includes(term));mount.innerHTML=`<div class="container book-container">${breadcrumb([HOME_CRUMB,{label:"Endèks",href:"#route-endeks"},{label:term}])}${pageHead("Rezilta rechèch",`Rezilta pou ${term}`,`${rows.length} chapit jwenn.`)}<ul class="toc-list">${rows.map(c=>`<li class="toc-item"><a href="#route-chapit-${c.id}"><span class="toc-num">${esc(c.num)}</span><span class="toc-text"><strong>${esc(c.title)}</strong><small>${esc(c.summary)}</small></span></a></li>`).join("")}</ul></div>`}
function renderAssistant(){mount.innerHTML=`<div class="container book-container">${breadcrumb([HOME_CRUMB,{label:"Asistan AI"}])}${pageHead("Asistan ki baze sou liv la","Asistan Entèlijan Nouvo Ayiti","Repons yo limite ak kontni liv la.")}<form id="assistantForm" class="contact-form"><textarea id="assistantQuestion" rows="4" placeholder="Ki sa liv la di sou DGI?" required></textarea><button class="btn btn-primary">Poze kesyon an</button></form><div id="assistantAnswer" class="page-prose"></div></div>`;mount.querySelector("form").addEventListener("submit",e=>{e.preventDefault();const q=mount.querySelector("#assistantQuestion").value,rows=related(q.split(/\s+/).filter(x=>x.length>3));mount.querySelector("#assistantAnswer").innerHTML=rows.slice(0,5).map(c=>`<p><strong>Chapit ${esc(c.num)} — ${esc(c.title)}</strong><br>${esc(c.summary)} <a href="#route-chapit-${c.id}">Li chapit la →</a></p>`).join("")||"<p>Mwen pa jwenn repons lan nan kontni liv la.</p>"})}
function renderDownloads(){mount.innerHTML=`<div class="container book-container">${breadcrumb([HOME_CRUMB,{label:"Telechaje"}])}${pageHead("Sant telechajman","Telechaje Liv la","Fòma ofisyèl yo ap disponib sou platfòm la.")}<div class="cards-grid"><article class="pillar-card"><h2>PDF</h2><p>Vèsyon dijital liv la.</p><span>Disponib byento</span></article><article class="pillar-card"><h2>EPUB</h2><p>Fòma pou lektè elektwonik.</p><span>Disponib byento</span></article><article class="pillar-card"><h2>Audiobook</h2><p>Vèsyon odyo liv la.</p><span>Disponib byento</span></article></div></div>`}
function renderCommunity(){mount.innerHTML=`<div class="container book-container">${breadcrumb([HOME_CRUMB,{label:"Kominote"}])}${pageHead("Kominote","Pataje refleksyon ou","Kòmantè, sijesyon ak kestyon lektè yo ede konvèsasyon an grandi.")}<form id="communityForm" class="contact-form"><label>Non<input required></label><label>Imèl<input type="email" required></label><label>Kòmantè<textarea required rows="5"></textarea></label><button class="btn btn-primary">Voye kòmantè a</button><small id="communityMsg" aria-live="polite"></small></form></div>`;mount.querySelector("form").addEventListener("submit",e=>{e.preventDefault();mount.querySelector("#communityMsg").textContent="Mèsi. Kòmantè ou pare pou revizyon."})}

function renderNotFound() {
  mount.innerHTML = `
    <div class="container book-container">
      ${breadcrumb([HOME_CRUMB, { label: "Pa jwenn" }])}
      <div class="chapter-page">
        <h1 class="section-title">Paj sa a pa egziste.</h1>
        <p class="chapter-summary">Petèt lyen an pa bon. Tounen nan akèy la pou w kontinye.</p>
        <a class="btn btn-primary" href="#top">Tounen nan akèy</a>
      </div>
    </div>`;
}

/* ---------- Router ---------- */
const ROUTES = {
  "/liv": renderBookPage,
  "/chapit": renderIndex,
  "/pilye": renderPillars,
  "/vizyon-nasyonal": renderVision,
  "/endeks": renderIndexPage,
  "/asistan-ai": renderAssistant,
  "/telechaje": renderDownloads,
  "/kominote": renderCommunity,
  "/enfografik": renderInfographics,
  "/bibliyografi": renderBibliography,
  "/glose": renderGlossary,
  "/ote": renderAuthorPage,
  "/kontak": renderContact,
};

function enterPage() {
  document.body.classList.add("reading");
  if (homeMain) homeMain.hidden = true;
  mount.hidden = false;
}

function exitPage() {
  document.body.classList.remove("reading");
  if (homeMain) homeMain.hidden = false;
  mount.hidden = true;
  mount.innerHTML = "";
}

function setActive(routeKey) {
  document.querySelectorAll(".main-nav a[data-route]").forEach((a) => {
    const on = a.getAttribute("data-route") === routeKey;
    a.classList.toggle("active", on);
    if (on) a.setAttribute("aria-current", "page");
    else a.removeAttribute("aria-current");
  });
}

function route() {
  const hash = location.hash || "";

  // Not a page route -> show homepage
  if (!hash.startsWith("#route-")) {
    exitPage();
    setActive("home");
    return;
  }

  enterPage();
  const rest = hash.slice("#route-".length); // "chapit-3" -> chapter 3; "liv" -> The Book

  if (rest.startsWith("chapit-")) {
    const id = rest.slice("chapit-".length);
    renderChapter(id);
    setActive("/chapit");
  } else if (rest.startsWith("fwontmatye-")) {
    renderDoc(FRONTMATTER, "fwontmatye", rest.slice("fwontmatye-".length), "Paj entwodiktif");
    setActive("/chapit");
  } else if (rest.startsWith("bakmatye-")) {
    renderDoc(BACKMATTER, "bakmatye", rest.slice("bakmatye-".length), "Paj final");
    setActive("/chapit");
  } else if (rest === "pilye") {
    renderPillars();
    setActive("/pilye");
  } else if (rest === "vizyon-nasyonal") {
    renderVision();
    setActive("/vizyon-nasyonal");
  } else if (rest === "endeks") {
    renderIndexPage();
    setActive("/endeks");
  } else if (rest === "asistan-ai") {
    renderAssistant();
    setActive("/asistan-ai");
  } else if (rest.startsWith("pilye-")) {
    renderPillar(rest.slice("pilye-".length));
    setActive("/pilye");
  } else if (rest.startsWith("search-")) {
    renderSearch(rest.slice("search-".length));
    setActive("/endeks");
  } else if (rest.startsWith("aneks-")) {
    // keep prev/next within the annex's own group (Prensipal vs Konplemantè)
    const id = rest.slice("aneks-".length);
    const item = ANNEXES.find((a) => String(a.id) === id);
    const scope = item ? ANNEXES.filter((a) => a.group === item.group) : ANNEXES;
    renderDoc(scope, "aneks", id, item ? item.group : "Anèks");
    setActive("/chapit");
  } else {
    const key = "/" + rest;
    const fn = ROUTES[key];
    if (fn) {
      fn();
      setActive(key);
    } else {
      renderNotFound();
      setActive("home");
    }
  }

  window.scrollTo({ top: 0, behavior: "auto" });
}

window.addEventListener("hashchange", route);
window.addEventListener("DOMContentLoaded", route);
if (document.readyState !== "loading") route();
