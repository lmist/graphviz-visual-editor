// Axe-core accessibility smoke test.
//
// Renders each top-level Dialog and other key consumer surfaces of the
// brutalist UI and asserts zero axe-core violations. Acts as a regression
// guard for gv-d90ab048: any new accessibility violation introduced by
// future changes will fail this test.
//
// Scope: P0/P1 axe rules — labels, roles, aria-*, landmarks, button/link
// names, heading order. Color contrast is not evaluated here because
// jsdom has no layout/paint engine; that gate is covered by the design
// tokens and src/design/VISUAL_DIFF.md sign-off.
//
// Why no Playground in this suite: src/components/ui/__playground__ is a
// dev-only showcase that intentionally renders some primitives bare
// (without their consumer-supplied <label>) to demonstrate the visual
// system. That is not a real user surface and would create noise here;
// the consumer surfaces below ARE real and must remain clean.

import React from 'react';
import { render } from '@testing-library/react';
import { axe, toHaveNoViolations } from 'jest-axe';

import AboutDialog from '../AboutDialog.js';
import DoYouWantToDeleteDialog from '../DoYouWantToDeleteDialog.js';
import DoYouWantToReplaceItDialog from '../DoYouWantToReplaceItDialog.js';
import KeyboardShortcutsDialog from '../KeyboardShortcutsDialog.js';
import MouseOperationsDialog from '../MouseOperationsDialog.js';
import ExportAsSvgDialog from '../ExportAsSvgDialog.js';
import ExportAsUrlDialog from '../ExportAsUrlDialog.js';
import SaveAsToBrowserDialog from '../SaveAsToBrowserDialog.js';
import OpenFromBrowserDialog from '../OpenFromBrowserDialog.js';
import SettingsDialog from '../SettingsDialog.js';
import ButtonAppBar from '../ButtonAppBar.js';

expect.extend(toHaveNoViolations);

// `color-contrast` cannot be evaluated by axe in jsdom (no layout/paint);
// see header comment.
const axeOptions = {
  rules: {
    'color-contrast': { enabled: false },
  },
};

// `@base-ui-components/react` Dialog/Drawer wraps its popup in two
// invisible <span data-base-ui-focus-guard role="button" /> sentinels
// that implement the focus trap. Axe flags them under aria-command-name
// because role=button without a name. They are library-internal, never
// reach the user, and are out of our control — strip them before the
// scan so we don't false-positive on a third-party implementation
// detail. We do NOT disable the aria-command-name rule globally:
// MenuItem still uses role="menuitem" and must be checked.
// We need direct DOM access here: this scrubs third-party invisible
// sentinels before handing the tree to axe so the audit grades the
// consumer-visible markup, not library internals. The Testing Library
// guidance against node-access doesn't apply.
/* eslint-disable testing-library/no-node-access */
function stripBaseUiFocusGuards(node) {
  node.querySelectorAll('[data-base-ui-focus-guard]').forEach((el) => el.remove());
}
/* eslint-enable testing-library/no-node-access */

async function expectNoViolations(node) {
  stripBaseUiFocusGuards(node);
  const results = await axe(node, axeOptions);
  expect(results).toHaveNoViolations();
}

