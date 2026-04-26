# Cypress Findings — 2026-04-26 (Final v2, post-wave-3 residuals)

## Run Summary

| Metric | Value |
|---|---|
| Date | 2026-04-26 |
| Branch | `polecat/capable/gviz-zh7@mog5dee9` (origin/main HEAD `6fe1c65` — wave-3 residuals all merged: gviz-09h, c59, d9r, dd8, g6j, a8d, uo8) |
| Cypress Cloud run | n/a (local run, no `--record`) |
| Total tests | 108 |
| Passing | **88 (81.5%)** |
| Failing | 20 (18.5%) |
| Specs total | 16 |
| Specs all-green | 12 (`browser_save_and_open`, `export_and_import_as_url`, `fullscreen_graph`, `github`, `help`, `main_menu`, `pan_and_zoom`, `select_delete`, `select_deselect`, `settings`, `text_editor`, `undo_redo`) |
| Specs all-red | 0 |
| Wall time | 9m 25s |

### Setup notes

Coverage server started on `PORT=3010` from this worktree; cypress run with `CYPRESS_BASE_URL=http://localhost:3010` per the gviz-g68 baseUrl refactor. The local run was not recorded to Cypress Cloud (no `--record` token in this session); pass/fail counts and stack traces here come from the local console output saved to `/tmp/cypress-run.log`.

## Executive Summary

**Pass rate moved DOWN from 86/108 (79.6%) to 88/108 (81.5%) — net +2 — but with a hidden regression that masks real progress.**

Of the 22 wave-2 residuals, **17 closed cleanly** (pan_and_zoom 4, browser_save_and_open 2, rendering 1, transition 2, plus the 8 insert_node tests that g6j alone would have closed). But **15 NEW failures appeared** in `draw_edge` (-5 from 8/8), `insert_node` (-2 from 7/14, since 8 of the 9 closing got re-broken by a different root cause), and `transition` (-2 net). Net: +2.

The new failures all share one shape: `Expected to find element: 'input#<switch-id>'` in `#format-drawer` or `#settings-dialog`. Root cause is a **collision between gviz-d9r and gviz-g6j** that landed in opposite directions on the same DOM contract:

- **gviz-d9r** (component side): "forward `id` onto Switch.Root render = `<button id=…>`, no hidden input."
- **gviz-g6j** (helper side): "Switch.Root spreads `id` onto hidden form `<input>`, walk to `[role=switch]` sibling."

g6j was authored against the *pre-d9r* DOM and merged minutes before d9r. After both landed, the cypress helpers (`fitSwitch`, `pathTweenSwitch`, `shapeTweenSwitch`, `styleSwitch`, `colorSwitch`, `fillColorSwitch`) all probe for an `input#<id>` that no longer exists. Six helper sites; 19 of 20 current failures trace back to these.

The 20th failure is a single 1-px exact-string drift in `rendering` (wants `width='469'`, got `'468'`).

The suite is **still below the 95% acceptance bar**. Per the bead's acceptance clause ("pass rate ≥ 95% OR every residual has a follow-up bead"), the second branch is satisfied via two follow-up beads (one for the d9r/g6j collision covering 19 tests, one for the 1-px width drift).

## Per-spec table — delta vs final-v1 (CYPRESS_FINDINGS_2026-04-26-final.md)

| # | Spec | v1 Pass / Total | v2 Pass / Total | Δ | Status | Follow-up |
|---|---|---|---|---|---|---|
| 1 | `browser_save_and_open` | 15/17 | 17/17 | **+2** | ✔ | — (gviz-uo8 closed) |
| 2 | `draw_edge` | 8/8 | 3/8 | **−5** | ✖ (5 red) | gviz-cjd |
| 3 | `export_and_import_as_url` | 3/3 | 3/3 | 0 | ✔ | — |
| 4 | `fullscreen_graph` | 4/4 | 4/4 | 0 | ✔ | — |
| 5 | `github` | 1/1 | 1/1 | 0 | ✔ | — |
| 6 | `help` | 5/5 | 5/5 | 0 | ✔ | — |
| 7 | `insert_node` | 7/14 | 5/14 | **−2** | ✖ (9 red) | gviz-cjd |
| 8 | `main_menu` | 1/1 | 1/1 | 0 | ✔ | — |
| 9 | `pan_and_zoom` | 0/4 | 4/4 | **+4** | ✔ | — (gviz-dd8 closed) |
| 10 | `rendering` | 4/8 | 5/8 | **+1** | ✖ (3 red) | gviz-cjd (2), gviz-1r3 (1) |
| 11 | `select_delete` | 3/3 | 3/3 | 0 | ✔ | — |
| 12 | `select_deselect` | 18/18 | 18/18 | 0 | ✔ | — |
| 13 | `settings` | 1/1 | 1/1 | 0 | ✔ | — |
| 14 | `text_editor` | 10/10 | 10/10 | 0 | ✔ | — |
| 15 | `transition` | 2/7 | 4/7 | **+2** | ✖ (3 red) | gviz-cjd |
| 16 | `undo_redo` | 4/4 | 4/4 | 0 | ✔ | — |
| | **Total** | **86/108 (79.6%)** | **88/108 (81.5%)** | **+2 net** | | |

## Residual clusters

### Cluster L — d9r/g6j helper-vs-component collision (19 tests) → **gviz-cjd**

**Shape:** `Expected to find element: 'input#<switch-id>'` (where `<switch-id>` ∈ {`fit-switch`, `path-tween-switch`, `shape-tween-switch`, `style-switch`, `color-switch`, `fillcolor-switch`}) inside `#settings-dialog` or `#format-drawer`.

