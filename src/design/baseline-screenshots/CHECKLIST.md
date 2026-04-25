# Baseline screenshot checklist

Before any MUI surface is replaced, capture screenshots of every state
below into this directory. Filename convention: `<area>-<state>.png`,
all lowercase, hyphens. Screenshots are captured manually by a human;
this file is just the work list.

## Main view

- [ ] `main-default.png` — graph view with the default sample DOT
- [ ] `main-empty.png` — empty editor (no DOT input)
- [ ] `main-error.png` — invalid DOT triggering parser error toast
- [ ] `main-loading.png` — graph mid-render / loading spinner

## Top app bar (ButtonAppBar)

- [ ] `appbar-default.png`
- [ ] `appbar-undo-redo-active.png` — undo and redo enabled

## Drawers / panels

- [ ] `drawer-format-open.png` — FormatDrawer expanded
- [ ] `drawer-format-collapsed.png`
- [ ] `panel-insert-open.png` — InsertPanels open
- [ ] `panel-insert-accordion-expanded.png`

## Menus

- [ ] `menu-main.png` — MainMenu open
- [ ] `menu-help.png` — HelpMenu open

## Dialogs

- [ ] `dialog-about.png`
- [ ] `dialog-settings.png`
- [ ] `dialog-keyboard-shortcuts.png`
- [ ] `dialog-mouse-operations.png`
- [ ] `dialog-export-svg.png`
- [ ] `dialog-export-url.png`
- [ ] `dialog-open-from-browser.png`
- [ ] `dialog-save-as-to-browser.png`
- [ ] `dialog-do-you-want-to-delete.png`
- [ ] `dialog-do-you-want-to-replace.png`

## Toasts / snackbars

- [ ] `snackbar-updated.png` — UpdatedSnackbar visible
- [ ] `toast-parse-error.png`

## Color picker

- [ ] `colorpicker-open.png`

## Editor

- [ ] `editor-focused.png` — TextEditor with caret + selection
- [ ] `editor-error.png` — ErrorOutline indicator visible

## Responsive

- [ ] `responsive-mobile-360.png` — 360px viewport
- [ ] `responsive-tablet-768.png` — 768px viewport
- [ ] `responsive-desktop-1440.png` — 1440px viewport

## Process

1. Run the app: `npm start`
2. Navigate to each state; capture at standard 1440×900 unless noted
3. Save into `src/design/baseline-screenshots/`
4. Commit screenshots in a separate commit so the diff is reviewable
