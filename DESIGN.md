# reel-watcher — Design System (DESIGN.md)

Implementation spec for a React + Vite + Tailwind + shadcn/ui build. Derives every value from
`BRAND_GUIDELINES.md`. A frontend-implementer should build the app from this file with no further
decisions. Where a number appears here, it is canonical — do not re-derive it.

Direction: **Swiss Brutalism** — strict visible grid, MASSIVE condensed type, flat ink-on-paper
blocks, hard 1–2px rules, square corners (radius `0`), no shadows, no gradients. **Default theme:
LIGHT (paper).** Both light and dark ship with a working toggle.

---

## 0. shadcn token blocks (`:root` light + `.dark`) — paste into `index.css`

Values are HSL (space-separated) per shadcn convention; consume as `hsl(var(--token))`.
**`:root` = light (default). `.dark` = dark.** Radius is `0` (square — a brand token).

```css
@layer base {
  :root {
    /* surfaces — paper */
    --background: 315 18% 96%;        /* #F6F2F5  paper, faint magenta tint */
    --foreground: 0 0% 11%;           /* #1D1D1D  jet ink */
    --card: 0 0% 100%;                /* #FFFFFF  raised (separated by hard border, not lightness) */
    --card-foreground: 0 0% 11%;
    --popover: 0 0% 100%;             /* #FFFFFF */
    --popover-foreground: 0 0% 11%;

    /* brand accent — Orchid (FILL only on light; text uses --accent-ink) */
    --primary: 309 43% 82%;           /* #E5BDDF  Orchid slab / primary fill */
    --primary-foreground: 0 0% 11%;   /* #1D1D1D  jet label on Orchid */

    /* recessed / secondary / shadcn hover-surface (NOT brand accent) */
    --secondary: 315 17% 91%;         /* #EBE3E9 */
    --secondary-foreground: 0 0% 11%;
    --muted: 315 17% 91%;             /* #EBE3E9 */
    --muted-foreground: 317 4% 35%;   /* #5E575C */
    --accent: 315 17% 91%;            /* #EBE3E9  neutral hover surface */
    --accent-foreground: 0 0% 11%;

    /* status */
    --destructive: 3 71% 41%;         /* #B3261E */
    --destructive-foreground: 0 0% 100%;

    /* lines & focus */
    --border: 0 0% 11%;               /* #1D1D1D  HARD brutalist rule (cards, inputs, sections) */
    --input: 0 0% 11%;                /* #1D1D1D */
    --ring: 305 50% 37%;              /* #8E2F86  Orchid-Deep (light focus ring) */

    --radius: 0rem;                   /* square corners — brand token */
    color-scheme: light;
  }

  /* app-level tokens (not part of base shadcn set) — light */
  :root {
    --accent-ink: 305 50% 37%;        /* #8E2F86  Orchid-Deep — accent TEXT / links on light */
    --accent-ink-hover: 305 50% 32%;  /* #7A2873 */
    --primary-hover: 311 38% 77%;     /* #DBAED3  Orchid fill hover */
    --primary-pressed: 311 33% 68%;   /* #C994BF  Orchid fill pressed */
    --border-muted: 313 12% 83%;      /* #D8CFD6  subtle divider (decorative only, <3:1) */
    --placeholder: 315 4% 42%;        /* #6E666C  (≥4.5:1 on white card) */
    --success: 140 61% 27%;           /* #1B6E37 */
    --success-foreground: 0 0% 100%;
  }

  .dark {
    /* surfaces — jet */
    --background: 0 0% 11%;           /* #1D1D1D */
    --foreground: 315 18% 96%;        /* #F6F2F5  paper ink */
    --card: 300 4% 14%;               /* #242124 */
    --card-foreground: 315 18% 96%;
    --popover: 300 4% 14%;            /* #242124 */
    --popover-foreground: 315 18% 96%;

    --primary: 309 43% 82%;           /* #E5BDDF  Orchid (fill AND text on dark) */
    --primary-foreground: 0 0% 11%;   /* #1D1D1D  jet label on Orchid */

    --secondary: 300 5% 17%;          /* #2E2A2E */
    --secondary-foreground: 315 18% 96%;
    --muted: 300 5% 17%;              /* #2E2A2E */
    --muted-foreground: 315 4% 64%;   /* #A8A0A6 */
    --accent: 300 5% 17%;             /* #2E2A2E  neutral hover surface */
    --accent-foreground: 315 18% 96%;

    --destructive: 6 79% 75%;         /* #F2998F */
    --destructive-foreground: 0 0% 11%;

    --border: 300 3% 54%;             /* #8C868C  HARD rule, 4.7:1 */
    --input: 300 3% 54%;              /* #8C868C */
    --ring: 309 43% 82%;              /* #E5BDDF  Orchid (dark focus ring) */

    color-scheme: dark;

    /* app-level — dark */
    --accent-ink: 309 43% 82%;        /* #E5BDDF  accent TEXT / links on dark = base Orchid */
    --accent-ink-hover: 311 38% 77%;  /* #DBAED3 */
    --primary-hover: 311 38% 77%;     /* #DBAED3 */
    --primary-pressed: 311 33% 68%;   /* #C994BF */
    --border-muted: 300 5% 22%;       /* #3A353A  subtle divider (decorative only) */
    --placeholder: 315 4% 56%;        /* #948C92  (≥4.5:1 on --card) */
    --success: 130 39% 65%;           /* #84C98F */
    --success-foreground: 0 0% 11%;
  }
}
```

