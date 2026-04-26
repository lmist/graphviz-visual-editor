# Cypress Findings — 2026-04-26 (Final, post-cluster-fixes + gviz-tsk)

## Run Summary

| Metric | Value |
|---|---|
| Date | 2026-04-26 |
| Branch | `polecat/dag/gviz-cp9@mof8kehg` (origin/main `1492531` + merge of `polecat/capable/gviz-tsk@mof76mg4` for testing) |
| Cypress Cloud run | https://cloud.cypress.io/projects/8wm34o/runs/1405 |
| Total tests | 108 |
| Passing | **86 (79.6%)** |
| Failing | 22 (20.4%) |
| Specs total | 16 |
| Specs all-green | 11 (`draw_edge`, `export_and_import_as_url`, `fullscreen_graph`, `github`, `help`, `main_menu`, `select_delete`, `select_deselect`, `settings`, `text_editor`, `undo_redo`) |
| Specs all-red | 1 (`pan_and_zoom`) |
| Wall time | 10m 31s |

### Setup notes

`gviz-tsk` (D3 event handlers bound on `renderEnd` instead of transition end) closed but its merge bead `gviz-wisp-o9k` was still **open** in the queue at the start of this run (refinery had not yet landed it). To produce a valid post-tsk reading the polecat merged `polecat/capable/gviz-tsk@mof76mg4` into the cp9 branch locally before running the suite. The merge is benign — refinery will resolve cleanly because `cp9` declares `gviz-tsk` as a dependency, so tsk will land on main first and the cp9 merge becomes a no-op for its sole code change.

Coverage server started on `PORT=3010` (a non-Gas-Town `npm run start` from a sibling worktree was holding port 3000). `CYPRESS_BASE_URL=http://localhost:3010` was used per the URL refactor that landed in `gviz-g68`.

## Executive Summary

Pass rate moved from **34/108 = 31.5%** (E1, 2026-04-26) to **86/108 = 79.6%** (this run): **+52 newly green tests, no new regressions**. The cluster-fix wave (gviz-bly, gviz-42l, gviz-0h1, gviz-1gx, gviz-5v8) plus gviz-tsk closed Clusters A, C, D, and E from the E1 findings entirely — `select_deselect` (0/18 → 18/18), `select_delete` (0/3 → 3/3), `pan_and_zoom`-other-failures aside, `fullscreen_graph` (0/4 → 4/4), `undo_redo` (0/4 → 4/4), `draw_edge` (3/8 → 8/8), `export_and_import_as_url` (1/3 → 3/3), and `browser_save_and_open` (6/17 → 15/17) all stepped forward.

The suite is **still below the 95% acceptance bar**. The 22 residuals collapse into **6 clusters**, each filed as a follow-up bead. Per the bead's acceptance clause ("pass rate ≥ 95% OR every residual has a follow-up bead"), the second branch is satisfied.

## Per-spec table — delta vs E1 (CYPRESS_FINDINGS_2026-04-26.md)

| # | Spec | E1 Pass / Total | Final Pass / Total | Δ | Status | Follow-up |
|---|---|---|---|---|---|---|
| 1 | `browser_save_and_open` | 6/17 | 15/17 | **+9** | ✖ (2 red) | gviz-uo8 |
| 2 | `draw_edge` | 3/8 | 8/8 | **+5** | ✔ | — |
| 3 | `export_and_import_as_url` | 1/3 | 3/3 | **+2** | ✔ | — |
| 4 | `fullscreen_graph` | 0/4 | 4/4 | **+4** | ✔ | — |
| 5 | `github` | 1/1 | 1/1 | 0 | ✔ | — |
| 6 | `help` | 5/5 | 5/5 | 0 | ✔ | — |
| 7 | `insert_node` | 1/14 | 7/14 | **+6** | ✖ (7 red) | gviz-d9r, gviz-09h |
| 8 | `main_menu` | 1/1 | 1/1 | 0 | ✔ | — |
| 9 | `pan_and_zoom` | 0/4 | 0/4 | 0 | ✖ (4 red) | gviz-dd8 |
| 10 | `rendering` | 3/8 | 4/8 | **+1** | ✖ (4 red) | gviz-d9r, gviz-c59, gviz-a8d |
| 11 | `select_delete` | 0/3 | 3/3 | **+3** | ✔ | — |
| 12 | `select_deselect` | 0/18 | 18/18 | **+18** | ✔ | — |
| 13 | `settings` | 1/1 | 1/1 | 0 | ✔ | — |
| 14 | `text_editor` | 10/10 | 10/10 | 0 | ✔ | — |
| 15 | `transition` | 2/7 | 2/7 | 0 | ✖ (5 red) | gviz-d9r |
| 16 | `undo_redo` | 0/4 | 4/4 | **+4** | ✔ | — |
| | **Total** | **34/108 (31.5%)** | **86/108 (79.6%)** | **+52** | | |

## Residual clusters

### Cluster F — Settings-dialog Switch/Radio not exposing `id` on the Base UI button (11 tests) → **gviz-d9r**

**Shape:** `Expected to find element: 'button#fit-switch'` (or `#shape-tween-switch`, `#path-tween-switch`, `#absolute`) inside `#settings-dialog`.

**Where:**
- `insert_node` 3, 4, 6, 7 (4 tests — `#fit-switch`)
- `rendering` 2, 4 (2 tests — `#fit-switch`)
- `transition` 1, 2, 3, 4, 5 (5 tests — `#shape-tween-switch`, `#path-tween-switch`, `#absolute`)

