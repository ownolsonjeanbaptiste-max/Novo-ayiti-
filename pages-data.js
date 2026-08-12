/* ============================================================
   Novo Ayiti — pages-data.js
   ------------------------------------------------------------
   Kontni (an Kreyòl) pou paj estatik yo:
     Liv la, Enfografik, Bibliyografi, Glosè, Otè a, Kontak.
   Modifye tèks yo isit la san w pa bezwen touche router la (book.js).
   ============================================================ */

/* ---------- Paj: Liv la ---------- */
export const BOOK_PAGE = {
  eyebrow: "Sou liv la",
  title: "Novo Ayiti — yon plan konplè pou yon renesans nasyonal",
  lead:
    "Novo Ayiti se plis pase yon liv: se yon fèy wout. Li rasanble analiz, dyagnostik ak pwopozisyon konkrè pou transfòme fason Leta ayisyen fonksyone epi remèt sitwayen an nan sant desizyon yo.",
  paragraphs: [
    "Liv la òganize otou senk gran pati ki kouvri fondasyon Leta, sekirite ak jistis, ekonomi ak devlopman, sèvis sosyal, ak modènizasyon. Chak pati divize an chapit ki bay yon vizyon klè, egzanp konkrè ak etap aplikasyon.",
    "Objektif la se pa bay yon repons magik, men ouvri yon konvèsasyon serye — ak done, ak lojik, ak respè pou entèlijans lektè a. Chak pwopozisyon fèt pou moun analize l, kritike l epi amelyore l.",
  ],
  parts: [
    { num: "I", title: "Fondasyon Leta", desc: "Separasyon pouvwa, anti-koripsyon, bon gouvènans ak dezantralizasyon." },
    { num: "II", title: "Sekirite ak Jistis", desc: "Yon polis pwofesyonèl ak yon sistèm jidisyè endepandan e aksesib." },
    { num: "III", title: "Ekonomi ak Devlopman", desc: "Travay, pwodiksyon, agrikilti modèn ak enfrastrikti." },
    { num: "IV", title: "Sèvis Sosyal", desc: "Edikasyon ak sante piblik ki disponib pou tout moun." },
    { num: "V", title: "Modènizasyon", desc: "Gouvènman dijital ak rezilyans anviwònmantal." },
  ],
  audience: [
    "Sitwayen ki vle konprann epi patisipe",
    "Etidyan ak chèchè",
    "Antreprenè ak envestisè",
    "Responsab piblik ak desidè",
    "Manm dyaspora a",
    "Òganizasyon sosyete sivil la",
  ],
};

/* ---------- Paj: Enfografik ---------- */
/* Chak bar gen yon valè 0–100 ki reprezante nivo priyorite/atansyon
   nan vizyon an (se yon reprezantasyon vizyèl, pa yon statistik ofisyèl). */
export const INFOGRAPHICS = {
  eyebrow: "Done ak vizyèl",
  title: "Vizyon an nan yon sèl koutje",
  lead:
    "Kèk repè vizyèl pou konprann estrikti liv la, gwo priyorite yo ak fason chapit yo reparti nan senk pati yo.",
  priorities: [
    { label: "Bon gouvènans ak anti-koripsyon", value: 95 },
    { label: "Sekirite ak jistis", value: 90 },
    { label: "Edikasyon ak fòmasyon", value: 88 },
    { label: "Ekonomi ak travay", value: 85 },
    { label: "Sante piblik", value: 80 },
    { label: "Enfrastrikti ak amenajman", value: 76 },
    { label: "Agrikilti ak sekirite alimantè", value: 74 },
    { label: "Modènizasyon dijital", value: 70 },
    { label: "Anviwònman ak klima", value: 68 },
  ],
  figures: [
    { value: "13", label: "Chapit estratejik" },
    { value: "5", label: "Gran pati" },
    { value: "10", label: "Pilye devlopman" },
    { value: "1", label: "Vizyon nasyonal" },
  ],
};

/* ---------- Paj: Bibliyografi ---------- */
export const BIBLIOGRAPHY = {
  eyebrow: "Referans",
  title: "Bibliyografi ak sous",
  lead:
    "Yon seleksyon referans, tèm ak kad teyorik ki enspire refleksyon nan Novo Ayiti. Lis la ap kontinye grandi.",
  groups: [
    {
      category: "Gouvènans ak enstitisyon",
      items: [
        { title: "Enstitisyon, devlopman ak kwasans", author: "Travay sou ekonomi enstitisyonèl", year: "—", note: "Sou wòl enstitisyon solid nan devlopman." },
        { title: "Separasyon pouvwa yo ak Leta dwa", author: "Prensip konstitisyonèl", year: "—", note: "Baz teyorik pou ekilib pouvwa yo." },
        { title: "Transparans ak lit kont koripsyon", author: "Rapò sou bon gouvènans", year: "—", note: "Mekanis kontwòl ak responsablite." },
      ],
    },
    {
      category: "Devlopman ekonomik",
      items: [
        { title: "Devlopman lokal ak dezantralizasyon", author: "Etid sou gouvènans lokal", year: "—", note: "Modèl otonomi teritoryal." },
        { title: "Endistriyalizasyon ak travay", author: "Ekonomi devlopman", year: "—", note: "Estrateji pwodiksyon ak anplwa." },
      ],
    },
    {
      category: "Sèvis sosyal ak modènizasyon",
      items: [
        { title: "Edikasyon kòm motè chanjman", author: "Politik piblik edikasyon", year: "—", note: "Kalite, aksè ak egalite chans." },
        { title: "Gouvènman dijital", author: "e-Governance", year: "—", note: "Sèvis piblik an liy ak idantite dijital." },
        { title: "Rezilyans klimatik ak anviwònman", author: "Devlopman dirab", year: "—", note: "Adaptasyon ak pwoteksyon resous." },
      ],
    },
  ],
  note:
    "Nòt: referans ki make ak “—” yo se kad tematik jeneral; vèsyon detaye ak sitasyon konplè yo ap parèt nan edisyon final liv la.",
};

