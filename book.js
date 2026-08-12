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

import { CHAPTERS, FRONTMATTER, BACKMATTER, ANNEXES, BIBLIOGRAPHY, GLOSSARY, BOOK_TITLE, BOOK_SUBTITLE } from "/book-data.js";
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

// Body may contain intentional inline HTML (<strong>, <ul>...), so we
// only strip HTML comments and split into paragraphs on blank lines.
function renderBody(body = "") {
  return body
    .replace(/<!--[\s\S]*?-->/g, "")
    .split(/\n\s*\n/)
    .map((p) => p.trim())
    .filter(Boolean)
    .map((p) => `<p>${p.replace(/\n/g, "<br>")}</p>`)
    .join("");
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
        </header>
        <div class="chapter-body">
          ${renderBody(c.body)}
        </div>
        ${nav}
        <div class="chapter-foot">
          <a class="text-link" href="#route-chapit">← Tounen nan tab matyè a</a>
          <span class="chapter-progress">${i + 1} / ${CHAPTERS.length}</span>
        </div>
      </article>
    </div>`;
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
            <div class="author-initials">OJB</div>
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
