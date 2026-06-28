# reel-watcher — Brand Guidelines

The single source of truth for how reel-watcher looks, sounds, and behaves. Every later
UI decision must obey this file. Where this file and a component library disagree, this file wins.

---

## 1. Design Thesis

> **reel-watcher is a reading archive, not a feed.** It sets saved short-form-video content
> in a serif reading column and refuses video-thumbnail grid tiles as the primary layout,
> infinite-scroll feeds, decorative gradients/blobs/glassmorphism, heavy drop shadows, and
> more than one accent hue — the periwinkle (`#8F9AE8`) appears *only* on links, focus rings,
> and active state.

This sentence is falsifiable. It explicitly refuses, by name:

1. Thumbnail-grid tiles as the primary browse layout (the source apps already do that).
2. Infinite-scroll / feed pagination (this is a library you *finished* watching, not a feed).
3. Decorative gradients, mesh blobs, and default glassmorphism.
4. Heavy drop shadows / skeuomorphic depth.
5. More than one accent hue in UI chrome.

If you find any of these five in the build, the build violates the brand. The product's entire
job is to turn ephemeral, scroll-and-forget reels into a considered, *readable, searchable*
personal archive. Restraint is the point.

---

## 2. Selected Direction

**Explicit user direction — the two default directions (Sakazuki / Tresmares) do not apply.**

The user mandated, non-negotiably:

- **Direction:** typographic minimalism — type-led hierarchy, generous whitespace, restraint.
- **Color base:** `#0F0F0F` near-black background + `#8F9AE8` periwinkle accent; full system
  derived from these two. **Dark theme is primary.**
- **Component system:** shadcn/ui (React + Vite + Tailwind) first; all tokens map to shadcn's
  CSS-variable theming convention so components drop in re-themed.
- **Icons:** Lucide exclusively.

The three selection questions are answered for completeness, but the mandate governs:

| # | Question | Answer for reel-watcher |
|---|----------|-------------------------|
| 1 | Restraint-as-signal? | Yes — the design must disappear behind the content. |
| 2 | Trust-as-primary-job? | No — single-user personal tool; no institution to trust. |
| 3 | Editorial vs functional? | **Editorial** — reading and searching saved content *is* the product. |

This maps closest to a minimal-editorial posture, but executed dark-first on the user's
mandated two-color base. We follow the mandate, not a default's font/palette stack.

---

## 3. Signature Element

**The reading column.**

On a post-detail page, the transcript is set in a serif (Newsreader) in a single,
measure-constrained column (~66ch) that is the **dominant element at ≥2× the visual weight**
of everything around it. This is the one load-bearing move: the entire app exists to make a
saved video *readable*, so the reading of it must visibly dominate.

This is supported by one principle applied product-wide — the **serif-content / sans-chrome
duality**:

- **Serif (Newsreader)** is reserved for *content the user came to read*: transcripts, post
  titles, topic names, creator names as headings, pull quotes.
- **Sans (Inter)** is everything that is *interface*: navigation, search, badges/tags, buttons,
  metadata (views, dates, counts), captions, labels.

This duality is load-bearing, not stylistic: it is what makes a folder of scraped `.txt`
files feel like an *edited archive* instead of a debug dump. If you swapped the serif for the
sans, the product would read as a file browser — proof the choice carries meaning.

### Do-not-compete list (nothing may out-weight the reading column on a post page)

- No card chrome, border, or shadow box drawn around the transcript column.
- No accent-colored fills inside the reading column (inline links only).
- No sidebar, related-posts rail, or sticky promo competing for attention beside it on desktop;
  secondary content (slides, metadata, source link) sits *below or above*, never abreast at
  equal weight.
- Slide-OCR and thumbnails render at subordinate scale and muted treatment — never as a
  full-width hero that upstages the text.
- No second accent hue, no oversized iconography, no animated affordance in the column.

---

## 4. Palette

### 4-step OKLCH derivation trace

**Step 1 — Base hue.** Mandated accent `#8F9AE8` resolves to **OKLCH(0.709, 0.115, 277°)** — a
light, low-chroma blue-violet (periwinkle). Hue 277° is the spine of the whole system; the
neutral ramp borrows it.

