# Odit Nouvo Ayiti — 2026-08-19

## Limit odit la

Odit sa a fèt san okenn deplwaman epi san okenn chanjman nan app la. Kat fichye yo te bay kòm sous la te ekspòte kòm tèks PDF nan espas referans lan; zouti PDF binè klasik yo pa t ka li fichye sa yo paske header PDF yo pa prezan. Se tèks paj yo ki te verifye, pandan li te konsève lòd fichye yo ak nimewo paj yo.

## Rezilta prensipal

| Eleman | PDF yo | Sit aktyèl la | Diferans konstate |
|---|---:|---:|---:|
| Fichye/Pati | 4 | 4 lyen download | 0 pou fichye yo |
| Chapit heading occurrences | 57 | 48 chapter records | 9 plis heading nan sous la |
| Nimewo chapit inik detekte | 44 | 48 inik | Pa posib pou konsidere nimewo yo yon seri final paske PDF yo gen doublon ak konfli |
| Heading `SEKSYON`/`TIT` detekte | 637 | pa gen manifest ekivalan | Odit estriktirèl nesesè |
| Liy ki gen KPI/Endikatè/Objektif | 547 | pa gen tablo PDF-fidèl | Kontni plat/heuristic sou sit la |
| Blòk KPI ak heading exact `Endikatè Pèfòmans (KPI)` | 82 | parser/render mwens serye | Tout bezwen ekstraksyon cell-by-cell |
| Faz aplikasyon | 207 heading/liy | pa gen manifest PDF | Odit nesesè |
| Heading Aneks | 14 nan ekstraksyon nòmal; 20 total ak liy kontèks | done pa verifye kòm kopi PDF | Odit nesesè |
| Heading Referans/Bibliyografi | 77 | pa gen manifest PDF | Odit nesesè |

## Chapit ak nimewotasyon

### Nimewo inik ki detekte nan kat pati yo

`1, 2, 3, 4, 5, 6, 8, 9, 10, 11, 12, 13, 14, 15, 16, 17, 18, 19, 20, 21, 22, 23, 24, 25, 26, 27, 28, 29, 30, 31, 32, 33, 34, 35, 36, 37, 38, 39, 44, 45, 46, 47, 49, 63`

### Nimewo ki sou sit aktyèl la men ki pa parèt kòm heading inik nan ekstraksyon PDF la

`7, 40, 41, 42, 43, 48`

### Nimewo ki parèt nan PDF yo men ki pa gen record menm nimewo sou sit la

`49, 63`

### Konfli/repete ki bezwen rezolisyon anvan rekonstriksyon

- Pati I gen `CHAPIT 9` de fwa.
- Pati II repete `CHAPIT 20`, `CHAPIT 28`, ak `CHAPIT 29` nan pozisyon diferan.
- Pati III repete `CHAPIT 33` ak `CHAPIT 34`.
- Pati III gen heading `CHAPIT 44`, `45`, `46`, `47`, `49`, ak `63`.
- Gen heading ki ekri ak varyasyon tipografik: `CHAPIT`, `Chapit`, espas anplis, tire long, ak tit ki kontinye sou liy apre a.

Sa vle di kantite `44` la se kantite nimewo inik ki sòti nan heading detekte yo, pa yon deklarasyon ke liv final la gen sèlman 44 chapit. Pou rekonstriksyon 100% fidèl la, doublon ak konfli sa yo dwe rete jan yo parèt nan PDF yo jiskaske paj TOC ofisyèl la konfime ki heading ki chapit prensipal ak ki heading ki repetisyon/insert.

## KPI yo

- 82 heading exact `Endikatè Pèfòmans (KPI)` detekte nan tout tèks yo.
- 82 header pè `Endikatè / Objektif` te detekte nan regex ki pi strik; kèk ekstraksyon paj gen heading kase oswa repete, kidonk sa pa sifi pou konstwi kantite tab final la.
- 547 liy gen mo `KPI`, `Endikatè`, oswa `Objektif`; anpil ladan yo se fraz nòmal, pa liy tablo. Yo pa dwe konte kòm KPI san delimitasyon tab la.
- Pati IV montre yon egzanp KPI klè: `Travayè afilye — Ogmante`, `Kontribisyon kolekte — Ogmante`, `Dosye trete alè — Ogmante`, `Sèvis dijital disponib — Ogmante`, `Odit anyèl — 100%`.
- KPI yo dwe rekonstrui sou baz lòd liy yo nan sous la; odit sa a pa modifye okenn valè.

## Sou-seksyon, plan, anèks, referans

- 637 heading `SEKSYON` oswa `TIT` detekte. Sa se kantite markers estriktirèl, pa kantite tout paragraph/subsection, paske PDF yo mete anpil tit san yon prefiks estanda.
- 207 liy/heading `Faz I/II/III/IV` detekte pou plan aplikasyon yo.
- 14 heading `Aneks` detekte dirèkteman ak regex; 20 rezilta total nan manifest la gen ladan liy ki pran `ANÈKS` nan kontèks estriktirèl la.
- 77 heading `Referans`, `REFERANS`, oswa `Bibliyografi` detekte.
- Egzanp anèks Pati IV yo gen `Aneks N` ak `Aneks o`, epi yo kontinye ak TIT I–XIII ak gwo lis fonksyon/konpetans. Sa pa dwe ranplase oswa rezime.

## Sa ki manke oswa pa verifyab sou sit la

1. Sit la gen 48 chapter records, men PDF heading occurrences yo bay 57 pozisyon; 9 pozisyon pa reprezante nan dataset 48 la kòm menm heading/pozisyon.
2. Sit la pa gen manifest verifikab pou tout 637 markers seksyon/TIT.
3. Sit la pa gen manifest verifikab pou 207 faz aplikasyon yo.
4. Sit la pa gen kopi verifye pou tout 14–20 markers anèks yo.
5. Sit la pa gen kopi verifye pou 77 markers referans/bibliyografi yo.
6. KPI renderer aktyèl la pa ka pwouve cell-by-cell parity; li te deja itilize parsing heuristik epi li pa ase pou yon kopi PDF-fidèl.
7. Diferans nimewotasyon yo pa ka korije otomatikman san deside kijan PDF la vle trete doublon `20`, `28`, `29`, `33`, `34` ak heading `63`.

## Aksyon ki rete anvan nenpòt deplwaman

- Li paj TOC ofisyèl chak pati a epi etabli yon manifest line-by-line ki gen `part`, `page`, `chapter_number`, `exact_title`, `section`, `subsection`, ak `source_line`.
- Separe heading chapit prensipal yo ak heading ki repete nan body/annex yo san efase tèks.
- Ekstrè chak KPI kòm kolòn ak liy egzak, enkli nòt ak target yo.
- Konpare manifest la ak `book-data.js` epi bay yon lis exact missing/extra/reordered.
- Rekonstwi TOC ak anchor ki sòti nan manifest la, pa nan ansyen 01–48 dataset la.
- Valide chak anchor ak chak KPI sou desktop ak mobil.

**Status:** Pa gen okenn chanjman app ki fèt nan etap odit sa a. Pa gen okenn deplwaman final ki fèt.
