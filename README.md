# Gard L. Christiansen — personlig nettside

Statisk Astro-nettside for gardlc.com.

## Kom i gang

```bash
npm install
npm run dev      # Utviklingsserver på http://localhost:4321
npm run build    # Bygg til /dist
npm run preview  # Forhåndsvis bygget lokalt
```

## Fontfiler

Legg PP Neue Machina og PP Neue Montreal (woff2) i `/public/fonts/`:

- `PPNeueMachina-Regular.woff2`
- `PPNeueMontreal-Book.woff2`
- `PPNeueMontreal-Regular.woff2`
- `PPNeueMontreal-Medium.woff2`

## Kontaktskjema

Erstatt Formspree-plassholder i `src/components/CTA.astro`:

```html
action="https://formspree.io/f/XXXXXXX"
```

## Neste steg

- [ ] Legg inn fontfiler i `/public/fonts/`
- [ ] Fyll inn norsk copy i `<!-- PLASSHOLDER -->` -kommentarer
- [ ] Erstatt Formspree-endpoint i kontaktskjemaet
- [ ] Oppdater `site`-URL i `astro.config.mjs` ved bytte av domene
- [ ] Velg og erstatt `--color-accent` i `src/styles/tokens.css`
- [ ] Legg til profilbilde i `/public/` og koble det til `/om-meg`