/* ---------- Paj: Glosè ---------- */
export const GLOSSARY = {
  eyebrow: "Definisyon",
  title: "Glosè tèm kle yo",
  lead: "Yon lis tèm enpòtan ki parèt nan liv la, ak yon definisyon senp an Kreyòl.",
  terms: [
    { term: "Anti-koripsyon", def: "Ansanm mezi, lwa ak enstitisyon ki fèt pou anpeche, detekte epi pini move jesyon lajan piblik." },
    { term: "Bon gouvènans", def: "Fason pou dirije zafè piblik yo ak transparans, responsablite, patisipasyon ak respè lalwa." },
    { term: "Dezantralizasyon", def: "Transfè pouvwa, resous ak responsablite soti nan gouvènman santral la pou ale nan kolektivite lokal yo." },
    { term: "Dijitalizasyon", def: "Pwosesis pou transfòme sèvis ak enfòmasyon an fòma elektwonik pou yo pi rapid e pi aksesib." },
    { term: "Enstitisyon", def: "Estrikti fòmèl (ministè, tribinal, palman) ki gen règ ak wòl klè nan fonksyònman Leta a." },
    { term: "Meritokrasi", def: "Sistèm kote yo chwazi ak pwomote moun sou baz konpetans ak rezilta, pa sou baz relasyon." },
    { term: "Rezilyans klimatik", def: "Kapasite yon kominote pou reziste, adapte epi refè apre chòk ak dezas ki lye ak klima." },
    { term: "Sekirite alimantè", def: "Sitiyasyon kote tout moun gen aksè regilye ak ase manje ki bon pou lasante yo." },
    { term: "Separasyon pouvwa", def: "Prensip ki divize Leta an twa branch (egzekitif, lejislatif, jidisyè) pou youn kontwole lòt." },
    { term: "Transparans", def: "Fè enfòmasyon sou desizyon ak depans piblik yo klè epi disponib pou tout sitwayen." },
  ],
};

/* ---------- Paj: Otè a ---------- */
export const AUTHOR_PAGE = {
  eyebrow: "Sou otè a",
  name: "Ownolson Jean Baptiste",
  badge: "Otè • Atis • Vizyonè",
  lead:
    "Yon Ayisyen ki mete eksperyans, obsèvasyon ak refleksyon li nan sèvis yon sèl bi: ede peyi a jwenn wout devlopman ak diyite.",
  paragraphs: [
    "Ownolson Jean Baptiste kwè chanjman reyèl la pa kòmanse ak yon slogan, men ak yon plan, enstitisyon solid ak sitwayen ki angaje. Se konviksyon sa a ki bay nesans a pwojè Novo Ayiti.",
    "Pandan plizyè ane, li obsève defi peyi a ap konfwonte yo epi li chwazi transfòme fristrasyon an refleksyon estriktire. Chak chapit liv la soti nan yon volonte pou pwopoze — pa sèlman kritike.",
    "Objektif li se pataje yon vizyon ki ka sèvi kòm baz travay pou tout moun ki vle patisipe nan rekonstriksyon peyi a, kèlkeswa domèn yo oswa kote yo ye.",
  ],
  highlights: [
    { k: "Vizyon", v: "Yon Ayiti modèn, jis ak pwospè" },
    { k: "Metòd", v: "Analiz, dyalòg ak pwopozisyon konkrè" },
    { k: "Angajman", v: "Mete sitwayen an nan sant chanjman an" },
  ],
  quote:
    "“Chanjman pa kòmanse ak yon slogan; li kòmanse ak yon plan, enstitisyon solid ak sitwayen ki angaje.”",
};

/* ---------- Paj: Kontak ---------- */
export const CONTACT_PAGE = {
  eyebrow: "Ann pale",
  title: "Kontakte ekip Novo Ayiti",
  lead:
    "Yon kesyon, yon pwopozisyon, yon envitasyon oswa yon lide pou pataje? Nou ta renmen tande w. Ranpli fòm nan oswa itilize kanal ki anba yo.",
  methods: [
    { k: "Imèl", v: "kontak@nouvo-ayiti.xyz" },
    { k: "Rezo sosyal", v: "TikTok • YouTube • Facebook" },
    { k: "Kolaborasyon", v: "Louvri pou patenarya ak konferans" },
  ],
  form: {
    name: "Non konplè",
    email: "Adrès imèl",
    subject: "Sijè",
    message: "Mesaj ou",
    submit: "Voye mesaj la",
    ok: "Mèsi! Mesaj ou an pati. N ap reponn ou pi vit ke posib.",
    err: "Tanpri ranpli tout chan yo ak yon adrès imèl valab.",
  },
};