Tailwind: extend `theme.colors` to read these (`background: "hsl(var(--background))"`, etc.), plus
`accent-ink`, `border-muted`, `placeholder`, `success`. **Accent-text rule (Brand §10):** accent
*text* / links / focus ring use `--accent-ink` / `--ring` (Orchid-Deep on light, Orchid on dark) —
they flip automatically via the `.dark` overrides, so author components with the tokens, never raw
hex. Base Orchid (`--primary`) is **fill-only** (always with `--primary-foreground` jet text).

**Radius discipline:** `--radius` = **0** everywhere. Square corners are the brand signal. No
`rounded-*` utilities anywhere (including avatars and badges — they are square). Lint for `rounded`.

**Border discipline:** the brutalist look is **hard 1–2px borders**. Default component border = 1px
`--border`; structural/section rules and the masthead rule = **2px** `--border`. `--border-muted` is
the only soft divider and is decorative (use inside dense lists where spacing already separates rows).

**Shadow:** none anywhere. Elevation = a hard 1–2px `--border` + a surface step. Never add `shadow-*`.

---

## 1. Type Scale

Named ratio: **Perfect Fourth (1.333)** for the heading steps (big, decisive jumps), with the
display steps set above the scale as fluid `clamp()` (the massive Swiss moment). Base UI = 16px;
body = 17px; transcript = 18px.

| Step | px / clamp | Family · weight · case | Line-height | Tracking | Use |
|------|-----------|------------------------|-------------|----------|-----|
| hero | clamp(72→168) | Anton 400 · UPPER | 0.9 | -0.01em | Landing hero only |
| display | clamp(44→112) | Anton 400 · UPPER | 0.92 | -0.01em | Page masthead headline (every page) |
| numeral | clamp(40→96) | Anton 400 | 0.9 | -0.01em | Oversized index numerals / count figure |
| h2 | 42 / 2.625 | Oswald 700 · UPPER | 1.05 | +0.01em | Major section headers |
| h3 | 31 / 1.9375 | Oswald 600 · UPPER | 1.1 | +0.01em | Sub-section headers |
| title | 22 / 1.375 | Oswald 500 | 1.15 | 0 | Post/topic/creator title in lists/cards |
| read | 18 / 1.125 | Inter 400 | 1.7 | 0 | **Transcript reading body** |
| body | 17 / 1.0625 | Inter 400 | 1.6 | -0.011em | UI body, descriptions |
| label | 14 / 0.875 | Inter 500 | 1.45 | 0 | Nav labels, badges, metadata, input text |
| caption | 13 / 0.8125 | Inter 400 (tnum) | 1.4 | 0 | Counts, secondary metadata |
| overline | 13 / 0.8125 | Inter 600 · UPPER | 1.3 | +0.12em | Eyebrows above mastheads ("ARCHIVE", "TOPIC") |
| micro | 12 / 0.75 | Inter 400 (tnum) | 1.3 | 0 | View counts, dates in dense rows |

Canonical reconciliation: transcript reading measure **68ch**; heading blocks max **24ch** (Anton is
wide-set — keep headlines short and punchy). Tabular figures on all numeric metadata (`"tnum" 1`).
`hero`, `display`, `numeral` are the **only** fluid (`clamp`) steps; everything else is stepped.

---

## 2. Spacing & the Swiss Grid

8pt base scale. Use only these steps:

`4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128 · 160 · 192` (px) → Tailwind `1 2 3 4 6 8 12 16 24 32 40 48`.

### The grid (explicit, visible)

The Swiss grid is a **12-column grid** inside a max container, with a fixed gutter. It is a design
element: content snaps to columns, mastheads and rules span the full 12, and the asymmetry (content
left-locked, not centered) is intentional.

