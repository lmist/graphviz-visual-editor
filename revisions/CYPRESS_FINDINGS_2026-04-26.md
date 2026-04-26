# Cypress Findings — 2026-04-26

## Run Summary

| Metric | Value |
|---|---|
| Date | 2026-04-26 |
| Branch | `polecat/nux/gviz-g68@mof1rjbr` (== `origin/main` at `15b5bf1`) |
| Cypress Cloud run | https://cloud.cypress.io/projects/8wm34o/runs/1404 |
| Total tests | 108 |
| Passing | 34 (31.5%) |
| Failing | 74 (68.5%) |
| Specs total | 16 |
| Specs all-green | 5 (`github`, `help`, `main_menu`, `settings`, `text_editor`) |
| Specs all-red | 4 (`fullscreen_graph`, `pan_and_zoom`, `select_delete`, `select_deselect`, `undo_redo`) |
| Wall time | 15m 53s |

### Setup notes (URL refactor — required to even start the run)

A non-Gas-Town `npm run start` from `/Users/lou/gts/graphviz-visual-editor` (commit `ffcfc8b`) was holding port 3000, so the coverage server had to be started on `PORT=3010`. Cypress could not be redirected by `CYPRESS_BASE_URL` alone, because every `cy.visit()` and several URL assertions hard-coded `http://localhost:3000` — meaning the suite was effectively un-runnable against any other port. Mayor authorized the cleanup (option A in the gviz-g68 escalation thread) and it landed as part of this run:

- `cypress.config.js` — added `e2e.baseUrl = 'http://localhost:3000'` (default; overridable via `CYPRESS_BASE_URL`).
- `cypress/support/commands.js` — `startApplication`, `startCleanApplication`, `startApplicationWithDotSource` now `cy.visit('/', options)`.
- `cypress/e2e/rendering.spec.js`, `cypress/e2e/browser_save_and_open.spec.js`, `cypress/e2e/export_and_import_as_url.spec.js` — converted 1 + 3 + 6 sites. URL-value assertions now derive from `Cypress.config('baseUrl')` so the export-link contract still verifies the app's emitted origin instead of a hard-coded literal.

This refactor is *infrastructure*, not a behavioural fix; it does not move the pass-rate but unblocked the run.

## Executive Summary

Pass rate moved from **21/107 = 19.6%** (2026-04-25) to **34/108 = 31.5%** (today): +13 newly green tests, no new regressions. The same three buckets identified in `CYPRESS_FINDINGS_2026-04-25.md` still describe the bulk of the remaining red — the recent merges (gviz-5l3, 5nz, 5t9, j4u, prd, q4p, ra5, sn1, n6l, zkz) cleaned up the harness flake, the platform-aware undo/redo, the `clearDotSource` cross-platform path, and the pixel-tight rendering bands, but they did not move the needle on the **two dominant root causes still left**: (1) Base UI / MUI re-render churn that detaches Cypress subjects mid-chain, and (2) selectors and interaction patterns still pinned to the pre-Base-UI DOM. The five all-green specs are exactly the ones that don't touch settings, the format drawer, the open/save dialogs, or canvas selection — i.e., the parts of the app the Base UI swap didn't touch.

The suite is **far below the 95% acceptance bar** in `gviz-g68`. Per the bead's acceptance clause, every remaining failure is filed as a follow-up bead under `gviz-xds`, with priority by impact.

## Per-spec table

