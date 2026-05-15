# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Static HTML/CSS/JS marketing landing page for CIBIL Business — a product selection page for CIBIL Rank & Company Credit Report (CCR) subscriptions. No build system, no package manager, no compilation step.

## Development

Open `index.html` directly in a browser. There is no dev server, build command, or test suite. Use a local static server if needed:

```bash
python3 -m http.server 8080
# or
npx serve .
```

## Architecture

**Single-page layout** — everything lives in `index.html` (264 lines), `assets/css/style.css`, and two JS files.

**Sections in `index.html`:**
1. `.hero-plans` — Hero copy (left) + plan selection cards (right). Cards use `<label>` + `<input type="radio">` for selection state. Each card has a `data-href` attribute pointing to the enrollment URL; the floating "Subscribe Now" button (`hp-subscribe-btn`) updates its `href` dynamically when a card is selected (inline script at bottom of `<body>`).
2. `.faq-section` — Tabbed FAQ with accordion items. Tab state controlled via `switchFaqTab()`, accordion via `toggleFaq()` — both defined as inline scripts.

**JavaScript files (`assets/js/`):**
- `scroll-animations.js` — GSAP + ScrollTrigger entrance animations for each section. Hero plays on load; other sections trigger on scroll.
- `banks-scroll.js` — Scroll-synced tab system (pinned section with scroll progress → tab switching). Uses GSAP `ScrollTrigger` and `ScrollToPlugin`.

**External dependencies (CDN only, not in any config file):**
- GSAP with ScrollTrigger and ScrollToPlugin — referenced in JS files, must be loaded in `<head>` or before the JS files.

## CSS Conventions

Custom properties defined in `:root` — use these, don't hardcode colors or font stacks:

```css
--blue: #00A6CA
--yellow: #FCD800
--dark: #262626
--font-intro-bold / --font-intro-semibold / --font-intro-regular / --font-intro-light
--max: 1320px
--px: 120px  /* horizontal padding */
```

Font files live in `assets/fonts/` and are declared at the top of `style.css` via `@font-face`.

## Subscription Plan URLs

Enrollment links go to `cibilrankccr.cibil.com` with offer codes:
- Premium Duo — `offer=PRM01` (with extra GA tracking params on the `data-href`)
- Premium — `offer=PRM01`
- Standard — `offer=STD01`
- Basic — `offer=BAS01`

The Premium Duo card's `data-href` contains long GA/GTM tracking parameters; the inline Subscribe button (`hp-subscribe-btn`) picks up whatever `data-href` is on the active card.
