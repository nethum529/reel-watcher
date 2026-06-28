# reel-watcher — Brand Guidelines

The single source of truth for how reel-watcher looks, sounds, and behaves. Every later
UI decision must obey this file. Where this file and a component library disagree, this file wins.

This is a **Swiss Brutalism** redesign: the International Typographic Style (strict visible grid,
massive grotesque type, flat ink-on-paper blocks, one accent) fused with brutalist rawness (hard
1–2px rules, square corners, no shadows, no gradients). It is **loud, structural, and confident** —
not soft, not luxurious, not minimal-pretty.

---

## 1. Design Thesis

> **reel-watcher is black ink on paper, set on a visible Swiss grid that shouts in condensed
> grotesque type and punches exactly once with a flat Orchid slab.** It refuses gradients and
> decorative blobs; refuses rounded soft cards and drop-shadows; refuses centered-everything
> symmetry; refuses serif / "luxury" display type; and refuses any chromatic color other than the
> single flat Orchid accent.

This sentence is falsifiable. It explicitly refuses, by name:

1. **Gradients, mesh, glassmorphism, decorative blobs** — every fill is flat, every surface opaque.
2. **Rounded soft cards + drop-shadows** — corners are square (radius `0`); elevation is a hard
   1–2px rule, never a shadow or blur.
3. **Centered-everything symmetry** — the grid is asymmetric and left-locked; the page does not
   resolve to a single centered column with three equal cards.
4. **Serif / luxury / expressive display type** — type is grotesque only (one heavy condensed
   display, one condensed companion, one neutral body). No serifs anywhere.
5. **More than one chromatic accent** — Orchid is the *only* color; everything else is jet, paper,
   or a hue-biased neutral. Orchid appears as a flat slab/fill, never as a gradient.

If you find any of these five in the build, the build violates the brand. The product's job is to
turn ephemeral, scroll-and-forget reels into a **bold, structured, searchable archive** that reads
like a printed reference index — confident, legible, and fast to scan.

---

## 2. Selected Direction

**Explicit user direction — Swiss Brutalism. The two default directions (sakazuki / tresmares) do
not apply.** The mandate governs every token below. This supersedes the prior Japanese-luxury
direction entirely; nothing from gold-on-green carries forward.

Mandated, non-negotiable:

- **Style:** Swiss Brutalism — International Typographic Style + brutalism. Strict visible grid,
  MASSIVE condensed type, raw high-contrast flat blocks, hard 1–2px borders/rules, square corners
  (radius `0`), flat fills, no shadows, no gradients. Deliberate, punchy, structural, loud.
- **Palette base (two swatches):** Jet Black `#1D1D1D` (RGB 29,29,29) = ink / structure;
  Orchid `#E5BDDF` (RGB 229,189,223) = the single punch accent. Neutrals + a minimal functional
  set are derived from these two with a faint Orchid hue-bias (≈310°).
- **Themes:** BOTH light and dark are required, with a working toggle. **Default = LIGHT** (paper).
  Light = paper-white bg + Jet-Black ink + Orchid punch (the canonical Swiss black-on-white poster,
  and the better surface for sustained transcript reading). Dark = Jet-Black bg + paper ink +
  Orchid punch.
- **Navigation:** a **bold structural top bar** (not a sidebar) — see §3 and DESIGN §6. Justified:
  the Swiss style is built on a horizontal masthead + grid, the pages are documents (not tool
  panels), and distinct full pages read better under a top bar than a persistent app rail.
- **Component system:** shadcn/ui shape (React + Vite + Tailwind) first; all tokens map to shadcn's
  CSS-variable convention on `:root` (light) and `.dark` (dark) so components drop in re-skinned.
  *(Runtime note: this repo ships a dependency-light hand-rolled `cva()` implementation of the
  shadcn primitives — the token contract and visual result are identical; see `component-index.md`.)*
- **Icons:** Lucide exclusively.

The three selection questions, answered for completeness (the explicit mandate still governs):

| # | Question | Answer for reel-watcher |
|---|----------|-------------------------|
| 1 | Restraint-as-signal? | **No** — the brief is explicitly "loud and structural." We shout, with discipline. |
| 2 | Trust-as-primary-job? | No — single-user personal archive; no institution to vouch for. |
| 3 | Editorial vs functional? | **Editorial-leaning** — reading and scanning saved transcripts is the product, but presented as a bold reference index, not quiet *ma*. |

