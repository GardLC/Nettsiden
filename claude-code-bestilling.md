# Bestilling til Claude Code — personlig nettside

**Mål:** Bygge en statisk nettside i Astro som kan deployes til builder.statichost.eu.

**Eier:** Gard L. Christiansen
**Formål:** Personlig nettside som posisjonerer eieren for ansettelse/engasjement innen designdrevet HR-utviklingsarbeid i norske teknologiselskaper.

---

## 1. Teknisk stack

- **Static site generator:** Astro (siste stabile versjon)
- **Språk:** Norsk (bokmål) — `lang="nb"`
- **Hosting:** builder.statichost.eu (deploy via git)
- **CSS:** Vanilla CSS med CSS custom properties (variabler). Ingen Tailwind eller CSS-in-JS.
- **JavaScript:** Minimalt. Kun der det er nødvendig (kontaktskjema, eventuell menytoggling på mobil).
- **Bilder:** Astro `<Image>` for optimalisering.
- **Innhold:** Astro Content Collections for artikler (markdown).

---

## 2. Sidestruktur

Tre primære sider:
- `/` (forside)
- `/slik-jobber-jeg` (utdypning av metode)
- `/om-meg` (biografi)

Pluss artikkelinfrastruktur:
- `/artikler` (oversikt over publiserte artikler)
- `/artikler/[slug]` (enkeltartikkel)

---

## 3. Filstruktur (forslag)

```
/
├── astro.config.mjs
├── package.json
├── public/
│   ├── fonts/
│   │   ├── PPNeueMachina-Regular.woff2
│   │   ├── PPNeueMontreal-Regular.woff2
│   │   ├── PPNeueMontreal-Medium.woff2
│   │   └── PPNeueMontreal-Book.woff2
│   ├── favicon.svg
│   └── robots.txt
├── src/
│   ├── layouts/
│   │   └── BaseLayout.astro
│   ├── components/
│   │   ├── Header.astro
│   │   ├── Footer.astro
│   │   ├── Hero.astro
│   │   ├── Problembevis.astro
│   │   ├── Monster.astro
│   │   ├── SlikJobberVi.astro
│   │   ├── HvorJegBidrar.astro
│   │   ├── Om.astro
│   │   └── CTA.astro
│   ├── pages/
│   │   ├── index.astro
│   │   ├── slik-jobber-jeg.astro
│   │   ├── om-meg.astro
│   │   ├── artikler/
│   │   │   ├── index.astro
│   │   │   └── [...slug].astro
│   │   └── sitemap-index.xml.js
│   ├── content/
│   │   ├── config.ts
│   │   └── artikler/
│   │       └── eksempel-artikkel.md
│   └── styles/
│       ├── global.css
│       ├── tokens.css
│       └── typography.css
└── README.md
```

---

## 4. Design tokens (CSS custom properties)

Plasseres i `src/styles/tokens.css` slik at de er enkle å endre.

### Farger (palett — 6 farger + aksent)

```css
:root {
  /* Grunnpalett */
  --color-sand: #D1B9A1;          /* R=209 G=185 B=161 */
  --color-oker: #E8C08D;          /* R=232 G=192 B=141 */
  --color-oliven-dyp: #514D34;    /* R=81 G=77 B=52 */
  --color-salviegronn: #B6B798;   /* R=182 G=183 B=152 */
  --color-mosegronn: #ABB087;     /* R=171 G=176 B=135 — bryter interiør-følelsen */
  --color-off-white: #E5E1DE;     /* R=229 G=225 B=222 */

  /* Aksent — ikke valgt ennå. Bytt ut når valgt. */
  --color-accent: #00FFAA;        /* PLASSHOLDER: dempet neon-grønn — endres */

  /* Funksjonelle farger */
  --color-text: var(--color-oliven-dyp);
  --color-text-muted: #6B6750;
  --color-bg: var(--color-off-white);
  --color-link: var(--color-accent);
  --color-link-hover: var(--color-oliven-dyp);
  --color-border: rgba(81, 77, 52, 0.15);
}
```

