# reel-watcher — Design System (DESIGN.md)

Implementation spec for a React + Vite + Tailwind + shadcn/ui build. Derives every value from
`BRAND_GUIDELINES.md`. A frontend-implementer should be able to build the app from this file with
no further decisions. Where a number appears here, it is canonical — do not re-derive it.

---

## 0. shadcn `:root` token block (paste into `index.css`)

Dark is the only theme in v1. Values are HSL (space-separated) per shadcn convention; consume as
`hsl(var(--token))`.

```css
@layer base {
  :root {
    /* surfaces */
    --background: 0 0% 6%;          /* #0F0F0F  brand anchor, held neutral */
    --foreground: 240 9% 96%;       /* #F4F4F6 */
    --card: 240 6% 9%;              /* #161618 */
    --card-foreground: 240 9% 96%;
    --popover: 240 6% 11%;          /* #1B1B1E */
    --popover-foreground: 240 9% 96%;

    /* brand accent */
    --primary: 233 66% 74%;         /* #8F9AE8 periwinkle */
    --primary-foreground: 240 9% 7%;/* #111114 dark text on accent */

    /* recessed / secondary */
    --secondary: 240 6% 14%;        /* #212126 */
    --secondary-foreground: 240 9% 96%;
    --muted: 240 6% 14%;            /* #212126 */
    --muted-foreground: 240 6% 65%; /* #A1A1AC */
    --accent: 240 6% 16%;           /* #26262B  shadcn hover-surface (NOT brand accent) */
    --accent-foreground: 240 9% 96%;

    /* status */
    --destructive: 6 70% 67%;       /* #E5736B */
    --destructive-foreground: 240 9% 7%;

    /* lines & focus */
    --border: 240 7% 18%;           /* #2B2B30 */
    --input: 240 7% 18%;            /* #2B2B30 */
    --ring: 233 66% 74%;            /* #8F9AE8 */

    --radius: 0.5rem;
    color-scheme: dark;
  }

  /* app-level tokens (not part of base shadcn set) */
  :root {
    --accent-hover: 231 65% 82%;    /* #B4BCEF */
    --accent-pressed: 231 62% 65%;  /* #6E7CDC */
    --accent-subtle: 231 27% 13%;   /* #191B2B  tint behind selected items */
    --placeholder: 240 5% 55%;      /* #87878F */
    --border-strong: 244 8% 24%;    /* #3A3A43 */
    --warning: 44 73% 56%;          /* #E0B341 */
    --success: 141 50% 62%;         /* #6FCF8E */
    --info: 233 66% 74%;            /* #8F9AE8 = accent */
  }
}
```

Tailwind: extend `theme.colors` to read these (`background: "hsl(var(--background))"`, etc.) per
the standard shadcn `tailwind.config` pattern. Radius via `--radius` (`lg`=var, `md`=var-2px,
`sm`=var-4px). Two radius tokens carry meaning: **`rounded-lg` (8px)** for interactive surfaces
(buttons, inputs, cards), **`rounded-full`** for badges/tags and avatars only. Nothing else.

---

## 1. Type Scale

Named ratio: **Major Third (1.25)**, tuned for screen. Base UI = 16px; reading body = 18px serif.

| Step | px / rem | Family · weight | Line-height | Tracking | Use |
|------|----------|------------------|-------------|----------|-----|
| display | 40 / 2.5 | Newsreader 500 | 1.1 | -0.02em | Post title (detail), home masthead |
| h2 | 30 / 1.875 | Newsreader 500 | 1.15 | -0.015em | Topic/creator page title, section headers |
| h3 | 24 / 1.5 | Newsreader 500 | 1.25 | -0.01em | Sub-section, grouped list headers |
| title | 20 / 1.25 | Newsreader 500 | 1.3 | -0.005em | Post title in lists/cards |
| read | 18 / 1.125 | Newsreader 400 | 1.7 | 0 | **Transcript reading body** (signature) |
| body | 16 / 1.0 | Inter 400 | 1.6 | -0.011em | UI body, captions text |
| label | 14 / 0.875 | Inter 500 | 1.45 | 0 | Nav, badges, metadata, input text |
| caption | 13 / 0.8125 | Inter 400 | 1.4 | 0 | Counts, secondary metadata |
| overline | 12 / 0.75 | Inter 600 | 1.3 | +0.06em, uppercase | Section eyebrows ("RECENT", "TOPICS") |
| micro | 12 / 0.75 | Inter 400 (tnum) | 1.3 | 0 | View counts, dates in dense rows |

