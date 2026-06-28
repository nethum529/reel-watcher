# reel-watcher — Brand Guidelines

The single source of truth for how reel-watcher looks, sounds, and behaves. Every later
UI decision must obey this file. Where this file and a component library disagree, this file wins.

This is a **Japanese-luxury** redesign: gold-on-green, deep negative space (*ma*), exquisite
type, quiet drama. Premium, never loud.

---

## 1. Design Thesis

> **reel-watcher is a quiet gold-on-green reading room.** It stages saved short-video transcripts
> as centered editorial pages in deep green (`#1C2814`) lit by a single gold-leaf accent
> (`#BF8E34`) inside generous *ma* — and it refuses video-thumbnail grids as the primary layout,
> decorative gradients/mesh/blobs/glassmorphism, more than one accent hue, drop-shadow /
> skeuomorphic depth, and a dense top navigation bar.

This sentence is falsifiable. It explicitly refuses, by name:

1. **Thumbnail-grid tiles** as the primary browse layout (the source apps already do that; we read).
2. **Decorative gradients, mesh blobs, and default glassmorphism.**
3. **More than one accent hue** in UI chrome — gold is the *only* chromatic color.
4. **Drop-shadow / skeuomorphic depth** — elevation is surface lightness + a 1px hairline, never a shadow.
5. **A dense top navigation bar** — navigation lives in a quiet left rail; the content area is for content.

If you find any of these five in the build, the build violates the brand. The product's job is to
turn ephemeral, scroll-and-forget reels into a considered, *readable, searchable* archive that
feels like a private library, not a feed. Restraint and *ma* are the point.

---

## 2. Selected Direction

**Explicit user direction — Japanese luxury (the sakazuki minimal-editorial sensibility), executed
dark-first on a mandated three-color base.** The two default directions do not apply; the mandate
governs every token below.

Mandated, non-negotiable:

- **Direction:** Japanese-luxury minimal-editorial — restraint, *ma* (negative space), refined
  materiality, quiet drama, exquisite type. Premium, not loud.
- **Palette base (three swatches):** `#1C2814` deep green = primary background of the whole app;
  `#BF8E34` gold/ochre = the accent (links, focus, key emphasis, the gold-leaf moment); `#1E1415`
  warm near-black = deepest surfaces / contrast wells / the landing. The full system is derived
  from these three. **Dark, green-based theme is primary.**
- **Layout:** persistent **left sidebar** navigation on the wiki routes (nav rail vs content area);
  **content is centered**; a dramatic full-screen **landing page** with no sidebar precedes the wiki.
- **Component system:** shadcn/ui (React + Vite + Tailwind) first; all tokens map to shadcn's
  CSS-variable convention on `:root` so components drop in re-themed.
- **Icons:** Lucide exclusively.

The three selection questions, answered for completeness (the mandate still governs):

| # | Question | Answer for reel-watcher |
|---|----------|-------------------------|
| 1 | Restraint-as-signal? | **Yes** — quiet confidence; the design recedes so the words read. |
| 2 | Trust-as-primary-job? | No — single-user personal archive; no institution to vouch for. |
| 3 | Editorial vs functional? | **Editorial** — reading and searching saved transcripts *is* the product. |

Two of three resolve to the minimal-editorial (sakazuki) posture, which is exactly the
Japanese-luxury sensibility the user mandated — restraint as signal, content as the product. We
execute it dark-first on the mandated gold/green/warm-black base rather than a default font/palette.

---

## 3. Signature Element

**The gold-leaf masthead in a field of *ma*.**

One typographic moment at extreme scale — a centered display heading set in Fraunces, surrounded
by deliberate emptiness, anchored by a **single thin gold hairline** (the "gold-leaf" rule). On the
landing it fills the viewport (gold-and-off-white on warm-black). On every wiki page it returns,
subordinated, as the page masthead: a centered Fraunces title with the same gold hairline beneath
it. This is the one load-bearing move — it is what makes a folder of scraped `.txt` files feel like
a *bound, edited collection*. It is the **dominant element at ≥2× the visual weight** of anything
near it on its page.

It is supported by one product-wide principle — the **serif-content / sans-chrome duality**:

- **Display serif (Fraunces)** — the gold-leaf masthead only: landing hero, page mastheads. Never
  below 40px, never body, never in chrome.
