/* ============================================================
   Novo Ayiti — script.js
   Handles: language toggle (HT/FR), mobile menu, newsletter,
   footer year, and scroll reveal animations.
   ============================================================ */

/* ---------- Translations ---------- */
const I18N = {
  ht: {
    "brand.tagline": "Liv • Vizyon • Refòm",
    "nav.home": "Akèy",
    "nav.book": "Liv la",
    "nav.vision": "Vizyon",
    "nav.chapters": "Chapit yo",
    "nav.infographics": "Enfografik",
    "nav.bibliography": "Bibliyografi",
    "nav.glossary": "Glosè",
    "nav.author": "Otè a",
    "nav.contact": "Kontak",
    "nav.cta": "Li liv la",

    "hero.eyebrow": "Yon pwojè nasyonal pou jenerasyon kap vini yo",
    "hero.title": "Konstwi yon <span>Nouvo Ayiti</span> sou baz vizyon, disiplin ak aksyon.",
    "hero.text": "<strong>Novo Ayiti</strong> prezante yon vizyon estriktire pou refòme Leta, ranfòse enstitisyon yo, devlope ekonomi an, modènize sèvis piblik yo epi bay chak sitwayen plis diyite ak opòtinite.",
    "hero.cta1": "Li prezantasyon liv la",
    "hero.cta2": "Eksplore vizyon an",
    "hero.stat1": "Chapit estratejik",
    "hero.stat2": "Pilye devlopman",
    "hero.stat3": "Vizyon nasyonal",

    "book.subtitle": "Yon vizyon modèn pou refòm, devlopman ak renesans nasyonal",
    "book.footer": "Liv • Pwopozisyon • Aksyon",
    "note.one": "Refòm enstitisyonèl",
    "note.two": "Dijitalizasyon sèvis piblik",

    "intro.eyebrow": "Sou liv la",
    "intro.title": "Yon plan reflechi pou chanje fason peyi a fonksyone.",
    "intro.lead": "Liv la rasanble pwopozisyon konkrè sou sekirite, jistis, travay, envestisman, edikasyon, sante, agrikilti, enfrastrikti ak administrasyon piblik.",
    "intro.body": "Objektif la se mete lide yo nan yon estrikti klè pou sitwayen, pwofesyonèl, etidyan, antreprenè ak responsab piblik kapab analize yo, amelyore yo epi sèvi avè yo kòm baz pou aksyon.",
    "intro.link1": "Gade chapit prensipal yo →",
    "intro.link2": "Resevwa nouvèl sou piblikasyon an →",

    "pillars.eyebrow": "Pilye vizyon an",
    "pillars.title": "Dis domèn kle pou rebati peyi a.",
    "pillars.text": "Chak pilye konekte ak lòt yo pou fòme yon sistèm nasyonal ki pi efikas, transparan ak dirab.",
    "pillar.justice.t": "Jistis",
    "pillar.justice.d": "Tribinal modèn, aksè rapid, endepandans jidisyè ak pwoteksyon dwa sitwayen yo.",
    "pillar.security.t": "Sekirite",
    "pillar.security.d": "Polis pwofesyonèl, teknoloji, prevansyon, kontwòl fwontyè ak pwoteksyon kominote yo.",
    "pillar.gov.t": "Bon gouvènans",
    "pillar.gov.d": "Enstitisyon solid, responsablite piblik, meritokrasi ak kontwòl kont koripsyon.",
    "pillar.economy.t": "Ekonomi",
    "pillar.economy.d": "Travay, antreprenarya, endistri, kredi, envestisman ak pwodiksyon nasyonal.",
    "pillar.agri.t": "Agrikilti",
    "pillar.agri.d": "Teknoloji modèn, irigasyon, transfòmasyon lokal, depo ak ekspòtasyon.",
    "pillar.edu.t": "Edikasyon",
    "pillar.edu.d": "Fòmasyon teknik, kalite, dijitalizasyon, rechèch syantifik ak egalite chans.",
    "pillar.health.t": "Sante",
    "pillar.health.d": "Swen aksesib, lopital rejyonal, prevansyon, dosye medikal ak laboratwa modèn.",
    "pillar.infra.t": "Enfrastrikti",
    "pillar.infra.d": "Wout, dlo, kouran, transpò, lojman ak espas piblik planifye.",
    "pillar.digital.t": "Dijitalizasyon",
    "pillar.digital.d": "Pòtal Leta, idantite dijital, peman elektwonik ak sèvis piblik sou entènèt.",
    "pillar.env.t": "Anviwònman",
    "pillar.env.d": "Rebwazman, jesyon dechè, pwoteksyon dlo, enèji pwòp ak rezilyans klimatik.",

    "chapters.eyebrow": "Chapit seleksyone",
    "chapters.title": "Yon bibliyotèk lide pou aksyon piblik.",
    "chapters.cta": "Louvri tab matyè a",
    "ch.more": "Detay →",
    "ch1.t": "Refòm Leta ak separasyon pouvwa yo",
    "ch1.d": "Wòl egzak chak enstitisyon, limit pouvwa ak responsablite devan sitwayen yo.",
    "ch2.t": "Sistèm nasyonal anti-koripsyon",
    "ch2.d": "Transparans bidjè, trasabilite depans, deklarasyon patrimwàn ak sanksyon.",
    "ch3.t": "Gouvènman dijital",
    "ch3.d": "Yon sèl pòtal pou dokiman, taks, pèmi, plent, peman ak sèvis piblik.",
    "ch4.t": "Dezentralizasyon ak devlopman depatman yo",
    "ch4.d": "Plan ekonomik lokal, sèvis de baz, enfrastrikti ak otonomi administratif.",
    "ch5.t": "Travay, pwodiksyon ak endistriyalizasyon",
    "ch5.d": "Fòmasyon pwofesyonèl, pwoteksyon travayè, faktori, kredi ak ekspòtasyon.",

    "author.badge": "Otè • Atis • Vizyonè",
    "author.eyebrow": "Sou otè a",
    "author.lead": "Yon Ayisyen ki itilize eksperyans, obsèvasyon ak refleksyon li pou pwopoze solisyon sou avni peyi a.",
    "author.body": "Pwojè <strong>Novo Ayiti</strong> a fèt nan volonte pou transfòme fristrasyon an vizyon, vizyon an pwopozisyon, epi pwopozisyon an zouti pou aksyon kolektif.",
    "author.quote": "“Chanjman pa kòmanse ak yon slogan; li kòmanse ak yon plan, enstitisyon solid ak sitwayen ki angaje.”",

    "news.eyebrow": "Rete konekte",
    "news.title": "Resevwa nouvèl sou liv la ak pwojè Novo Ayiti.",
    "news.text": "Enskri pou resevwa mizajou, ekstrè chapit, enfografi ak enfòmasyon sou lansman an.",
    "news.label": "Adrès imèl",
    "news.placeholder": "Antre adrès imèl ou",
    "news.submit": "Enskri",
    "news.ok": "Mèsi! Ou enskri ak siksè.",
    "news.err": "Tanpri antre yon adrès imèl valab.",

    "footer.tagline": "Yon vizyon pou demen",
    "footer.about": "Yon platfòm pou prezante liv la, pataje pwopozisyon ak ankouraje refleksyon sou devlopman Ayiti.",
    "footer.nav": "Navigasyon",
    "footer.info": "Enfòmasyon",
    "footer.bulletin": "Bilten",
    "footer.social": "Rezo",
    "footer.rights": "Tout dwa rezève.",
  },
  fr: {
    "brand.tagline": "Livre • Vision • Réforme",
    "nav.home": "Accueil",
    "nav.book": "Le livre",
    "nav.vision": "Vision",
    "nav.chapters": "Chapitres",
    "nav.infographics": "Infographies",
    "nav.bibliography": "Bibliographie",
    "nav.glossary": "Glossaire",
    "nav.author": "L'auteur",
    "nav.contact": "Contact",
    "nav.cta": "Lire le livre",

    "hero.eyebrow": "Un projet national pour les générations à venir",
    "hero.title": "Bâtir une <span>Nouvelle Haïti</span> sur la vision, la discipline et l'action.",
    "hero.text": "<strong>Novo Ayiti</strong> présente une vision structurée pour réformer l'État, renforcer les institutions, développer l'économie, moderniser les services publics et offrir à chaque citoyen plus de dignité et d'opportunités.",
    "hero.cta1": "Lire la présentation du livre",
    "hero.cta2": "Explorer la vision",
    "hero.stat1": "Chapitres stratégiques",
    "hero.stat2": "Piliers de développement",
    "hero.stat3": "Vision nationale",

    "book.subtitle": "Une vision moderne pour la réforme, le développement et la renaissance nationale",
    "book.footer": "Livre • Propositions • Action",
    "note.one": "Réforme institutionnelle",
    "note.two": "Numérisation des services publics",

    "intro.eyebrow": "À propos du livre",
    "intro.title": "Un plan réfléchi pour changer le fonctionnement du pays.",
    "intro.lead": "Le livre rassemble des propositions concrètes sur la sécurité, la justice, l'emploi, l'investissement, l'éducation, la santé, l'agriculture, les infrastructures et l'administration publique.",
    "intro.body": "L'objectif est de placer les idées dans une structure claire afin que citoyens, professionnels, étudiants, entrepreneurs et responsables publics puissent les analyser, les améliorer et s'en servir comme base d'action.",
    "intro.link1": "Voir les chapitres principaux →",
    "intro.link2": "Recevoir des nouvelles sur la publication →",

    "pillars.eyebrow": "Les piliers de la vision",
    "pillars.title": "Dix domaines clés pour reconstruire le pays.",
    "pillars.text": "Chaque pilier se connecte aux autres pour former un système national plus efficace, transparent et durable.",
    "pillar.justice.t": "Justice",
    "pillar.justice.d": "Des tribunaux modernes, un accès rapide, l'indépendance judiciaire et la protection des droits des citoyens.",
    "pillar.security.t": "Sécurité",
    "pillar.security.d": "Une police professionnelle, la technologie, la prévention, le contrôle des frontières et la protection des communautés.",
    "pillar.gov.t": "Bonne gouvernance",
    "pillar.gov.d": "Des institutions solides, la responsabilité publique, la méritocratie et le contrôle de la corruption.",
    "pillar.economy.t": "Économie",
    "pillar.economy.d": "Emploi, entrepreneuriat, industrie, crédit, investissement et production nationale.",
    "pillar.agri.t": "Agriculture",
    "pillar.agri.d": "Technologies modernes, irrigation, transformation locale, stockage et exportation.",
    "pillar.edu.t": "Éducation",
    "pillar.edu.d": "Formation technique, qualité, numérisation, recherche scientifique et égalité des chances.",
    "pillar.health.t": "Santé",
    "pillar.health.d": "Soins accessibles, hôpitaux régionaux, prévention, dossiers médicaux et laboratoires modernes.",
    "pillar.infra.t": "Infrastructures",
    "pillar.infra.d": "Routes, eau, électricité, transport, logement et espaces publics planifiés.",
    "pillar.digital.t": "Numérisation",
    "pillar.digital.d": "Portail de l'État, identité numérique, paiements électroniques et services publics en ligne.",
    "pillar.env.t": "Environnement",
    "pillar.env.d": "Reboisement, gestion des déchets, protection de l'eau, énergie propre et résilience climatique.",

    "chapters.eyebrow": "Chapitres sélectionnés",
    "chapters.title": "Une bibliothèque d'idées pour l'action publique.",
    "chapters.cta": "Ouvrir la table des matières",
    "ch.more": "Détails →",
    "ch1.t": "Réforme de l'État et séparation des pouvoirs",
    "ch1.d": "Le rôle exact de chaque institution, les limites du pouvoir et la responsabilité envers les citoyens.",
    "ch2.t": "Système national anti-corruption",
    "ch2.d": "Transparence budgétaire, traçabilité des dépenses, déclaration de patrimoine et sanctions.",
    "ch3.t": "Gouvernement numérique",
    "ch3.d": "Un portail unique pour les documents, les impôts, les permis, les plaintes, les paiements et les services publics.",
    "ch4.t": "Décentralisation et développement des départements",
    "ch4.d": "Plan économique local, services de base, infrastructures et autonomie administrative.",
    "ch5.t": "Emploi, production et industrialisation",
    "ch5.d": "Formation professionnelle, protection des travailleurs, usines, crédit et exportation.",

    "author.badge": "Auteur • Artiste • Visionnaire",
    "author.eyebrow": "À propos de l'auteur",
    "author.lead": "Un Haïtien qui met son expérience, son observation et sa réflexion au service de solutions pour l'avenir du pays.",
    "author.body": "Le projet <strong>Novo Ayiti</strong> naît de la volonté de transformer la frustration en vision, la vision en propositions, et les propositions en outils pour l'action collective.",
    "author.quote": "« Le changement ne commence pas par un slogan ; il commence par un plan, des institutions solides et des citoyens engagés. »",

    "news.eyebrow": "Restez connecté",
    "news.title": "Recevez des nouvelles sur le livre et le projet Novo Ayiti.",
    "news.text": "Inscrivez-vous pour recevoir les mises à jour, des extraits de chapitres, des infographies et des informations sur le lancement.",
    "news.label": "Adresse e-mail",
    "news.placeholder": "Entrez votre adresse e-mail",
    "news.submit": "S'inscrire",
    "news.ok": "Merci ! Votre inscription a été enregistrée.",
    "news.err": "Veuillez entrer une adresse e-mail valide.",

    "footer.tagline": "Une vision pour demain",
    "footer.about": "Une plateforme pour présenter le livre, partager des propositions et encourager la réflexion sur le développement d'Haïti.",
    "footer.nav": "Navigation",
    "footer.info": "Informations",
    "footer.bulletin": "Bulletin",
    "footer.social": "Réseaux",
    "footer.rights": "Tous droits réservés.",
  },
};