### Typografi (PP Neue Machina + PP Neue Montreal)

```css
:root {
  /* Skrifttyper */
  --font-display: "PP Neue Machina", system-ui, sans-serif;
  --font-body: "PP Neue Montreal", system-ui, sans-serif;

  /* Type scale — desktop */
  --fs-display: clamp(2.5rem, 5vw, 4.5rem);   /* Hero — 40–72px */
  --fs-h1: clamp(1.75rem, 3vw, 2.5rem);        /* Seksjonsoverskrifter — 28–40px */
  --fs-h2: clamp(1.125rem, 1.5vw, 1.375rem);   /* Underoverskrifter — 18–22px */
  --fs-body-large: 1.125rem;                    /* 18px */
  --fs-body: 1rem;                              /* 16px */
  --fs-small: 0.875rem;                         /* 14px */

  /* Linjehøyder */
  --lh-display: 1.05;
  --lh-heading: 1.2;
  --lh-body: 1.6;
  --lh-small: 1.5;

  /* Vekter — PP Neue Montreal */
  --fw-book: 300;
  --fw-regular: 400;
  --fw-medium: 500;
}
```

**Bruk i hierarkiet:**
- Display: `--font-display`, regular, `--fs-display`
- H1 (seksjonsoverskrifter): `--font-display`, regular, `--fs-h1`
- H2 (kortoverskrifter, underoverskrifter): `--font-body`, medium, `--fs-h2`
- Body large (fremhevet brødtekst, hero-undertekst): `--font-body`, medium eller italic, `--fs-body-large`
- Body: `--font-body`, regular, `--fs-body`
- Small (kildehenvisninger, footer): `--font-body`, book, `--fs-small`

### Layout

```css
:root {
  --max-width: 1200px;
  --content-width: 800px;     /* For tekstblokker */
  --gutter: clamp(1rem, 4vw, 3rem);
  --section-spacing: clamp(4rem, 8vw, 8rem);
  --radius: 4px;
}
```

---

## 5. Font-loading

Last fontene som woff2 fra `/public/fonts/` med `font-display: swap`.

```css
@font-face {
  font-family: "PP Neue Machina";
  src: url("/fonts/PPNeueMachina-Regular.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "PP Neue Montreal";
  src: url("/fonts/PPNeueMontreal-Book.woff2") format("woff2");
  font-weight: 300;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "PP Neue Montreal";
  src: url("/fonts/PPNeueMontreal-Regular.woff2") format("woff2");
  font-weight: 400;
  font-style: normal;
  font-display: swap;
}

@font-face {
  font-family: "PP Neue Montreal";
  src: url("/fonts/PPNeueMontreal-Medium.woff2") format("woff2");
  font-weight: 500;
  font-style: normal;
  font-display: swap;
}
```

**Merknad:** Fontfilene legges manuelt i `/public/fonts/`. Hvis ikke tilgjengelig ved build, fall tilbake til `system-ui`.

---

## 6. Navigasjon

### Topmeny (alle sider)

- Venstre: *Gard L. Christiansen* (wordmark, lenker til `/`)
- Høyre: lenker
  - *Slik jobber vi* → `/slik-jobber-jeg`
  - *Om meg* → `/om-meg`
  - *Artikler* → `/artikler`
  - *Kontakt* → anchor `#kontakt` på forsiden

Mobil: hamburgermeny som åpner full skjerm-overlay.

### Footer (alle sider)

- Navn: Gard L. Christiansen
- E-post: `kontakt@gardlc.com` (plassholder — endre)
- Lenke: gardlc.com (portefølje)

---

## 7. Innhold per seksjon (forsiden)

### Seksjon 1: Hero

