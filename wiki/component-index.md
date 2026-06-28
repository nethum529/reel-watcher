# Component Index — runtime & sourcing

**Headless runtime: none (intentional).** This is a file://-hostable static wiki
(HashRouter, relative base, no server). To keep the bundle minimal and match the
existing dependency-light codebase, interactive components are hand-rolled on
`cva()` + tokens, following the WAI-ARIA APG patterns rather than pulling Radix
or Ark. shadcn's CSS-variable token convention is honored on `:root`
(`src/index.css`, DESIGN §0) so the visual contract matches a shadcn build.

| Concern | Implementation | Pattern / notes |
|---------|----------------|-----------------|
| App shell sidebar | `src/components/sidebar.tsx` | Persistent rail (264px lg / 72px md), warm-black material vs green content. |
| Mobile sidebar sheet | `src/components/sidebar.tsx` `MobileBar` | WAI-ARIA APG **Dialog (modal)** — focus trap, Esc, focus-return, scroll-lock, `aria-modal`. |
| Button / Badge / Input / Card / Separator | `src/components/ui/*` | shadcn shape, re-themed to tokens; `cva()` variants. |
| Icons | `src/components/icon.tsx` | **Lucide only**, `strokeWidth={ICON_STROKE_WIDTH=1.5}` token (2 for active nav). |
| Masthead / gold-leaf hairline | `src/components/masthead.tsx` + `.gold-leaf` util | The signature element (BRAND §3); appears once per page. |

**Invariants:** one icon set (Lucide); every color is `hsl(var(--token))` — no raw
hex / `gray-*` / `slate-*`; radius = `rounded-md` (6px) or `rounded-full` only; no
`shadow-*` (elevation = surface step + 1px border). Adding a headless runtime
requires updating this file.