| Property | Value |
|----------|-------|
| Container max-width | **1280px**, centered in viewport, side margins `--page-margin` |
| Page side margin | 24px (`<md`) · 48px (`md`) · 64px (`lg+`) |
| Columns | **12** at `lg+` · **6** at `md` · **2** at `<md` (base) |
| Gutter | 16px (`<md`) · 20px (`md`) · 24px (`lg+`) |
| Baseline rhythm | 8px (all vertical spacing is a multiple of 8) |

- **Column rules may be made visible** as faint 1px `--border-muted` verticals on index pages — an
  honest Swiss move, never decorative. Optional; off by default.
- The **masthead rule** and section rules span the **full 12 columns** (full content width).
- Content blocks are **left-locked** to the grid (start at column 1), not centered. The transcript
  reading column occupies columns 1–8 at `lg` (68ch), leaving columns 9–12 for metadata/aside.

### Semantic gap tokens (section gap ≥2× component gap)

| Token | px (desktop / mobile) | Use |
|-------|----------------------|----|
| gap-inline | 8 | icon↔label, badge internal |
| gap-component | 16 | within a card / list row, label↔control |
| gap-content | 24 | between stacked content blocks |
| gap-group | 64 / 40 | between subsections within a page |
| gap-section | 128 / 80 | between major page sections |
| gap-masthead | 48 / 32 | below the masthead rule before content begins |

Transcript paragraphs: `margin-block: 16px`. The masthead rule sits directly under the headline
(`margin-block: 16px`). Vertical rhythm is tight-then-open: blocks pack on the 8px baseline, sections
break wide.

---

## 3. Responsive Contract

Tailwind breakpoints, mobile-first.

| Name | Min width | Layout intent |
|------|-----------|---------------|
| (base) | 0 | single column, 2-col grid for indexes; top bar collapses nav to a `menu` Sheet |
| `sm` | 640 | single column, wider margins; index grids 2-col |
| `md` | 768 | full top bar (inline nav); 6-col grid; index grids 2–3 col |
| `lg` | 1024 | 12-col grid; index grids 3–4 col; transcript reading column = cols 1–8 |
| `xl` | 1280 | container caps at 1280; extra width becomes side margin |

- **Fluid vs stepped:** spacing and grid columns step at breakpoints; type is stepped **except**
  `hero`, `display`, `numeral` (`clamp`). No muddy in-between body sizes.
- **Mid-range (768–1024):** the awkward zone. The top bar shows inline nav from `md`; index grids
  are **2-col** at `md`, **3–4-col** only at `lg+` (and only because index tiles are genuinely
  co-equal). The transcript column is full-width (`md`) and snaps to cols 1–8 at `lg`.
- **Gap scale-down:** `gap-section` 128→80, `gap-group` 64→40, `gap-masthead` 48→32 below `md`.
  Component/content gaps are constant.
- **Touch:** at `<md`, all targets ≥44px, no hover-only affordances; nav is a full-height `Sheet`.
- **Landing (`#/`)** is full-bleed at every breakpoint with no top-bar nav (see §13).

---

## 4. Section Cadence Map

Density varies by content so the app breathes (anti-test: not every section is the same padding +
grid). Left-locked does **not** mean uniform — the dominant element per page is large and isolated,
then content tightens into the grid.

| Page · section | Density tier | Rationale |
|----------------|--------------|-----------|
| **Landing** · hero | Sparse-extreme | One massive Anton hero, left-locked, full-bleed; the dominant element of the whole product. |
| **Browse** · masthead | Sparse | Eyebrow → Anton "ARCHIVE" headline + Orchid count slab → 2px rule. Lots of air. |
| **Browse** · post list | Dense | The work happens here — tight rows on the grid (title + creator + date + counts). |
| **Topics** · masthead | Sparse | Eyebrow "TOPICS" → Anton headline + slab → rule. |
| **Topics** · index grid | Medium | Co-equal topic tiles (name + count) → an honest grid (3–4 col lg). |
| **Creators** · masthead | Sparse | Eyebrow "CREATORS" → Anton headline + slab → rule. |
| **Creators** · index grid | Medium | Co-equal creator tiles (avatar + @handle + platform + count). |
| **Topic** · masthead | Sparse | Eyebrow "TOPIC" → tag as Anton headline + count slab → rule. |
| **Topic** · post list | Dense | Tight grid rows; minimal per-row chrome. |
| **Creator** · masthead | Medium | Square avatar + @handle (Anton) + platform + count slab + link-out. |
| **Creator** · post list | Dense | Same dense rows. |
| **Post** · masthead | Medium | Title (Anton/Oswald per length) + metadata row + source link + rule. |
| **Post** · reading column | **Sparse + dominant** | Cols 1–8, 68ch, generous leading; ≥2× weight of all else. |
| **Post** · slides/OCR + source | Subordinate | Below/aside the read in hard-bordered boxes; muted, small. |
| **Search** · query bar | Sparse | One large field owns the viewport top, left-locked. |
| **Search** · results | Dense | Result rows with matched-term highlight; built for fast scanning. |

