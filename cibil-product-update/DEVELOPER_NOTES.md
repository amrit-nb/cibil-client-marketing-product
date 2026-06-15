# CIBIL Product Update — Developer Integration Notes (AEM)

Static handoff: `index.html`, `assets/css/style.css`, `assets/js/main.js`, `assets/images/`.
Everything lives on **one screen**. Both tabs (Individual + Combo) and both feature
panels (Consumer + Commercial) are present in the DOM at all times and shown/hidden via
CSS classes. There are **no IDs** — all hooks are **classes / data-attributes**.

Utility: `.hidden { display:none !important; }` is the on/off switch used everywhere.

---

## Tab system (Individual ⇄ Combo)

| Hook | Purpose |
|---|---|
| `.plan-switch-tab[data-tab="individual"]` / `[data-tab="combo"]` | the two switch buttons |
| `switchTab('individual')` / `switchTab('combo')` | JS that performs the switch |
| `.tab-panel[data-panel="individual"]` / `[data-panel="combo"]` | the two pricing panels |
| `[data-tab-show="individual"]` / `[data-tab-show="combo"]` | any element shown only for that tab (titles, feature headers, combo ring) |

Active panel gets `.is-active`; inactive content gets `.hidden`. `switchTab()` already
wires titles, panels, feature header, and the combo sub-toggle.

> The switch has an intro animation (`.plan-switch--s1` / `--s2`, gold "New" reveal).
> Cosmetic only — safe to keep or remove. Driven by timers in `main.js`.

---

## 1. Plan-tier filtering  (hide tiers the user already owns)

**Rule:** if the user is already on **Standard**, show only **Premium** and **Premium Duo**
(hide Basic + Standard). Same logic for higher tiers. **Applies to BOTH tabs.**

### a/c — Pricing cards
- Container per tab: `.tab-panel[data-panel="individual"] .plans-cards` and
  `.tab-panel[data-panel="combo"] .plans-cards`
- Each card: `.plan-card[data-plan="basic|standard|premium|premium-duo"]`
  (visible label is in `.plan-card-name`)
- **To suppress a tier:** add class `hidden` to that `.plan-card`. Target via the
  stable `data-plan` attribute, not the visible text (text may be localized).
- Cards reflow + recenter automatically (flexbox). No layout work needed.

Example — user already on Standard, hide Basic + Standard on the active tab:
```js
document.querySelectorAll(
  '.tab-panel.is-active [data-plan="basic"], .tab-panel.is-active [data-plan="standard"]'
).forEach(el => el.classList.add('hidden'));
```
(`[data-plan]` is set on both the pricing `.plan-card` and the `.more-plans-card`, so one
selector covers both the card row and the More Plans row.)

### b — "More Plans" collapsible (at its designated place, below the cards)
- Container per tab: `.more-plans` (inside each `.tab-panel`)
- Each collapsible row: `.more-plans-card[data-plan="…"]`; tier label inside `.mp-name`
- Toggle handler: `toggleMorePlans(this)` on `.mp-head` (already wired)
- **To suppress a tier:** add `hidden` to that `.more-plans-card`.
- Row dividers `.mp-row-divider` **auto-hide** when a panel ends up with a single
  plan (pure CSS via `:has`). Authors only add/remove cards — dividers manage themselves.

Whatever is hidden in the pricing row above is typically what surfaces in More Plans —
keep the two in sync per your tier rule.

---

## 2. Feature cards  (Section: "…Features")

Header text is tab-specific via `[data-tab-show]`. Cards live in `.features-cards` rows
keyed by `data-feat-panel`:

| Hook | Shows for |
|---|---|
| `.features-cards[data-feat-panel="consumer"]` | **Individual tab AND Combo › Consumer** (a — common/shared) |
| `.features-cards--com[data-feat-panel="commercial"]` | **Combo › Commercial only** (b) |
| `.feat-toggle` (Consumer/Commercial pills) | rendered for **Combo tab only** (`data-tab-show="combo"`) |
| `switchFeatTab('consumer')` / `switchFeatTab('commercial')` | JS sub-toggle |

So: the Consumer card set is authored **once** and reused for both tabs. The Commercial
set never appears on the Individual tab. On Individual, the Consumer row shows with no
sub-toggle; on Combo, the sub-toggle swaps Consumer ⇄ Commercial.

Each card: `.feature-card` (consumer, with illustration) / `.feature-card--com`
(commercial, icon-box). Titles `.feature-card-title`, body `.feature-card-desc`.

---

## 3. FAQ  ⚠️ content placeholder

- Section: `.faq-section`; each entry: `.faq-item`
- Question text: `.faq-q-text`
- Answer body: `.faq-answer-inner` (one or more `<p>`)
- Toggle handler: `toggleFaq(this)` (already wired; single-open accordion)

> **Q1 is real CIBIL content. Q2–Q9 answers are AI-drafted placeholders and MUST be
> replaced with approved copy before go-live.** Edit only the markup inside
> `.faq-answer-inner`; leave structure/handlers intact.

---

## JS reference (`assets/js/main.js`)

| Function | Trigger |
|---|---|
| `switchTab(tab)` | Individual/Combo switch |
| `switchFeatTab(name)` | Consumer/Commercial feature sub-toggle |
| `toggleMorePlans(head)` | expand/collapse a More Plans row |
| `toggleCardFeatures(btn)` | mobile "View/Hide Features" on pricing cards |
| `toggleFaq(btn)` | FAQ accordion |

All content diversion = add/remove the `hidden` class on the listed containers. No JS
changes required for tier filtering — only DOM/class authoring.

## Colors
All colors are CSS variables in `:root` (`assets/css/style.css`). Override the brand
palette there; avoid hardcoding hex in component CSS.
