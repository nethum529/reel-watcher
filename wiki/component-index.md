# Component Index — runtime & sourcing

**Headless runtime: none (intentional).** This is a file://-hostable static wiki
(HashRouter, relative base, no server). To keep the bundle minimal and match the
existing dependency-light codebase, interactive components are hand-rolled on
`cva()` + tokens, following the WAI-ARIA APG patterns rather than pulling Radix
or Ark. shadcn's CSS-variable token convention is honored on `:root` (light) and
`.dark` (dark) in `src/index.css` (DESIGN §0) so the visual contract matches a
shadcn build. Style: **Swiss Brutalism** — square corners (radius 0), hard 1–2px
borders, flat fills, no shadows, no gradients.

| Concern | Implementation | Pattern / notes |
|---------|----------------|-----------------|
| App shell top bar | `src/components/top-bar.tsx` | Sticky 64/72px bar, 2px `--border` bottom rule; the horizontal Swiss masthead seam (DESIGN §6). |
| Mobile nav sheet | `src/components/top-bar.tsx` `MobileMenu` | WAI-ARIA APG **Dialog (modal)** — focus trap, Esc, focus-return, scroll-lock, `aria-modal`. |
| Theme system | `src/components/theme-provider.tsx` + `theme-toggle.tsx` | `localStorage['rw-theme']` + `.dark` on `<html>`; no-flash boot script in `index.html`; default LIGHT. |
| Button / Badge / Input / Card / Separator | `src/components/ui/*` | shadcn shape, re-themed to brutalism (square, hard border, flat); `cva()` variants. |
| Icons | `src/components/icon.tsx` | **Lucide only**, `strokeWidth={ICON_STROKE_WIDTH=2}` token (1.5 for dense rows). |
| Masthead (signature) | `src/components/masthead.tsx` | Left-locked eyebrow → Anton headline + single Orchid slab → 2px rule (BRAND §3); once per page. |

**Fonts (BRAND §7):** Anton (display) · Oswald Variable (condensed) · Inter
Variable (body) — all grotesque, self-hosted via `@fontsource`.

**Invariants:** one icon set (Lucide); every color is `hsl(var(--token))` — no raw
hex / `gray-*` / `slate-*`; radius = 0 (no `rounded-*` anywhere); no `shadow-*`
(elevation = surface step + hard border); accent TEXT uses `--accent-ink` (base
Orchid `--primary` is fill-only). Adding a headless runtime requires updating this
file.
