import packageJSON from '../../package.json';

Cypress.Commands.add("startApplication", (options) => {
  localStorage.setItem('version', packageJSON.version);
  cy.visit('/', options);
  cy.canvasGraph().should('exist');
});

Cypress.Commands.add("startCleanApplication", (options) => {
  localStorage.setItem('dotSrc', 'digraph {}');
  localStorage.setItem('version', packageJSON.version);
  cy.visit('/', options);
  cy.canvasGraph().should('exist');
});

Cypress.Commands.add("startApplicationWithDotSource", (dotSrc, options) => {
  localStorage.setItem('dotSrc', dotSrc);
  localStorage.setItem('version', packageJSON.version);
  cy.visit('/', options);
  cy.canvasGraph().should('exist');
});

Cypress.Commands.add("startApplicationWithNamedDotSource", (dotSrc, name, options) => {
  localStorage.setItem('name', name);
  cy.startApplicationWithDotSource(dotSrc, options);
});

Cypress.Commands.add("textEditorWrapper", () => {
  return cy.get('#text-editor-wrapper');
});

Cypress.Commands.add("textEditor", () => {
  return cy.textEditorWrapper().find('#text-editor');
});

Cypress.Commands.add("textEditorContent", () => {
  return cy.textEditor().find('.ace_content');
});

Cypress.Commands.add("textEditorGutter", () => {
  return cy.textEditor().find('.ace_gutter');
});

Cypress.Commands.add("textEditorGutterCells", () => {
  return cy.textEditorGutter().find('.ace_gutter-cell');
});

Cypress.Commands.add("textEditorGutterCellWithError", () => {
  return cy.textEditorGutter().find('.ace_error');
});

Cypress.Commands.add("textEditorTooltip", () => {
  return cy.textEditor().find('.ace_tooltip');
});

Cypress.Commands.add("textEditorTextLayer", () => {
  return cy.textEditorContent().find('> .ace_text-layer');
});

Cypress.Commands.add("textEditorVisibleLines", () => {
  return cy.textEditorTextLayer().find('> .ace_line_group > .ace_line');
});

Cypress.Commands.add("textEditorErrorButton", () => {
  return cy.textEditorWrapper().find('#error-button');
});

// Canvas helpers collapse to a single cy.get() so Cypress's auto-retry can
// re-resolve the entire selector path from root after a re-render. Chained
// custom commands (cy.canvas().find('svg').find('#graph0')) used to break
// retry-ability across the custom-command boundary, leaving Cypress holding a
// detached subject when Base UI re-rendered between commands.
Cypress.Commands.add("canvas", () => {
  return cy.get('#canvas');
});

Cypress.Commands.add("canvasSvg", () => {
  return cy.get('#canvas svg');
});

Cypress.Commands.add("canvasGraph", () => {
  return cy.get('#canvas svg #graph0');
});

Cypress.Commands.add("findNode", {prevSubject: true}, (subject, index) => {
  return cy.get('#canvas svg #graph0 > #node' + index);
});

Cypress.Commands.add("findNodes", {prevSubject: true}, (subject, index) => {
  return cy.get('#canvas svg #graph0 > .node');
});

Cypress.Commands.add("findEdge", {prevSubject: true}, (subject, index) => {
  return cy.get('#canvas svg #graph0 > #edge' + index);
});

Cypress.Commands.add("findEdges", {prevSubject: true}, (subject, index) => {
  return cy.get('#canvas svg #graph0 > .edge');
});

Cypress.Commands.add("node", (index) => {
  return cy.get('#canvas > svg > #graph0 > #node' + index);
});

Cypress.Commands.add("edge", (index) => {
  return cy.get('#canvas > svg > #graph0 > #edge' + index);
});

Cypress.Commands.add("nodes", () => {
  return cy.get('#canvas > svg > #graph0 > .node');
});

Cypress.Commands.add("edges", () => {
  return cy.get('#canvas > svg > #graph0 > .edge');
});

Cypress.Commands.add("fullscreenButton", (buttonName) => {
  return cy.get('#fullscreen');
});

Cypress.Commands.add("toolbar", (buttonName) => {
  return cy.get('#toolbar');
});

Cypress.Commands.add("toolbarButton", (buttonName) => {
  return cy.toolbar().contains(buttonName);
});

Cypress.Commands.add("menuButton", () => {
  return cy.toolbar().find('#menu');
});