Canonical reconciliation: reading measure **66ch**, body/heading measure max **72ch / 48ch**,
leading is fixed per step above (do not improvise). Tabular figures on all numeric metadata
(`font-feature-settings: "tnum" 1`).

---

## 2. Spacing

8pt base scale. Use only these steps:

`4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128` (px) → Tailwind `1 2 3 4 6 8 12 16 24 32`.

Semantic gap tokens (section gap is **≥2×** component gap):

| Token | px | Use |
|-------|----|----|
| gap-inline | 8 | icon↔label, badge internal |
| gap-component | 16 | within a card / list row, label↔control |
| gap-content | 24 | between stacked content blocks |
| gap-group | 48 | between subsections within a page |
| gap-section | 96 (desktop) / 64 (mobile) | between major page sections |

Reading column rhythm: paragraphs in the transcript get `margin-block: 16px`; OCR-slide blocks
get `gap-content` (24) separation from the transcript above/below.

---

## 3. Responsive Contract

Tailwind breakpoints, mobile-first. Single source of truth:

| Name | Min width | Layout intent |
|------|-----------|---------------|
| (base) | 0 | single column, stacked; top nav collapses to a sheet/menu button |
| `sm` | 640 | unchanged single column, wider margins |
| `md` | 768 | persistent top nav appears; 2-col grids allowed for *equal* content |
| `lg` | 1024 | full layout; topic/creator index can go 2–3 col; reading column centers |
| `xl` | 1280 | max content frame `max-w-[1200px]`, margins grow, column stays 66ch |

- **Fluid vs stepped:** spacing and grid columns step at breakpoints; **type is stepped**, not
  fluid `clamp()` (keeps the editorial scale exact — no muddy in-between sizes). Only the page
  display title may use `clamp(30px, 5vw, 40px)`.
- **Mid-range (768–1024):** the awkward zone. Rule: the reading column never exceeds 66ch even as
  the viewport grows — extra width becomes margin, not measure. Index grids stay **2-col** here
  (3-col only at `lg+`). Nav is the persistent horizontal bar from `md`.
- **Gap scale-down:** `gap-section` 96→64 below `md`; `gap-group` 48→32 below `md`. Component/
  content gaps are constant across breakpoints.
- **Touch:** at `<md`, treat as touch — all targets ≥44px, no hover-only affordances.

---

## 4. Section Cadence Map

Density varies by content so the app has rhythm (anti-test: not every section is the same
padding + same grid). Tier = vertical breathing + internal density.

| Page · section | Density tier | Rationale |
|----------------|--------------|-----------|
| **Home** · masthead (title + global search) | Sparse | One dominant entry point; whitespace signals "start here". Search field is the single largest interactive element. |
| **Home** · Topics index | Medium | A scannable list/grid of topic names + counts; co-equal, so a real grid is honest here. |
| **Home** · Recent posts | Medium-dense | A vertical list of recent post rows (title serif + creator + date + counts); reading-forward, not tiles. |
| **Topic** · header | Sparse | Topic name (h2 serif) + count + one-line description; lots of air. |
| **Topic** · post list | Dense | The work happens here — a tight vertical list of post rows; minimal per-row chrome. |
| **Creator** · header | Sparse | Creator handle/name + source platform + post count + link out. |
| **Creator** · post list | Dense | Same dense list pattern as topic. |
| **Post detail** · header | Medium | Title (display serif) + metadata row (creator, date, views, source link). |
| **Post detail** · reading column | **Sparse + dominant** | The signature element. Generous leading, 66ch, ≥2× weight of all else. |
| **Post detail** · slides/OCR + source | Subordinate | Below the read; muted, small, never upstaging. |
| **Search** · query bar | Sparse | Command-palette-style focus; one field owns the viewport top. |
| **Search** · results | Dense | Result rows with matched-term highlight; built for fast scanning. |