Neither default fits: sakazuki demands restraint-as-signal (the brief demands the opposite);
tresmares demands trust-first institutional calm. Swiss Brutalism is the user-mandated custom path —
loud editorial structure — so we take it directly and document it below.

---

## 3. Signature Element

**The left-locked grid-rule masthead with a single Orchid slab.**

Every page opens with one load-bearing move: a **full-width 2px jet rule**, beneath it a **massive
Anton headline set hard to the left margin of the grid** (never centered), and a **single flat
Orchid slab** — a solid Orchid rectangle with jet-black text carrying the page's key datum (the
count: "47 TRANSCRIPTS", "TOPIC / cooking", "@creator"). The headline is the dominant element at
**≥2× the visual weight** of anything near it; the Orchid slab is the one punch of color on the page.

This is what turns a folder of scraped `.txt` files into a *designed reference publication*. Remove
it and you have a generic table. It is load-bearing precisely because it would NOT work as generic
style on three unrelated products — it depends on this app's structure (every view is "a labelled
set with a count"), which the slab encodes literally.

It is supported by one product-wide principle — the **type triad**, strictly partitioned:

- **Anton (heavy condensed display)** — the masthead headline, the landing hero, oversized index
  numerals. Uppercase. Never body, never below 28px.
- **Oswald (condensed companion)** — section headers, post titles in lists, nav labels, eyebrows.
  The structural "poster condensed" voice.
- **Inter (neutral grotesque)** — body, transcript reading text, metadata, captions, all small UI.

### Do-not-compete list (nothing may out-weight the masthead headline / Orchid slab on its page)

- **One Orchid slab per page.** Orchid as a solid fill appears exactly once per view (the masthead
  datum). It is never a second card fill, never a row background, never a section band.
- **Orchid is never text on a light surface** (fails contrast — see §10). Light-mode accent *text*
  uses Orchid-Deep; the bright Orchid is fill-only there.
- **One Anton headline per page.** Anton never repeats as a row title or a divider; subordinate
  titles are Oswald.
- No second chromatic color anywhere. No gradient, blob, glass, drop-shadow, or rounded card.
- No centered hero + three-equal-card layout. The dominant element is left-locked and asymmetric.
- Thumbnails / slide images render at subordinate scale inside hard-bordered boxes — never a
  full-bleed hero, never tinted Orchid.

---

## 4. Palette

### 4-step OKLCH derivation trace

**Step 1 — Base hues (both user-mandated).**
- Ink: Jet Black `#1D1D1D` ≈ **OKLCH(0.26, 0.00, —)** — a near-neutral very dark gray (mandated
  exactly; kept neutral as the ink/structure color).
- Accent: Orchid `#E5BDDF` ≈ **OKLCH(0.83, 0.055, 332°)** — a light, low-chroma magenta-pink. Its
  hue (≈310° HSL / ≈332° OKLCH, the magenta family) is the spine the neutrals borrow from.

**Step 2 — Hue-biased neutrals.** The whole neutral ramp injects ≈2–5% of the Orchid magenta hue
(≈310–315° HSL) at very low chroma — it is never raw Tailwind `gray`/`slate`. Paper-white carries a
faint magenta tint (`#F6F2F5`); the dark surfaces carry the same faint magenta in their grays
(`#242124`, `#2E2A2E`). Jet ink stays neutral (mandated). Lightness steps are listed in §4 ramps.

**Step 3 — Derive the accent for both themes and the text-safe variant.** Orchid `#E5BDDF` has a
high luminance (Y≈0.58), so:
- As a **fill** it pairs with jet-black text/icons at ~10.2:1 on any background — use it as the
  Orchid slab and as primary-button fill in **both** themes.
- As **text**, Orchid is legible only on dark surfaces (10.2:1 on jet) — so in **dark mode** Orchid
  is the link/accent-text color. In **light mode** Orchid as text on paper is only 1.5:1 (fails), so
  light-mode accent *text* uses **Orchid-Deep `#8E2F86`** (≈OKLCH 0.45, C 0.16, 305° HSL — a
  darkened, more-saturated orchid that hits 6.5:1 on paper). Hover/pressed steps in the ramp.

**Step 4 — Measure all pairs.** See §10 contrast table (both themes verified).

### ΔE vs the slop accent family

