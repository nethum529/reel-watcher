# reel-watcher — Design System (DESIGN.md)

Implementation spec for a React + Vite + Tailwind + shadcn/ui build. Derives every value from
`BRAND_GUIDELINES.md`. A frontend-implementer should build the app from this file with no further
decisions. Where a number appears here, it is canonical — do not re-derive it.

Direction: **Japanese luxury** — gold-on-green, deep *ma*, centered content, a left sidebar shell,
and a dramatic landing. Dark is the only theme in v1.

---

## 0. shadcn `:root` token block (paste into `index.css`)

Values are HSL (space-separated) per shadcn convention; consume as `hsl(var(--token))`. Includes the
shadcn **sidebar** token set (the app shell uses `Sidebar`).

```css
@layer base {
  :root {
    /* surfaces */
    --background: 96 33% 12%;        /* #1C2814  deep green — the content area (mandated) */
    --foreground: 40 37% 92%;        /* #F2EDE3  warm parchment */
    --card: 89 35% 14%;              /* #243017  raised surface, input fill */
    --card-foreground: 40 37% 92%;
    --popover: 92 35% 17%;           /* #2A3A1C  overlays / command palette */
    --popover-foreground: 40 37% 92%;

    /* brand accent — gold leaf */
    --primary: 39 57% 48%;           /* #BF8E34 */
    --primary-foreground: 354 20% 10%;/* #1E1415 dark text on gold fill */

    /* recessed / secondary */
    --secondary: 89 30% 19%;         /* #313F22 */
    --secondary-foreground: 40 37% 92%;
    --muted: 89 30% 19%;             /* #313F22 */
    --muted-foreground: 71 9% 66%;   /* #ADB0A0 */
    --accent: 89 29% 21%;            /* #364526  shadcn hover-surface (NOT brand accent); darkened so meta clears AA on row hover */
    --accent-foreground: 40 37% 92%;

    /* status */
    --destructive: 6 65% 72%;        /* #E2897F */
    --destructive-foreground: 354 20% 10%;

    /* lines & focus */
    --border: 87 25% 24%;            /* #3F4D2E */
    --input: 87 25% 24%;             /* #3F4D2E */
    --ring: 39 57% 48%;              /* #BF8E34 */

    /* sidebar (shadcn Sidebar token set) — warm near-black rail */
    --sidebar-background: 354 20% 10%; /* #1E1415 */
    --sidebar-foreground: 71 9% 66%;   /* #ADB0A0  idle item */
    --sidebar-primary: 39 57% 48%;     /* #BF8E34  active item text/icon */
    --sidebar-primary-foreground: 354 20% 10%;
    --sidebar-accent: 51 39% 13%;      /* #2E2A14  active-item gold-subtle glow */
    --sidebar-accent-foreground: 39 57% 48%; /* #BF8E34 */
    --sidebar-border: 87 25% 24%;      /* #3F4D2E  the rail/content seam */
    --sidebar-ring: 39 57% 48%;        /* #BF8E34 */

    --radius: 0.375rem;              /* 6px — restrained, see §6 */
    color-scheme: dark;
  }

  /* app-level tokens (not part of base shadcn set) */
  :root {
    --green-well: 96 33% 9%;         /* #151E0F  deepest well */
    --gold-hover: 40 62% 57%;        /* #D6A84E  link hover + gold-on-popover text */
    --gold-pressed: 38 60% 39%;      /* #9E7328  pressed FILL (button active); dark label on top */
    --gold-pressed-text: 38 60% 47%; /* #C08B30  pressed link TEXT on --gold-subtle (4.79:1) */
    --gold-subtle: 51 39% 13%;       /* #2E2A14  selected/active tint */
    --gold-foreground: 354 20% 10%;  /* #1E1415  text on gold fill */
    --placeholder: 75 7% 57%;        /* #95998A  clears AA on the --card input fill (4.77:1) */
    --border-strong: 86 22% 31%;     /* #51603D */
    --success: 119 28% 65%;          /* #8FBF8E */
  }
}
```

