# Cypress Findings — 2026-04-26 (Final v3, post-wave-4: cjd + 1r3)

## Run Summary

| Metric | Value |
|---|---|
| Date | 2026-04-26 |
| Branch | `polecat/capable/gviz-4zl@mog7qb7f` (origin/main HEAD `f63a39c` — wave-4 merged: gviz-cjd, gviz-1r3, plus gviz-pll cypress-parallel runner) |
| Cypress Cloud run | n/a (local run, no `--record`) |
| Total tests | 108 |
| Passing | **100 (92.6%)** |
| Failing | 8 (7.4%) |
| Specs total | 16 |
| Specs all-green | 13 |
| Specs all-red | 0 |
| Wall time (parallel `-t 4`) | **5m 10s** (vs 9m 25s for the recorded suite in v2 — ~1.8× speedup) |
| Wall time (sum across workers) | 10m 35s |

### Setup

- Dev server: `PORT=3010 BROWSER=none npm run start:fast` (uncoverage'd; no `@cypress/instrument-cra`).
- Suite: `CYPRESS_BASE_URL=http://localhost:3010 npm run integration-test:fast` (`cypress-parallel -t 4`).
- All measurements from this worktree (`polecats/capable/gviz`); raw log saved at `/tmp/cypress-suite.log`. Per-spec solo re-runs at `/tmp/cy-{rendering,panzoom,fs}.log`.

## Executive Summary

**Pass rate moved UP from 88/108 (81.5%) → 100/108 (92.6%), net +12.** The two wave-4 fixes landed cleanly:

- **gviz-cjd** (six `*Switch` helpers reverted from `input#…`-walk to direct `button#…`) closed all 19 of cluster-L's d9r/g6j collision failures across `draw_edge`, `insert_node`, `transition`, and 1 of `rendering`'s residuals.
- **gviz-1r3** (loosened `rendering.spec.js:141–143` SVG `width`/`height` attr assertions to `closeTo(..., 1)`) closed cluster-M.

Three previously all-green specs now pass at full count after wave-4: `draw_edge` 8/8, `insert_node` 14/14, `transition` 7/7.

The 8 remaining failures fall into three new (or re-shaped) clusters:

- **Cluster N — `pan_and_zoom` 4-test tx 3-px drift** (deterministic, all 4 tests). New residual; likely a regression in the `dd8`/`a8d` tolerance family that opened during the wave-4 churn or comes from environment drift. Filed as **gviz-a1r**.
- **Cluster O — `rendering` tests 4/5/6 dimension drift, larger magnitude** (deterministic). gviz-g7d's original 1-2-px hypothesis is too narrow: test 5 has a 6-px viewBox-width diff and test 6 has an 8-px width-attr diff. Updated **gviz-g7d** notes with the new measurements and recommends restructuring the assertions rather than just widening tolerance.
- **Cluster P — `fullscreen_graph` parallel-only flake** (1/4 under `-t 4`, 4/4 solo). New, low priority. Filed as **gviz-q6t**.

The cypress-parallel runner from gviz-pll is **working as advertised** — total wall time fell from 9m 25s to 5m 10s for the full suite. The new `start:fast` script + `integration-test:fast` (`integration-test:noinstrument` under cypress-parallel) skip the `@cypress/instrument-cra` overhead and run cleanly.

## Per-spec table — delta vs final-v2

| # | Spec | v2 Pass / Total | v3 Pass / Total | Δ | Status | Follow-up |
|---|---|---|---|---|---|---|
| 1 | `browser_save_and_open` | 17/17 | 17/17 | 0 | ✔ | — |
| 2 | `draw_edge` | 3/8 | 8/8 | **+5** | ✔ | — (gviz-cjd closed) |
| 3 | `export_and_import_as_url` | 3/3 | 3/3 | 0 | ✔ | — |
| 4 | `fullscreen_graph` | 4/4 | 3/4 | **−1** | ✖ (parallel-only) | **gviz-q6t** |
| 5 | `github` | 1/1 | 1/1 | 0 | ✔ | — |
| 6 | `help` | 5/5 | 5/5 | 0 | ✔ | — |
| 7 | `insert_node` | 5/14 | 14/14 | **+9** | ✔ | — (gviz-cjd closed) |
| 8 | `main_menu` | 1/1 | 1/1 | 0 | ✔ | — |
| 9 | `pan_and_zoom` | 4/4 | 0/4 | **−4** | ✖ | **gviz-a1r** (new) |
| 10 | `rendering` | 5/8 | 5/8 | 0 | ✖ | **gviz-g7d** (updated; now covers tests 4/5/6) |
| 11 | `select_delete` | 3/3 | 3/3 | 0 | ✔ | — |
| 12 | `select_deselect` | 18/18 | 18/18 | 0 | ✔ | — |
| 13 | `settings` | 1/1 | 1/1 | 0 | ✔ | — |
| 14 | `text_editor` | 10/10 | 10/10 | 0 | ✔ | — |
| 15 | `transition` | 4/7 | 7/7 | **+3** | ✔ | — (gviz-cjd closed) |
| 16 | `undo_redo` | 4/4 | 4/4 | 0 | ✔ | — |
| | **Total** | **88/108 (81.5%)** | **100/108 (92.6%)** | **+12 net** | | |

## Residual clusters

### Cluster N — `pan_and_zoom` tx 3-px drift (4 tests) → **gviz-a1r**

**Shape:** All four tests fail at the same line in `cypress/support/commands.js:734` with:
```
AssertionError: tx of "translate(145.875,267.75) scale(1)":
  expected 145.875 to be close to 148.875 +/- 2
```

The translate-x is 145.875; expected close to 148.875 ±2 — diff is **3.0**, just outside the ±2 tolerance window.

**Where:** Likely the shared `canvasGraphTransform` / pan-zoom-init helper invoked from each pan_and_zoom test's `beforeEach`. All four tests fail before reaching their actual zoom assertions.

**Reproduces:** Both in `cypress-parallel` and `npx cypress run --spec cypress/e2e/pan_and_zoom.spec.js` (solo). Deterministic.

**Suspected family:** Same as gviz-dd8 (transform tolerance) and gviz-a8d (viewBox subpixel drift). Either layout/font-metric drift slipped past dd8's tolerance window post-wave-4, or this workspace's headless-chrome rendering produces slightly different node-size metrics than the recorded baseline.

**Fix shape:** Widen tx tolerance from ±2 to ±4 (or compute expected tx dynamically from svg/viewBox dims). One-line change in `cypress/support/commands.js:734` should land 4/4.

### Cluster O — `rendering` 4/5/6 dimension drift, larger magnitude (3 tests) → **gviz-g7d** (updated)

**Shape:** Three deterministic failures on hard-coded pixel dimensions, with diffs larger than the 1-2 px gviz-g7d originally hypothesised:

| Test | Line | Expected | Actual | Diff | Tolerance |
|---|---|---|---|---|---|
| 4 'Fits…' (height) | 113 | `should('eq', 572)` | 570 | 2 | exact (none) |
| 5 'Does not resize…' (viewBox w) | 138 | `closeTo(351.75, 1)` | 345.75 | **6** | 1 |
| 6 'Resizes…' (width attr) | 192 | `should('have.attr', 'width', '469')` | 461 | **8** | exact (none) |

**Newly in scope:** Test 5 (viewBox width 6-px diff) was not in gviz-g7d's original description — it only mentioned tests 4 and 6. gviz-1r3 fixed line 141–143 (`width`/`height` attrs in the same test) but did not touch line 138 (viewBox width inside a `then` block).

**Why g7d's "widen to ±2" recipe is insufficient:** A 6-px or 8-px diff cannot be silenced by ±1 or ±2 tolerance — the actual rendered graph is materially different in size on this workspace. Likely root cause is graphviz-wasm or font-metric drift between the recorded baseline and current chrome/headless.

**Fix shape (revised in gviz-g7d notes):** Either
1. Restructure tests 4/5/6 in the gviz-a8d/dd8 style — assert structural relationships (viewBox aspect ratio, post-resize/pre-resize ratio) rather than absolute pixel dimensions, OR
2. Widen tolerance to ±10 with a comment explaining why the absolute dimensions can't be trusted.

### Cluster P — `fullscreen_graph` parallel-only flake (1 test) → **gviz-q6t**

**Shape:** `Show graph only mode -- Shows the graph only when the open in full button is clicked and shows the full application when it's clicked again` fails under `cypress-parallel -t 4` (1/4) but passes solo (4/4 in 5s).

**Reproduces:**
- Parallel: 3/4 passing, 17s total spec time.
- Solo (`npx cypress run --spec cypress/e2e/fullscreen_graph.spec.js`): 4/4 passing.

**Suspected cause:** Resource contention at parallelism 4 — when `insert_node` and `browser_save_and_open` (the two slowest specs) run concurrently with `fullscreen_graph`, the open-in-full transition timing is affected.

**Fix shape:** Drop runner from `-t 4` to `-t 3` on local hardware, or add an explicit animation-end wait in the failing test, or quarantine under parallel.

## Recommended Next Actions

In priority order:

1. **gviz-a1r** (P2) — Widen pan_and_zoom tx tolerance from ±2 to ±4 in `cypress/support/commands.js:734`. One-line change, closes 4 tests, lands suite at 104/108 = 96.3%.
2. **gviz-g7d** (P3, updated) — Restructure or widen rendering tests 4/5/6 dimension assertions (closeTo ≥10 or aspect-ratio-based). Closes 3 tests, lands suite at 107/108 = 99.1% (or 108/108 combined with a1r).
3. **gviz-q6t** (P3) — Fullscreen parallel-only flake. Either quarantine, drop runner threads to 3, or add animation-end wait.

If a1r and g7d both land, the suite reaches **107/108 = 99.1%** under solo runs and ≥106/108 = 98.1% under parallel (q6t still flaky). The cypress-parallel runner from gviz-pll is the right baseline going forward — solo per-spec runs remain useful for debug.

## Acceptance for gviz-4zl

**Pass rate:** 92.6% (below 95% bar, but materially up from 81.5%).
**Every residual has a follow-up bead:** ✔
  - gviz-a1r (P2, 4 tests, **new**)
  - gviz-g7d (P3, 3 tests, **updated** to cover test 5 and to revise the fix-shape hypothesis)
  - gviz-q6t (P3, 1 test, **new**)

Per the bead's acceptance clause ("108/108 OR every residual has a bead"), the second branch is satisfied.

## Notes on the parallel runner

gviz-pll's `cypress-parallel`-based `integration-test:fast` script is an unambiguous win at this workspace's hardware:

- Wall time: **5m 10s** (parallel) vs **9m 25s** (final-v2's recorded run) — ~1.8× speedup.
- Sum across 4 workers: 10m 35s — the parallel speedup is bounded by the longest single spec (`browser_save_and_open` at 2m 39s) plus marshalling overhead.
- Coverage is suppressed (`integration-test:noinstrument` + `start:fast` skip `@cypress/instrument-cra`); for coverage runs the original `npm run integration-test` path remains.

The one observed parallel-only flake (cluster P) is small enough to handle separately (gviz-q6t).