Cypress.Commands.add("mainMenu", () => {
  return cy.get('#main-menu');
});

Cypress.Commands.add("menuItemNew", () => {
  return cy.mainMenu().find('#new');
});

Cypress.Commands.add("menuItemOpen", () => {
  return cy.mainMenu().find('#open');
});

Cypress.Commands.add("menuItemSaveAs", () => {
  return cy.mainMenu().find('#save-as');
});

Cypress.Commands.add("menuItemRename", () => {
  return cy.mainMenu().find('#rename');
});

Cypress.Commands.add("replaceGraphDialog", () => {
  return cy.get('#replace-graph-dialog');
});

Cypress.Commands.add("replaceGraphCancelButton", () => {
  return cy.replaceGraphDialog().find('#cancel');
});

Cypress.Commands.add("replaceGraphReplaceButton", () => {
  return cy.replaceGraphDialog().find('#replace');
});

Cypress.Commands.add("menuItemExportAsUrl", () => {
  return cy.get('#main-menu').find('#export-as-url');
});

Cypress.Commands.add("exportGraphAsUrlDialog", () => {
  return cy.get('#export-graph-as-url-dialog');
});

Cypress.Commands.add("exportGraphAsUrlExportedUrl", () => {
  return cy.exportGraphAsUrlDialog().find('#export');
});

Cypress.Commands.add("exportGraphAsUrlCopyButton", () => {
  return cy.exportGraphAsUrlDialog().find('#copy');
});

Cypress.Commands.add("exportGraphAsUrlCancelButton", () => {
  return cy.exportGraphAsUrlDialog().find('#cancel');
});

Cypress.Commands.add("exportGraphAsUrlOpenLinkButton", () => {
  return cy.exportGraphAsUrlDialog().find('#open-link');
});

Cypress.Commands.add("menuItemSettings", () => {
  return cy.mainMenu().find('#settings');
});

Cypress.Commands.add("newButton", () => {
  return cy.toolbar().find('#new');
});

Cypress.Commands.add("openButton", () => {
  return cy.toolbar().find('#open');
});

Cypress.Commands.add("openFromBrowserDialog", () => {
  return cy.get('#open-from-browser-dialog');
});

// Saved-graph helpers re-query from the dialog root each call. Base UI
// re-renders the dialog body more aggressively than legacy MUI did, so a
// captured tr subject becomes detached between chained calls. Resolving the
// row by index from `cy.get('#open-from-browser-dialog tbody > tr')` lets
// Cypress's auto-retry recover from the re-render.
function rowIndexOf(subject, index) {
  if (index !== undefined) return index;
  if (subject != null && typeof subject.index === 'function') {
    const idx = subject.index();
    if (idx >= 0) return idx;
  }
  return 0;
}

Cypress.Commands.add("graphTableHeader", {prevSubject: 'optional'}, (subject, name) => {
  // Base UI's TableCell renders as <td> inside <thead> (no TableContext to mark
  // header cells as <th>), and the sort button is wrapped in Tooltip.Trigger.
  // Anchor on the sort button id instead of the cell tag.
  return cy.get('#open-from-browser-dialog').find('thead #' + name);
});

Cypress.Commands.add("savedGraphs", {prevSubject: 'optional'}, (subject) => {
  return cy.get('#open-from-browser-dialog tbody > tr');
});

Cypress.Commands.add("savedGraph", {prevSubject: 'optional'}, (subject, index) => {
  return cy.get('#open-from-browser-dialog tbody > tr').eq(rowIndexOf(subject, index));
});

Cypress.Commands.add("savedGraphName",  {prevSubject: 'optional'}, (subject, index) => {
  const idx = rowIndexOf(subject, index);
  return cy.get('#open-from-browser-dialog tbody > tr').eq(idx).find('th');
});

Cypress.Commands.add("savedGraphDotSource", {prevSubject: 'optional'}, (subject, index) => {
  const idx = rowIndexOf(subject, index);
  return cy.get('#open-from-browser-dialog tbody > tr').eq(idx).find('td').eq(0);
});

Cypress.Commands.add("savedGraphTime", {prevSubject: 'optional'}, (subject, index) => {
  const idx = rowIndexOf(subject, index);
  return cy.get('#open-from-browser-dialog tbody > tr').eq(idx).find('td').eq(1);
});