const LANG_LABEL = { ht: "HT", fr: "FR" };
let currentLang = "ht";

function applyLang(lang) {
  const dict = I18N[lang];
  if (!dict) return;
  currentLang = lang;
  document.documentElement.lang = lang;

  // Text-only nodes
  document.querySelectorAll("[data-i18n]").forEach((el) => {
    const key = el.getAttribute("data-i18n");
    if (dict[key] != null) el.textContent = dict[key];
  });

  // Nodes that contain inline HTML (bold/italic/spans)
  document.querySelectorAll("[data-i18n-html]").forEach((el) => {
    const key = el.getAttribute("data-i18n-html");
    if (dict[key] != null) el.innerHTML = dict[key];
  });

  // Attribute translations, e.g. "placeholder|news.placeholder"
  document.querySelectorAll("[data-i18n-attr]").forEach((el) => {
    el.getAttribute("data-i18n-attr").split(",").forEach((pair) => {
      const [attr, key] = pair.split("|");
      if (attr && key && dict[key] != null) el.setAttribute(attr, dict[key]);
    });
  });

  const langBtn = document.querySelector(".lang-btn");
  if (langBtn) {
    // Show the language you'd switch TO, which is clearer for a toggle.
    langBtn.textContent = LANG_LABEL[lang];
    langBtn.setAttribute("aria-label", lang === "ht" ? "Chanje lang / Changer de langue" : "Changer de langue");
  }
}

