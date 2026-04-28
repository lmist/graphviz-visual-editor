# Local Icons Inventory

Inventory of local SVG icon primitives that still live under
`src/components/icons/`.

- **Active local SVG icons:** 9
- **Navbar icons:** migrated to `@phosphor-icons/react`

| Icon              | Import sites | Example file                          |
| ----------------- | -----------: | ------------------------------------- |
| ChevronLeft       | 1            | src/FormatDrawer.js                   |
| ChevronRight      | 1            | src/FormatDrawer.js                   |
| Close             | 11           | src/KeyboardShortcutsDialog.js        |
| CloseFullscreen   | 1            | src/Graph.js                          |
| Delete            | 1            | src/OpenFromBrowserDialog.js          |
| ErrorOutline      | 1            | src/TextEditor.js                     |
| ExpandMore        | 1            | src/InsertPanels.js                   |
| Link              | 1            | src/ExportAsUrlDialog.js              |
| OpenInFull        | 1            | src/Graph.js                          |

## Notes

- Sites count = number of distinct source files importing the icon.
- "Close" dominates because every dialog has a close affordance — the
  Dialog primitive (E2) should provide this slot to collapse 11
  imports into 0.
- Navbar icons were migrated from local SVG wrappers to Phosphor in
  `ButtonAppBar.js`. The remaining local SVG wrappers are non-navbar
  affordances used by dialogs, drawers, panels, graph fullscreen, and editor
  errors.