Cypress.Commands.add("savedGraphPreview", {prevSubject: 'optional'}, (subject, index) => {
  const idx = rowIndexOf(subject, index);
  return cy.get('#open-from-browser-dialog tbody > tr').eq(idx).find('td').eq(2);
});

Cypress.Commands.add("savedGraphPreviewGraph", {prevSubject: 'optional'}, (subject, index) => {
  // Callers chain this off a savedGraphPreview <td>, not a <tr>. Using
  // subject.index() on a td returns the cell position (3), not the row, so
  // search inside the subject directly when one is given.
  if (subject != null && index === undefined) {
    return cy.wrap(subject).find('#svg-wrapper > svg > #graph0');
  }
  const idx = rowIndexOf(subject, index);
  return cy.get('#open-from-browser-dialog tbody > tr').eq(idx).find('td').eq(2)
    .find('#svg-wrapper > svg > #graph0');
});

Cypress.Commands.add("savedGraphPreviewPopUp", {prevSubject: 'optional'}, (subject, index) => {
  if (subject != null && index === undefined) {
    return cy.wrap(subject).find('#preview-pop-up');
  }
  const idx = rowIndexOf(subject, index);
  return cy.get('#open-from-browser-dialog tbody > tr').eq(idx).find('td').eq(2)
    .find('#preview-pop-up');
});

Cypress.Commands.add("savedGraphDeleteButton", (index) => {
  return cy.get('#open-from-browser-dialog tbody > tr').eq(index).find('td').eq(3).find('#delete');
});

Cypress.Commands.add("openGraphCancelButton", (index) => {
  return cy.openFromBrowserDialog().find('#cancel');
});

Cypress.Commands.add("openGraphOpenButton", (index) => {
  return cy.openFromBrowserDialog().find('#open');
});

Cypress.Commands.add("deleteGraphDialog", (index) => {
  return cy.get('#delete-graph-dialog');
});

Cypress.Commands.add("deleteGraphDeleteButton", () => {
  return cy.deleteGraphDialog().find('#delete');
});

Cypress.Commands.add("deleteGraphCancelButton", () => {
  return cy.deleteGraphDialog().find('#cancel');
});

Cypress.Commands.add("saveAsButton", () => {
  return cy.toolbar().find('#save-as');
});

Cypress.Commands.add("saveToBrowserDialog", () => {
  return cy.get('#save-to-browser-dialog');
});

Cypress.Commands.add("saveToBrowserNameInput", () => {
  return cy.saveToBrowserDialog().find('#name');
});

Cypress.Commands.add("saveToBrowserSaveButton", () => {
  return cy.saveToBrowserDialog().find('#save');
});

Cypress.Commands.add("undoButton", () => {
  return cy.toolbar().find('#undo');
});

Cypress.Commands.add("redoButton", () => {
  return cy.toolbar().find('#redo');
});

Cypress.Commands.add("insertPanels", () => {
  return cy.get('#insert-panels');
});

Cypress.Commands.add("nodeShapeCategory", (nodeShapeCategoryName) => {
  return cy.insertPanels().contains(nodeShapeCategoryName);
});

Cypress.Commands.add("nodeShape", (nodeShapeName) => {
  return cy.insertPanels().contains(nodeShapeName);
});

Cypress.Commands.add("formatDrawer", () => {
  return cy.get('#format-drawer');
});

Cypress.Commands.add("styleSwitch", () => {
  return cy.formatDrawer().find('button#style-switch');
});

Cypress.Commands.add("formatDrawerCloseButton", () => {
  return cy.formatDrawer().find('#close-button');
});

Cypress.Commands.add("styles", () => {
  return cy.formatDrawer().find('#styles');
});

Cypress.Commands.add("style", (styleName) => {
  return cy.styles()
    .find('input#' + styleName)
    .siblings('[role="checkbox"]');
});

Cypress.Commands.add("colorPickerForm", () => {
  return cy.formatDrawer().find('#color-picker-form');
});

Cypress.Commands.add("colorSwitch", () => {
  return cy.formatDrawer().find('button#color-switch');
});

Cypress.Commands.add("colorPickerSwatch", () => {
  return cy.colorPickerForm().find('#color-picker-swatch');
});

Cypress.Commands.add("colorPicker", () => {
  return cy.colorPickerForm().find('#color-picker-popover > .chrome-picker');
});

Cypress.Commands.add("colorPickerSaturation", () => {
  return cy.colorPicker().find('.saturation-white');
});