| Compared to | Slop hex | reel-watcher Orchid | Approx ΔE2000 | Verdict |
|-------------|----------|---------------------|---------------|---------|
| Tailwind pink | `#EC4899` | `#E5BDDF` (Orchid) | ≈ 28 | Clears ≥10 (far lighter L0.58 vs 0.65, far lower chroma) |
| Tailwind violet | `#8B5CF6` | `#E5BDDF` (Orchid) | ≈ 33 | Clears ≥10 (magenta vs blue-violet, lighter) |
| Tailwind pink | `#EC4899` | `#8E2F86` (Orchid-Deep) | ≈ 22 | Clears ≥10 (darker, hue 305 vs ~350) |
| Tailwind violet | `#8B5CF6` | `#8E2F86` (Orchid-Deep) | ≈ 24 | Clears ≥10 |

Orchid is a soft, light magenta-pink and Orchid-Deep is a dark plum-magenta; both are materially
distinct from the saturated mid-tone Tailwind pink/violet. They clear the ≥10 bar on their own, and
are user-mandated regardless.

### Light theme ramp (DEFAULT — paper)

| Token / step | Hex | HSL (shadcn) | Role |
|--------------|-----|--------------|------|
| **background** | **`#F6F2F5`** | **`315 18% 96%`** | `--background` — paper (faint magenta tint) |
| card / popover | `#FFFFFF` | `0 0% 100%` | `--card` / `--popover` — raised surfaces (separated by a hard border, not lightness) |
| muted / secondary | `#EBE3E9` | `315 17% 91%` | `--muted` / `--secondary` — recessed fills, badge base |
| accent-surface | `#EBE3E9` | `315 17% 91%` | `--accent` (shadcn hover-surface — NOT the brand accent) |
| border (hard) | `#1D1D1D` | `0 0% 11%` | `--border` / `--input` — the brutalist hard rule (jet, on every card/input/section) |
| border-muted | `#D8CFD6` | `313 12% 83%` | rare subtle divider inside dense lists only (decorative, not structural) |
| **foreground** | **`#1D1D1D`** | **`0 0% 11%`** | `--foreground` — ink: body, headings, transcript |
| muted-foreground | `#5E575C` | `317 4% 35%` | `--muted-foreground` — secondary text, metadata |
| placeholder | `#6E666C` | `315 4% 42%` | input placeholders/hints (≥4.5:1 on white card) |

### Dark theme ramp (jet)

| Token / step | Hex | HSL (shadcn) | Role |
|--------------|-----|--------------|------|
| **background** | **`#1D1D1D`** | **`0 0% 11%`** | `--background` — jet |
| card / popover | `#242124` | `300 4% 14%` | `--card` / `--popover` — raised surfaces (one step up; separated by border) |
| muted / secondary | `#2E2A2E` | `300 5% 17%` | `--muted` / `--secondary` — recessed fills, badge base |
| accent-surface | `#2E2A2E` | `300 5% 17%` | `--accent` (shadcn hover-surface — NOT the brand accent) |
| border (hard) | `#8C868C` | `300 3% 54%` | `--border` / `--input` — hard rule (4.7:1, visible/structural) |
| border-muted | `#3A353A` | `300 5% 22%` | subtle divider inside dense lists only (decorative, not structural) |
| **foreground** | **`#F6F2F5`** | **`315 18% 96%`** | `--foreground` — paper ink |
| muted-foreground | `#A8A0A6` | `315 4% 64%` | `--muted-foreground` — secondary text, metadata |
| placeholder | `#948C92` | `315 4% 56%` | input placeholders/hints (≥4.5:1 on `--card`) |

### Orchid accent ramp (the one chromatic color)

| Step | Hex | HSL | Light-mode role | Dark-mode role |
|------|-----|-----|-----------------|----------------|
| **Orchid (base)** | **`#E5BDDF`** | **`309 43% 82%`** | `--primary` FILL (Orchid slab, primary button) — jet text on top | `--primary` FILL **and** link/accent TEXT + `--ring` |
| Orchid-hover | `#DBAED3` | `311 38% 77%` | primary-fill hover | — |
| Orchid-pressed | `#C994BF` | `311 33% 68%` | primary-fill pressed | accent-text pressed |
| Orchid-Deep | `#8E2F86` | `305 50% 37%` | link/accent **TEXT** + `--ring` (focus) | — (unused; dark uses base Orchid) |
| Orchid-Deep-hover | `#7A2873` | `305 50% 32%` | link hover (light) | — |

> **One-color rule.** Orchid and its steps are the *only* chromatic color in UI chrome. Semantic
> status colors (§5) are functional signals, never decoration, and never appear as brand chrome.
> The critical contrast split (Orchid = fill-only on light, text-ok on dark) is enforced in §10.

