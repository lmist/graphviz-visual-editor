// Design tokens — single source of truth for the brutalist redesign.
// See src/design/STYLE.md for rationale and rules.
//
// Values are flat and serializable: primitives import named consts;
// the stringified `cssVariables` block is injected once globally so
// non-primitive code can read the same values via var(--token).

export const COLORS = {
  fg: '#000',
  bg: '#fff',
  accent: '#4ed1f8',
  error: '#ff3030',
  muted: '#666',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const TYPOGRAPHY = {
  ui: '"Space Grotesk", system-ui, sans-serif',
  mono: '"JetBrains Mono", ui-monospace, monospace',
  sizes: {
    h1: 32,
    h2: 24,
    h3: 20,
    h4: 16,
    body: 14,
    caption: 12,
  },
};

export const BORDERS = {
  thin: '1px solid #000',
  thick: '2px solid #000',
  radius: 0,
};

export const SHADOWS = {
  hover: '2px 2px 0 0 #000',
};

export const MOTION = {
  duration: '80ms',
  easing: 'linear',
};

export const cssVariables = `:root {
  --color-fg: ${COLORS.fg};
  --color-bg: ${COLORS.bg};
  --color-accent: ${COLORS.accent};
  --color-error: ${COLORS.error};
  --color-muted: ${COLORS.muted};

  --space-xs: ${SPACING.xs}px;
  --space-sm: ${SPACING.sm}px;
  --space-md: ${SPACING.md}px;
  --space-lg: ${SPACING.lg}px;
  --space-xl: ${SPACING.xl}px;

  --font-ui: ${TYPOGRAPHY.ui};
  --font-mono: ${TYPOGRAPHY.mono};
  --font-size-h1: ${TYPOGRAPHY.sizes.h1}px;
  --font-size-h2: ${TYPOGRAPHY.sizes.h2}px;
  --font-size-h3: ${TYPOGRAPHY.sizes.h3}px;
  --font-size-h4: ${TYPOGRAPHY.sizes.h4}px;
  --font-size-body: ${TYPOGRAPHY.sizes.body}px;
  --font-size-caption: ${TYPOGRAPHY.sizes.caption}px;

  --border-thin: ${BORDERS.thin};
  --border-thick: ${BORDERS.thick};
  --border-radius: ${BORDERS.radius};

  --shadow-hover: ${SHADOWS.hover};

  --motion-duration: ${MOTION.duration};
  --motion-easing: ${MOTION.easing};
}`;

const tokens = {
  COLORS,
  SPACING,
  TYPOGRAPHY,
  BORDERS,
  SHADOWS,
  MOTION,
  cssVariables,
};

export default tokens;