Cypress.Commands.add("colorPickerHue", () => {
  return cy.colorPicker().find('.hue-horizontal');
});

Cypress.Commands.add("colorPickerOpacity", () => {
  return cy.colorPickerHue().parent().parent().parent().find('> div').eq(1).find(' > div > div').eq(2);
});

Cypress.Commands.add("colorPickerInput", () => {
  return cy.colorPickerForm().find('#color-input');
});

Cypress.Commands.add("fillColorPickerForm", () => {
  return cy.formatDrawer().find('#fillcolor-picker-form');
});

Cypress.Commands.add("fillColorSwitch", () => {
  return cy.formatDrawer().find('button#fillcolor-switch');
});

Cypress.Commands.add("fillColorPickerSwatch", () => {
  return cy.fillColorPickerForm().find('#color-picker-swatch');
});

Cypress.Commands.add("fillColorPicker", () => {
  return cy.fillColorPickerForm().find('#color-picker-popover > .chrome-picker');
});

Cypress.Commands.add("fillColorPickerSaturation", () => {
  return cy.fillColorPicker().find('.saturation-white');
});

Cypress.Commands.add("fillColorPickerHue", () => {
  return cy.fillColorPicker().find('.hue-horizontal');
});

Cypress.Commands.add("fillColorPickerOpacity", () => {
  return cy.fillColorPickerHue().parent().parent().parent().find('> div').eq(1).find(' > div > div').eq(2);
});

Cypress.Commands.add("fillColorPickerInput", () => {
  return cy.fillColorPickerForm().find('#color-input');
});

Cypress.Commands.add("zoomInButton", () => {
  return cy.toolbar().find('#zoom-in');
});

Cypress.Commands.add("zoomOutButton", () => {
  return cy.toolbar().find('#zoom-out');
});

Cypress.Commands.add("zoomOutMapButton", () => {
  return cy.toolbar().find('#zoom-out-map');
});

Cypress.Commands.add("zoomResetButton", () => {
  return cy.toolbar().find('#zoom-reset');
});

Cypress.Commands.add("settingsButton", () => {
  return cy.toolbar().find('#settings');
});

Cypress.Commands.add("settingsDialog", () => {
  return cy.get('#settings-dialog');
});

Cypress.Commands.add("fitSwitch", () => {
  return cy.settingsDialog().find('button#fit-switch');
});

Cypress.Commands.add("engineSelector", () => {
  return cy.settingsDialog().find('#engine-selector');
});

Cypress.Commands.add("engineMenu", () => {
  return cy.get('[role=listbox]');
});

Cypress.Commands.add("engineMenuAlternative", (engine) => {
  // Base UI Select.Item renders as a div[role=option], not a <li>.
  // Select.jsx forwards the `id` prop from the MenuItem child onto
  // BaseSelect.Item so we can still anchor by id.
  return cy.engineMenu().find('#' + engine);
});

Cypress.Commands.add("transitionDurationInput", () => {
  return cy.settingsDialog().find('#transition-duration');
});

Cypress.Commands.add("pathTweenSwitch", () => {
  return cy.settingsDialog().find('button#path-tween-switch');
});

Cypress.Commands.add("shapeTweenSwitch", () => {
  return cy.settingsDialog().find('button#shape-tween-switch');
});

Cypress.Commands.add("tweenPrecisionForm", () => {
  return cy.settingsDialog().find('#tween-precision-form');
});

Cypress.Commands.add("tweenPrecisionRadioGroup", () => {
  return cy.tweenPrecisionForm().find('#tween-precision-radio-group');
});

Cypress.Commands.add("tweenPrecisionRadioButtonAbsolute", () => {
  // Base UI Radio.Root renders a button (role=radio); the `id` lands on
  // that button, and there is no hidden <input>. Use checked-ness via
  // aria-checked or data-checked rather than `:checked`.
  return cy.tweenPrecisionRadioGroup().find('button#absolute');
});

Cypress.Commands.add("tweenPrecisionRadioButtonRelative", () => {
  return cy.tweenPrecisionRadioGroup().find('button#relative');
});

Cypress.Commands.add("tweenPrecisionInput", () => {
  return cy.tweenPrecisionForm().find('#tween-precision-input');
});

Cypress.Commands.add("tweenPrecisionInputAdornment", () => {
  return cy.tweenPrecisionForm().find('#tween-precision-input-adornment');
});