No two adjacent sections share padding + grid; cadence alternates sparse → dense deliberately.

---

## 5. Information Architecture

Goal (a personal KB) = **find and re-read a saved idea fast.** Separation of concerns → distinct
pages (no cramming Topics + Recent into one home). Data model (from `src/data/types.ts`): `Post`
(id, url, source, caption, transcript, slides, content, creator, posted_at, view_count, tags[]),
`TopicSummary` (tag, count), `CreatorSummary` (creator, source, count). Routes (HashRouter):

| Route | Page | Top bar? |
|-------|------|----------|
| `#/` | Landing (dramatic entry) | **No** |
| `#/browse` | Browse — all transcripts (the full archive list; default sort = recent) | Yes |
| `#/topics` | Topics index (all tags + counts) | Yes |
| `#/creators` | Creators index (all creators + platform + counts) | Yes |
| `#/search` | Search | Yes |
| `#/topic/:tag` | Topic — posts under one tag | Yes |
| `#/creator/:creator` | Creator — posts from one creator | Yes |
| `#/post/:id` | Post detail (reading column) | Yes |

The landing "Enter" affordance targets `#/browse` (the archive is the home of the working app).

Obstacle → answer map:

- **"I remember a reel but not where."** → Search, reachable from every page (top-bar Search item +
  `⌘K` palette).
- **"What did I save about X?"** → Topics index → Topic page list.
- **"What does this creator post?"** → Creators index, or the Creator link in any post's metadata.
- **"What's everything, newest first?"** → Browse.
- **"What did this video actually say?"** → Post-detail reading column = the payoff.
- **"I want the original."** → source link + platform/date always in post metadata.

Per-page question → dominant element:

| Page | Question it answers | Dominant element |
|------|--------------------|------------------|
| Landing | "What is this / how do I enter?" | The Anton hero + single Enter affordance |
| Browse | "What's in here / what's new?" | "ARCHIVE" masthead, then the dense post list |
| Topics | "What subjects did I save?" | "TOPICS" masthead, then the topic grid |
| Creators | "Whose videos did I save?" | "CREATORS" masthead, then the creator grid |
| Topic | "Everything about this subject" | Tag masthead + dense post list |
| Creator | "Everything from this creator" | Creator masthead + dense post list |
| Post | "What did this video say?" | **Reading column** |
| Search | "Find the one I'm thinking of" | Query field → ranked result rows |

Every page leads with exactly one dominant element (hierarchy gate). Top-bar nav order = Browse ·
Topics · Creators · Search — matches obstacle frequency.

---

## 6. Top Bar (the app shell) + Theme Toggle

A **bold structural top bar** on all non-landing routes (Brand §2). It IS the horizontal Swiss
masthead rule that anchors the grid.

### Structure & dimensions

- **Height:** 72px (`lg`) / 64px (`<lg`). Full-bleed background `--background`, **2px `--border`
  bottom rule** (the structural seam — no shadow, no gradient). Sticky at top.
- **Layout (left → right), aligned to the grid:**
  - **Wordmark (left, col 1):** "REEL-WATCHER" in **Anton**, ~22–26px, UPPERCASE, `--foreground`;
    links to `#/`. The one place Anton appears small, as a logotype.
  - **Primary nav (center/left group):** four links in **Oswald 500, 14px, UPPERCASE**, with a 16px
    Lucide icon each:
    - Browse → `layout-grid` → `#/browse`
    - Topics → `hash` → `#/topics`
    - Creators → `users` → `#/creators`
    - Search → `search` → `#/search` (right-aligned `⌘K` `kbd` hint, muted)
  - **Theme toggle (far right):** icon-only `<button>` — Lucide `sun` (when dark, click → light) /
    `moon` (when light, click → dark). `aria-label="Switch to dark theme"` / `"…light theme"`
    (label reflects the *target*). `min-h-11 min-w-11`. Toggles `.dark` on `<html>`, persists
    `localStorage['rw-theme']`. See boot script below.

### Nav item states (all nine)

- **default:** `--muted-foreground` text + icon (stroke 2), transparent bg.
- **hover:** text → `--foreground`, icon → `--foreground`; a **2px `--border` underline** appears
  under the label (second channel, not color-only).