/* ---------- Init ---------- */
document.addEventListener("DOMContentLoaded", () => {
  // Footer year
  const yearEl = document.getElementById("year");
  if (yearEl) yearEl.textContent = new Date().getFullYear();

  // Language toggle
  const saved = localStorage.getItem("novo-ayiti-lang");
  applyLang(saved === "fr" ? "fr" : "ht");

  const langBtn = document.querySelector(".lang-btn");
  if (langBtn) {
    langBtn.addEventListener("click", () => {
      const next = currentLang === "ht" ? "fr" : "ht";
      applyLang(next);
      localStorage.setItem("novo-ayiti-lang", next);
    });
  }

  // Mobile menu
  const toggle = document.querySelector(".menu-toggle");
  const nav = document.querySelector(".main-nav");
  if (toggle && nav) {
    toggle.addEventListener("click", () => {
      const open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", String(open));
    });
    nav.querySelectorAll("a").forEach((a) =>
      a.addEventListener("click", () => {
        nav.classList.remove("open");
        toggle.setAttribute("aria-expanded", "false");
      })
    );
  }

  // Newsletter
  const form = document.getElementById("newsletterForm");
  const msg = document.getElementById("formMessage");
  if (form && msg) {
    form.addEventListener("submit", (e) => {
      e.preventDefault();
      const input = document.getElementById("email");
      const valid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.value.trim());
      const dict = I18N[currentLang];
      if (valid) {
        msg.textContent = dict["news.ok"];
        msg.className = "ok";
        form.reset();
      } else {
        msg.textContent = dict["news.err"];
        msg.className = "err";
      }
    });
  }

  // Preserve the homepage card design while making each whole card a route link.
  document.querySelectorAll(".pillar-card").forEach((card, index) => {
    const routes = ["justice", "security", "governance", "economy", "education", "health", "infrastructure", "agriculture", "environment", "digital"];
    const route = routes[index];
    if (!route || card.closest("a")) return;
    card.setAttribute("role", "link");
    card.setAttribute("tabindex", "0");
    const open = () => { location.hash = `#route-pilye-${route}`; };
    card.addEventListener("click", open);
    card.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
  });
  document.querySelectorAll(".chapter-item").forEach((card) => {
    if (card.closest("a")) return;
    const link = card.querySelector("a[href]");
    if (!link) return;
    card.setAttribute("role", "link");
    card.setAttribute("tabindex", "0");
    const open = () => { location.hash = link.getAttribute("href"); };
    card.addEventListener("click", (e) => { if (e.target.closest("a")) return; open(); });
    card.addEventListener("keydown", (e) => { if (e.key === "Enter" || e.key === " ") { e.preventDefault(); open(); } });
  });

  // Scroll reveal
  const revealTargets = document.querySelectorAll(
    ".hero-copy, .hero-card-wrap, .two-col > div, .section-head, .pillar-card, .chapter-item, .author-visual, .author-copy, .newsletter-box"
  );
  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add("in");
            io.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.12 }
    );
    revealTargets.forEach((el, i) => {
      el.classList.add("reveal");
      el.style.transitionDelay = `${Math.min(i % 6, 5) * 60}ms`;
      io.observe(el);
    });
  }
});