The cadence alternates sparse → dense deliberately; no two adjacent sections share padding+grid.

---

## 5. Information Architecture

Conversion goal (for a personal KB) = **find and re-read a saved idea fast**. Map of obstacles
and the question→answer sequence each page answers:

- **Obstacle: "I remember a reel but not where."** → global search is reachable from every page
  (persistent in nav + `⌘K` palette). Answered first, everywhere.
- **Obstacle: "What did I save about X?"** → Topics index (home) → Topic page list.
- **Obstacle: "What does this creator post?"** → Creator page from any post's metadata.
- **Obstacle: "What did this video actually say?"** → Post detail reading column = the payoff.
- **Obstacle: "I want the original."** → source link + platform/date always in post metadata.

Per-page question→answer:

| Page | Question it answers | Primary element (dominant) |
|------|--------------------|----------------------------|
| Home | "Where do I start / what's new?" | Global search field, then Topics + Recent |
| Topic | "Everything I saved about this subject" | Dense post list |
| Creator | "Everything from this creator" | Creator header + dense post list |
| Post detail | "What did this video say?" | **Reading column** |
| Search | "Find the one I'm thinking of" | Query field → ranked result rows |

Justification: every page leads with exactly one dominant element (hierarchy gate). Nav order =
Home · Topics · Creators · Search — matches the obstacle frequency above.

---

## 6. Components (shadcn mapping + 9 states each)