- **focus-visible:** 2px `--ring` + 2px offset.
- **active (current route):** text/icon → `--foreground`; **2px Orchid (`--primary`) underline** +
  Oswald weight bumps to 600. Three channels (weight + underline + the Orchid color). `aria-current="page"`.
- **active+hover:** underline stays Orchid; no extra change.
- **disabled / loading / error / empty:** n/a (static nav, all destinations exist).

### Mobile (`<md`)

Nav collapses behind a 44px `menu` (Lucide) button → full-height `Sheet` (WAI-ARIA APG Dialog):
focus trap, Esc closes, focus returns to trigger, scroll-lock, `aria-modal="true"`. The theme toggle
stays visible in the bar at all widths. DOM order = visual order = tab order; the bar is
`<header><nav aria-label="Primary">`.

### Theme boot script (in `index.html` `<head>`, before the app — prevents flash)

```html
<script>
  (function () {
    var t = localStorage.getItem('rw-theme');
    if (!t) t = matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
    if (t === 'dark') document.documentElement.classList.add('dark');
  })();
</script>
```

Resolution order: stored value → system preference → **light** (default). The toggle writes
`'light'`/`'dark'` to `localStorage` and adds/removes `.dark`.

---

## 7. Content Layout (left-locked, per page type)

All content sits inside the 1280px grid container (§2). Mastheads and content are **left-locked**
(start at grid column 1) — not centered (Brand §1 refuses centered symmetry). Running transcript text
is left-aligned within its measure.

| Page type | Content span | Alignment | Notes |
|-----------|--------------|-----------|-------|
| Browse | full 12 cols | left-locked | masthead full width; list rows full width |
| Topics / Creators | full 12 cols | left-locked | index grid (3–4 col lg, 2 col md) |
| Topic / Creator | full 12 cols | left-locked | masthead full width; dense list full width |
| Post | reading cols 1–8 (68ch); aside cols 9–12 | left-aligned body | metadata + slides aside at `lg`; stacked below at `<lg` |
| Search | cols 1–8 | left-locked | query field + result rows |

**Masthead pattern (every non-landing page):**
left-locked eyebrow (overline, +0.12em, uppercase, `--muted-foreground`) → **Anton `display`
headline** (left, uppercase) sitting beside or above a **single Orchid slab** (solid `--primary`
fill, jet `--primary-foreground` text, carrying the count/datum, e.g. "47") → **2px full-width
`--border` rule**. Then `gap-masthead` before content. The Orchid slab appears **once** per page,
only here (Brand §3).

### Lucide icon sizing table

| Context | Size | Stroke |
|---------|------|--------|
| nav item / inline with label | 16px | 2 |
| buttons | 16px | 2 |
| active nav item / emphasis | 16px | 2 |
| theme toggle | 20px | 2 |
| dense list-row meta | 14px | 1.5 |
| empty-state glyph | 32px | 2 |
| landing Enter affordance arrow | 24px | 2 |

---

## 8. Components (shadcn mapping + 9 states each)

All map to shadcn/ui primitives (hand-rolled on `cva()` here, same token contract). Each interactive
component defines nine states: **default, hover, focus-visible, active/pressed, disabled, loading,
error, selected, empty/skeleton** (n/a where it cannot apply). Every color-coded state carries a
second channel (icon/border/underline/label). **Square corners, hard borders, flat fills, no shadow**
throughout.

### 8.1 Post row (the workhorse) — `<a>` wrapping a grid row

- Layout: Oswald `title` on top; below, Inter `caption` meta — `@creator · platform · relative date ·
  {N} views`. No thumbnail by default; an optional **square** 56×56 slide thumb (hard 1px border) may
  sit left at subordinate weight. Left-aligned within the grid.
- **default:** title `--foreground`, meta `--muted-foreground`, transparent bg, 1px `--border-muted`
  bottom divider.
- **hover:** bg `--accent` (neutral surface), title gains a 2px Orchid (`--accent-ink`) underline,
  cursor pointer. (Meta stays `--muted-foreground` — verified ≥4.5:1 on `--accent` in both themes.)
- **focus-visible:** 2px `--ring` + 2px offset, no bg change required.
- **active/pressed:** bg `--accent`, title `--accent-ink` + underline.
- **disabled:** n/a (rows always navigate).
- **loading:** skeleton (see empty).
- **error:** transcript failed to scrape → inline `octagon-alert` (14px) + "TRANSCRIPT UNAVAILABLE"
  in `--destructive`; row still links.