**Innhold (låst):**
- H1 / Display: *Nye arbeidshverdager med mer samspill og mindre friksjon*
- Body large: *Bedre arbeidshverdager skapes sammen med de ansatte og deres ledere, ikke for dem.*

Ingen CTA-knapp. Visuelt element: åpent (la stå tomt eller plasshold).

### Seksjon 2: Problembevis

**Innhold:**
- Hovedpoeng (visuelt fremtredende, stort tall): `<!-- PLASSHOLDER: tekst om at 12% har tilfredsstillende innfasing, og at dette er en blindsone hos arbeidsgivere -->`
- Tilleggslinje: `<!-- PLASSHOLDER: tekst om at ledere bekrefter det samme og peker ut veien ut av problemet -->`
- Kildehenvisninger (small):
  - HR Norge, Onboardingundersøkelsen 2023
  - 15 dybdeintervjuer med norske ledere

**Struktur:** Ett samlet poeng, ikke to blokker. Tallet 12% skal være visuelt fremtredende (svært stor typografi).

### Seksjon 3: Mønsteret er tydelig

**Innhold (låst):**
- H1: *Mønsteret er tydelig*
- Tre punkter:

  1. **Ledere vet det ikke fungerer**
     – men mangler tid, kompetanse og støtte

  2. **HR lager rutiner og prosesser isolert**
     – uten å involvere brukerne, ledere og ansatte

  3. **Arbeidsgivere spør sjelden om opplevelsen**
     – som gjør egen kvalitet til en blindsone

Ingen ikoner. Kun typografi.

### Seksjon 4: Slik jobber vi

**Innhold:**
- H1: *Slik jobber vi*
- Setning 1: `<!-- PLASSHOLDER: kjernen i tilnærmingen — forstå, samskape, teste smått, levere noe gjennomførbart -->`
- Setning 2: `<!-- PLASSHOLDER: involveringen er smidig og målrettet, og tilpasses en hektisk arbeidshverdag -->`
- Lenke: *Les mer* → `/slik-jobber-jeg`

### Seksjon 5: Hvor jeg kan bidra

**Innhold:**
- H1: *Hvor jeg kan bidra*
- Fem kort i grid (3+2 på desktop, stables på mobil). Hvert kort:
  - H2: navn (låst)
  - Body: `<!-- PLASSHOLDER: én forklarende linje -->`

Navn (låst):
1. Innfasing av medarbeidere (onboarding)
2. Medarbeider- og kandidatopplevelser
3. Læring og utvikling
4. Mangfold, likestilling og inkludering
5. Innsikt og gap-analyse

### Seksjon 6: Om

**Innhold:**
- Foto (plassholder, hentes fra `/om-meg`)
- H2: Gard L. Christiansen
- Body: `<!-- PLASSHOLDER: én setning som plasserer faglig -->`
- Lenke: *Mer om meg* → `/om-meg`

Liten seksjon, ikke dominerende.

### Seksjon 7: CTA (#kontakt)

**Innhold:**
- H1: `<!-- PLASSHOLDER: overskrift som inviterer til samtale -->`
- Body: `<!-- PLASSHOLDER: kort tekst om hva man kan kontakte for -->`
- Kontakt:
  - E-post-lenke (synlig)
  - Inline kontaktskjema (felt: navn, e-post, melding, send-knapp)

Skjema: bruk en enkel `<form>` med `action` til en tredjeparts skjematjeneste (f.eks. Formspree) — sett opp som plassholder slik at Gard kan legge til endpoint senere.

---

## 8. Innhold per underside

### `/slik-jobber-jeg`

**Innhold:** Utdypning av prinsipper og metode.

- Intro (plassholder)
- Seks prinsipper, hvert med navn + plassholder for forklarende setning:
  1. Helhetlig
  2. Menneskeorientert
  3. Samskapende
  4. Iterativt
  5. Gjennomførbar
  6. Visuelt
- Fire metodesteg, hvert med navn + plassholder for forklarende setning:
  1. Forstå og ramme inn
  2. Utforske mulighetsrommet
  3. Teste
  4. Implementere

