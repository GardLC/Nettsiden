# Refaktorplan: moderne layout-system

Mål: erstatte ad-hoc spacing og tre ulike kollaps-regler med ÉN layout-primitiv
basert på web.dev-mønstrene **content-grid**, **container queries** og en
**spacing-skala**. Sluttresultatet skal se tilnærmet likt ut som i dag, men all
luft styres fra tokens i stedet for per komponent.

## Regler (viktig)
- IKKE endre filer under `src/content/`.
- Aldri æ/ø/å i filnavn eller bildereferanser.
- Behold norske feltnavn i frontmatter.
- Behold eksisterende tokens; kun LEGG TIL nye. Ingen visuell regresjon.
- Bevisste linjeskift (`<br>`, `<br class="bryt-d">`) er design — la dem stå.
- Ren type (f.eks. `font-size: 7rem`) er ikke layout-feilen — la stå.

## Rotårsak som skal fjernes
Horisontal luft styres i dag av tre uavhengige lag som ikke kjenner hverandre:
`.container` padding (`--gutter`), `.two-col` `gap` (egen `clamp`-formel), og
løse margins per element. Kolonne-gap ≠ kant-luft, og kollaps skjer på tre
forskjellige steder: globalt `@media (max-width:700px)`, eget `@media 768px` i
SlikJobberVi, og `margin-top: 60px` + 700px i Nyansattsitater.

---

## Trinn 1 — Spacing-skala (`src/styles/tokens.css`)

Sett inn rett FØR `/* Layout */`-blokken:

```css
  /* Spacing-skala — flytende, felles kilde for ALL luft. */
  --space-3xs: clamp(0.25rem, 0.23rem + 0.1vw, 0.3125rem);
  --space-2xs: clamp(0.5rem, 0.46rem + 0.2vw, 0.625rem);
  --space-xs:  clamp(0.75rem, 0.69rem + 0.3vw, 0.9375rem);
  --space-s:   clamp(1rem, 0.91rem + 0.4vw, 1.25rem);
  --space-m:   clamp(1.5rem, 1.37rem + 0.6vw, 1.875rem);
  --space-l:   clamp(2rem, 1.83rem + 0.8vw, 2.5rem);
  --space-xl:  clamp(3rem, 2.74rem + 1.2vw, 3.75rem);
  --space-2xl: clamp(4rem, 3.65rem + 1.6vw, 5rem);
  --space-3xl: clamp(6rem, 5.48rem + 2.4vw, 7.5rem);
```

Sett inn rett ETTER `--radius: 4px;` (fortsatt inne i `:root`):

```css
  /* To-kolonne / grid-kontroll.
     --col-gap: luft MELLOM kolonner (overstyr per instans med inline style).
     --two-col-collapse: container-bredden der to kolonner blir til én.
     --measure: lesbar tekstbredde. */
  --col-gap: clamp(var(--space-l), 5vw, var(--space-2xl));
  --two-col-collapse: 48rem;
  --measure: 65ch;
```

---

## Trinn 2 — Content-grid som NY klasse (`src/styles/global.css`)

VIKTIG: Ikke overlast `.container`. Den brukes på elementer som ALLEREDE har egen
layout — `.container.header-inner` og `.container.footer-inner` har `display:flex`,
og å gjøre `.container` til `display:grid` ville kollidere og brekke header/footer.
`.container` beholdes uendret som enkel sentrert wrapper.

Legg i stedet til en NY klasse `.content-grid` (under `/* Layout-hjelpere */`):

```css
.content-grid {
  --content-max: var(--max-width);     /* bred kolonne, ~1400px */
  --measure-max: var(--content-width); /* lesetekst, ~800px */
  width: 100%;
  margin-inline: auto;
  container-type: inline-size;
  container-name: layout;
  display: grid;
  grid-template-columns:
    [full-start] minmax(var(--gutter), 1fr)
    [wide-start] minmax(0, calc((var(--content-max) - var(--measure-max)) / 2))
    [content-start] min(100% - var(--gutter) * 2, var(--measure-max)) [content-end]
    minmax(0, calc((var(--content-max) - var(--measure-max)) / 2)) [wide-end]
    minmax(var(--gutter), 1fr) [full-end];
}

/* Standard: direkte barn fyller den brede kolonnen (= som dagens 1400px-container). */
.content-grid > * { grid-column: wide; }
/* Lesetekst: sentrert smal kolonne (~800px). */
.content-grid > .measure { grid-column: content; }
/* Fullbredde, kant til kant. */
.content-grid > .full { grid-column: full; }

/* Et .full-element kan selv være content-grid og gi SINE barn tilbake sporene
   (kanonisk del av mønsteret — nyttig for fullbredde-seksjoner med eget innhold). */
.full.content-grid > * { grid-column: wide; }
.full.content-grid > .measure { grid-column: content; }
```