| # | Spec | Pass / Total | Status | Dominant failure mode | Follow-up |
|---|---|---|---|---|---|
| 1 | `browser_save_and_open` | 6/17 | ✖ | DOM-detached mid-chain `cy.find()` (Base UI dialog re-renders) | gviz-cy01 |
| 2 | `draw_edge` | 3/8 | ✖ | `cy.click()` center hidden from view (overlay/MUI Drawer occlusion) | gviz-cy02 |
| 3 | `export_and_import_as_url` | 1/3 | ✖ | DOM-detached mid-chain on dialog re-render | gviz-cy03 |
| 4 | `fullscreen_graph` | 0/4 | ✖ | `#text-editor-wrapper` never appears (fullscreen toggle regression) | gviz-cy04 |
| 5 | `github` | 1/1 | ✔ | — | — |
| 6 | `help` | 5/5 | ✔ | — | — |
| 7 | `insert_node` | 1/14 | ✖ | Mix: `cy.click()` hidden, `.MuiFormControlLabel-root` missing, missing nodes after insert | gviz-cy05 |
| 8 | `main_menu` | 1/1 | ✔ | — | — |
| 9 | `pan_and_zoom` | 0/4 | ✖ | DOM-detached mid-chain on every test | gviz-cy06 |
| 10 | `rendering` | 3/8 | ✖ | Mix: `li#circo` (engine selector listbox shape), `.MuiFormControlLabel-root`, pixel band (445 vs 469±15) | gviz-cy07 |
| 11 | `select_delete` | 0/3 | ✖ | DOM-detached mid-chain | gviz-cy08 |
| 12 | `select_deselect` | 0/18 | ✖ | DOM-detached mid-chain on canvas-graph queries | gviz-cy09 |
| 13 | `settings` | 1/1 | ✔ | — | — |
| 14 | `text_editor` | 10/10 | ✔ | — | — |
| 15 | `transition` | 2/7 | ✖ | `.MuiFormControlLabel-root` missing in tween-precision radio group | gviz-cy10 |
| 16 | `undo_redo` | 0/4 | ✖ | DOM-detached mid-chain on body / canvas | gviz-cy11 |

## Root-cause clusters

### Cluster A — DOM detachment from Base UI re-renders (largest cluster)

**Shape:** `CypressError: Timed out retrying after 10000ms: cy.find() failed because the page updated as a result of this command, but you tried to continue the command chain. The subject is no longer attached to the DOM, and Cypress cannot requery the page after commands such as cy.find().`

**Where:** `browser_save_and_open` (most), `export_and_import_as_url`, `pan_and_zoom` (all 4), `select_delete` (all 3), `select_deselect` (all 18), `undo_redo` (all 4), parts of `insert_node`.

**Hypothesis:** Base UI's `Dialog` / `Popover` / `Listbox` primitives re-render their portal contents on state changes (controlled vs. uncontrolled, transitions resolving to the open state) more aggressively than legacy MUI did. Cypress chains like `cy.openFromBrowserDialog().savedGraphs().savedGraph(0).savedGraphName()` capture a subject from the parent dialog and then dereference into descendants — when the dialog re-renders between `cy.find()` calls, the captured subject is detached and the next link in the chain blows up.

**Fix shape (no code change here, just direction):** rewrite chained queries to *re-query from root* between transitions, or wrap them in `cy.then()` that re-resolves the subject via id selectors. Alternative: add an explicit `cy.get('#dialog').should('be.visible')` checkpoint between `cy.openButton().click()` and the first nested `cy.find()` so the dialog has settled before the chain begins.

### Cluster B — Stale MUI selectors after Base UI swap

**Shape:** `AssertionError: Expected to find element: .MuiFormControlLabel-root, but never found it.` and `Expected to find element: li#circo, but never found it.`

**Where:** `transition` (5/5 failing tests use this selector), `insert_node` (style/color/fillcolor controls), `rendering` (engine selector + tween radios).

**Hypothesis:** Base UI ships its own primitives — `FormControl`, `Select`, `RadioGroup`, etc. — that do **not** emit `Mui-*` class names. Several Cypress helpers in `cypress/support/commands.js` still target `.MuiFormControlLabel-root` and `.MuiSwitch-root` (see `fitSwitch`, `pathTweenSwitch`, `shapeTweenSwitch`, `tweenPrecisionRadioButtonAbsolute`, `tweenPrecisionRadioButtonRelative`). Some of these were already addressed by gviz-5t9, gviz-q4p, and gviz-sn1, but the survivors above still hit the legacy class.