Tailwind: extend `theme.colors` to read these (`background: "hsl(var(--background))"`, etc.) plus a
`sidebar` color group, per the standard shadcn config. **Gold-on-popover rule (Brand §10):** base
gold text fails AA on `--popover`; any gold text inside a popover/command/dropdown surface must use
`text-[hsl(var(--gold-hover))]` (apply a `.on-popover` utility). Base gold is fine as fill, hairline,
or focus ring on any surface.

**Radius discipline (two tokens carry meaning):** `--radius` = **6px** (`rounded-md`) for
interactive surfaces (buttons, inputs, cards); **`rounded-full`** for badges/tags and avatars only.
Nothing else. Luxury restraint favors near-square corners — do not raise to `xl`.

**Shadow:** none anywhere. Elevation = surface lightness step + 1px `--border`. Never add `shadow-*`.

---

## 1. Type Scale

Named ratio: **Major Third (1.25)**, tuned for screen. Base UI = 16px; reading body = 19px serif.
The hero sits above the scale as a fluid display step (the signature gold-leaf moment).

| Step | px / rem | Family · weight | Line-height | Tracking | Use |
|------|----------|------------------|-------------|----------|-----|
| hero | clamp(56→104) | Fraunces 300 | 1.0 | -0.02em | Landing masthead only |
| display | clamp(40→52) | Fraunces 400 | 1.05 | -0.02em | Page masthead (wiki-home, topic, creator, post) |
| h2 | 31 / 1.9375 | Newsreader 500 | 1.15 | -0.01em | Section headers, in-page group titles |
| h3 | 25 / 1.5625 | Newsreader 500 | 1.25 | -0.01em | Sub-section, grouped list headers |
| title | 20 / 1.25 | Newsreader 500 | 1.3 | -0.005em | Post title in lists/cards |
| read | 19 / 1.1875 | Newsreader 400 | 1.75 | 0 | **Transcript reading body** (subordinate signature) |
| body | 16 / 1.0 | Inter 400 | 1.6 | -0.011em | UI body, descriptions |
| label | 14 / 0.875 | Inter 500 | 1.45 | 0 | Sidebar items, badges, metadata, input text |
| caption | 13 / 0.8125 | Inter 400 | 1.4 | 0 | Counts, secondary metadata |
| overline | 12 / 0.75 | Inter 600 | 1.3 | +0.18em, uppercase | Eyebrows above mastheads ("ARCHIVE", "TOPIC") |
| micro | 12 / 0.75 | Inter 400 (tnum) | 1.3 | 0 | View counts, dates in dense rows |

Canonical reconciliation: reading measure **66ch**; centered content column max **68ch** for text,
**56ch** for masthead/heading blocks. Tabular figures on all numeric metadata (`"tnum" 1`). `hero`
and `display` are the **only** fluid (`clamp`) steps — everything else is stepped to keep the
editorial scale exact.

---

## 2. Spacing (generous *ma*)

8pt base scale. Use only these steps:

`4 · 8 · 12 · 16 · 24 · 32 · 48 · 64 · 96 · 128 · 160` (px) → Tailwind `1 2 3 4 6 8 12 16 24 32 40`.

Semantic gap tokens (section gap is **≥2×** component gap; luxury *ma* runs deliberately large):

| Token | px | Use |
|-------|----|----|
| gap-inline | 8 | icon↔label, badge internal |
| gap-component | 16 | within a card / list row, label↔control |
| gap-content | 24 | between stacked content blocks |
| gap-group | 64 | between subsections within a page |
| gap-section | 128 (desktop) / 80 (mobile) | between major page sections |
| gap-masthead | 96 (desktop) / 56 (mobile) | below a page masthead before content begins |

Reading-column rhythm: transcript paragraphs get `margin-block: 18px`; OCR-slide blocks get
`gap-content` (24) from the transcript. The gold-leaf hairline below a masthead has `margin-block:
24px`. *Ma* is the brand — when unsure, choose the larger gap.

---

## 3. Responsive Contract

Tailwind breakpoints, mobile-first.