All map to shadcn/ui primitives. Each interactive component defines nine states: **default,
hover, focus-visible, active/pressed, disabled, loading, error, selected, empty/skeleton**
(states that don't apply to a static component are marked n/a). Every color-coded state carries a
second channel (icon/border/underline/label).

### Lucide icon sizing table

| Context | Size | Stroke |
|---------|------|--------|
| inline with label / nav | 16px | 1.5 |
| buttons | 16px | 1.5 |
| active nav item / emphasis | 18px | 2 |
| dense list-row meta | 14px | 1 |
| empty-state illustration glyph | 32px | 1.5 |

### 6.1 Post row (the workhorse) — `<a>` wrapping a flex row

- Layout: serif `title` (post title) on top; below, sans `caption` meta — `@creator · platform ·
  relative date · {N} views`. No thumbnail tile by default; an optional 56×56 `rounded-lg` slide
  thumb may sit left at subordinate weight.
- **default:** title `--foreground`, meta `--muted-foreground`, transparent bg.
- **hover:** bg `--accent` (#26262B), title underline (accent), cursor pointer.
- **focus-visible:** 2px `--ring` + 2px offset, no bg change required.
- **active:** bg `--accent-subtle`, title `--accent-pressed`.
- **disabled:** n/a (rows are always navigable).
- **loading:** skeleton — see empty.
- **error:** if transcript failed to scrape, show inline `octagon-alert` (14px) + "transcript
  unavailable" in `--destructive`; row still links.
- **selected:** (in search/keyboard nav) left 2px `--primary` border + `--accent-subtle` bg.
- **empty/skeleton:** two shimmer bars (title 60% width, meta 30%), `--muted` fill, no spin.

### 6.2 Card — shadcn `Card`

Used sparingly (topic/creator index tiles, *not* around the reading column). `bg-card`,
`border border-border`, `rounded-lg`, **no shadow** (thesis refuses heavy shadows; depth = the
1px border + surface lightness step only). States mirror the post row (hover → `--accent` bg,
focus ring, selected → primary left border). Empty → skeleton card.

### 6.3 Badge / Tag — shadcn `Badge`

For topics/hashtags on a post. `rounded-full`, sans `label` 14px (12px in dense rows), `bg-muted`
`text-muted-foreground`, `border border-border`. Interactive (links to topic): hover →
`text-foreground` + border `--border-strong`; focus-visible ring; active → `--accent-subtle` bg.
Selected (active filter) → `bg-accent-subtle text-primary border-primary`. Two-channel: selected
also shows a 12px `check` icon. Disabled n/a. No loading/error/empty.

### 6.4 Search input — shadcn `Input` + `Command`

- Persistent header search = `Input` with leading `search` icon (16/1.5). Global palette = shadcn
  `Command` dialog on `⌘K` / `Ctrl K`.
- **default:** `bg-card`, `border-border`, placeholder `--placeholder`.
- **hover:** border `--border-strong`.
- **focus-visible:** border `--primary` + 2px `--ring` offset; placeholder remains ≥4.5:1.
- **active/typing:** caret `--primary`.
- **disabled:** `opacity-50`, `cursor-not-allowed`.
- **loading:** trailing `loader-2` icon, 16px, spin (respects reduced-motion → static `loader`).
- **error:** n/a for search.
- **selected (result highlighted):** result row gets `--accent-subtle` bg + `--primary` left rule;
  matched substring wrapped in `<mark>` (bg `--accent-subtle`, text `--primary`) — color + the
  `<mark>` semantic = two channels.
- **empty:** "No results for '<query>'" centered, `search-x` glyph 32/1.5 muted, plus a hint.

### 6.5 Button — shadcn `Button`

Primary use is minimal (source link-out, "copy transcript"). Variants:

- **primary** (`bg-primary text-primary-foreground`): used at most once per view.
- **secondary** (`bg-secondary text-secondary-foreground border-border`).
- **ghost** (transparent, `text-muted-foreground`, hover `bg-accent text-foreground`): default for
  icon actions.

States: default; hover (primary→`--accent-hover` bg; ghost→`--accent` bg); focus-visible (2px ring
+offset); active (primary→`--accent-pressed`); disabled (`opacity-50`, no pointer); loading
(leading `loader-2` spin + `aria-busy`, label stays); error n/a; selected (toggle buttons →
`bg-accent-subtle text-primary` + `check`); empty n/a. Icon-only buttons `min-h-11 min-w-11` +
`aria-label`.

### 6.6 Nav (top bar) — custom + shadcn `NavigationMenu`/`Sheet`

Sticky from `md` (`bg-background/95` solid — **no glass blur**, just a 1px bottom `--border`).
Items: Home · Topics · Creators · Search (`⌘K` hint). Active item: `text-primary` + 2px
under-rule (`--primary`) + 18px/stroke-2 icon (two channels). At `<md`, collapse to a `Sheet`
behind a `menu` icon (44px target). Focus-visible ring on every item; DOM order = visual order.

### 6.7 Separator / ScrollArea / Breadcrumb

`Separator` = 1px `--border`, used to divide reading column from slides and between dense list
groups (not between every row — rows separate by spacing, not rules). `ScrollArea` for the
transcript on very long posts and the command palette. `Breadcrumb` (sans, `caption`) on
topic/creator/post pages: `Home / Topics / {topic}` — last crumb `--foreground`, others
`--muted-foreground` links.

### 6.8 Toast / status — shadcn `Sonner`

Only for real events (copy succeeded, scrape error). Bottom-right, `bg-popover border-border`,
status icon from §5 brand semantics, auto-dismiss 4s (pauses on hover/focus). Reduced-motion →
fade only.

---

## 7. Media & Empty-Asset States

The source assets are slide images (`.jpg/.webp`) and OCR text; thumbnails are *proof*, never
decoration (thesis).

- **Aspect-ratio reserved** to prevent CLS: slide images render in a fixed `aspect-[9/16]`
  (reel/short portrait) or `aspect-[4/5]` (carousel) wrapper with `object-cover`; the box is
  reserved before load. List thumbs are fixed `56×56` `rounded-lg`.
- **Loading:** `--muted` fill + subtle shimmer (reduced-motion → static fill).
- **Alt classification:** (a) slide image that has OCR text → `alt=""` + `aria-hidden` (text is
  already in the OCR block, image is redundant proof); (b) slide with *no* OCR → `alt` = the
  caption's first line or "slide N of post"; (c) creator avatar → `alt="@handle"`.
- **No generic stock, ever.** When an asset is missing: render a typographic placeholder — the
  post title in serif on `bg-muted` with a 32px muted `image-off` glyph — never a stock photo or
  gradient block.
- **Video (`.mp4`):** not embedded/autoplayed; the source link handles playback. Optionally a
  poster frame as a static thumb with a `play` overlay icon linking out.

---

## 8. Motion

Restraint budget — utility only, no decorative motion (thesis).

- **Allowed:** state transitions ≤150ms (hover bg/color, focus ring), palette/sheet open
  120–180ms ease-out, toast slide+fade, skeleton shimmer.
- **Easing:** `cubic-bezier(0.2, 0, 0, 1)` (standard ease-out) for enters; `ease-in` 120ms for
  exits. One easing token, no springs/bounces.
- **Compositor-only:** animate only `opacity` and `transform`; never `width/height/top/left`.
- **Budget:** at most one animated affordance per interaction; the reading column never animates.
- **Reduced motion:** `prefers-reduced-motion: reduce` → all transforms/shimmer removed; palette
  and toast cross-fade only; spinners become static icons.

---

## 9. Forms

The only forms are search and (optionally) a settings/filter panel.

- **Single column**, labels visible and persistent above the field (placeholder is never the
  label — Tier 1 rule #6). Search uses a visible `<label class="sr-only-visually-but-present">`
  pattern only where a magnifier icon + `aria-label` already convey it; the `⌘K` palette has a
  visible "Search transcripts, topics, creators" placeholder *plus* an accessible label.
- **Expected widths:** search field `max-w-[560px]` in header, full-width in palette; filter
  selects `w-[200px]`.
- **Focus / tab order = DOM order** (Tier 1 rule #9); no `tabindex` > 0.
- **Errors:** co-located below the field, `role="alert"`, `--destructive` text + `octagon-alert`
  icon, message states problem *and* fix ("No results — try a creator handle or a topic").
- **Filter chips** reuse the Badge selected state (§6.3) with two-channel `check`.

---

## 10. Performance Budget

- **Fonts:** self-host Newsreader + Inter (variable) via `@fontsource-variable`, subset to
  Latin. `font-display: swap` for both. **Preload** Inter 400/500 and Newsreader 400/500 woff2
  (the four faces actually used above the fold). Fallback chain:
  `Inter, ui-sans-serif, system-ui, sans-serif` and
  `Newsreader, ui-serif, Georgia, "Times New Roman", serif`.
- **LCP element:** post-detail = the post title (display serif) + first transcript paragraph;
  keep both in initial HTML/route chunk, no layout shift (title box reserved). Target LCP <2.0s.
- **CLS:** all media boxes have reserved aspect-ratio (§7); fonts preloaded → no FOIT swap shift.
- **Static-first:** the wiki is generated/static — render lists server-side or at build time;
  hydrate only interactive islands (search palette, nav sheet). No client-side data fetch for the
  reading column.
- **Compositor-only animations:** hover bg/color, focus ring, palette/toast transform+opacity
  (listed §8) — nothing animates layout.
- **Images:** `loading="lazy"` + `decoding="async"` on all non-LCP images; prefer `.webp`.

---

## 11. Implementation Notes

- **Override discipline:** wrap shadcn/base styles in `@layer base`, app overrides in
  `@layer components`, utilities last — so Tailwind utilities win predictably. Use `:where()`
  for zero-specificity resets so component classes override cleanly.
- **Token source of truth:** this `:root` block (§0) is the *only* place colors are defined.
  Components reference `hsl(var(--token))` via Tailwind theme keys — no raw hex in JSX/CSS, no
  `gray-*`/`slate-*` Tailwind classes anywhere (would reintroduce raw-gray slop). Lint for it.
- **Radius:** only `--radius` (8px, → `rounded-lg`) and `rounded-full`. No per-component radii.
- **Shadow:** none. Elevation = surface lightness step + 1px `--border`. Do not add `shadow-*`.
- **Forced-colors layer:** add
  `@media (forced-colors: active) { :root { ... } }` that drops custom backgrounds, lets borders
  fall to `CanvasText`, and maps `--ring` to `Highlight`; do not override system colors elsewhere.
- **Icons:** import individual Lucide icons (tree-shake); set a global default
  `<LucideIcon strokeWidth={1.5} size={16} />` wrapper so the brand stroke token is enforced in
  one place.
- **`color-scheme: dark`** on `:root` so native controls (scrollbars, form widgets) render dark.