describe('axe smoke — top-level dialogs', () => {
  test('AboutDialog', async () => {
    const { baseElement } = render(
      <AboutDialog onAboutDialogClose={() => {}} graphvizVersion="2.50.0" />,
    );
    await expectNoViolations(baseElement);
  });

  test('DoYouWantToDeleteDialog', async () => {
    const { baseElement } = render(
      <DoYouWantToDeleteDialog
        type="node"
        name="Foo"
        onDeleteConfirmed={() => {}}
        onDoYouWantToDeleteDialogClose={() => {}}
      />,
    );
    await expectNoViolations(baseElement);
  });

  test('DoYouWantToReplaceItDialog', async () => {
    const { baseElement } = render(
      <DoYouWantToReplaceItDialog
        name="Foo"
        onReplaceConfirmed={() => {}}
        onDoYouWantToReplaceItDialogClose={() => {}}
      />,
    );
    await expectNoViolations(baseElement);
  });

  test('KeyboardShortcutsDialog', async () => {
    const { baseElement } = render(
      <KeyboardShortcutsDialog onKeyboardShortcutsDialogClose={() => {}} />,
    );
    await expectNoViolations(baseElement);
  });

  test('MouseOperationsDialog', async () => {
    const { baseElement } = render(
      <MouseOperationsDialog onMouseOperationsDialogClose={() => {}} />,
    );
    await expectNoViolations(baseElement);
  });

  test('ExportAsSvgDialog', async () => {
    const { baseElement } = render(
      <ExportAsSvgDialog
        defaultFilename="graph.svg"
        getSvgString={() => '<svg></svg>'}
        onClose={() => {}}
      />,
    );
    await expectNoViolations(baseElement);
  });

  test('ExportAsUrlDialog', async () => {
    const { baseElement } = render(
      <ExportAsUrlDialog
        URL="https://example.com/graph"
        onClose={() => {}}
      />,
    );
    await expectNoViolations(baseElement);
  });

  test('SaveAsToBrowserDialog', async () => {
    const { baseElement } = render(
      <SaveAsToBrowserDialog
        name="current"
        defaultNewName="new-graph"
        projects={{ current: {}, other: {} }}
        onSave={() => {}}
        onClose={() => {}}
      />,
    );
    await expectNoViolations(baseElement);
  });

  test('OpenFromBrowserDialog', async () => {
    const { baseElement } = render(
      <OpenFromBrowserDialog
        name="current"
        dotSrc="digraph {}"
        dotSrcLastChangeTime={0}
        svg=""
        projects={{
          current: { dotSrcLastChangeTime: 0 },
          other: { dotSrcLastChangeTime: 0 },
        }}
        onClose={() => {}}
        onOpen={() => {}}
        onDelete={() => {}}
      />,
    );
    await expectNoViolations(baseElement);
  });

  test('SettingsDialog', async () => {
    const { baseElement } = render(
      <SettingsDialog
        engine="dot"
        fitGraph
        transitionDuration={1}
        tweenPaths
        tweenShapes
        tweenPrecision="1%"
        holdOff={0.2}
        fontSize={12}
        tabSize={4}
        onSettingsClose={() => {}}
        onEngineSelectChange={() => {}}
        onFitGraphSwitchChange={() => {}}
        onTransitionDurationChange={() => {}}
        onTweenPathsSwitchChange={() => {}}
        onTweenShapesSwitchChange={() => {}}
        onTweenPrecisionChange={() => {}}
        onHoldOffChange={() => {}}
        onFontSizeChange={() => {}}
        onTabSizeChange={() => {}}
      />,
    );
    await expectNoViolations(baseElement);
  });
});

describe('axe smoke — top-level chrome', () => {
  test('ButtonAppBar', async () => {
    const { baseElement } = render(
      <ButtonAppBar
        hasUndo
        hasRedo
        onMenuButtonClick={() => {}}
        onNewButtonClick={() => {}}
        onOpenInBrowserButtonClick={() => {}}
        onSaveAltButtonClick={() => {}}
        onUndoButtonClick={() => {}}
        onRedoButtonClick={() => {}}
        onZoomInButtonClick={() => {}}
        onZoomOutButtonClick={() => {}}
        onZoomOutMapButtonClick={() => {}}
        onZoomResetButtonClick={() => {}}
        onInsertClick={() => {}}
        onNodeFormatClick={() => {}}
        onEdgeFormatClick={() => {}}
        onSettingsButtonClick={() => {}}
        onHelpButtonClick={() => {}}
      />,
    );
    await expectNoViolations(baseElement);
  });
});