- **Reading serif (Newsreader)** — content the user came to read: transcript body, post/topic/
  creator titles in lists, pull quotes.
- **Sans (Inter)** — everything that is interface: sidebar, search, badges, buttons, metadata,
  labels, breadcrumbs.

Swap the serif for the sans and the product reads as a file browser — proof the choice carries
meaning, not decoration.

### Do-not-compete list (nothing may out-weight the masthead / reading column on its page)

- No second display moment on a page — one masthead, one hairline. The gold-leaf rule appears
  **once** per masthead, never as a repeated divider between every row.
- No card chrome, border, or box drawn around the post-detail reading column.
- No accent-colored fills inside the reading column (inline gold links only).
- No related-posts rail, sticky promo, or sidebar widget competing abreast of the reading column on
  desktop; secondary content (slides, metadata, source link) sits *below*, never alongside at equal weight.
- Slide-OCR and thumbnails render at subordinate scale and muted treatment — never a full-width hero.
- No gradient, blob, glass, drop-shadow, or second accent hue anywhere on the page.

---

## 4. Palette

### 4-step OKLCH derivation trace

**Step 1 — Base hue.** Two anchors, both user-mandated:
- Background green `#1C2814` ≈ **OKLCH(0.27, 0.045, 130°)** — a deep, low-chroma forest green. Hue
  130° is the spine of the whole neutral system; every surface borrows it.
- Accent gold `#BF8E34` ≈ **OKLCH(0.66, 0.115, 82°)** — a muted ochre/gold-leaf, not a saturated amber.

**Step 2 — Hue-biased neutrals.** The whole surface ramp is built on the green hue (≈130° OKLCH /
≈90° HSL) at low chroma — it is never raw Tailwind `gray`/`slate`. Surfaces step up in lightness
from the background green; the warm near-black `#1E1415` (354° HSL, a *warm* hue) is reserved for
the deepest wells — the sidebar rail and the landing — so the nav reads as a distinct material
against the green content well. Text neutrals are warm parchment off-whites (≈40–75° HSL) for the
gold-leaf warmth. Lightness steps below.

**Step 3 — Accent.** Gold `#BF8E34` (OKLCH L≈0.66, C≈0.115). Because the app is dark-first, gold is
already in a high-contrast form against the dark greens, so no inversion is needed. A hover step
brightens to `#D6A84E` (L≈0.72); a pressed step deepens to `#9E7328` (L≈0.50). The brighter hover
step doubles as the **gold-text-on-lighter-surfaces** step (see §10 — base gold fails AA on the
lightest overlay green).

**Step 4 — Measure all pairs.** See §10 contrast table.

### ΔE vs the slop accent family

| Compared to | Slop hex | reel-watcher gold | Approx ΔE2000 | Verdict |
|-------------|----------|-------------------|---------------|---------|
| Tailwind amber | `#F59E0B` | `#BF8E34` | ≈ 14 | Clears ≥10 (darker L 0.78→0.66, lower C, browner) |
| Tailwind yellow | `#EAB308` | `#BF8E34` | ≈ 15 | Clears ≥10 |
| Tailwind orange | `#F97316` | `#BF8E34` | ≈ 22 | Clears ≥10 |

The gold is a desaturated, dark *ochre* (gold-leaf), materially deeper and less chromatic than the
bright Tailwind amber/yellow — it clears the ≥10 bar on its own, and is user-mandated regardless.

### Surface ramp (dark-first, green-based)

Hue ≈90° HSL (green), except the warm-black wells. All values are exact hex with shadcn HSL.

| Token / step | Hex | HSL (shadcn) | Role |
|--------------|-----|--------------|------|
| green-well | `#151E0F` | `96 33% 9%` | deepest green well (active reading background, footer) |
| **background** | **`#1C2814`** | **`96 33% 12%`** | `--background` — the content area (primary, mandated) |
| sidebar-bg | `#1E1415` | `354 20% 10%` | `--sidebar-background` — nav rail (warm near-black, mandated) |
| card | `#243017` | `89 35% 14%` | `--card` — raised content surface (topic/creator tiles, input fill) |
| popover | `#2A3A1C` | `92 35% 17%` | `--popover` — overlays, command palette (floats above scrim) |
| muted / secondary | `#313F22` | `89 30% 19%` | `--muted` / `--secondary` — recessed fills, badge base |
| accent-surface | `#3A4A29` | `89 29% 23%` | `--accent` (shadcn hover-surface), hovered/selected row base |
| border | `#3F4D2E` | `87 25% 24%` | `--border` — default hairlines, sidebar/content seam |
| border-strong | `#51603D` | `86 22% 31%` | `--input` focused-idle edge, strong dividers |