| Name | Min width | Layout intent |
|------|-----------|---------------|
| (base) | 0 | single centered column; sidebar collapses to a `Sheet` behind a `menu` button |
| `sm` | 640 | unchanged single column, wider margins |
| `md` | 768 | **persistent sidebar appears as a 72px icon rail**; content centered in remaining width |
| `lg` | 1024 | **sidebar expands to 264px** (icon + label); content column centers at full measure |
| `xl` | 1280 | content frame caps; column stays at measure, extra width becomes margin (*ma*) |

- **Fluid vs stepped:** spacing and grid columns step at breakpoints; type is stepped **except**
  `hero` and `display` (`clamp`). No muddy in-between body sizes.
- **Mid-range (768–1024):** the awkward zone. Sidebar is the **72px icon rail** here (labels appear
  only `lg+`); the centered content column never exceeds its measure — extra width is margin, not
  text width. Index grids stay **2-col** here (3-col only at `lg+` and only if content is co-equal).
- **Gap scale-down:** `gap-section` 128→80 below `md`; `gap-masthead` 96→56 below `md`; `gap-group`
  64→40 below `md`. Component/content gaps are constant.
- **Touch:** at `<md`, treat as touch — all targets ≥44px, no hover-only affordances; the sidebar is
  a full-height `Sheet`.
- **Landing (`#/`)** is full-bleed at every breakpoint with no sidebar (see §13).

---

## 4. Section Cadence Map

Density varies by content so the app breathes (anti-test: not every section is the same padding +
grid). Centered does **not** mean uniform — the dominant element per page is set out alone in *ma*,
then content tightens.

| Page · section | Density tier | Rationale |
|----------------|--------------|-----------|
| **Landing** · hero | Sparse-extreme | One gold-leaf masthead in full-viewport *ma*; the dominant element of the whole product. Nothing competes. |
| **Wiki-home** · masthead + global search | Sparse | Centered "ARCHIVE" overline → display title → gold hairline → one search field (largest interactive element). |
| **Wiki-home** · Topics index | Medium | Centered grid of topic name + count cards; co-equal content, so a real grid is honest. |
| **Wiki-home** · Recent posts | Medium-dense | Centered vertical list of recent post rows (serif title + creator + date + counts); reading-forward, not tiles. |
| **Topic** · masthead | Sparse | Overline "TOPIC" → topic name (display) → count + one-line note → hairline; lots of air. |
| **Topic** · post list | Dense | The work happens here — a tight centered vertical list of post rows; minimal per-row chrome. |
| **Creator** · masthead | Sparse | Avatar + @handle (display) + platform + post count + link-out, centered. |
| **Creator** · post list | Dense | Same dense centered list as topic. |
| **Post detail** · masthead | Medium | Title (display serif) + centered metadata row (creator, date, views, source link) + hairline. |
| **Post detail** · reading column | **Sparse + dominant** | The subordinate signature. Generous leading, 66ch, centered, ≥2× weight of all else. |
| **Post detail** · slides/OCR + source | Subordinate | Below the read; muted, small, never upstaging. |
| **Search** · query bar | Sparse | Command-palette focus; one centered field owns the viewport top. |
| **Search** · results | Dense | Result rows with matched-term highlight; built for fast scanning. |

No two adjacent sections share padding + grid; the cadence alternates sparse → dense deliberately.

---

## 5. Information Architecture

Goal (a personal KB) = **find and re-read a saved idea fast.** Routes:

| Route | Page | Sidebar? |
|-------|------|----------|
| `#/` | Landing (dramatic entry) | **No** |
| `#/wiki` | Wiki home (Topics + Recent) | Yes |
| `#/search` | Search | Yes |
| `#/topic/:tag` | Topic — posts under a tag | Yes |
| `#/creator/:creator` | Creator — posts from a creator | Yes |
| `#/post/:id` | Post detail (reading column) | Yes |

Obstacle → answer map:

- **"I remember a reel but not where."** → global search reachable from every wiki page (sidebar
  Search item + `⌘K` palette). Answered first, everywhere.