**Hypothesis:** gviz-1gx and gviz-0h1 fixed the *helper-side* (`fitSwitch` now uses `cy.settingsDialog().find('button#fit-switch')`, expecting the Base UI Switch button to carry the `id`). But the *component-side* in Settings.jsx / TransitionSettings is not forwarding `id` onto the inner Switch.Root / Radio.Root button. The fix in Select.jsx (gviz-0h1) needs to be replicated for Switch and Radio.

**Fix shape:** in Settings.jsx and TransitionSettings, forward the Switch/Radio component's `id` prop onto the rendered `<button role="switch"|"radio">` Root element. Single-PR fix that should close 11 tests.

### Cluster G — pan_and_zoom transform fractional pixel mismatch (4 tests) → **gviz-dd8**

**Shape:** `expected 'translate(148.5,267.75) scale(1)'` vs actual `'translate(148.875,268.5) scale(1)'`.

**Where:** all 4 `pan_and_zoom` tests, identical drift on each axis (~0.5–0.75 px).

**Hypothesis:** SVG/zoom precision drift, not a real regression. Possibly tied to the dependency bumps in the recent merge wave (lodash-es, svgo, serialize-javascript, underscore) or to a minor d3-zoom/d3-graphviz upgrade affecting subpixel rounding.

**Fix shape:** widen the assertion to use `closeTo` with a 1-px tolerance, or pin the expected transform to the new values if the diff is benign. Same family of fix as gviz-5v8 (rendering ±25).

### Cluster H — insert_node panel-insert produces wrong node identity (3 tests) → **gviz-09h**

**Shape:** assertion expected `'ellipse'` (shape), got `'Alice'` or `'n0'` (label).

**Where:** `insert_node` 1 (panel click), 2 (panel drag), 5 (deselect default styles).

**Hypothesis:** the helper is reading the wrong DOM element (label `<title>` vs shape attribute), or panel-insert now auto-labels nodes where it previously left them unlabeled. The other 7 insert_node tests pass, so the insertion machinery itself works; this is a test/helper alignment issue.

**Fix shape:** trace the helper used by these three tests; assert against the rendered SVG `<ellipse>`/`<polygon>` element directly rather than `<title>`.

### Cluster I — rendering 'engine selected in settings' — width 154.67 vs 58.67 ±0.0005 (1 test) → **gviz-c59**

**Shape:** `expected 154.66665649414062 to be close to 58.667 +/- 0.0005`.

**Where:** `rendering.spec.js` test 1.

**Hypothesis:** the 96-px delta with a 0.0005-px tolerance is not a precision-band issue — the rendered graph is fundamentally a different size. The test sets the engine via the settings dialog; if the engine-selector drop-down is broken (same root cause as gviz-d9r), the engine never changes and the graph renders with `dot` instead of the expected engine.

**Fix shape:** likely closes for free once gviz-d9r lands. Re-run after, and widen the tolerance only if it still fails.

### Cluster J — rendering 'window-resize, fit-disabled' — viewBox subpixel drift (1 test) → **gviz-a8d**

**Shape:** `expected '0 0 351 427.5'` vs actual `'0 0 351.75 429'`.

**Where:** `rendering.spec.js` test 3.

**Hypothesis:** same shape as Cluster G — subpixel drift, probably shared upstream cause.

**Fix shape:** widen the assertion or pin to new values. Could be folded into gviz-dd8.

### Cluster K — open-from-browser-dialog header & preview-pop-up selectors (2 tests) → **gviz-uo8**

**Shape:**
- `Expected to find element: 'thead > tr > th > #name'` inside `#open-from-browser-dialog` (sorting test)
- `Expected to find element: '3'` inside `#open-from-browser-dialog tbody > tr` (preview pop-up test)

**Where:** `browser_save_and_open` 'allows sorting the view of stored graphs' and 'shows a pop-up with a larger preview'.

**Hypothesis:** two surgical helper bugs — the table-header anchor `<th id='name'>` is no longer in the rendered DOM, and the preview pop-up element id changed. Note `cypress/support/commands.js:253` (`savedGraphPreviewPopUp`) also has a dead second `return` statement that should be cleaned up while in there.

**Fix shape:** inspect the rendered open-from-browser dialog DOM, update `graphTableHeader` and `savedGraphPreviewPopUp` accordingly.

## Recommended Next Actions

In priority order:

1. **gviz-d9r** (P2) — Forward Switch/Radio `id` onto Base UI button Root in Settings.jsx / TransitionSettings. **Single-PR fix that closes 11 tests** (51% of remaining failures) and likely also resolves gviz-c59 (1 test) for free → effectively 12 tests, ~91% pass rate after.
2. **gviz-09h** (P2) — Fix insert_node helper to read shape attribute, not label (3 tests).
3. **gviz-dd8** (P2) — pan_and_zoom transform tolerance (4 tests).
4. **gviz-uo8** (P3) — open-from-browser dialog header + preview pop-up selectors (2 tests).
5. **gviz-c59** (P2) — re-evaluate after gviz-d9r; widen tolerance only if still failing (1 test).
6. **gviz-a8d** (P3) — rendering viewBox tolerance (1 test) — could be folded into gviz-dd8.

Landing the top three would put the suite at **104/108 = 96.3%** (above the 95% acceptance bar). All four remaining tests after that are tolerance-band or surgical-selector fixes.

## Acceptance for gviz-cp9

**Pass rate:** 79.6% (below 95% bar)
**Every residual has a follow-up bead:** ✔ (6 beads filed: gviz-d9r, gviz-09h, gviz-dd8, gviz-c59, gviz-a8d, gviz-uo8)

Per the bead's acceptance clause ("pass rate ≥ 95% OR every residual has a follow-up bead"), the second branch is satisfied.
