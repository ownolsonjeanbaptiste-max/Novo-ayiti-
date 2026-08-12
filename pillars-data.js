import { CHAPTERS } from "/book-data.js";

const DEFINITIONS = [
  ["justice", "Jistis", "Tribinal endepandan, aksè egal ak pwoteksyon dwa moun.", ["jistis", "tribinal", "lalwa", "dwa", "kòd"]],
  ["security", "Sekirite", "Sekirite piblik, polis pwofesyonèl ak pwoteksyon fwontyè.", ["sekirite", "polis", "gang", "fwontyè", "PNH"]],
  ["governance", "Bon gouvènans", "Meritokrasi, transparans, responsablite ak enstitisyon solid.", ["gouvènans", "merit", "Leta", "koripsyon", "DGI", "ONI"]],
  ["economy", "Ekonomi", "Travay, pwodiksyon lokal, kredi, envestisman ak endistriyalizasyon.", ["ekonomi", "travay", "pwodiksyon", "kredi", "BNIK", "BRH"]],
  ["education", "Edikasyon", "Kalite edikasyon, fòmasyon pwofesyonèl ak rechèch.", ["edikasyon", "lekòl", "inivèsite", "fòmasyon"]],
  ["health", "Sante", "Swen aksesib, prevansyon, lopital ak sistèm sante piblik.", ["sante", "lopital", "medikal"]],
  ["infrastructure", "Enfrastrikti", "Wout, dlo, elektrisite, lojman ak transpò.", ["wout", "dlo", "elektrisite", "EDH", "DINEPA", "transpò"]],
  ["agriculture", "Agrikilti", "Pwodiksyon alimantè, irigasyon, teknoloji ak mache lokal.", ["agrikilti", "irigasyon", "manje", "pwodiksyon"]],
  ["environment", "Anviwònman", "Pwoteksyon dlo, rebwazman, enèji pwòp ak rezilyans.", ["anviwònman", "klima", "dlo", "dechè"]],
  ["digital", "Dijitalizasyon ak Inovasyon", "Sèvis Leta sou entènèt, idantite dijital ak peman elektwonik.", ["dijital", "teknoloji", "peman", "BNIK", "portal"]],
];

const textFor = (c) => `${c.title} ${c.summary} ${c.body}`.toLowerCase();
export const PILLARS = DEFINITIONS.map(([id, name, description, keywords]) => {
  const chapters = CHAPTERS.filter((c) => {
    const text = textFor(c);
    return keywords.some((keyword) => text.includes(keyword.toLowerCase()));
  });
  return { id, name, description, keywords, chapters, reforms: chapters.slice(0, 5).map((c) => c.title) };
});

export const VISION_PAGE = {
  title: "Vizyon Nasyonal Nouvo Ayiti",
  lead: "Yon vizyon estriktire pou refòm, devlopman ak renesans nasyonal.",
  sections: [
    ["Objektif liv la", "Mete analiz, dyagnostik ak pwopozisyon yo nan yon estrikti klè pou sitwayen, etidyan, pwofesyonèl ak responsab piblik kapab analize yo epi sèvi avè yo kòm baz aksyon."],
    ["Vizyon nasyonal", "Bati yon Ayiti modèn, jis, transparan ak pwospè kote enstitisyon yo solid epi sitwayen an nan sant desizyon yo."],
    ["Prensip fondamantal", "Respè lalwa, separasyon pouvwa, meritokrasi, transparans, responsablite piblik, enklizyon ak sèvis ki aksesib."],
    ["Objektif estratejik", "Refòme Leta, ranfòse sekirite ak jistis, devlope pwodiksyon ak travay, amelyore sèvis sosyal, epi modènize sèvis piblik yo."],
    ["Relasyon ant refòm yo", "Dis pilye yo konekte youn ak lòt: enstitisyon solid soutni ekonomi, sekirite ak sèvis sosyal; dijitalizasyon ak transparans ede tout refòm yo vin mezurab."],
  ],
};

export const SOCIAL_LINKS = [
  ["Website", "https://nouvo-ayiti.xyz"], ["WhatsApp", "https://whatsapp.com/channel/0029Vb8g86t8fewls29hrP2u"], ["Facebook", "https://www.facebook.com/profile.php?id=61592610551063"], ["TikTok", "https://www.tiktok.com/@nouvo.ayiti.509"], ["Threads", "https://www.threads.com/@nouvou_ayiti_509"], ["Telegram", "https://t.me/haitigran"], ["YouTube", "https://youtube.com/@nouvoayiti-509"], ["X", "https://x.com/Nouvoayiti509"], ["Lemon8", "http://www.lemon8-app.com/@nouvo.ayiti.509"], ["Email", "mailto:novoayiti509@gmail.com"],
].map(([label, href]) => ({ label, href }));

export const INDEX_TERMS = ["Agrikilti", "Edikasyon", "Jistis", "Sekirite", "Ekonomi", "DGI", "ONI", "BRH", "PNH", "DINEPA", "EDH", "Koripsyon", "Dijitalizasyon"];

export function searchBook(query) {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  return CHAPTERS.filter((c) => textFor(c).includes(q));
}

export function readingMinutes(chapter) {
  const words = (chapter.body || "").replace(/<[^>]+>/g, " ").trim().split(/\s+/).filter(Boolean).length;
  return Math.max(1, Math.ceil(words / 200));
}