Migrering: bytt `class="container"` → `class="content-grid"` KUN på de wrapperne
som inneholder vanlig seksjonsinnhold (forsidekomponentene). IKKE rør
`.container.header-inner` og `.container.footer-inner`. `1fr`-sporene + `minmax(gutter…)`
gir samme sentrering/kant-luft som dagens `.container`, men nå er gutter og
innholdsbredde ett system.

---

## Trinn 3 — `.two-col` på container queries (`src/styles/global.css`)

Erstatt dagens `.two-col`-regel OG `@media (max-width: 700px) { .two-col … }` med:

```css
.two-col {
  display: grid;
  grid-template-columns: var(--two-col-template, 1fr 1fr);
  gap: var(--col-gap);
  align-items: var(--two-col-align, start);
}

/* Kollaps styres av container-bredde (komponentens egen bredde), ikke viewport.
   Samme regel gjelder ALLE to-kolonner — ett sted å justere.
   `layout` = container-name satt på .content-grid i Trinn 2. */
@container layout (max-width: 48rem) {
  .two-col { grid-template-columns: 1fr; }
}
```

NB: `.two-col` må ligge inni en `.content-grid` for at container-query skal måle
riktig bredde. Det gjør den i alle tre forsidekomponentene etter Trinn 4.

`.two-col-figur` beholdes uendret.

Bruk: overstyr per instans uten ny CSS:
- Annet kolonneforhold: `<div class="two-col" style="--two-col-template: 7fr 5fr">`
- Mer/mindre luft mellom kolonner: `style="--col-gap: var(--space-2xl)"`
- Vertikal sentrering: `style="--two-col-align: center"`

---

## Trinn 4 — Migrer komponentene

Bytt `class="container"` → `class="content-grid"` i ALLE forsidekomponenter som
bruker container-wrapperen rundt seksjonsinnhold:
`Hero`, `Innledning`, `Ledersitater`, `Nyansattsitater`, `Monster`, `Tilnaerming`,
`Resultater`, `SlikJobberVi`, `CTA`.
IKKE rør `Header.astro` (`.container.header-inner`) og `Footer.astro`
(`.container.footer-inner`) — de beholder `.container`.

NB: `HvorJegBidrar` er IKKE en forsidekomponent — den rendres i `om-meg.astro`.
Klassebyttet gjelder der den brukes, men hører hjemme i Trinn 4b.

Spesifikke endringer utover klassebyttet:

### `src/components/Tilnaerming.astro`
Ingen endring nødvendig — arver det nye systemet. (Valgfritt: dropp den lokale
`.tilnaerming-bilde { display:flex; … }` siden `.two-col-figur` gjør samme jobb.)

### `src/components/SlikJobberVi.astro`
Fjern dette blokket fra `<style>` (kollaps håndteres nå globalt):

```css
  @media (max-width: 768px) {
    .slik-jobber-vi .two-col {
      grid-template-columns: 1fr;
    }
  }
```

### `src/components/Nyansattsitater.astro`
Bytt magic numbers mot tokens i `<style>`:
- `.nyansattsitater .two-col { margin-top: 60px; }` → `margin-block-start: var(--space-2xl);`
- `.nyansattsitater-tittel { margin: 0 0 3rem 0; }` → `margin: 0 0 var(--space-xl) 0;`
- `.sitat-liste { gap: 2.5rem; }` → `gap: var(--space-xl);`
- `.kilde-blokk { margin-top: 3rem; }` → `margin-block-start: var(--space-xl);`

La `font-size`-verdier og `<br>` stå.

---

## Trinn 4b — Artikler og undersider

Disse kjører i dag et parallelt system og må forenes med grid-et:

- `layouts/ArticleLayout.astro` bruker `.content-container` rundt `<article>`.
  Bytt til `.content-grid` og gi `<article class="measure">` slik at brødteksten
  havner i den lesbare ~800px-kolonnen. `.prose` sin `max-width: 68ch` kan da
  beholdes som finjustering, men bredden styres nå av grid-et.
- `pages/slik-jobber-jeg.astro` og `pages/om-meg.astro` har MOTSATT nesting:
  `.container` ligger UTENPÅ og wrapper flere `<section>`-er. Her byttes ytre
  `.container` → `.content-grid`, og de indre `<section>`-ene blir vanlige
  `> *` (wide) — verifiser at de ikke arver forsidens fullbredde-`section{}`-boks
  uønsket (se Trinn 4c).
- `pages/artikler/index.astro`: bytt `.container` → `.content-grid`.
- `src/components/HvorJegBidrar.astro` brukes i `om-meg.astro`: bytt `.container`
  → `.content-grid` her.
- `.content-container` og `.wide-inner` i `global.css` kan beholdes midlertidig,
  men målet er å fjerne dem når alt bruker `.content-grid` + spor. Ikke la to
  systemer leve side om side permanent.

## Trinn 4c — Vertikal rytme på seksjonsnivå (`global.css`)

Dette er den vertikale halvdelen av «luft mot andre elementer» og må med for at
jobben skal være komplett. Rut `section{}`-reglene gjennom spacing-skalaen:

```css
section {
  padding-block: var(--space-2xl) var(--space-3xl); /* var: headline-anchor / section-spacing */
  margin-bottom: var(--space-xs);                   /* var: clamp(0.5rem,1.5vw,1rem) */
  /* resten uendret: display:flex; flex-direction:column; scroll-margin-top; bg; */
}
```

⚠️ VERDIDRIFT: `--space-2xl`/`--space-3xl` er IKKE verdimessig ekvivalent med
dagens `--headline-anchor`/`--section-spacing`:
- Topp: i dag `clamp(2rem,6vh,5rem)`, ny verdi `clamp(4rem,…,5rem)` — mer luft på smått.
- Bunn: i dag `clamp(5rem,10vw,10rem)`, ny verdi `clamp(6rem,…,7.5rem)` — mindre luft på stort.

Valg: enten behold `--headline-anchor`/`--section-spacing` (gjerne redefiner dem
via skalaen i en separat runde), eller aksepter den nye strammere rytmen bevisst
og juster i Trinn 5 hvis noe ser feil ut.

⚠️ GLOBAL REGEL: `section {}` gjelder alle seksjoner, inkludert undersidenes
(som ligger inne i `.content-grid` etter Trinn 4b). Den nye `padding-block` treffer
altså alle seksjoner. Kun `background-color` snevres inn til `main > section` for
å unngå uønsket boks på undersider — resten av section-stilen er global.

---

## Trinn 5 — Verifiser
1. `npm run build` skal passere uten feil.
2. Visuell sjekk i nettleser på ~375px, ~768px og ~1280px:
   - Alle tre to-kolonner kollapser til én kolonne ved smal bredde.
   - Luft mot seksjonskant er lik på tvers av seksjoner.
   - Hero, statistikk og sitater ser ut som før.
3. **Header og Footer** (som beholder `.container`) ser uendret ut — flex-layout
   intakt, ikke brukket av grid-endringen.
4. **Artikkelside** (`/artikler/...`): brødtekst i lesbar bredde, headerbilde og
   meta riktig plassert.
5. **Undersider** (`/slik-jobber-jeg`, `/om-meg`): seksjoner inni `.content-grid`
   har ikke fått uønsket fullbredde-boksbakgrunn (Trinn 4c).
6. Vertikal rytme (overskrift→innhold, seksjon→seksjon) uendret.

## Etterpå (valgfritt, ikke del av denne jobben)
- Rute resterende seksjoners vertikale luft (`--section-spacing` osv.) gjennom
  spacing-skalaen for full konsistens.
- Vurder `subgrid` på `.two-col` slik at indre innhold retter seg etter forelder-grid.
- Vurder `text-wrap: balance` på display-overskrifter (men behold bevisste `<br>`).
```

