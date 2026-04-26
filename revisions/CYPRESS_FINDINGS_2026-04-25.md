# Cypress Findings - 2026-04-25

## Run Summary

- Command run: `npm run integration-test`
- App server used for the run: `npm run start:coverage`
- Cypress Cloud run: <https://cloud.cypress.io/projects/8wm34o/runs/1403>
- Total tests: `107`
- Passing: `21`
- Failing: `86`
- Specs failing: `12 / 16`
- Screenshots generated locally: `86`

## Executive Summary

The run does not indicate `86` independent product bugs.

The failures cluster into three categories:

1. Shared Cypress harness failures
2. Cypress selectors and interaction assumptions that no longer match the Base UI refactor
3. A smaller set of likely real product regressions or changed behavior

My working estimate from this run:

- Likely real product bugs: `~5-10`
- Broken or stale Cypress assumptions/selectors: `~15-30`
- Shared harness bugs that fan out into many failures: `1-3`

## Highest-Leverage Finding

The single biggest failure source is the shared Cypress helper `clearAndRenderDotSource()` in `cypress/support/commands.js`.

Relevant code:

- `cypress/support/commands.js:620-625`
- `cypress/support/commands.js:608-618`

What it does:

1. Sends `{ctrl}a{del}` to `.ace_content`
2. Asserts the editor text is exactly empty
3. Types DOT
4. Waits for a transition

The critical assertion is:

- `cypress/support/commands.js:622`

```js
cy.textEditorContent().should('have.text', '');
```

Many failures stop here before the spec reaches the actual behavior being tested.

This means a large part of the red suite is not trustworthy as product-signal.

## Base UI Refactor Drift

Several failures are clearly caused by Cypress still targeting the old DOM contract.

### Hidden switch inputs are being clicked directly

The tests target ids such as:

- `#fit-switch`
- `#style-switch`
- `#path-tween-switch`
- `#shape-tween-switch`

Evidence:

- `cypress/support/commands.js:408-409`
- `cypress/support/commands.js:428-433`
- `src/SettingsDialog.js:201-208`
- `src/SettingsDialog.js:230-250`

Observed failure mode:

- Cypress reports the center of the element is hidden from view
- The element is an input clipped to `1px`

Interpretation:

- The app is using accessible hidden inputs plus visible switch UI
- Cypress should target the visible switch control or the label text, not the hidden input

### Old engine menu contract no longer matches the UI

Evidence:

- `cypress/support/commands.js:412-421`
- `src/SettingsDialog.js:173-191`

Observed failure mode:

- Cypress looks for `#menu-engine`
- The UI now shows a visible select with `#engine-selector`

Interpretation:

- This is stale test code, not necessarily a product bug

### Tween precision radio ids no longer match assumptions

Evidence:

- `cypress/support/commands.js:436-449`
- `src/SettingsDialog.js:256-270`

Observed failure mode:

- Cypress expects `#absolute` and `#relative`
- Those ids were not found during the run

Interpretation:

- The radio group is visible in the UI
- The selectors are outdated

## Likely Real Product Regressions or Behavior Changes

These are the parts of the run that look like actual app behavior needs review.

### 1. Undo and redo behavior appears changed

Evidence:

- `src/TextEditor.js:31-35`
- `src/TextEditor.js:53-63`
- `cypress/e2e/text_editor.spec.js`
- `cypress/e2e/undo_redo.spec.js`

Observed failures:

- `text_editor.spec.js`: undo/redo expectations failed
- `undo_redo.spec.js`: all four tests failed

Why this looks real:

- `text_editor.spec.js` otherwise had good signal and `6/10` passed
- The editor can render DOT, show errors, and respect hold-off timing
- Undo/redo is a focused behavior area rather than a global selector issue

### 2. Invalid DOT may now preserve the last valid graph render

Evidence:

- `src/pages/index.js:104-120`
- Representative screenshot:
  - `cypress/screenshots/browser_save_and_open.spec.js/Browser save and open -- A DOT source that is imported from the dot parameter in the URL creates a new graph in browser local storage if not equal to any existing DOT source (failed).png`

Observed on screen:

- The editor shows an error marker
- The canvas still shows the previous valid graph

Why this matters:

- Older tests expected the SVG to disappear
- The current behavior may be intentional, or it may be a regression
- Either way, the product contract changed enough that it needs an explicit decision

### 3. Save/open/local-storage flows need verification

Affected spec:

- `browser_save_and_open.spec.js`

Observed result:

- `4` passing
- `13` failing

Why this is mixed:

- Some failures are still poisoned by the shared editor helper
- But this area has enough concentrated failures that persistence behavior deserves direct browser verification

Most suspicious subareas:

- autosave timing
- save-as overwrite flow
- opening a stored graph
- creating a new empty graph

### 4. Graph editing flows may have real breakage

Affected specs:

- `insert_node.spec.js`
- `draw_edge.spec.js`
- `select_delete.spec.js`
- `select_deselect.spec.js`

Why the signal is mixed:

- Many failures occur after the shared DOT setup helper already failed
- Some interaction tests are therefore not reliable evidence

What still looks worth checking in the product:

- insertion through canvas and insert panel
- edge creation gesture behavior
- selection state behavior
- keyboard shortcuts that act on graph selection

## Likely Test Bugs

These look like test problems more than product problems.

### 1. Editor-clearing assumption is too strict

Evidence:

- `cypress/support/commands.js:620-625`
- `cypress/support/commands.js:36-37`

Problem:

- `.ace_content` is not a stable contract for "editor is empty"
- Ace can retain DOM structure or text-layer artifacts that make this assertion brittle

### 2. Tests depend on hidden input interaction

Evidence:

- `cypress/support/commands.js:408-409`
- `cypress/support/commands.js:428-433`
- `src/SettingsDialog.js:201-208`
- `src/SettingsDialog.js:230-250`

Problem:

- Cypress is trying to click inputs that are intentionally visually hidden

### 3. Tests depend on removed or renamed ids

Evidence:

- `cypress/support/commands.js:416-421`
- `cypress/support/commands.js:444-449`

Problem:

- `#menu-engine`, `#absolute`, and `#relative` are no longer good selectors

### 4. Busy-indicator timing is assumed too strongly

Evidence:

- `cypress/support/commands.js:595-606`
- `src/Graph.js:792-806`

Observed failure:

- Cypress expected `#busy-indicator` to appear and it never did

Interpretation:

- The spinner only appears when `this.state.busy` is true
- It is wrapped in `Fade` with `transitionDelay: '800ms'`
- A fast render may legitimately skip the visible busy state

This is a test-design bug unless the product explicitly guarantees the indicator appears for every transition.

### 5. Some layout assertions are too pixel-tight

Observed failures:

- rendering resize assertion: `460` vs `469`
- text editor scroll assertion: `36` vs `41`

Interpretation:

- These are small geometry shifts consistent with a UI overhaul
- They do not, by themselves, prove a functional regression

## Specs and Results

| Spec | Result | Notes |
| --- | --- | --- |
| `browser_save_and_open.spec.js` | `4 pass / 13 fail` | Mixed signal; persistence and new/open flows need browser verification |
| `draw_edge.spec.js` | `0 pass / 8 fail` | Mostly blocked by shared DOT helper; drawer selectors also stale |
| `export_and_import_as_url.spec.js` | `0 pass / 3 fail` | Shared DOT helper issue dominates |
| `fullscreen_graph.spec.js` | `0 pass / 4 fail` | Fails after shared setup path; product mode toggle still worth checking manually |
| `github.spec.js` | `1 pass / 0 fail` | Healthy |
| `help.spec.js` | `5 pass / 0 fail` | Healthy |
| `insert_node.spec.js` | `0 pass / 14 fail` | Mixed: shared helper plus hidden switch selector failures |
| `main_menu.spec.js` | `1 pass / 0 fail` | Healthy |
| `pan_and_zoom.spec.js` | `0 pass / 4 fail` | Mostly blocked by shared setup path |
| `rendering.spec.js` | `2 pass / 5 fail` | Good signal; includes stale selectors and one real layout behavior shift |
| `select_delete.spec.js` | `0 pass / 3 fail` | Mostly blocked by shared setup path |
| `select_deselect.spec.js` | `0 pass / 18 fail` | Mostly blocked by shared setup path |
| `settings.spec.js` | `1 pass / 0 fail` | Healthy |
| `text_editor.spec.js` | `6 pass / 4 fail` | Good signal; undo/redo and a few assumptions need work |
| `transition.spec.js` | `1 pass / 6 fail` | Clear selector drift plus busy-indicator assumption |
| `undo_redo.spec.js` | `0 pass / 4 fail` | Good candidate for real behavioral review |

## Representative Artifacts

Cloud run:

- <https://cloud.cypress.io/projects/8wm34o/runs/1403>

Representative screenshots:

- `cypress/screenshots/rendering.spec.js/Basic rendering from DOT source -- Renders DOT source using the engine selected in settings (failed).png`
- `cypress/screenshots/insert_node.spec.js/Insertion of nodes into the graph -- Default node style is seleced from one of the styles in the node format drawer (failed).png`
- `cypress/screenshots/browser_save_and_open.spec.js/Browser save and open -- A DOT source that is imported from the dot parameter in the URL creates a new graph in browser local storage if not equal to any existing DOT source (failed).png`

## What Looked Healthy

These areas had good evidence of working behavior:

- Main menu opens
- Help menu and help dialogs work
- Settings dialog opens
- GitHub external link flow works
- Text editor can render typed DOT
- Text editor error gutter works
- Hold-off timing in editor works
- Font size setting works

## Recommended Fix Order

1. Fix real product regressions first where the signal is strongest:
   - undo/redo behavior
   - invalid-DOT render persistence contract
   - save/open behavior if manual browser verification confirms breakage
2. Fix the shared Cypress editor helper so setup becomes reliable
3. Update Cypress selectors for Base UI controls
4. Loosen pixel-tight assertions where the UI overhaul intentionally changed layout
5. Re-run the suite and reassess what remains red

## Bottom Line

The suite is currently low-signal, not because the app is fine, but because the suite still assumes the old DOM and an older editor contract.

There are likely real product bugs in the app, but the current red count overstates them substantially.