**Step 2 — Hue-biased neutrals.** The neutral ramp injects ~245° (HSL) / 277° (OKLCH) hue at
low chroma so it is never raw Tailwind `gray`/`slate`. Per the user mandate the literal floor
`--background` is held at true `#0F0F0F` (the brand anchor); **every surface above the floor
carries periwinkle tint** (cards, popovers, muted, borders), which is what satisfies the
"hue-injected neutral ramp" rule — the ramp as a system is biased, only its named anchor is
neutral by decree. Lightness steps below.

**Step 3 — Accent.** Accent is `#8F9AE8` at OKLCH L=0.71, C=0.115. Because the app is
dark-first, the accent is already in its "dark-mode" high-L form (light periwinkle on near-black),
so no inversion is needed. A pressed/active step drops to L≈0.62; a hover step rises to L≈0.78.

**Step 4 — Measure all pairs.** See §10 contrast table.

### ΔE vs the slop accent family

| Compared to | Slop hex | reel-watcher accent | Approx ΔE2000 | Verdict |
|-------------|----------|---------------------|---------------|---------|
| Tailwind indigo | `#6366F1` | `#8F9AE8` | ≈ 22 | Clears ≥10 (different L: 0.51→0.71, C: 0.21→0.115) |
| Tailwind violet | `#8B5CF6` | `#8F9AE8` | ≈ 20 | Clears ≥10 |
| Tailwind blue | `#3B82F6` | `#8F9AE8` | ≈ 24 | Clears ≥10 |

The periwinkle is a desaturated *pastel*, materially lighter and lower-chroma than the
saturated default indigo/violet — it clears the ≥10 bar on its own. It is also user-mandated,
so exempt regardless.

### Neutral ramp (dark-first) — hue 245° (HSL)

| Token / step | Hex | HSL (shadcn) | Role |
|--------------|-----|--------------|------|
| neutral-floor | `#0F0F0F` | `0 0% 6%` | `--background` — page base (held neutral per mandate) |
| neutral-1 | `#161618` | `240 6% 9%` | `--card` — primary surface |
| neutral-2 | `#1B1B1E` | `240 6% 11%` | `--popover` — overlays, command palette |
| neutral-3 | `#212126` | `240 6% 14%` | `--muted` / `--secondary` — recessed fills, badges |
| neutral-4 | `#26262B` | `240 6% 16%` | `--accent` (shadcn hover-surface), selected row base |
| border-1 | `#2B2B30` | `240 7% 18%` | `--border` / `--input` — default hairlines |
| border-2 | `#3A3A43` | `244 8% 24%` | strong borders, focused input idle edge |
| text-muted | `#A1A1AC` | `240 6% 65%` | `--muted-foreground` — secondary text, metadata |
| text-placeholder | `#87878F` | `240 5% 55%` | input placeholders, hints (still ≥4.5:1) |
| text-strong | `#F4F4F6` | `240 9% 96%` | `--foreground` — primary text, headings |

### Accent ramp — periwinkle, hue 233° (HSL)

| Step | Hex | HSL | Role |
|------|-----|-----|------|
| accent-hover | `#B4BCEF` | `231 65% 82%` | link hover, hovered active state |
| **accent (base)** | **`#8F9AE8`** | **`233 66% 74%`** | `--primary`, `--ring`, links, active nav, key emphasis |
| accent-pressed | `#6E7CDC` | `231 62% 65%` | `:active`/pressed link & control state |
| accent-subtle-bg | `#191B2B` | `231 27% 13%` | tint behind selected nav item / active search result |
| accent-foreground | `#0F0F0F` | `240 9% 7%` | dark text/icon *on* a filled accent surface |

> **One-hue rule.** `#8F9AE8` and its four steps are the *only* chromatic color in UI chrome.
> Semantic status colors (below) are functional signals, not brand chrome, and never appear
> decoratively.

---

## 5. Semantic Colors

