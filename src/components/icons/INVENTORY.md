# MUI Icons Inventory

Exhaustive list of every `@mui/icons-material` icon currently imported
under `src/`. Each row will get its own follow-up task to replace the
MUI import with a custom SVG primitive in this directory.

- **Total unique icons:** 20
- **Total import sites:** 32

| Icon              | Import sites | Example file                          |
| ----------------- | -----------: | ------------------------------------- |
| Add               | 1            | src/ButtonAppBar.js                   |
| ChevronLeft       | 1            | src/FormatDrawer.js                   |
| ChevronRight      | 1            | src/FormatDrawer.js                   |
| Close             | 11           | src/KeyboardShortcutsDialog.js        |
| CloseFullscreen   | 1            | src/Graph.js                          |
| Delete            | 1            | src/OpenFromBrowserDialog.js          |
| ErrorOutline      | 1            | src/TextEditor.js                     |
| ExpandMore        | 1            | src/InsertPanels.js                   |
| Help              | 1            | src/ButtonAppBar.js                   |
| Link              | 1            | src/ExportAsUrlDialog.js              |
| Menu              | 3            | src/MainMenu.js                       |
| OpenInBrowser     | 1            | src/ButtonAppBar.js                   |
| OpenInFull        | 1            | src/Graph.js                          |
| Redo              | 1            | src/ButtonAppBar.js                   |
| SaveAlt           | 1            | src/ButtonAppBar.js                   |
| Settings          | 1            | src/ButtonAppBar.js                   |
| Undo              | 1            | src/TextEditor.js                     |
| ZoomIn            | 1            | src/ButtonAppBar.js                   |
| ZoomOut           | 1            | src/ButtonAppBar.js                   |
| ZoomOutMap        | 1            | src/ButtonAppBar.js                   |

## Method

```bash
grep -rhE "from ['\"]@mui/icons-material" src/ | sort -u   # unique import lines
grep -lE "import \{ <Icon>( as |,| )" src/ -r              # files per icon
```

## Notes

- Sites count = number of distinct source files importing the icon.
- "Close" dominates because every dialog has a close affordance — the
  Dialog primitive (E2) should provide this slot to collapse 11
  imports into 0.
- No `.jsx` icon components are implemented yet — that is child-task
  work. This file is the work list for that effort.