Cypress.Commands.add("fontSizeInput", () => {
  return cy.settingsDialog().find('#font-size');
});

Cypress.Commands.add("tabSizeInput", () => {
  return cy.settingsDialog().find('#tab-size');
});

Cypress.Commands.add("holdOffTimeInput", () => {
  return cy.settingsDialog().find('#holdoff');
});

Cypress.Commands.add("gitHubButton", () => {
  return cy.toolbar().find('#github');
});

Cypress.Commands.add("helpButton", () => {
  return cy.toolbar().find('#help');
});

Cypress.Commands.add("helpMenu", () => {
  return cy.get('#help-menu');
});

Cypress.Commands.add("helpMenuBackdrop", () => {
  return cy.helpMenu().find(' > div').first();
});

Cypress.Commands.add("helpMenuItemKeyboardShortcuts", () => {
  return cy.helpMenu().find('#keyboard-shortcuts');
});

Cypress.Commands.add("keyboardShortcutsDialog", () => {
  return cy.get('#keyboard-shortcuts-dialog');
});

Cypress.Commands.add("keyboardShortcutsDialogCloseButton", () => {
  return cy.keyboardShortcutsDialog().find('#close-button');
});

Cypress.Commands.add("keyboardShortcutsTable", () => {
  return cy.keyboardShortcutsDialog().find('table');
});

Cypress.Commands.add("keyboardShortcutsTableRows", () => {
  return cy.keyboardShortcutsTable().find('tr');
});

Cypress.Commands.add("helpMenuItemMouseOperations", () => {
  return cy.helpMenu().find('#mouse-operations');
});

Cypress.Commands.add("mouseOperationsDialog", () => {
  return cy.get('#mouse-operations-dialog');
});

Cypress.Commands.add("mouseOperationsDialogCloseButton", () => {
  return cy.mouseOperationsDialog().find('#close-button');
});

Cypress.Commands.add("mouseOperationsTable", () => {
  return cy.mouseOperationsDialog().find('table');
});

Cypress.Commands.add("mouseOperationsTableRows", () => {
  return cy.mouseOperationsTable().find('tr');
});

Cypress.Commands.add("helpMenuItemAbout", () => {
  return cy.helpMenu().find('#about');
});

Cypress.Commands.add("aboutDialog", () => {
  return cy.get('#about-dialog');
});

Cypress.Commands.add("aboutDialogCloseButton", () => {
  return cy.aboutDialog().find('#close-button');
});

Cypress.Commands.add("aboutDialogParagraphs", () => {
  return cy.aboutDialog().find('p');
});

// These chained assertions historically did `cy.wrap(subject).find(...)`,
// which captured a stale subject across re-renders. Re-resolve via the
// subject's id scoped to the canvas-graph so cy.get() can retry the lookup
// from root. Scoping matters: insert panels render their own preview SVG
// per shape, each with its own #graph0 > #node1, so a bare `cy.get('#node1')`
// matches dozens of elements and the assertion sees the wrong title.
const canvasGraphChild = (id) => '#canvas svg #graph0 > #' + id;

Cypress.Commands.add("shouldHaveName", {prevSubject: true}, (subject, label) => {
  const id = subject.attr('id');
  if (id) {
    cy.get(canvasGraphChild(id)).find('title').should('have.text', label);
  } else {
    cy.wrap(subject).find('title').should('have.text', label);
  }
  return cy.wrap(subject);
});

Cypress.Commands.add("nodeShouldHaveName", (index, label) => {
  return cy.canvasGraph().find('> #node' + index + ">title").should('have.text', label);
});

Cypress.Commands.add("edgeShouldHaveName", (index, label) => {
  return cy.canvasGraph().find('> #edge' + index + ">title").should('have.text', label);
});

Cypress.Commands.add("shouldHaveLabel", {prevSubject: true}, (subject, label) => {
  const id = subject.attr('id');
  if (id) {
    cy.get(canvasGraphChild(id)).find('text').should('have.text', label);
  } else {
    cy.wrap(subject).find('text').should('have.text', label);
  }
  return cy.wrap(subject);
});

Cypress.Commands.add("shouldHaveShape", {prevSubject: true}, (subject, shape) => {
  const id = subject.attr('id');
  if (id) {
    cy.get(canvasGraphChild(id)).find(':nth-child(2)').should('have.prop', 'tagName', shape);
  } else {
    cy.wrap(subject).find(':nth-child(2)').should('have.prop', 'tagName', shape);
  }
  return cy.wrap(subject);
});

