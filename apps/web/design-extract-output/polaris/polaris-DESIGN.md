# Polaris admin look, on the BizOS shadcn layer

Source: `@shopify/polaris-tokens@9.4.2` (pure tokens, no React). We adopt Polaris's
**shape, density, type and elevation**. We keep the existing BizOS **green color
palette** (cream/green light, navy/green dark). Polaris React components are NOT
installed — they peer-depend on React 18 and the app runs React 19 / Next 16.

## The four things that make it read as "Polaris admin"

1. **Tight radii.** Controls (button, input, select) at 8px, cards at 12px.
   Not the old 16px-everywhere. Driven by `--radius: 0.5rem` for controls; cards
   use `rounded-xl` (12px).
2. **Flat elevation.** Resting cards are a 1px hairline + `shadow-100`
   (`0 1px 0 rgba(26,26,26,.07)`). No clay/bevel. Heavier shadows only for
   overlays (menus 300, dialogs 400, modals 600).
3. **Dense type.** Body is 13px/20px. Headings are semibold/bold with slightly
   negative letter-spacing. Section titles are 14px semibold, not 16px.
4. **Calm, square surfaces.** 1px borders everywhere, generous 16px card padding,
   6px table cells.

## Token mapping (Polaris primitive -> BizOS token)

| BizOS token        | Polaris value                        |
| ------------------ | ------------------------------------ |
| `--radius`         | `0.5rem` (control radius-200, 8px)   |
| card radius        | `rounded-xl` => 12px (radius-300)    |
| `--shadow-xs/2xs`  | `--p-shadow-100`                     |
| `--shadow-sm`      | `--p-shadow-200`                     |
| `--shadow-md`      | `--p-shadow-300`                     |
| `--shadow-lg`      | `--p-shadow-400`                     |
| `--shadow-xl`      | `--p-shadow-500`                     |
| `--shadow-2xl`     | `--p-shadow-600`                     |
| `--shadow-clay`    | neutralized to `--p-shadow-100`      |
| `--tracking-normal`| `0` (Polaris body letter-spacing)    |

Colors (`--primary`, `--background`, all `*-foreground`) are unchanged.

## Component anatomy notes

- **Button.** Medium height ~32px, 8px radius, medium weight. Primary = solid
  green. Secondary/outline = surface fill + 1px border + subtle inset
  (`--p-shadow-100`). No drop shadow on flat/ghost.
- **Card.** 1px border, 12px radius, `--p-shadow-100`, 16px padding, 16px gap.
  Title 14px semibold. Footer is a bordered muted strip.
- **Input / Select.** 1px border, 8px radius, 2px focus ring in `--ring`.
- **Table.** 6px cell padding, 1px row borders, semibold 12px header.

## How it is wired

- `app/globals.css` imports `design-extract-output/polaris/polaris-tokens.css`
  (the `--p-*` primitive layer) and remaps the shape/density tokens in `:root`.
- Restyled primitives so far: `card.tsx`, `button.tsx`, `badge.tsx`, `table.tsx`,
  `input.tsx`, `select.tsx`, `textarea.tsx`, `tabs.tsx`, `dialog.tsx`,
  `alert-dialog.tsx`, plus `shared/page-header.tsx`. Shadows rolled through
  `:root`, `.dark`, `.warm`. Gray app surface + dense `text-*` scale in `:root`.
- Shell pass: `app-sidebar.tsx`, `sidebar-nav-item.tsx`, `top-bar.tsx`,
  `main-content-chrome.tsx` — Polaris density, subtle nav active state, card top bar.
- Dashboard/marketplace feature cleanup: flat cards, no clay/hover-lift.
- POS app-window header on `pos-register-screen.tsx`.
- Feature audit pass: removed hover-lift on `dashboard-stat-card.tsx`; tightened
  avatar/icon tiles (account, team) and the inventory dropzone from `rounded-2xl`
  to `rounded-lg` (8px), logo preview to `rounded-xl` (12px). Left the decorative
  `auth-brand-panel` mock and `.boron` overrides untouched.
- This overrides the repo rule "never hand-edit `components/ui/`" — deliberate,
  because the Polaris look is a design-system decision. Edits are minimal and
  isolated so they survive / are easy to re-apply after a shadcn update.

## Remaining (next passes)

- optional: tonal Polaris badge variants (success/warning/info subdued fills)
- list pages: overflow menu (⋯) and bulk action toolbar pattern