- **selected (keyboard/search nav):** **2px Orchid (`--primary`) left rule** + `--accent` bg.
- **empty/skeleton:** two flat bars (title 60%, meta 30%), `--muted` fill, no spinner, no shimmer
  (brutalism = static; a single hard bar, optional 800ms opacity pulse honoring reduced-motion).

### 8.2 Card — shadcn `Card`

Topic/creator index tiles only (never around the reading column). `bg-card`, **2px `border-border`**,
square (radius 0), **no shadow**. Tile content left-locked: Oswald `title` name + Inter `caption`
count; creator tiles add a **square** avatar. States mirror the post row (hover → `--accent` bg +
Orchid name underline; focus ring; selected → 2px Orchid left rule). Empty → skeleton card (flat).

### 8.3 Badge / Tag — shadcn `Badge`

Topics/hashtags on a post. **Square** (radius 0), Inter `label` (12–13px) or Oswald uppercase,
`bg-muted` `text-muted-foreground`, **1px `border-border`**. Interactive (links to topic): hover →
`text-foreground` + bg `--accent`; focus ring; active → bg `--accent`. Selected (active filter) →
**`bg-primary` (Orchid fill) `text-primary-foreground` (jet)** + 12px `check` icon (two-channel —
the one place a tag may take the Orchid fill, since it is acting as the single selected punch).
Disabled n/a; no loading/error/empty.

### 8.4 Search input + Command — shadcn `Input` + `Command`

- Header/page search = `Input`, `bg-card` fill, **2px `border-input`** (hard, square), leading
  `search` icon (16/2). Global palette = `Command` dialog on `⌘K` / `Ctrl K`, surface `--popover`,
  **2px `--border`**.
- **default:** `bg-card`, `border-input`, placeholder `--placeholder` (≥4.5:1 on the `--card` fill).
- **hover:** border stays `--border` (already hard); cursor text.
- **focus-visible:** **2px `--ring`** ring + 2px offset (border itself stays jet/`--border`);
  placeholder stays ≥4.5:1.
- **active/typing:** caret `--accent-ink`.
- **disabled:** `opacity-50`, `cursor-not-allowed`.
- **loading:** trailing `loader-2`, 16px, spin (reduced-motion → static `loader`).
- **error:** n/a for search.
- **selected (result highlighted in palette):** row `--accent` bg + 2px Orchid left rule; matched
  substring in `<mark>` (bg transparent, **2px Orchid underline** + `--accent-ink` text — two
  channels: underline + color; mark is never a fill that breaks contrast).
- **empty:** "NO RESULTS FOR '<query>'" left-locked, `search-x` 32/2 muted, plus a fix hint.

### 8.5 Button — shadcn `Button`

Primary use is minimal (landing Enter, source link-out, "copy transcript"). **Square, hard border,
flat fill, no shadow.** Variants:

- **primary** (`bg-primary` Orchid fill, `text-primary-foreground` jet, 10.2:1, **2px `--border`**):
  at most once per view. Hover → `--primary-hover`; active → `--primary-pressed`.
- **secondary** (`bg-card`, `text-foreground`, **2px `--border`**): hover → `bg-accent`.
- **ghost** (transparent, `text-muted-foreground`, no border): hover → `bg-accent text-foreground`.
  Default for icon actions.
- **link** (`--accent-ink` text + **2px underline on hover**): inline source links / landing "Enter".

States: default; hover (above); focus-visible (2px `--ring` +offset); active (primary→
`--primary-pressed`; others→`bg-accent`); disabled (`opacity-50`, no pointer); loading (leading
`loader-2` spin + `aria-busy`, label persists); error n/a; selected (toggle → `bg-primary
text-primary-foreground` + `check`); empty n/a. Icon-only buttons `min-h-11 min-w-11` + `aria-label`.

### 8.6 Breadcrumb / Separator / ScrollArea

`Breadcrumb` (Inter `caption`, left-locked under the masthead on topic/creator/post): `BROWSE /
TOPICS / {topic}` — last crumb `--foreground`, others `--muted-foreground` with Orchid-underline on
hover (`--accent-ink`). `Separator` = **2px `--border` hard rule** to divide the reading column from
slides and between dense list groups (not between every row — rows separate by `--border-muted` +
spacing). The masthead rule is a 2px `--border` rule (§7), used once per page. `ScrollArea` for very
long transcripts and the palette.

### 8.7 Toast / status — shadcn `Sonner`

Real events only (copy succeeded, scrape error). Bottom-right, `bg-popover`, **2px `--border`**,
square, status icon + text from Brand §5 (theme-correct semantic color), auto-dismiss 4s (pauses on
hover/focus). Motion = a hard 120ms slide-in (translate only) + instant; reduced-motion → instant
appear, no slide.

---

