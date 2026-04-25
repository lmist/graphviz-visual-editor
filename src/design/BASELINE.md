# Baseline — pre-migration measurements

Recorded immediately after the foundation layer landed (design tokens,
fonts, reset, typography, ui barrel) but **before** any MUI removal or
primitive substitution. Use these numbers to detect regressions while
the brutalist redesign rolls out.

## Build artifact sizes

`npm run build` output, hashes will rotate on each rebuild:

| File                                       | Raw    | Gzip      |
| ------------------------------------------ | -----: | --------: |
| build/static/js/main.228e1f80.js           | 2284996 B (2.18 MiB) | 1001666 B (978.2 KiB) |
| build/static/css/main.61e685a4.css         |   15540 B (15.18 KiB) |    2809 B (2.74 KiB) |

CRA reports `999.98 kB` gzipped JS at this baseline — this is already
above CRA's recommended threshold and is the headline number we expect
to *shrink* once `@mui/material` is replaced surface-by-surface.

## How to measure

```bash
npm run build
stat -f "%z" build/static/js/*.js
stat -f "%z" build/static/css/*.css
gzip -c build/static/js/main.*.js | wc -c
gzip -c build/static/css/main.*.css | wc -c
```

## Notes

- These sizes already include `@base-ui-components/react` (foundation
  install) and the two fontsource packages. The fontsource imports add
  weight files to the CSS bundle and brought CSS up from ~3 KiB to
  ~15 KiB raw — expected.
- JS bundle did not move materially when Base UI was added because
  nothing imports it yet (foundation is install-only).