- **"What did I save about X?"** → Topics (wiki-home) → Topic page list.
- **"What does this creator post?"** → Creator page from any post's metadata.
- **"What did this video actually say?"** → Post-detail reading column = the payoff.
- **"I want the original."** → source link + platform/date always in post metadata.

Per-page question → dominant element:

| Page | Question it answers | Dominant element |
|------|--------------------|------------------|
| Landing | "What is this / how do I enter?" | The gold-leaf hero + single Enter affordance |
| Wiki-home | "Where do I start / what's new?" | Global search field, then Topics + Recent |
| Topic | "Everything I saved about this subject" | Dense post list (under its masthead) |
| Creator | "Everything from this creator" | Creator masthead + dense post list |
| Post detail | "What did this video say?" | **Reading column** |
| Search | "Find the one I'm thinking of" | Query field → ranked result rows |

Every page leads with exactly one dominant element (hierarchy gate). Sidebar order = Wiki · Topics ·
Creators · Search — matches obstacle frequency.

---

## 6. Sidebar (the app shell) — shadcn `Sidebar`

The persistent left rail on all wiki routes. Built on shadcn `Sidebar` + `SidebarProvider`. Warm
near-black (`--sidebar-background` `#1E1415`) against the green content well — the material change
*is* the separation of concerns (nav rail vs content). Seam = 1px `--sidebar-border` (`#3F4D2E`); no
shadow, no gradient.

### Dimensions & structure

- **Width:** 264px at `lg+` (icon + label); **72px icon rail** at `md`; full-height `Sheet` at `<md`
  behind a 44px `menu` trigger in a slim top bar.
- **Layout (top → bottom):** brand lockup → primary nav group → (spacer / *ma*) → utility footer.
  - **Brand lockup:** small Fraunces 400 wordmark "reel-watcher" at 18px (the one place display type
    appears small, as a logotype) above a 1px gold-leaf hairline; links to `#/`. Hidden to an icon
    glyph in the 72px rail.
  - **Primary nav group** (`SidebarMenu`): four `SidebarMenuItem`s, each an `<a>` with a 16px Lucide
    icon + `label` (14px Inter 500):
    - Wiki → `house` → `#/wiki`
    - Topics → `tags` → `#/wiki#topics` (anchors to the Topics section / index)
    - Creators → `users` → first-class creators index (`#/wiki#creators`)
    - Search → `search` → `#/search` (with a right-aligned `⌘K` `kbd` hint, `caption`, muted)
  - **Utility footer:** "Back to landing" → `arrow-left` → `#/`; muted, `caption`.

### Item states (all nine)

- **default:** `--sidebar-foreground` (`#ADB0A0`) text + icon (stroke 1.5), transparent bg.
- **hover:** bg `--sidebar-accent` (`#2E2A14`), text → `--foreground`, icon → gold.
- **focus-visible:** 2px `--sidebar-ring` (gold) + 2px offset; 6.12:1 on the rail.
- **active (current route):** bg `--sidebar-accent` (`#2E2A14`) + **2px gold left rule** (inset-inline-
  start) + text/icon `--sidebar-primary` (gold) + icon **stroke 2**. Three channels (color + rule +
  weight) so it never relies on color alone. `aria-current="page"`.
- **active+hover:** same as active; bg stays, no extra change.
- **disabled:** n/a (all destinations always exist).
- **loading:** n/a (static nav).
- **error:** n/a.
- **empty/skeleton:** n/a — nav is static; on first paint it is fully present (no skeleton).

### Behavior

- Collapses 264px→72px at `md`; toggling is **not** user-controllable in v1 (breakpoint-driven only —
  one fewer control, more *ma*).
- DOM order = visual order = tab order. The rail is `<nav aria-label="Primary">`.
- At `<md` the `Sheet` traps focus, closes on Esc, returns focus to the `menu` trigger, scroll-locks
  behind it (Tier 1 modal contract).

---

## 7. Content Layout (centered, per page type)