**Where (19 tests):**
- `draw_edge` 4–8 (5 tests — `style-switch`, `color-switch`, `fillcolor-switch` in `#format-drawer`)
- `insert_node` 2, 7, 11 (3 tests — `style-switch`, `color-switch`, `fillcolor-switch` in `#format-drawer`)
- `insert_node` 8, 9, 10, 12, 14 (5 tests — `fit-switch` in `#settings-dialog`)
- `rendering` 4, 6 (2 tests — `fit-switch` in `#settings-dialog`)
- `transition` 2, 3, 5 (3 tests — `path-tween-switch`, `shape-tween-switch` in `#settings-dialog`)
- 1 additional test in `insert_node` (`shift-click default attrs`) — same shape via `style-switch`

**Root cause (verified):**

`src/components/ui/Switch.jsx` was changed by gviz-d9r (`5785082`) to use Base UI's `render` prop, rendering `Switch.Root` as `<button id="<provided-id>">` and **eliminating the hidden form `<input>`** that older Base UI versions emitted with the same id.

`cypress/support/commands.js` was changed by gviz-g6j (`5c62554`, merged 3 min before d9r) to walk:
```js
return cy.settingsDialog()
  .find('input#fit-switch')              // ← no longer exists
  .siblings('[role="switch"]');
```
on the assumption that `Switch.Root` still produces a hidden input. Six helper functions are stuck in this stale walk:

| commands.js line | Helper | Used by |
|---|---|---|
| 343–346 | `styleSwitch` | draw_edge, insert_node (#format-drawer) |
| 367–370 | `colorSwitch` | draw_edge, insert_node (#format-drawer) |
| 401–404 | `fillColorSwitch` | draw_edge, insert_node (#format-drawer) |
| 454–461 | `fitSwitch` | insert_node, rendering, transition (#settings-dialog) |
| 482–486 | `pathTweenSwitch` | transition |
| 488–492 | `shapeTweenSwitch` | transition |

**Fix shape:** revert the body of these six helpers back to the *direct-button* form g6j replaced — i.e., `cy.settingsDialog().find('button#fit-switch')` (and equivalents in `#format-drawer`). The Radio helpers immediately below (`tweenPrecisionRadioButtonAbsolute` etc.) are already in the correct shape post-d9r and document the pattern.

Note: the **shape-of-fix is the exact reverse of g6j**. g6j's other change (scoping `shouldHaveName/Label/Shape` to `#canvas svg #graph0`) is **independently correct** and must not be reverted — the scoping fix is what landed insert_node from 7/14 toward 14/14 in g6j's local run. Only the *switch-helper* part of g6j needs reverting.

Single-PR fix should close 19 of 20 remaining failures and put the suite at **107/108 = 99.1%**.

### Cluster M — rendering 'fit-disabled' SVG width 1-px exact-string drift (1 test) → **gviz-1r3**

**Shape:** `expected '468' actual '469'` (or vice-versa) on `cy.wrap(svg).should('have.attr', 'width', '469')` at `cypress/e2e/rendering.spec.js:141`.

**Where:** `rendering.spec.js` test 5 (`Does not resize the graph when the window is resized if fit graph is disabled`).

**Hypothesis:** Same family as gviz-a8d (viewBox subpixel drift) and gviz-dd8 (pan_and_zoom transform tolerance). The exact-string width assertions are not robust to the recent dependency-bump precision drift. The same test's neighboring `cy.wrap(svg).invoke('width').should('be.closeTo', 469, 25)` passes on the same SVG; the strict `should('have.attr', 'width', '469')` form does not.

**Fix shape:** swap the two exact-string `width`/`height` attribute assertions for `closeTo(..., 1)` against the parsed numeric values, mirroring the pattern gviz-a8d used on the viewBox dims earlier in the same `it` block.

## Recommended Next Actions

In priority order:

1. **gviz-cjd** (P1) — Revert the six `*Switch` cypress helpers from g6j's `input#…` + sibling-walk form to direct `button#…`. Single-file change, ~12 lines, closes 19 tests, lands suite at 99.1%.
2. **gviz-1r3** (P3) — Loosen the two exact-string width/height attribute assertions in `rendering.spec.js:141–142` to `closeTo(..., 1)`. Closes 1 test, lands suite at ≥99.1% (or 100% if combined with #1).

If both land, the suite reaches **108/108 = 100%** for the first time on this convoy.

## Acceptance for gviz-zh7

**Pass rate:** 81.5% (below 95% bar).
**Every residual has a follow-up bead:** ✔ — two follow-up beads filed: gviz-cjd (P1, 19 tests) and gviz-1r3 (P3, 1 test).

Per the bead's acceptance clause ("pass rate ≥ 95% OR every residual has a follow-up bead"), the second branch is satisfied.

## Notes on the regression

The 20-test net regression (relative to expected near-zero residuals after wave-3) is **not a bug in any of the wave-3 fixes individually** — it is a **merge-order interaction** between two fixes that touched opposite sides of the same DOM contract:

- gviz-g6j authored `commands.js` against pre-d9r Base UI Switch DOM (hidden input form).
- gviz-d9r changed Base UI Switch DOM to button-id form *after* g6j was authored but landed *after* g6j was merged.

Refinery's per-bead merge into main is correct in isolation; what failed is the **cross-bead invariant** that the `Switch.Root` DOM contract assumed by helpers should match the contract emitted by the component. A future check (linter, integration smoke, or hand-off mail) that captures "if you change Switch.jsx, check `commands.js` for stale `input#*-switch` walks" would prevent this class of collision. Filed for consideration but not blocking this bead's acceptance.