### Text neutrals (warm parchment)

| Token | Hex | HSL | Role |
|-------|-----|-----|------|
| foreground | `#F2EDE3` | `40 37% 92%` | `--foreground` — body, headings, transcript |
| muted-foreground | `#ADB0A0` | `71 9% 66%` | `--muted-foreground` — secondary text, metadata |
| placeholder | `#8C9080` | `75 7% 53%` | input placeholders, hints (still ≥4.5:1 on field fill) |

### Gold accent ramp — gold-leaf, hue ≈39° HSL

| Step | Hex | HSL | Role |
|------|-----|-----|------|
| gold-hover | `#D6A84E` | `40 62% 57%` | link hover; **gold text on lighter surfaces** (popover) |
| **gold (base)** | **`#BF8E34`** | **`39 57% 48%`** | `--primary`, `--ring`, links, active nav, gold-leaf rule, key emphasis |
| gold-pressed | `#9E7328` | `38 60% 39%` | `:active` / pressed link & control state |
| gold-subtle | `#2E2A14` | `51 39% 13%` | tint behind selected nav item / active result (the "gold-leaf glow") |
| gold-foreground | `#1E1415` | `354 20% 10%` | dark text/icon *on* a filled gold surface |

> **One-hue rule.** `#BF8E34` and its steps are the *only* chromatic color in UI chrome. Semantic
> status colors (§5) are functional signals, never decorative, and never appear as brand chrome.

---

## 5. Semantic Colors