All wiki content sits in the area right of the sidebar, in a **centered column**. The column is
centered within the content area (`margin-inline: auto`), not within the full viewport — so it stays
optically centered as the rail width changes. Headings, mastheads, and the hero are centered;
running text inside the reading column is left-aligned within its centered measure (centered *body*
text is unreadable — Brand §7 / Tier-1 readability).

| Page type | Column max-width | Alignment | Notes |
|-----------|------------------|-----------|-------|
| Wiki-home | 880px frame; masthead 56ch | masthead centered; grids centered | search field `max-w-[560px]`, centered |
| Topic / Creator | 760px frame | masthead centered; list centered | dense list rows left-aligned text within the centered column |
| Post detail | 66ch reading column | masthead centered; **body left-aligned** | metadata row centered under title; transcript left-aligned |
| Search | 720px frame | query centered; results centered | result rows left-aligned text within the centered column |

**Masthead pattern (every wiki page):** centered overline (12px, +0.18em, uppercase, muted) →
centered display title (Fraunces) → optional centered subline (count / note, `caption`) → centered
**gold-leaf hairline** (1px, `#BF8E34`, width `clamp(48px, 12vw, 120px)`, `margin-inline: auto`).
Then `gap-masthead` before content. The hairline is the recurring signature; it appears **once** per
page, only here.

Vertical page padding: `gap-section` top of the content area below any top bar; content blocks
separated by `gap-group`.

### Lucide icon sizing table

| Context | Size | Stroke |
|---------|------|--------|
| sidebar item / inline with label | 16px | 1.5 |
| buttons | 16px | 1.5 |
| active sidebar item / emphasis | 16px | 2 |
| dense list-row meta | 14px | 1 |
| empty-state glyph | 32px | 1.5 |
| landing Enter affordance arrow | 20px | 1.5 |

---

## 8. Components (shadcn mapping + 9 states each)

All map to shadcn/ui primitives. Each interactive component defines nine states: **default, hover,
focus-visible, active/pressed, disabled, loading, error, selected, empty/skeleton** (n/a where it
cannot apply). Every color-coded state carries a second channel (icon/border/underline/label).

### 8.1 Post row (the workhorse) — `<a>` wrapping a flex row

- Layout: serif `title` on top; below, sans `caption` meta — `@creator · platform · relative date ·
  {N} views`. No thumbnail tile by default; an optional 56×56 `rounded-md` slide thumb may sit left
  at subordinate weight. Text left-aligned within the centered column.
- **default:** title `--foreground`, meta `--muted-foreground`, transparent bg.
- **hover:** bg `--accent` (`#364526`), title gold underline, cursor pointer. (Meta stays
  `--muted-foreground` `#ADB0A0` → 4.66:1 on this hover surface.)
- **focus-visible:** 2px gold ring + 2px offset, no bg change required.
- **active/pressed:** bg `--gold-subtle`, title `--gold-pressed-text` (`#C08B30`, 4.79:1 on
  `--gold-subtle`) + underline.
- **disabled:** n/a (rows always navigate).
- **loading:** skeleton (see empty).
- **error:** transcript failed to scrape → inline `octagon-alert` (14px) + "transcript unavailable"
  in `--destructive`; row still links.
- **selected (keyboard/search nav):** 2px gold left rule + `--gold-subtle` bg.
- **empty/skeleton:** two shimmer bars (title 60%, meta 30%), `--muted` fill, no spinner.

### 8.2 Card — shadcn `Card`

Topic/creator index tiles only (never around the reading column). `bg-card`, `border border-border`,
`rounded-md`, **no shadow**. Centered content inside the tile is acceptable here (short name +
count). States mirror the post row (hover → `--accent` bg + gold name underline, focus ring,
selected → gold left rule). Empty → skeleton card.

### 8.3 Badge / Tag — shadcn `Badge`

Topics/hashtags on a post. `rounded-full`, Inter `label` (12px in dense rows), `bg-muted`
`text-muted-foreground`, `border border-border`. Interactive (links to topic): hover →
`text-foreground` + border `--border-strong`; focus ring; active → `--gold-subtle` bg. Selected
(active filter) → `bg-[--gold-subtle] text-primary border-primary` + 12px `check` icon (two-channel).
Disabled n/a; no loading/error/empty.