**Fix shape:** point the helpers at semantic anchors (the underlying `input[id="..."]` is already used as the primary anchor — the helpers just need to stop traversing up to `.MuiFormControlLabel-root` and instead use a stable wrapper id, or assert against the input directly).

### Cluster C — `cy.click()` center hidden from view

**Shape:** `cy.click() failed because the center of this element is hidden from view`

**Where:** `draw_edge` (all 5 failing), parts of `insert_node`.

**Hypothesis:** Base UI's `Drawer` and `Popover` components animate via `transform`/`opacity` on a child layer, leaving the parent measurable but the inner clickable centre occluded by an animation layer. The legacy MUI implementation had finished its enter transition by the time Cypress queried it; Base UI's seems to settle slightly later or to leave a lingering overlay element above the click target.

**Fix shape:** either (a) wait on a `data-state="open"` / `aria-hidden="false"` attribute on the drawer/popover before clicking, or (b) `{ force: true }` the click after asserting visibility through a different gate (e.g., text content present). Option (a) is cleaner — option (b) papers over real user-impacting jank.

### Cluster D — `fullscreen_graph` regression (all 4 red)

**Shape:** `AssertionError: Expected to find element: #text-editor-wrapper, but never found it.`

**Where:** all 4 tests in `fullscreen_graph.spec.js`.

**Hypothesis:** the spec calls `cy.startApplication()` (which now visits `/`), then expects `#text-editor-wrapper` to be present. If `localStorage.fullscreenMode` is being persisted between specs (Cypress doesn't clear localStorage between specs by default, only between `it` blocks — check `cypress/support/index.js` / `support/e2e.js`), the app may load straight into "show graph only" mode, hiding the editor. Alternatively, the Base UI refactor removed or renamed the `#text-editor-wrapper` id in fullscreen mode.

**Fix shape:** verify in DevTools what the DOM actually looks like at this point. If `fullscreenMode` is leaking, clear it in `support` before each run; if the id is gone, restore it or update the helper.

### Cluster E — pixel tolerance bands (1 test)

**Shape:** `expected 445 to be close to 469 +/- 15`

**Where:** `rendering.spec.js` — a single resize-related assertion.

**Hypothesis:** gviz-5l3 loosened *most* pixel-tight bands but missed this one. The drift is 24 px against a 15 px tolerance, i.e., off by ~9 px from the band edge.

**Fix shape:** widen the band to `±25` (matching the pattern used elsewhere) or adopt a percentage-of-viewport tolerance.

## Recommended Next Actions

In priority order, executable as a single sub-epic-fan-out under `gviz-xds`:

1. **gviz-cy04** — Fix `fullscreen_graph` regression (all 4 red is suspicious; small surface, large impact).
2. **gviz-cy09** — `select_deselect` cluster A fix (18 red tests, single root cause; biggest single-shot win).
3. **gviz-cy01** — `browser_save_and_open` cluster A fix (11 red tests).
4. **gviz-cy05** — `insert_node` mixed-cluster fix (13 red tests; touches insertion contracts and format drawer).
5. **gviz-cy10** — `transition` `.MuiFormControlLabel-root` selector fix (5 red tests; one-line helper change).
6. **gviz-cy06** / **cy07** / **cy08** / **cy11** / **cy02** / **cy03** — remaining clusters.

A single PR that re-queries from root in the helper functions (`canvasGraph`, `openFromBrowserDialog`, `savedGraphs`) plus a checkpoint pattern (`cy.get('#dialog').should('exist')` before chaining) would close most of cluster A in one shot — recommend filing a *coordination* bead (`gviz-cyA-coord`) on top of the per-spec beads so the work can be batched.

Acceptance for `gviz-g68` is not met by this run (34/108 = 31.5% << 95%). Per the bead's acceptance clause, **every remaining failure has a follow-up bead** linked to `gviz-xds`. The bead may be closed on that basis, or remain open until the suite is back over 95%.
