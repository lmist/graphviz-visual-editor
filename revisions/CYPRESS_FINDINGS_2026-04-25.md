# Cypress Findings — 2026-04-25

## Decisions

### A3 (gviz-e04): Invalid-DOT render persistence contract

**Decision: Option A — preserve last valid render on parse error (intentional behavior).**

#### Contract

When the DOT source in the editor changes:

| Editor state | Canvas behavior | Error UI |
|---|---|---|
| Empty (`dotSrc.length === 0`) | SVG is removed (canvas cleared) | No error |
| Valid DOT | SVG is rendered/transitioned to the new graph | No error |
| **Invalid DOT (parse error)** | **SVG is left in place — the last successfully rendered graph is preserved** | Error gutter marker shown in editor; `state.error` populated via `Graph.onError` |

#### Why Option A

1. **Upstream-preserved behavior, not a regression.** `src/Graph.js:158-171` catches parse errors from `new DotGraph(this.props.dotSrc)`, calls `this.props.onError({...})`, and **returns early without touching `this.svg`**. The empty-DOT branch (`src/Graph.js:125-131`) is the only place `this.svg.remove()` is called from the render path. The Base UI / brutalist refactor in commit `dabb89f` did not modify any of this logic — `git show dabb89f -- src/Graph.js` only swaps MUI primitives for Base UI components and does not touch `renderGraph`, `onError`, or the parse-error catch block. So the "preserve last valid render on invalid DOT" behavior is the long-standing upstream contract, not a side effect of the recent refactor.

2. **Better editing UX.** While a user is mid-edit, transient parse failures are normal (a half-typed `digraph` token, an unmatched brace, etc.). Clearing the canvas on every keystroke that produces a transient invalid state would be jarring and would lose the user's visual context. Preserving the last valid render plus surfacing the error inline (gutter marker, `state.error`) lets the user see *what they had* while they fix the typo.

3. **Distinct, non-overlapping signal.** Empty DOT (`length === 0`) already has its own well-defined "clear the canvas" behavior. Conflating "invalid" with "empty" would erase the user's distinct signals: deliberate clear vs. transient typo.

#### Test contract implications

Any spec that asserts `cy.canvasSvg().should('not.exist')` is asserting **empty DOT**, not **invalid DOT**. Audit:

- `cypress/e2e/browser_save_and_open.spec.js:612` — assertion follows a delete-saved-graph flow that empties the editor. ✅ Consistent with contract (empty → clear).
- `cypress/e2e/browser_save_and_open.spec.js:971` — assertion follows `cy.clearDotSource()` (`{ctrl}a{del}`). ✅ Consistent if the clear actually drives `dotSrc.length === 0`. Any failure here is a harness/Ace-clear issue (handled by B1 / gviz-hx2), not a contract violation.
- `cypress/e2e/browser_save_and_open.spec.js:1119` — same shape as 971.
- `cypress/e2e/rendering.spec.js`, `cypress/e2e/draw_edge.spec.js` — no `canvasSvg().should('not.exist')` assertions found; no invalid-DOT clear assertions either.

No spec currently asserts SVG-clears-on-**invalid**-DOT, so Option A does not require any spec rewrites. The screenshot referenced in the bead (`browser_save_and_open.spec.js` "creates a new graph" test) shows a failure at the post-`clearDotSource` `canvasSvg().should('not.exist')` check, which is the **empty-DOT** path — fixed by B1 (`gviz-hx2`), not by the A3 contract decision.

#### Follow-up

- A4 (`gviz-j4u`): no spec changes required under Option A. The bead can either be closed as a no-op once B1 has landed and the suite is re-verified, or repurposed to add an explicit positive assertion (e.g., a new test asserting that typing invalid DOT after a valid render leaves the canvas SVG intact while `cy.textEditorGutterCellWithError()` becomes visible). Recommend the latter so the contract is encoded in the suite, not just in this document.