### 8.4 Search input + Command — shadcn `Input` + `Command`

- Header/landing-page search = `Input`, `bg-card` fill (so the field is distinct from `--background`
  without leaning on border contrast), leading `search` icon (16/1.5). Global palette = `Command`
  dialog on `⌘K` / `Ctrl K`, surface `--popover`.
- **default:** `bg-card`, `border-border`, placeholder `--placeholder` `#95998A` (4.77:1 on the
  `--card` fill — measured against the fill it renders on, not `--background`).
- **hover:** border `--border-strong`.
- **focus-visible:** border `--primary` + 2px gold ring/offset; placeholder stays ≥4.5:1.
- **active/typing:** caret `--primary` (gold).
- **disabled:** `opacity-50`, `cursor-not-allowed`.
- **loading:** trailing `loader-2`, 16px, spin (reduced-motion → static `loader`).
- **error:** n/a for search.
- **selected (result highlighted in palette):** row `--accent` bg + 2px gold left rule; matched
  substring in `<mark>` (bg `--gold-subtle`, text **`--gold-hover`** — palette is on `--popover`, so
  gold text uses the hover step per Brand §10). `<mark>` semantics + color = two channels.
- **empty:** "No results for '<query>'" centered, `search-x` 32/1.5 muted, plus a fix hint.

### 8.5 Button — shadcn `Button`

Primary use is minimal (landing Enter, source link-out, "copy transcript"). Variants:

- **primary** (`bg-primary text-primary-foreground` — gold fill, warm-black label, 6.12:1): at most
  once per view.
- **secondary** (`bg-secondary text-secondary-foreground border-border`).
- **ghost** (transparent, `text-muted-foreground`, hover `bg-accent text-foreground`): default for
  icon actions.
- **link** (gold text + underline-on-hover): the landing "Enter" and inline source links.

States: default; hover (primary→`--gold-hover` bg; ghost→`--accent` bg); focus-visible (2px gold ring
+offset); active (primary→`--gold-pressed` bg); disabled (`opacity-50`, no pointer); loading (leading
`loader-2` spin + `aria-busy`, label persists); error n/a; selected (toggle → `bg-[--gold-subtle]
text-primary` + `check`); empty n/a. Icon-only buttons `min-h-11 min-w-11` + `aria-label`.

### 8.6 Breadcrumb / Separator / ScrollArea

`Breadcrumb` (Inter `caption`, centered under the masthead on topic/creator/post): `Wiki / Topics /
{topic}` — last crumb `--foreground`, others `--muted-foreground` gold-on-hover links. `Separator` =
1px `--border` to divide reading column from slides and between dense list groups (not between every
row — rows separate by spacing). The gold-leaf hairline is **not** a `Separator`; it is the masthead
signature and is gold, used once per page (§7). `ScrollArea` for very long transcripts and the palette.

### 8.7 Toast / status — shadcn `Sonner`

Real events only (copy succeeded, scrape error). Bottom-right, `bg-popover border-border`, status
icon from Brand §5 (gold-hover text if any gold appears, since the surface is `--popover`),
auto-dismiss 4s (pauses on hover/focus). Reduced-motion → fade only.

---

## 9. Media & Empty-Asset States

Source assets are slide images (`.jpg/.webp`) + OCR text; thumbnails are *proof*, never decoration.

- **Aspect-ratio reserved** (CLS): slide images in a fixed `aspect-[9/16]` (reel/short) or
  `aspect-[4/5]` (carousel) wrapper with `object-cover`, reserved before load. List thumbs fixed
  `56×56` `rounded-md`.
- **Loading:** `--muted` fill + subtle shimmer (reduced-motion → static fill).
- **Alt classification:** (a) slide with OCR text → `alt=""` + `aria-hidden` (text already in the OCR
  block); (b) slide with no OCR → `alt` = caption's first line or "slide N of post"; (c) creator
  avatar → `alt="@handle"`.