`--primary-foreground` (text/icon on an Orchid fill) = **Jet Black `#1D1D1D`** in both themes (10.2:1).

---

## 5. Semantic Colors

Functional only. Each pairs with a **fixed Lucide icon** (color is never the only channel — Tier 1
rule #4) and is hue-separated from Orchid (≈305–315°) to avoid collision. The system carries **only
two chromatic semantics — error and success** — plus a **neutral notice** (uses `--muted-foreground`
+ an icon, no color). The app's real status moments: scrape failed → error; missing transcript →
neutral notice; copied → success. Each theme has its own value (a single hue can't clear 4.5:1 on
both jet and paper).

| Role | Light hex (on paper) | Dark hex (on jet) | Fixed Lucide icon | Accent-collision |
|------|----------------------|-------------------|-------------------|------------------|
| Destructive / error | `#B3261E` (`3 71% 41%`, 5.9:1) | `#F2998F` (`6 79% 75%`, 7.8:1) | `octagon-alert` | H≈3–6° vs 305° — clear |
| Success | `#1B6E37` (`140 61% 27%`, 5.7:1) | `#84C98F` (`130 39% 65%`, 8.6:1) | `circle-check` | H≈130–140° — clear |
| Notice (neutral) | `--muted-foreground` | `--muted-foreground` | `info` | no chroma — cannot collide |

`--destructive` / `--destructive-foreground` (and an app `--success`) are wired into both token
blocks (DESIGN §0). Used only for real status moments, never decoration.

---

## 6. Dark Mode

Both themes are first-class parallel palettes (not a CSS inversion — each has hand-tuned neutrals and
its own accent-text rule). **Light is the default.**

- Light = `:root`; dark = `.dark` on `<html>` (DESIGN §0 + §6 toggle).
- The accent behavior **flips by theme** (the one rule that is not a mirror): accent *text* is
  Orchid-Deep on light, base Orchid on dark; focus `--ring` is Orchid-Deep on light, base Orchid on
  dark. Orchid *fill* (the slab, primary button) + jet text is identical in both.
- `color-scheme` is set per theme (`light` / `dark`) so native controls render correctly.
- Theme is resolved at boot: `localStorage['rw-theme']` → `prefers-color-scheme` → light. An inline
  head script applies the class before first paint (no flash). Toggle persists to `localStorage`.

---

## 7. Typography

Three grotesque families, strictly partitioned by the §3 triad. No serifs. Self-hosted via
`@fontsource` (no third-party origin, no FOIT/CLS).

### Faces

| Face | Family | Pkg | Used for | Never used for |
|------|--------|-----|----------|----------------|
| **Display** | **Anton** | `@fontsource/anton` (OFL-1.1) | Masthead headline, landing hero, oversized index numerals. **Uppercase.** | Body, transcript, anything < 28px, anything not a headline |
| **Condensed** | **Oswald** (variable, wght 200–700) | `@fontsource-variable/oswald` (OFL-1.1) | Section headers, post/topic/creator titles in lists, nav labels, eyebrows | Long reading body, transcript |
| **Body** | **Inter** (variable) | `@fontsource-variable/inter` (already installed) | Body, transcript reading text, metadata, captions, all small UI | Masthead headline, big display |

### Font substitution rationale (commercial → free)

- **Druk Heavy → Anton.** The brief wants the *feel* of Druk Heavy (ultra-bold condensed display).
  Anton is the canonical free SIL-OFL substitute: a single heavy, tightly-condensed grotesque built
  for large display/poster use. It carries the same brick-wall density at scale. Single weight (its
  one weight reads as black), so it is display-only by nature. Verified OFL-1.1, woff2, self-hostable.
- **Theatre/Theater-condensed → Oswald.** The brief wants a condensed "theatre poster" companion.
  Oswald is the most widely-trusted free condensed grotesque (a reworking of the classic Alternate
  Gothic / news-condensed lineage that reads as theatrical poster type), available as a variable
  font (wght 200–700) for tight weight control. Verified OFL-1.1, woff2, self-hostable.
- **Body grotesque → Inter.** A neutral, screen-optimized grotesque in the Swiss/Helvetica lineage —
  the workhorse for body, transcript, and UI. Already installed; variable; excellent legibility at
  17–18px with tabular figures (`"tnum" 1`) for counts/dates.

> The prior serif faces (Fraunces, Newsreader) are **removed** — Swiss Brutalism is sans-only. The
> implementer should drop `@fontsource-variable/fraunces` + `@fontsource-variable/newsreader` and add
> `@fontsource/anton` + `@fontsource-variable/oswald`.

### Weight → role map (max discipline)

| Weight | Anton | Oswald | Inter |
|--------|-------|--------|-------|
| 400 | hero, masthead headline, index numerals (its only weight) | metadata-scale labels (rare) | body, transcript, captions, metadata |
| 500 | — | post/topic/creator titles, nav labels, eyebrows | UI labels, input text, active labels |
| 600 | — | section headers (h3) | buttons, emphasized labels |
| 700 | — | major section headers (h2) | reserved: inline error text only |

No weight outside {400, 500, 600, 700}. Anton is 400-only. Reading-text weight contrast comes from
*size and case*, not extra heft.

### Tracking & leading (canonical; do not improvise)

- Anton hero/masthead (uppercase): tracking **-0.01em**, line-height **0.9–0.95**.
- Oswald section headers (uppercase): **+0.01em**, line-height **1.05–1.15**.
- Oswald titles (mixed case): **0**, line-height **1.15**.
- Inter body 17px: **-0.011em**, line-height **1.6**; transcript 18px: **0**, line-height **1.7**.
- Inter ≤14px UI: **0**.
- **Uppercase eyebrows/overlines (Inter 600 or Oswald 500): +0.12em**, line-height 1.3 — the wide
  tracked label that sits above mastheads ("ARCHIVE", "TOPIC", "CREATOR").

---

## 8. Voice Fingerprint

The app is read by one person (its owner); the content is the creators' words, not ours. Our copy is
the thin chrome around it: labels, empty states, counts. Brutalist voice = blunt, declarative,
upper-case where structural; never marketing.

```
Always: name the real object ("12 POSTS", "TRANSCRIPT", "FROM @creator") ·
        use the source's own vocabulary (Reel / Short / TikTok, never "content piece") ·
        state counts and dates precisely (relative date + exact on hover), set as plain facts
Never:  marketing verbs or hype — no Unlock/Elevate/Empower/Supercharge/Transform/
        Streamline/Seamlessly/Effortlessly/Curate/Reimagine anywhere in UI copy.
```

Reading level: plain, ~grade 7. Structural labels are nouns or noun+count, often uppercase
("TOPICS", "47 SAVED", "NO TRANSCRIPT"). The landing carries **one** quiet, concrete line — never a
tagline.

---

## 9. Icons

- **Lucide only.** No other icon set; no emoji in UI chrome (emoji inside a scraped caption are
  *content* and render as-is).
- **Stroke-width is a brand token: `2`** (brutalism is heavy — the default stroke is bold to match
  the hard rules). Use `1.5` only inside dense data rows where 2 reads too heavy; never below 1.5.
  Stroke tracks weight: heavier structure → thicker stroke.
- **Color:** icons inherit `currentColor`. In chrome they are `--muted-foreground`; on hover/active
  they take `--foreground` (or Orchid-Deep/Orchid for the accent-text case per theme). On an Orchid
  fill they are jet (`--primary-foreground`). Never multicolor.
- **ARIA:** decorative icons get `aria-hidden="true"`; an icon that *is* the only label (icon-only
  button, e.g. the theme toggle) gets an `aria-label` and a ≥44×44px hit area (Tier 1 rule #3).

Reference sizing table lives in DESIGN §7.

---

## 10. Accessibility Commitments

WCAG **AA is the floor, never traded for aesthetics.** Verified contrast pairs — each computed
against **the surface the element actually renders on**, for BOTH themes.

### Light theme (paper)

| Pair | Foreground | Background | Ratio | Pass |
|------|-----------|-----------|-------|------|
| Body / headings / transcript | `#1D1D1D` | `#F6F2F5` `--background` | 15.2:1 | ✓ AAA |
| Secondary / metadata | `#5E575C` | `#F6F2F5` `--background` | 6.3:1 | ✓ AA |
| Placeholder | `#6E666C` | `#FFFFFF` `--card` (input fill) | 5.5:1 | ✓ AA |
| **Accent link / text** | **`#8E2F86` Orchid-Deep** | `#F6F2F5` `--background` | 6.5:1 | ✓ AA |
| Accent text on card | `#8E2F86` | `#FFFFFF` `--card` | 7.2:1 | ✓ AA |
| **Orchid as TEXT on paper** | `#E5BDDF` | `#F6F2F5` | **1.5:1** | ✗ — **forbidden as text on light; fill-only** |
| Slab / button label on Orchid | `#1D1D1D` | `#E5BDDF` `--primary` | 10.2:1 | ✓ AAA |
| Focus ring | `#8E2F86` | `#F6F2F5` | 6.5:1 | ✓ (≥3 UI) |
| Hard border / rule (UI) | `#1D1D1D` | `#F6F2F5` | 15.2:1 | ✓ (≥3 UI) |
| Error text | `#B3261E` | `#F6F2F5` | 5.9:1 | ✓ AA |
| Success text | `#1B6E37` | `#F6F2F5` | 5.7:1 | ✓ AA |

### Dark theme (jet)

| Pair | Foreground | Background | Ratio | Pass |
|------|-----------|-----------|-------|------|
| Body / headings / transcript | `#F6F2F5` | `#1D1D1D` `--background` | 15.2:1 | ✓ AAA |
| Secondary / metadata | `#A8A0A6` | `#1D1D1D` `--background` | 6.6:1 | ✓ AA |
| Placeholder | `#948C92` | `#242124` `--card` (input fill) | 4.8:1 | ✓ AA |
| **Accent link / text (Orchid)** | **`#E5BDDF`** | `#1D1D1D` `--background` | 10.2:1 | ✓ AAA |
| Accent text on card | `#E5BDDF` | `#242124` `--card` | 9.5:1 | ✓ AAA |
| Slab / button label on Orchid | `#1D1D1D` | `#E5BDDF` `--primary` | 10.2:1 | ✓ AAA |
| Focus ring (Orchid) | `#E5BDDF` | `#1D1D1D` | 10.2:1 | ✓ (≥3 UI) |
| Hard border / rule (UI) | `#8C868C` | `#1D1D1D` | 4.7:1 | ✓ (≥3 UI) |
| Error text | `#F2998F` | `#1D1D1D` | 7.8:1 | ✓ AA |
| Success text | `#84C98F` | `#1D1D1D` | 8.6:1 | ✓ AAA |

**Critical Orchid rule (do not violate):**
- **Orchid `#E5BDDF` as TEXT is forbidden on light surfaces** (1.5:1). Light-mode accent *text* and
  links use **Orchid-Deep `#8E2F86`**; the focus ring on light uses Orchid-Deep too.
- **Orchid as a FILL** (the slab, primary button) with a **jet-black label/icon** is fine on any
  surface in either theme (10.2:1).
- In **dark mode**, Orchid is fine as text (10.2:1) and as fill, and is the focus ring.
- `border-muted` (the subtle divider) is <3:1 and is **decorative only** — real structure and all
  load-bearing separators use `--border` (the hard rule, ≥3:1 in both themes) plus spacing.

Commitments:

- **Focus token:** `--ring` (Orchid-Deep on light / Orchid on dark), **2px ring + 2px offset** on
  every focusable element via `:focus-visible`. Never `outline: none` without this replacement.
- **Hit areas:** ≥44×44px for all interactive targets; icon-only buttons `min-h-11 min-w-11`.
- **Two-channel states:** every color-coded state also carries an icon, border, underline, or label.
- **Forced colors:** under `forced-colors: active` drop custom colors; rely on system
  `ButtonText`/`Canvas`/`Highlight`; focus ring and active-nav indicator map to `Highlight`; hard
  rules fall to `CanvasText` (DESIGN §11).
- **Reduced motion:** `prefers-reduced-motion: reduce` removes all transforms; instant or cross-fade
  fallback only (DESIGN §8).

---

## 11. i18n / Script Scope

- **v1 scope: Latin script (LGC), left-to-right**, primarily English UI chrome. Scraped transcript
  content may contain any Unicode (emoji, hashtags, non-Latin captions); the reading column must
  render arbitrary UTF-8 without breaking.
- This scope gates DESIGN choices: tracking values (the +0.12em eyebrows, -0.01em display) are tuned
  for Latin — do **not** apply negative/uppercase tracking to CJK if scope widens; the transcript
  line-height 1.7 assumes Latin metrics. **Anton has no lowercase nuance for non-Latin and is
  uppercase-Latin display only** — non-Latin headings fall back to the Inter/system stack.
- No RTL mirroring in v1. If added later, use logical properties (`margin-inline`, `padding-inline`,
  `text-align: start`/`end`) — the default in DESIGN so the path is open.
- Fallback chains (DESIGN §12): Anton/Oswald/Inter cover Latin-1/Latin-Extended; non-Latin glyphs
  fall back to the system UI stack via the `font-family` fallback chain.
</content>
</invoke>