## 9. Media & Empty-Asset States

Source assets are slide images (`.jpg/.webp`) + OCR text; thumbnails are *proof*, never decoration.

- **Aspect-ratio reserved** (CLS): slide images in a fixed `aspect-[9/16]` (reel/short) or
  `aspect-[4/5]` (carousel) wrapper with `object-cover` + **1px `--border`**, reserved before load.
  List thumbs fixed **square** `56×56` with 1px `--border`.
- **Loading:** `--muted` flat fill (no shimmer — brutalism; optional single 800ms opacity pulse,
  removed under reduced-motion).
- **Alt classification:** (a) slide with OCR text → `alt=""` + `aria-hidden` (text already in the OCR
  block); (b) slide with no OCR → `alt` = caption's first line or "slide N of post"; (c) creator
  avatar → `alt="@handle"`.
- **No generic stock, ever.** Missing asset → typographic placeholder: the post title in Oswald on
  `bg-muted` with a 32px `--muted-foreground` `image-off` glyph (stroke 2). Never stock, gradient, or
  blob.
- **Video (`.mp4`):** not embedded/autoplayed; source link handles playback. Optional poster frame
  as a static square thumb with a `play` overlay icon (jet on a small Orchid square) linking out.

---

## 10. Motion

Brutalism is **not floaty** — motion is sparse, snappy, and mostly instant. Budget: at most one
animated affordance per interaction.

- **Allowed:** state transitions ≤**120ms** (hover bg/border/underline, focus ring); palette/sheet
  open ≤160ms; toast hard slide-in; the **landing entrance** (§13). No springs, no bounce, no easing
  drama.
- **Easing:** `cubic-bezier(0.2, 0, 0, 1)` (sharp ease-out) or plain `linear` for ≤120ms swaps. One
  easing token.
- **Compositor-only:** animate only `opacity` and `transform`; never `width/height/top/left`.
- **No-go:** the reading column never animates; the masthead rule and Orchid slab never animate after
  first paint; no continuous/loop animations except the loading spinner.
- **Reduced motion:** `prefers-reduced-motion: reduce` → all transforms removed; instant state
  changes; palette/sheet/landing appear with a ≤120ms cross-fade or instantly; spinner → static icon.

---

## 11. Forms

The only forms are search and (optionally) a filter panel.