- **No generic stock, ever.** Missing asset → typographic placeholder: the post title in Newsreader
  on `bg-muted` with a 32px muted `image-off` glyph. Never a stock photo, gradient, or blob.
- **Video (`.mp4`):** not embedded/autoplayed; source link handles playback. Optional poster frame
  as a static thumb with a `play` overlay icon linking out.

---

## 10. Motion

Restraint budget — quiet, intentional, utility-first (Brand thesis). Luxury motion is slow and few.

- **Allowed:** state transitions ≤150ms (hover bg/color, focus ring); palette/sheet open 160–200ms
  ease-out; toast slide+fade; skeleton shimmer; the **landing entrance** (§13).
- **Easing:** `cubic-bezier(0.2, 0, 0, 1)` (ease-out) for enters; `ease-in` 120ms for exits. One
  easing token; no springs, no bounce.
- **Compositor-only:** animate only `opacity` and `transform`; never `width/height/top/left`.
- **Budget:** at most one animated affordance per interaction; the reading column never animates; the
  gold-leaf hairline never animates after first paint.
- **Reduced motion:** `prefers-reduced-motion: reduce` → all transforms/shimmer removed; palette,
  toast, and the landing cross-fade only (no translate/scale); spinners become static icons.

---

## 11. Forms

The only forms are search and (optionally) a filter panel.