Prinsipper først, deretter metode.

### `/om-meg`

**Innhold:** To deler.

- **Meg på 2 minutter** (kreves ved lansering): plassholder for 3–4 avsnitt
- **Meg på 10 minutter** (kan komme senere): plassholder for utvidet biografi + lenke til gardlc.com

To tydelig adskilte deler. Bruk anker-lenker så leseren kan hoppe direkte til den lange versjonen.

---

## 9. Artikkelinfrastruktur

Bruk Astro Content Collections.

### `src/content/config.ts`

```ts
import { defineCollection, z } from 'astro:content';

const artikler = defineCollection({
  type: 'content',
  schema: z.object({
    tittel: z.string(),
    ingress: z.string(),
    publisert: z.date(),
    oppdatert: z.date().optional(),
    tema: z.array(z.string()).optional(),
    utkast: z.boolean().default(false),
  }),
});

export const collections = { artikler };
```

### Artikkel-format (markdown)

```markdown
---
tittel: "Hvorfor onboarding sjelden fungerer"
ingress: "Kort beskrivelse i én-to setninger."
publisert: 2026-05-17
tema: ["onboarding", "ledelse"]
---

Brødtekst i markdown.
```

### `/artikler` (oversiktsside)

- Liste over alle publiserte artikler (`utkast: false`)
- Hver artikkel: tittel, ingress, publiseringsdato, eventuell tema-tag
- Sortert etter dato, nyeste først

### `/artikler/[...slug]` (enkeltartikkel)

- Tittel (H1)
- Ingress (body large)
- Publisert-dato (small)
- Brødtekst (rendered markdown)
- Tilbake-lenke til `/artikler`

---

## 10. SEO og tilgjengelighet

### SEO

- `<title>` og `<meta name="description">` per side
- Open Graph-tagger (`og:title`, `og:description`, `og:image`, `og:url`)
- Twitter Card-tagger
- Sitemap (auto-generert via `@astrojs/sitemap`)
- `robots.txt` som tillater indeksering
- Canonical URLs

### Tilgjengelighet (WCAG 2.1 AA)

- Semantisk HTML (`<main>`, `<nav>`, `<section>`, `<article>`)
- Logisk heading-hierarki (én H1 per side)
- Alt-tekst på alle bilder (alt-attributter alltid satt, tom for dekorative)
- Tilstrekkelig kontrast — sjekk at tekstfarge mot bakgrunnsfarge oppfyller AA
- Fokus-stiler synlige på alle interaktive elementer
- Skip-link til hovedinnhold
- Skjema har labels og aria-attributter
- Mobilvennlig (responsive design, ingen horisontal scroll)

---

## 11. Det Claude Code IKKE skal gjøre

- Ikke fyll inn norsk copy i plassholdere — la dem stå som HTML-kommentarer
- Ikke velg bakgrunnsfarger per seksjon — bruk én bakgrunn (`--color-bg`) som standard; Gard fordeler per seksjon i etterkant
- Ikke legg til animasjoner eller transitions utover hover på lenker/knapper
- Ikke bygg inn analytics, tracking eller eksterne skript
- Ikke gjør antakelser om innholdet i artikler — lever bare strukturen

---

## 12. Akseptansekriterier

Siden er ferdig når:
- Astro-prosjekt bygger feilfritt med `npm run build`
- Alle tre sider (`/`, `/slik-jobber-jeg`, `/om-meg`) renderer
- Artikkel-collection fungerer med eksempel-artikkel
- Alt låst innhold (titler, områder, tre punkter i seksjon 3) står ordrett som spesifisert
- Alle plassholdere er tydelig markert som HTML-kommentarer
- CSS-variabler er definert og kan endres uten å berøre komponentkode
- Mobil og desktop fungerer (testet i Chrome og Safari)
- Lighthouse-score: Accessibility > 90, SEO > 90