- **Single column**, labels visible and persistent above the field (placeholder is never the label —
  Tier 1 #6). The page/header search uses a visible `aria-label` + the magnifier icon; the `⌘K`
  palette shows a visible "SEARCH TRANSCRIPTS, TOPICS, CREATORS" placeholder *and* an accessible label.
- **Expected widths:** page search field spans cols 1–8 (`max-w-[640px]`); palette full-width within
  the dialog; filter selects `w-[200px]`.
- **Focus / tab order = DOM order** (Tier 1 #9); no `tabindex` > 0.
- **Errors:** co-located below the field, `role="alert"`, `--destructive` text + `octagon-alert`,
  message states problem *and* fix ("NO RESULTS — try a creator handle or a topic").
- **Filter chips** reuse the Badge selected state (§8.3) with two-channel `check`.

---

## 12. Performance Budget

- **Fonts:** self-host Anton + Oswald + Inter (Anton single-weight, Oswald + Inter variable) via
  `@fontsource` / `@fontsource-variable`, subset to Latin. `font-display: swap`. **Preload** Inter
  400/500, Oswald 500/600, and **Anton 400** (the masthead headline — above the fold on every page).
  The landing additionally relies on Anton (already preloaded). Fallback chains:
  - Display: `Anton, "Arial Narrow", ui-sans-serif, sans-serif`
  - Condensed: `"Oswald Variable", Oswald, "Arial Narrow", ui-sans-serif, sans-serif`
  - Body: `"Inter Variable", Inter, ui-sans-serif, system-ui, sans-serif`
- **LCP element:** browse/topics/creators = the Anton `display` masthead; post-detail = the post
  title + first transcript paragraph; landing = the Anton hero (reserve its box, target LCP <2.0s).
  Keep LCP text in the initial route chunk.
- **CLS:** all media boxes have reserved aspect-ratio (§9); fonts preloaded; the masthead headline
  box is reserved so the 2px rule below it does not jump on font swap.
- **Static-first:** the wiki is static (HashRouter, `public/data.json`) — render lists at build/load
  time; hydrate only interactive islands (search palette, mobile `Sheet`, theme toggle, landing
  entrance). No client fetch for the reading column.
- **Compositor-only animations** only (§10) — nothing animates layout.
- **Images:** `loading="lazy"` + `decoding="async"` on all non-LCP images; prefer `.webp`.

---

## 13. Landing Page (`#/`) — the dramatic entry

Full-bleed, brutalist, **default-theme paper** (jet ink) — or jet (paper ink) in dark. **No top-bar
nav** (the theme toggle may appear top-right as the only chrome). One arresting type moment + one
Enter affordance. This is the product's dominant element overall.

- **Surface:** full-bleed `--background`. A single **2px `--border` rule** structures the composition
  (e.g. a full-width rule above and/or below the hero). No gradient/blob/band (thesis).
- **Composition (left-locked to the grid, vertically centered block, generous space above/below):**
  1. **Eyebrow:** "PERSONAL ARCHIVE" — Inter 600, 13px, +0.12em, uppercase, `--muted-foreground`.
  2. **Hero:** the `hero` step — **Anton 400, `clamp(72px→168px)`, UPPERCASE, `--foreground`**,
     left-locked. Word: **"REEL-WATCHER"** (or the collection's name). One/two lines. The dominant
     element (≥2× weight of everything else).
  3. **Orchid slab + count:** a single solid `--primary` (Orchid) rectangle with jet
     `--primary-foreground` text — the one quiet concrete line as real counts, e.g.
     "142 TRANSCRIPTS · 23 TOPICS · 11 CREATORS". The single chromatic punch. Never a tagline.
  4. **Enter affordance:** a **primary** button "ENTER THE ARCHIVE" → `#/browse` (Orchid fill, jet
     label, 2px border, square) with a trailing `arrow-right` (24/2); hover → `--primary-hover`;
     focus → 2px `--ring` ring. ≥44px tall. The only nav element above the fold.
- **Hierarchy:** the hero is ≥2× the visual weight of everything else. Nothing else competes — no
  nav, no cards, no second CTA.
- **Entrance motion (the one allowed flourish):** on load, eyebrow → hero → slab → Enter, each a
  hard ≤120ms `opacity` 0→1 + `translateY` 8px→0, staggered ~60ms, total ≤500ms, sharp ease-out.
  **Reduced motion:** instant appear or a single ≤120ms cross-fade, no translate.
- **Keyboard:** the Enter affordance is the first/primary focus stop; pressing Enter/Return when
  focused navigates. The theme toggle (if shown) is the second stop.

---

## 14. Implementation Notes

- **Override discipline:** shadcn/base styles in `@layer base`, app overrides in `@layer components`,
  utilities last — so Tailwind utilities win predictably. Use `:where()` for zero-specificity resets.
- **Token source of truth:** the `:root` + `.dark` blocks (§0) are the *only* place colors are
  defined. Components reference `hsl(var(--token))` via Tailwind theme keys — **no raw hex in
  JSX/CSS**, no `gray-*`/`slate-*` Tailwind classes (reintroduces raw-gray slop). Lint for both.
- **Accent-text enforcement (Brand §10):** accent *text* / links / focus ring use `--accent-ink` /
  `--ring` (auto-flip per theme: Orchid-Deep on light, Orchid on dark). **Base Orchid (`--primary`)
  is fill-only and always carries `--primary-foreground` jet text.** CI/lint rule: forbid
  `text-primary` / Orchid base as a text color (it fails AA on light) — accent text must be
  `text-accent-ink`.
- **Radius:** `--radius` = 0. **No `rounded-*` utilities anywhere** (badges, avatars, thumbs, cards
  all square). Lint for `rounded`.
- **Borders:** hard 1–2px `--border` (jet on light, `#8C868C` on dark). Structural/section/masthead
  rules = 2px; component borders = 1–2px. `--border-muted` is decorative-only (dense-list dividers).
- **Shadow:** none. Elevation = surface step + hard border. Do not add `shadow-*`. Lint for `shadow`.
- **Theme toggle:** single source `localStorage['rw-theme']` + `.dark` on `<html>`; the head boot
  script (§6) prevents flash; the toggle button updates both. Default = light.
- **Forced-colors layer:** `@media (forced-colors: active) { ... }` drops custom backgrounds, lets
  borders fall to `CanvasText`, maps `--ring` and the active-nav Orchid underline to `Highlight`, and
  renders the Orchid slab as a `Canvas`/`CanvasText`-bordered block (its text → `CanvasText`); do not
  override system colors elsewhere.
- **Icons:** import individual Lucide icons (tree-shake); a global wrapper sets the brand stroke token
  (`<Icon strokeWidth={2} size={16} />`) so stroke is enforced in one place; pass `strokeWidth={1.5}`
  only for dense data-row meta.
- **`color-scheme`** is set per theme in §0 so native controls (scrollbars, form widgets) match.
</content>