Functional only. Each pairs with a **fixed Lucide icon** (color is never the only channel — Tier 1
rule #4) and is hue-separated from the gold accent (≈39° HSL) to avoid collision.

To keep the one-hue discipline (and because an amber "warning" would collide with the gold accent),
the system carries **only two chromatic semantics — error and success** — plus a **neutral notice**
that uses `--muted-foreground` + an icon and no color at all. The app's real status moments map
cleanly: scrape failed → error; nothing copied/missing transcript → neutral notice; copied → success.

| Role | Hex | HSL | On `#1C2814` | Fixed Lucide icon | Accent-collision |
|------|-----|-----|--------------|-------------------|------------------|
| Destructive / error | `#E2897F` | `6 65% 72%` | 5.96:1 ✓ | `octagon-alert` | H≈6° vs 39° — clear |
| Success | `#8FBF8E` | `119 28% 65%` | 7.35:1 ✓ | `circle-check` | H≈119° — clear |
| Notice (neutral) | `#ADB0A0` | `71 9% 66%` | 7.0:1 ✓ | `info` | no chroma — cannot collide |

`--destructive` / `--destructive-foreground` are wired into the shadcn `:root` (DESIGN.md §0).
Success and notice are app-level tokens used only for the few real status moments, never decoration.

---

## 6. Dark Mode

Dark (green-based) is **primary and the default `:root`**, as mandated. A light theme is *not in
scope* for v1 and the thesis does not require it — a "luxury reading room" is a dark room. If a
light theme is ever added it must be authored as a separate parallel palette (not a CSS inversion)
under a `.light` class. Until then, ship dark only and set `<meta name="color-scheme" content="dark">`.

---

## 7. Typography

Three families, strictly partitioned by the §3 duality. Self-hosted via `@fontsource` for
performance (no FOIT/CLS, no third-party origin).

### Faces

| Face | Family | Used for | Never used for |
|------|--------|----------|----------------|
| **Display serif** | **Fraunces** (variable, `opsz` axis) | Landing hero, page mastheads — the gold-leaf moment | Body, reading column, any chrome, anything < 40px |
| **Reading serif** | **Newsreader** (variable, optical-size) | Transcript body, post/topic/creator titles in lists, pull quotes | Sidebar, buttons, badges, metadata, form labels |
| **Sans** | **Inter** (variable) | Sidebar, search, buttons, badges, metadata, captions, labels, breadcrumbs | The transcript reading body, mastheads |

### Per-face rationale

- **Fraunces (display):** high-contrast, optical "Old Style" serif with genuine drama at large
  optical sizes (`opsz: 144`) — the luxury masthead voice. **Display-only**: never body, never below
  40px, never in chrome. This is the one place expressive type is allowed.
- **Newsreader (reading):** a lower-contrast text serif with true optical sizing — reads cleanly at
  19px and gives spoken-word transcripts the cadence of an *edited longform article*. The Fraunces↔
  Newsreader pairing is intentional: dramatic high-contrast display over calm low-contrast reading.
- **Inter (sans):** disappears as chrome; tabular figures (`"tnum" 1`) align counts and dates.

### Weight → role map (max discipline)

| Weight | Fraunces | Newsreader | Inter |
|--------|----------|-----------|-------|
| 300 Light | landing hero (large optical) | — | — |
| 400 Regular | page mastheads | transcript body, pull quotes (italic 400) | metadata, captions, body chrome |
| 500 Medium | — | post / topic / creator titles | sidebar items, badges, input text, active labels |
| 600 SemiBold | — | — | buttons, overlines, emphasized labels |

No weight outside {300, 400, 500, 600}; 300 is Fraunces-display only. No bold 700 except
`--destructive` inline error text. Reading serif stays ≤500 — content weight contrast comes from
*size*, not heft.

### Tracking & leading (canonical; do not improvise)

- Fraunces hero/masthead: tracking **-0.02em**, line-height **1.0–1.1**.
- Newsreader titles: **-0.01em**; reading body 18–19px: **0**, line-height **1.75**.
- Inter UI: **-0.011em** at 16px, **0** at ≤14px.
- **Uppercase overlines (signature luxury move): +0.18em**, line-height 1.3 — wide-tracked eyebrows
  are part of the Japanese-luxury voice and appear above mastheads ("ARCHIVE", "TOPIC").

---

## 8. Voice Fingerprint

The app is read by one person (its owner); the content is the creators' words, not ours. Our copy
is the thin chrome around it: labels, empty states, counts. Quiet and exact, like a museum caption.

```
Always: name the real object ("12 posts", "transcript", "from @creator") ·
        use the source's own vocabulary (Reel / Short / TikTok, never "content piece") ·
        state counts and dates precisely (relative date + exact on hover)
Never:  marketing verbs or hype — no Unlock/Elevate/Empower/Supercharge/Transform/
        Streamline/Seamlessly/Effortlessly/Curate anywhere in UI copy.
```

Reading level: plain, ~grade 7. Labels are nouns or noun+count ("Topics", "47 saved", "No
transcript yet"), never slogans. The landing may carry **one** quiet, concrete line — never a tagline.

---

## 9. Icons

- **Lucide only.** No other icon set, no emoji in UI chrome (emoji inside a scraped caption are
  *content* and render as-is).
- **Stroke-width is a brand token: `1.5`** default, matching the medium chrome weight. Use `2` only
  for the single active/emphasis icon in a control (active sidebar item); use `1` only in dense data
  rows where 1.5 reads heavy. Stroke tracks type weight: lighter context → thinner stroke.
- **Color:** icons inherit `currentColor`. In chrome they are `--muted-foreground`; on hover/active
  they take `--primary` (gold). Never multicolor.
- **ARIA:** decorative icons get `aria-hidden="true"`; an icon that *is* the only label (icon-only
  button) gets an `aria-label` and a ≥44×44px hit area (Tier 1 rule #3).

Reference sizing table lives in DESIGN.md §7.

---

## 10. Accessibility Commitments

WCAG **AA is the floor, never traded for aesthetics.** Verified contrast pairs (computed against the
exact hexes above):

| Pair | Foreground | Background | Ratio | Pass |
|------|-----------|-----------|-------|------|
| Body / headings | `#F2EDE3` | `#1C2814` | 13.2:1 | ✓ AAA |
| Transcript serif body | `#F2EDE3` | `#1C2814` | 13.2:1 | ✓ AAA |
| Body on sidebar | `#F2EDE3` | `#1E1415` | 15.4:1 | ✓ AAA |
| Secondary / metadata | `#ADB0A0` | `#1C2814` | 7.0:1 | ✓ AAA |
| Placeholder / hint | `#8C9080` | `#1C2814` | 4.7:1 | ✓ AA |
| Muted text on card | `#ADB0A0` | `#243017` | 6.3:1 | ✓ AA |
| Muted text on muted surface | `#ADB0A0` | `#313F22` | 5.1:1 | ✓ AA |
| **Gold link / accent text** | **`#BF8E34`** | **`#1C2814`** | **5.24:1** | **✓ AA** |
| Gold text on card | `#BF8E34` | `#243017` | 4.73:1 | ✓ AA |
| Gold text on **popover** | `#BF8E34` | `#2A3A1C` | 4.15:1 | ✗ — **use gold-hover here** |
| Gold-hover text on popover | `#D6A84E` | `#2A3A1C` | 5.56:1 | ✓ AA |
| Gold text on sidebar | `#BF8E34` | `#1E1415` | 6.12:1 | ✓ AA |
| Active/pressed gold link | `#9E7328` | `#1C2814` | 3.0:1 | ✓ large/UI only — pair w/ underline |
| Button label on gold | `#1E1415` | `#BF8E34` | 6.12:1 | ✓ AA |
| Focus ring | `#BF8E34` | `#1C2814` | 5.24:1 | ✓ (≥3:1 UI) |
| Focus ring on sidebar | `#BF8E34` | `#1E1415` | 6.12:1 | ✓ (≥3:1 UI) |
| Gold-leaf hairline vs bg | `#BF8E34` | `#1C2814` | 5.24:1 | ✓ (≥3:1 UI element) |
| Error text | `#E2897F` | `#1C2814` | 5.96:1 | ✓ AA |
| Success text | `#8FBF8E` | `#1C2814` | 7.35:1 | ✓ AAA |

**Critical gold rule (do not violate):** base gold `#BF8E34` as *text* is only legible on surfaces
at or darker than `--card` (background, card, sidebar, gold-subtle). On the lighter `--popover`
green (command palette, dropdowns) gold text **must** use the brighter `gold-hover #D6A84E`. The
implementer enforces this with a `.on-popover` modifier (DESIGN.md §0). Base gold is always fine as
a *fill*, a *hairline*, or a *focus ring* (UI-element 3:1) on any surface.

**Pressed-gold caveat:** `#9E7328` clears 3:1 (large/UI) but not 4.5:1, so the pressed link state
always carries an underline (two-channel) — it is never communicated by color alone.

Commitments:

- **Focus token:** `--ring` (`#BF8E34`), 2px ring + 2px offset on every focusable element via
  `:focus-visible`. Never `outline: none` without this replacement.
- **Hit areas:** ≥44×44px for all interactive targets; icon-only buttons `min-h-11 min-w-11`.
- **Two-channel states:** every color-coded state also carries an icon, label, border, or underline.
- **Forced colors:** under `forced-colors: active` drop custom colors and rely on system
  `ButtonText`/`Canvas`/`Highlight`; focus ring maps to system `Highlight` (DESIGN.md §11).
- **Reduced motion:** `prefers-reduced-motion: reduce` removes all transforms; cross-fade only,
  including the landing entrance (DESIGN.md §8 / §12).

---

## 11. i18n / Script Scope

- **v1 scope: Latin script (LGC), left-to-right**, primarily English UI chrome. Scraped transcript
  content may contain any Unicode (emoji, hashtags, non-Latin captions); the reading column must
  render arbitrary UTF-8 without breaking.
- This scope gates two choices in DESIGN.md: tracking values (incl. the +0.18em overlines and
  negative display tracking) are tuned for Latin — do **not** apply negative tracking to CJK if scope
  widens; and line-height 1.75 on the reading serif assumes Latin ascender/descender metrics.
- No RTL mirroring in v1. If added later, use logical properties (`margin-inline`, `padding-inline`,
  `text-align: start`/`end`) — already the default in DESIGN.md so the path is open. Note: the
  sidebar is `inset-inline-start`, so it mirrors correctly under RTL without rework.
- Fraunces + Newsreader + Inter cover Latin-1/Latin-Extended; non-Latin transcript glyphs fall back
  to the system UI stack via the `font-family` fallback chain (DESIGN.md §11).
