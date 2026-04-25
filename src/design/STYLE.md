# Brutalist Style Guide

Single source of truth for the new visual language. Every primitive in
`src/components/ui/` and every existing component being migrated off MUI
should match these rules exactly. If something is not listed here, it
does not exist in the system.

## Principles

- **Honest, not decorative.** No gradients, no soft shadows, no rounded
  corners. The chrome must not compete with the colorful surface (the
  graph) it frames.
- **Monochrome with a single accent.** Black on white. One blue accent
  (`#4ed1f8`). One error red (`#ff3030`). Nothing else.
- **Sharp edges.** Border-radius is `0` everywhere. Hover lift is a hard
  offset shadow with no blur.
- **Linear motion only.** No easing curves. Brutalism rejects organic
  movement.
- **Type as structure.** Space Grotesk for UI; JetBrains Mono for code
  and code-adjacent labels. The app is a code editor — mono labels
  reinforce the medium.

## Color

| Role    | Token           | Value     | Usage                                    |
| ------- | --------------- | --------- | ---------------------------------------- |
| Foreground | `COLORS.fg`  | `#000`    | Default text and borders                 |
| Background | `COLORS.bg`  | `#fff`    | Default surface                          |
| Accent  | `COLORS.accent` | `#4ed1f8` | Selection, focus highlight, active state |
| Error   | `COLORS.error`  | `#ff3030` | Destructive actions, error text          |
| Muted   | `COLORS.muted`  | `#666`    | Secondary text, disabled state           |

**Do**

- Reach for `fg` and `bg` first.
- Use `accent` for *one* thing per surface (the active item, the focus ring, etc.).
- Use `error` only for genuine error states.

**Do not**

- Introduce new hex values.
- Use `accent` and `error` together on the same control.
- Add semi-transparent overlays.

## Typography

Type stack:

- UI: `"Space Grotesk", system-ui, sans-serif`
- Mono: `"JetBrains Mono", ui-monospace, monospace`

Sizes (px):

| Token   | Size | Use                                  |
| ------- | ---- | ------------------------------------ |
| h1      | 32   | Page title (rare)                    |
| h2      | 24   | Section heading                      |
| h3      | 20   | Subsection                           |
| h4      | 16   | Inline heading                       |
| body    | 14   | Default body / form labels           |
| caption | 12   | Helper text, metadata                |

Weights: 400, 600, 700 (Space Grotesk — 800 is not published for this
family, 700 is the documented "Bold") and 400, 600 (JetBrains Mono).

Labels use `text-transform: uppercase`, `letter-spacing: 0.05em`,
`font-weight: 600`, `font-size: 12px`.

**Do**

- Match a size to one of the tokens above.
- Use mono for code, command keys (kbd), and short metadata where the
  monospaced rhythm communicates "this is data, not prose".

**Do not**

- Italicize. Italic is not in the system.
- Use weights other than the ones above.

## Spacing

Scale (px): `4, 8, 16, 24, 32`.

Tokens: `xs=4, sm=8, md=16, lg=24, xl=32`.

**Do**

- Compose paddings/margins from these values only.
- Default to `md` when uncertain.

**Do not**

- Use arbitrary `10`, `12`, `20` values.

## Borders

- Thin: `1px solid #000` (default)
- Thick: `2px solid #000` (focus, emphasized container)
- Radius: `0` (always)

**Do not**

- Round any corner, ever.
- Use a non-black border color in chrome (data viz inside the graph
  surface is exempt).

## Shadows

- Hover: `2px 2px 0 0 #000` (hard offset, no blur)
- No other shadows exist.

## Motion

- Duration: `80ms`
- Easing: `linear`
- Properties allowed to transition: `background-color`, `color`,
  `border-color`, `box-shadow`, `transform` (translate only).

**Do not**

- Animate `opacity` for fades longer than the duration above.
- Use `ease`, `ease-in`, `ease-out`, or `cubic-bezier`.

## Focus

- Focus ring: `2px solid #000` outline, offset `2px`.
- For accent contexts where black would disappear, use `#4ed1f8`.
- Never remove `:focus-visible` styling.

## Base UI version

This project pins `@base-ui-components/react` for primitive composition.

**Pin policy**

- Use the caret-pinned current latest at install time.
- Treat minor upgrades as routine; major upgrades require a tracking
  bead and a manual primitive audit (Base UI's headless API can shift
  prop names between majors).
- Do not mix Base UI primitives with `@mui/material` components in the
  same UI surface — pick one per surface during migration to avoid
  double-styling.