- **Single column**, labels visible and persistent above the field (placeholder is never the label —
  Tier 1 #6). The header/landing search uses a visible `aria-label` + the magnifier icon; the `⌘K`
  palette shows a visible "Search transcripts, topics, creators" placeholder *and* an accessible label.
- **Expected widths:** header/landing search `max-w-[560px]` (centered); palette full-width; filter
  selects `w-[200px]`.
- **Focus / tab order = DOM order** (Tier 1 #9); no `tabindex` > 0.
- **Errors:** co-located below the field, `role="alert"`, `--destructive` text + `octagon-alert`,
  message states problem *and* fix ("No results — try a creator handle or a topic").
- **Filter chips** reuse the Badge selected state (§8.3) with two-channel `check`.

---

## 12. Performance Budget

- **Fonts:** self-host Fraunces + Newsreader + Inter (variable) via `@fontsource-variable`, subset to
  Latin. `font-display: swap`. **Preload** Inter 400/500, Newsreader 400/500, and **Fraunces 400**
  (the masthead — above the fold on every page). Fraunces 300 (landing hero) is preloaded **only on
  the landing route**. Fallback chains:
  - Sans: `Inter, ui-sans-serif, system-ui, sans-serif`
  - Reading: `Newsreader, ui-serif, Georgia, "Times New Roman", serif`
  - Display: `Fraunces, ui-serif, Georgia, serif`
- **LCP element:** wiki-home = the display masthead; post-detail = the post title (display) + first
  transcript paragraph; **landing = the Fraunces hero** (preload Fraunces 300/400 + reserve its box,
  target LCP <2.0s). Keep LCP text in the initial route chunk.
- **CLS:** all media boxes have reserved aspect-ratio (§9); fonts preloaded; the masthead title box
  is reserved so the hairline below it does not jump on font swap.
- **Static-first:** the wiki is generated/static — render lists at build time; hydrate only
  interactive islands (search palette, sidebar `Sheet`, landing entrance). No client fetch for the
  reading column.
- **Compositor-only animations** only (§10) — nothing animates layout.
- **Images:** `loading="lazy"` + `decoding="async"` on all non-LCP images; prefer `.webp`.

---

## 13. Landing Page (`#/`) — the dramatic entry

Full-screen, cinematic, gold-on-warm-black, maximum *ma*. **No sidebar.** One arresting type moment
+ one Enter affordance. This is the product's dominant element overall.

- **Surface:** full-bleed `--sidebar-background` (`#1E1415`, warm near-black) — the deepest material,
  distinct from the green wiki it gates. Optional single faint `--green-well` band is **not** used
  (no gradient/blob — thesis). The whole viewport is the warm-black well.
- **Composition (centered, vertical stack in the viewport center, generous *ma* above and below):**
  1. **Overline:** "PERSONAL ARCHIVE" — Inter 600, 12px, +0.18em, uppercase, `--muted-foreground`.
  2. **Hero masthead:** the `hero` step — Fraunces 300, `clamp(56px→104px)`, `--foreground`
     (`#F2EDE3`, 15.4:1 on warm-black). Word: **"reel-watcher"** (or the collection's name). One line
     at `lg+`; may wrap to two centered lines below `sm`. This is the gold-leaf moment.
  3. **Gold-leaf hairline:** 1px, `#BF8E34`, `clamp(64px→160px)` wide, centered, `margin-block: 32px`
     — the single gold accent (6.12:1 on warm-black, ≥3:1 UI element).
  4. **Subline (one quiet concrete line, no tagline):** e.g. "142 transcripts · 23 topics · 11
     creators" — Newsreader 400, 19px, `--muted-foreground`. Real counts, never a slogan.
  5. **Enter affordance:** a `link`/`primary`-restraint button "Enter the archive" → `#/wiki`, gold
     text + trailing `arrow-right` (20/1.5); hover → `--gold-hover` + underline; focus → 2px gold ring
     (6.12:1). ≥44px tall. This is the only interactive element above the fold.
- **Hierarchy:** the hero is ≥2× the visual weight of everything else (it is the largest element by
  far). Nothing else competes — no nav, no cards, no second CTA.
- **Entrance motion (the one allowed flourish):** on load, overline → hero → hairline (drawn from
  center, scaleX) → subline → Enter fade-and-rise (`opacity` 0→1, `translateY` 8px→0), staggered
  ~80ms, total ≤700ms, ease-out. **Reduced motion:** simple cross-fade, no translate, no hairline draw.
- **Keyboard/skip:** Enter affordance is the first and primary focus stop; a visually-hidden "Skip to
  archive" is unnecessary (one destination). Pressing Enter/Return when the affordance is focused
  navigates.
- **No sidebar, no top bar, no footer chrome** — just the warm-black field, the type, and the gold rule.

---

## 14. Implementation Notes

- **Override discipline:** shadcn/base styles in `@layer base`, app overrides in `@layer components`,
  utilities last — so Tailwind utilities win predictably. Use `:where()` for zero-specificity resets.
- **Token source of truth:** the `:root` block (§0) is the *only* place colors are defined. Components
  reference `hsl(var(--token))` via Tailwind theme keys — **no raw hex in JSX/CSS**, no `gray-*`/
  `slate-*` Tailwind classes anywhere (reintroduces raw-gray slop). Lint for both.
- **Gold-on-popover enforcement:** ship a `.on-popover { color: hsl(var(--gold-hover)); }` (or a
  Tailwind `text-gold-hover`) and apply it to every gold text node inside `Command`/`Popover`/
  `DropdownMenu`/`Sonner`. CI/lint rule: gold base text is forbidden inside popover containers.
- **Radius:** only `--radius` (6px → `rounded-md`) and `rounded-full`. No per-component radii.
- **Shadow:** none. Elevation = surface lightness step + 1px `--border`. Do not add `shadow-*`.
- **Sidebar:** use shadcn `SidebarProvider`/`Sidebar` with the `--sidebar-*` tokens (§0); collapse
  mode is `icon` (breakpoint-driven), not a persisted user toggle in v1.
- **Forced-colors layer:** `@media (forced-colors: active) { ... }` drops custom backgrounds, lets
  borders fall to `CanvasText`, maps `--ring` and the active-nav rule to `Highlight`, and renders the
  gold-leaf hairline as a `CanvasText` rule; do not override system colors elsewhere.
- **Icons:** import individual Lucide icons (tree-shake); a global wrapper sets the brand stroke
  token (`<Icon strokeWidth={1.5} size={16} />`) so stroke is enforced in one place; pass
  `strokeWidth={2}` only for the active sidebar item.
- **`color-scheme: dark`** on `:root` so native controls (scrollbars, form widgets) render dark.
