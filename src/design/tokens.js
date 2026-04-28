// Design tokens — single source of truth for the brutalist redesign.
// See src/design/STYLE.md for rationale and rules.
//
// Values are flat and serializable: primitives import named consts;
// the stringified `cssVariables` block is injected once globally so
// non-primitive code can read the same values via var(--token).

export const COLORS = {
  fg: '#242423',
  bg: '#fbfaf5',
  surface: '#f3f0e7',
  panel: '#ebe6db',
  accent: '#4ed1f8',
  error: '#ff3030',
  muted: '#68645d',
  line: '#34332f',
};

export const SPACING = {
  xs: 4,
  sm: 8,
  md: 16,
  lg: 24,
  xl: 32,
};

export const TYPOGRAPHY = {
  display: 'Georgia, "Times New Roman", serif',
  ui: '"Space Grotesk", system-ui, sans-serif',
  mono: '"JetBrains Mono", ui-monospace, monospace',
  sizes: {
    h1: '1.625rem',
    h2: '1.375rem',
    h3: '1.1875rem',
    h4: '1rem',
    body: '0.875rem',
    caption: '0.75rem',
    micro: '0.6875rem',
  },
  weights: {
    regular: 400,
    medium: 500,
    semibold: 600,
    bold: 700,
  },
  tracking: {
    label: '0.06em',
    metadata: '0.1em',
  },
};

export const BORDERS = {
  thin: `1px solid ${COLORS.line}`,
  thick: `2px solid ${COLORS.line}`,
  radius: 0,
};

export const SHADOWS = {
  hover: `2px 2px 0 0 ${COLORS.line}`,
  deep: `8px 8px 0 ${COLORS.line}`,
};

export const MOTION = {
  duration: '80ms',
  easing: 'linear',
};

export const LAYOUT = {
  appBarHeight: 64,
};

export const cssVariables = `:root {
  --color-fg: ${COLORS.fg};
  --color-bg: ${COLORS.bg};
  --color-surface: ${COLORS.surface};
  --color-panel: ${COLORS.panel};
  --color-accent: ${COLORS.accent};
  --color-error: ${COLORS.error};
  --color-muted: ${COLORS.muted};
  --color-line: ${COLORS.line};

  --space-xs: ${SPACING.xs}px;
  --space-sm: ${SPACING.sm}px;
  --space-md: ${SPACING.md}px;
  --space-lg: ${SPACING.lg}px;
  --space-xl: ${SPACING.xl}px;

  --font-ui: ${TYPOGRAPHY.ui};
  --font-display: ${TYPOGRAPHY.display};
  --font-mono: ${TYPOGRAPHY.mono};
  --font-size-h1: ${TYPOGRAPHY.sizes.h1};
  --font-size-h2: ${TYPOGRAPHY.sizes.h2};
  --font-size-h3: ${TYPOGRAPHY.sizes.h3};
  --font-size-h4: ${TYPOGRAPHY.sizes.h4};
  --font-size-body: ${TYPOGRAPHY.sizes.body};
  --font-size-caption: ${TYPOGRAPHY.sizes.caption};
  --font-size-micro: ${TYPOGRAPHY.sizes.micro};
  --font-weight-regular: ${TYPOGRAPHY.weights.regular};
  --font-weight-medium: ${TYPOGRAPHY.weights.medium};
  --font-weight-semibold: ${TYPOGRAPHY.weights.semibold};
  --font-weight-bold: ${TYPOGRAPHY.weights.bold};
  --letter-spacing-label: ${TYPOGRAPHY.tracking.label};
  --letter-spacing-metadata: ${TYPOGRAPHY.tracking.metadata};

  --border-thin: ${BORDERS.thin};
  --border-thick: ${BORDERS.thick};
  --border-radius: ${BORDERS.radius};

  --shadow-hover: ${SHADOWS.hover};
  --shadow-deep: ${SHADOWS.deep};

  --motion-duration: ${MOTION.duration};
  --motion-easing: ${MOTION.easing};

  --layout-app-bar-height: ${LAYOUT.appBarHeight}px;
}`;

const tokens = {
  COLORS,
  SPACING,
  TYPOGRAPHY,
  BORDERS,
  SHADOWS,
  MOTION,
  LAYOUT,
  cssVariables,
};

export default tokens;