Functional only. Each pairs with a **fixed Lucide icon** (color is never the only channel —
Tier 1 rule #4) and is hue-separated from the periwinkle accent (H≈277° OKLCH) to avoid
collision.

| Role | Hex | HSL | On `#0F0F0F` | Fixed Lucide icon | Accent-collision |
|------|-----|-----|--------------|-------------------|------------------|
| Destructive / error | `#E5736B` | `6 70% 67%` | 6.2:1 ✓ | `octagon-alert` | H≈25° vs 277° — clear |
| Warning | `#E0B341` | `44 73% 56%` | 9.6:1 ✓ | `triangle-alert` | H≈85° — clear |
| Success | `#6FCF8E` | `141 50% 62%` | 9.8:1 ✓ | `circle-check` | H≈150° — clear |
| Info | `#8F9AE8` | `233 66% 74%` | 7.1:1 ✓ | `info` | **= accent by design** (the system has one blue; info maps to it, never a 2nd blue) |

`--destructive` / `--destructive-foreground` are wired into the shadcn `:root` (§ DESIGN.md).
Warning/success/info are app-level tokens used only for the few real status moments
(scrape-failed badge, transcript-missing notice, search-empty), never as decoration.

---

## 6. Dark Mode

Dark is **primary and the default `:root`**, as mandated. A light theme is *not in scope* for v1
and the thesis does not require it. If one is ever added it must be authored as a separate
parallel palette (not a CSS inversion) under a `.light` class; until then, ship dark only and
set `<meta name="color-scheme" content="dark">`.

---

## 7. Typography

Two families, strictly partitioned by the §3 duality. Self-hosted via `@fontsource` for
performance (no FOIT/CLS, no third-party origin).

### Faces

| Face | Family | Used for | Never used for |
|------|--------|----------|----------------|
| **Serif** | **Newsreader** (variable, optical-size) | Transcript body, post titles, topic/creator page headings, pull quotes | Navigation, buttons, badges, metadata, form labels, tables |
| **Sans** | **Inter** (variable) | All UI chrome: nav, search, buttons, badges/tags, metadata, captions, labels, breadcrumbs | The transcript reading body |

Newsreader is a text-first editorial serif with true optical sizing — it reads well at 18px on
screen, which is why it is *not* display-only here (unlike the Fraunces display-only rule, which
does not apply to this project; Fraunces is not used). Inter is the neutral workhorse for chrome.

### Per-face rationale

- **Newsreader (serif):** gives spoken-word transcripts the cadence of an *edited transcript* /
  longform article — the core thesis move. Optical sizes keep it crisp from 18px body up to a
  40px page title.
- **Inter (sans):** disappears as chrome; tabular figures (`font-feature-settings: "tnum" 1`)
  keep view-counts and dates aligned in lists.

### Weight → role map (max discipline)

| Weight | Newsreader | Inter |
|--------|-----------|-------|
| 400 Regular | transcript body, pull quotes (italic 400 for quotes) | metadata, captions, body chrome |
| 500 Medium | post / topic / creator titles | nav items, badges, input text, active labels |
| 600 SemiBold | — (serif stays ≤500) | buttons, section overlines, emphasized labels |

No weight outside {400, 500, 600}. No bold 700 except `--destructive` inline error text. The
serif never exceeds 500 — weight contrast in content comes from *size*, not heft.

---

## 8. Voice Fingerprint

The app is read by one person (its owner) and the content is the creators' words, not ours. Our
copy is the thin chrome around it: labels, empty states, counts.

```
Always: name the real object ("12 posts", "transcript", "from @creator") ·
        use the source's own vocabulary (Reel / Short / TikTok, never "content piece") ·
        state counts and dates precisely (relative date + exact on hover)
Never:  marketing verbs or hype — no Unlock/Elevate/Empower/Supercharge/Transform/
        Streamline/Seamlessly/Effortlessly anywhere in UI copy.
```

Reading level: plain, ~grade 7. Labels are nouns or noun+count ("Topics", "47 saved",
"No transcript yet"), never slogans.

---

## 9. Icons

- **Lucide only.** No other icon set, no emoji in UI chrome (emoji that appear inside a
  scraped caption are *content* and render as-is).
- **Stroke-width is a brand token: `1.5`** as the default, matching the medium type weight of the
  chrome. Use `2` only for the single accent/active icon in a control (e.g. the active nav item);
  use `1` only inside dense data rows where 1.5 reads heavy. Stroke-width tracks type weight:
  lighter context → thinner stroke.
- **Color:** icons inherit `currentColor`. In chrome they are `--muted-foreground`; on hover/active
  they take `--primary`. Never multicolor.
- **ARIA:** decorative icons get `aria-hidden="true"`; an icon that *is* the only label (icon-only
  button) gets an `aria-label` and a ≥44×44px hit area (Tier 1 rule #3).

Reference sizing table lives in DESIGN.md §6.

---

## 10. Accessibility Commitments

WCAG **AA is the floor, never traded for aesthetics**. Verified contrast pairs against `#0F0F0F`
and surfaces:

| Pair | Foreground | Background | Ratio | Pass |
|------|-----------|-----------|-------|------|
| Body / headings | `#F4F4F6` | `#0F0F0F` | 18.1:1 | ✓ AAA |
| Transcript serif body | `#F4F4F6` | `#0F0F0F` | 18.1:1 | ✓ AAA |
| Secondary / metadata | `#A1A1AC` | `#0F0F0F` | 7.0:1 | ✓ AAA |
| Placeholder / hint | `#87878F` | `#0F0F0F` | 5.3:1 | ✓ AA |
| Muted text on card | `#A1A1AC` | `#161618` | 6.4:1 | ✓ AA |
| Link / accent text | `#8F9AE8` | `#0F0F0F` | 7.1:1 | ✓ AAA |
| Active/pressed link | `#6E7CDC` | `#0F0F0F` | 5.0:1 | ✓ AA |
| Button label on accent | `#0F0F0F` | `#8F9AE8` | 7.1:1 | ✓ AAA |
| Focus ring | `#8F9AE8` | `#0F0F0F` | 7.1:1 | ✓ (≥3:1 UI) |
| Border vs base | `#2B2B30` | `#0F0F0F` | 1.4:1 | ✓ (non-text, decorative hairline) |
| Error text | `#E5736B` | `#0F0F0F` | 6.2:1 | ✓ AA |
| Success text | `#6FCF8E` | `#0F0F0F` | 9.8:1 | ✓ AAA |
| Warning text | `#E0B341` | `#0F0F0F` | 9.6:1 | ✓ AAA |

Commitments:

- **Focus token:** `--ring` (`#8F9AE8`), 2px ring + 2px offset on every focusable element via
  `:focus-visible`. Never `outline: none` without this replacement.
- **Hit areas:** ≥44×44px for all interactive targets; icon-only buttons `min-h-11 min-w-11`.
- **Two-channel states:** every color-coded state also carries an icon, label, border, or underline.
- **Forced colors:** under `forced-colors: active` we drop custom colors and rely on system
  `ButtonText`/`Canvas`/`Highlight`; the focus ring maps to system `Highlight` (DESIGN.md §11).
- **Reduced motion:** `prefers-reduced-motion: reduce` removes all transforms; cross-fade only.

---

## 11. i18n / Script Scope

- **v1 scope: Latin script (LGC), left-to-right**, primarily English UI chrome. Scraped transcript
  content may contain any Unicode (emoji, hashtags, non-Latin captions); the reading column must
  render arbitrary UTF-8 without breaking.
- This scope gates two choices documented in DESIGN.md: tracking values are tuned for Latin
  (do not apply negative tracking to CJK if scope ever widens), and line-height 1.7 on the serif
  body assumes Latin ascender/descender metrics.
- No RTL mirroring in v1. If added later, use logical properties (`margin-inline`,
  `padding-inline`, `text-align: start`) — already the default in DESIGN.md so the path is open.
- Newsreader + Inter both cover Latin-1/Latin-Extended; non-Latin transcript glyphs fall back to
  the system UI stack via the `font-family` fallback chain (DESIGN.md §10).