Cypress.Commands.add("shouldBeSelected", {prevSubject: true}, (subject) => {
  const id = subject.attr('id');
  if (id) {
    cy.get(canvasGraphChild(id)).find('rect').should('exist');
  } else {
    cy.wrap(subject).within(() => {
      cy.get('rect').should('exist');
    });
  }
});

Cypress.Commands.add("shouldNotBeSelected", {prevSubject: true}, (subject) => {
  const id = subject.attr('id');
  if (id) {
    cy.get(canvasGraphChild(id)).find('rect').should('not.exist');
  } else {
    cy.wrap(subject).within(() => {
      cy.get('rect').should('not.exist');
    });
  }
});

Cypress.Commands.add("checkDefaultGraph", () => {
  cy.canvasGraph().then(graph0 => {
    cy.wrap(graph0).findNodes().should('have.length', 2);
    cy.wrap(graph0).findEdges().should('have.length', 1);
    cy.wrap(graph0).findNode(1)
      .should('exist')
      .shouldHaveLabel('a');
    cy.wrap(graph0).findNode(2)
      .should('exist')
      .shouldHaveLabel('b');
    cy.wrap(graph0).findEdge(1)
      .should('exist')
      .shouldHaveName('a->b');
  });
});

Cypress.Commands.add("waitForBusy", () => {
  cy.get('#busy-indicator').should('exist');
});

Cypress.Commands.add("waitForNotBusy", () => {
  cy.get('#busy-indicator').should('not.exist');
});

Cypress.Commands.add("waitForTransition", () => {
  // Fade has an 800ms transitionDelay, so fast renders never make #busy-indicator visible.
  cy.get('#busy-indicator').should('not.exist');
});

Cypress.Commands.add("typeDotSource", (dotSrc) => {
  cy.textEditorContent().type(dotSrc);
});

// Ace binds undo/redo to Cmd- on darwin, Ctrl- elsewhere; mirror that here so
// Cypress drives the same shortcut Ace listens for on the host platform.
const editorModKey = Cypress.platform === 'darwin' ? '{cmd}' : '{ctrl}';

Cypress.Commands.add("clearDotSource", () => {
  cy.textEditorContent().type('{selectall}{del}');
});

Cypress.Commands.add("pressUndo", { prevSubject: 'optional' }, (subject) => {
  const target = subject ? cy.wrap(subject) : cy.get('body');
  target.type(`${editorModKey}z`);
});

Cypress.Commands.add("pressRedo", { prevSubject: 'optional' }, (subject) => {
  const target = subject ? cy.wrap(subject) : cy.get('body');
  target.type(`${editorModKey}y`);
});

Cypress.Commands.add("insertDotSource", (dotSrc) => {
  cy.typeDotSource(dotSrc.replace(/{/g, '{{}'), {force: true});
});

Cypress.Commands.add("clearAndRenderDotSource", (dotSrc) => {
  cy.clearDotSource();
  // Ace retains DOM after clear; trust the keystroke over a strict text assertion.
  cy.insertDotSource(dotSrc);
  cy.waitForTransition();
});

// d3-zoom/d3-graphviz produce sub-pixel transform values that drift slightly
// across dependency upgrades. Compare components numerically within tolerance
// rather than asserting on the exact serialized string.
Cypress.Commands.add(
  "shouldHaveTransform",
  {prevSubject: true},
  (subject, tx, ty, scale, tolerance = 20, scaleTolerance = 0.1) => {
    const attr = subject.attr('transform') || '';
    const match = attr.match(
      /translate\(\s*(-?\d+(?:\.\d+)?)\s*,\s*(-?\d+(?:\.\d+)?)\s*\)\s*scale\(\s*(-?\d+(?:\.\d+)?)\s*\)/
    );
    expect(match, `transform "${attr}" matches translate(...) scale(...)`).to.not.be.null;
    const [, axStr, ayStr, asStr] = match;
    expect(parseFloat(axStr), `tx of "${attr}"`).to.be.closeTo(tx, tolerance);
    expect(parseFloat(ayStr), `ty of "${attr}"`).to.be.closeTo(ty, tolerance);
    expect(parseFloat(asStr), `scale of "${attr}"`).to.be.closeTo(scale, scaleTolerance);
    return cy.wrap(subject);
  }
);
