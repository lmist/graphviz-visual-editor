# Visual diff: before vs. after MUI removal

This document pairs every captured baseline with its post-migration counterpart so a
reviewer can scan the entire visual surface in one pass.

- **Baselines** live in [`baseline-screenshots/`](./baseline-screenshots/) and were
  taken against the MUI/tss-react/Emotion stack as it shipped before the migration
  began. See [`baseline-screenshots/CHECKLIST.md`](./baseline-screenshots/CHECKLIST.md)
  for the capture protocol.
- **After** images live in `after-screenshots/` and are captured against the
  post-migration build using the same viewport, sample DOT, and interaction sequence.
- Filenames match across the two directories (e.g. `main-default.png` on both sides).
- Captions call out any **intentional** visual delta. If a row notes "no intentional
  delta," any pixel difference should be treated as a regression.

If an image fails to load below, the corresponding screenshot has not yet been
captured — file or update the relevant bead rather than working around the gap.

## Main view

| State | Before | After | Caption |
| --- | --- | --- | --- |
| Default graph (sample DOT) | ![main-default before](./baseline-screenshots/main-default.png) | ![main-default after](./after-screenshots/main-default.png) | No intentional delta. Graph rendering, app bar, and drawers should match within antialiasing noise. |
| Empty editor | ![main-empty before](./baseline-screenshots/main-empty.png) | ![main-empty after](./after-screenshots/main-empty.png) | No intentional delta. Empty-state placeholder copy and spacing preserved. |
| Parse error | ![main-error before](./baseline-screenshots/main-error.png) | ![main-error after](./after-screenshots/main-error.png) | Toast/snackbar styling is reimplemented without MUI; surface color and elevation are matched to tokens but may differ by a hair. |
| Loading / mid-render | ![main-loading before](./baseline-screenshots/main-loading.png) | ![main-loading after](./after-screenshots/main-loading.png) | Spinner replaced with a token-driven equivalent; size and stroke should match. |

## Top app bar (ButtonAppBar)

| State | Before | After | Caption |
| --- | --- | --- | --- |
| Default | ![appbar-default before](./baseline-screenshots/appbar-default.png) | ![appbar-default after](./after-screenshots/appbar-default.png) | No intentional delta. |
| Undo + redo enabled | ![appbar-undo-redo-active before](./baseline-screenshots/appbar-undo-redo-active.png) | ![appbar-undo-redo-active after](./after-screenshots/appbar-undo-redo-active.png) | No intentional delta. Disabled-vs-enabled icon contrast preserved. |

## Drawers / panels

| State | Before | After | Caption |
| --- | --- | --- | --- |
| Format drawer open | ![drawer-format-open before](./baseline-screenshots/drawer-format-open.png) | ![drawer-format-open after](./after-screenshots/drawer-format-open.png) | No intentional delta. |
| Format drawer collapsed | ![drawer-format-collapsed before](./baseline-screenshots/drawer-format-collapsed.png) | ![drawer-format-collapsed after](./after-screenshots/drawer-format-collapsed.png) | No intentional delta. |
| Insert panel open | ![panel-insert-open before](./baseline-screenshots/panel-insert-open.png) | ![panel-insert-open after](./after-screenshots/panel-insert-open.png) | No intentional delta. |
| Insert panel — accordion expanded | ![panel-insert-accordion-expanded before](./baseline-screenshots/panel-insert-accordion-expanded.png) | ![panel-insert-accordion-expanded after](./after-screenshots/panel-insert-accordion-expanded.png) | Accordion chevron and divider rule are reimplemented; visual weight should match. |

## Menus

| State | Before | After | Caption |
| --- | --- | --- | --- |
| Main menu open | ![menu-main before](./baseline-screenshots/menu-main.png) | ![menu-main after](./after-screenshots/menu-main.png) | No intentional delta. Menu shadow uses token-driven elevation. |
| Help menu open | ![menu-help before](./baseline-screenshots/menu-help.png) | ![menu-help after](./after-screenshots/menu-help.png) | No intentional delta. |

## Dialogs

| State | Before | After | Caption |
| --- | --- | --- | --- |
| About | ![dialog-about before](./baseline-screenshots/dialog-about.png) | ![dialog-about after](./after-screenshots/dialog-about.png) | No intentional delta. |
| Settings | ![dialog-settings before](./baseline-screenshots/dialog-settings.png) | ![dialog-settings after](./after-screenshots/dialog-settings.png) | No intentional delta. |
| Keyboard shortcuts | ![dialog-keyboard-shortcuts before](./baseline-screenshots/dialog-keyboard-shortcuts.png) | ![dialog-keyboard-shortcuts after](./after-screenshots/dialog-keyboard-shortcuts.png) | No intentional delta. |
| Mouse operations | ![dialog-mouse-operations before](./baseline-screenshots/dialog-mouse-operations.png) | ![dialog-mouse-operations after](./after-screenshots/dialog-mouse-operations.png) | No intentional delta. |
| Export SVG | ![dialog-export-svg before](./baseline-screenshots/dialog-export-svg.png) | ![dialog-export-svg after](./after-screenshots/dialog-export-svg.png) | No intentional delta. |
| Export URL | ![dialog-export-url before](./baseline-screenshots/dialog-export-url.png) | ![dialog-export-url after](./after-screenshots/dialog-export-url.png) | No intentional delta. |
| Open from browser | ![dialog-open-from-browser before](./baseline-screenshots/dialog-open-from-browser.png) | ![dialog-open-from-browser after](./after-screenshots/dialog-open-from-browser.png) | No intentional delta. |
| Save as to browser | ![dialog-save-as-to-browser before](./baseline-screenshots/dialog-save-as-to-browser.png) | ![dialog-save-as-to-browser after](./after-screenshots/dialog-save-as-to-browser.png) | No intentional delta. |
| Confirm delete | ![dialog-do-you-want-to-delete before](./baseline-screenshots/dialog-do-you-want-to-delete.png) | ![dialog-do-you-want-to-delete after](./after-screenshots/dialog-do-you-want-to-delete.png) | No intentional delta. |
| Confirm replace | ![dialog-do-you-want-to-replace before](./baseline-screenshots/dialog-do-you-want-to-replace.png) | ![dialog-do-you-want-to-replace after](./after-screenshots/dialog-do-you-want-to-replace.png) | No intentional delta. |

## Toasts / snackbars

| State | Before | After | Caption |
| --- | --- | --- | --- |
| Updated snackbar | ![snackbar-updated before](./baseline-screenshots/snackbar-updated.png) | ![snackbar-updated after](./after-screenshots/snackbar-updated.png) | Snackbar reimplemented without MUI; placement, dismiss timing, and surface color matched to tokens. |
| Parse-error toast | ![toast-parse-error before](./baseline-screenshots/toast-parse-error.png) | ![toast-parse-error after](./after-screenshots/toast-parse-error.png) | Error toast reimplemented without MUI; icon color uses token `--color-error`. |

## Color picker

| State | Before | After | Caption |
| --- | --- | --- | --- |
| Open | ![colorpicker-open before](./baseline-screenshots/colorpicker-open.png) | ![colorpicker-open after](./after-screenshots/colorpicker-open.png) | No intentional delta. Swatch grid and hue slider preserved. |

## Editor

| State | Before | After | Caption |
| --- | --- | --- | --- |
| Focused (caret + selection) | ![editor-focused before](./baseline-screenshots/editor-focused.png) | ![editor-focused after](./after-screenshots/editor-focused.png) | No intentional delta. Selection highlight color matched to token. |
| Error indicator visible | ![editor-error before](./baseline-screenshots/editor-error.png) | ![editor-error after](./after-screenshots/editor-error.png) | `ErrorOutline` icon replaced with token-driven SVG; color and size matched. |

## Responsive

| State | Before | After | Caption |
| --- | --- | --- | --- |
| Mobile (360px) | ![responsive-mobile-360 before](./baseline-screenshots/responsive-mobile-360.png) | ![responsive-mobile-360 after](./after-screenshots/responsive-mobile-360.png) | No intentional delta. App bar and drawer collapse behavior preserved. |
| Tablet (768px) | ![responsive-tablet-768 before](./baseline-screenshots/responsive-tablet-768.png) | ![responsive-tablet-768 after](./after-screenshots/responsive-tablet-768.png) | No intentional delta. |
| Desktop (1440px) | ![responsive-desktop-1440 before](./baseline-screenshots/responsive-desktop-1440.png) | ![responsive-desktop-1440 after](./after-screenshots/responsive-desktop-1440.png) | No intentional delta. Reference layout for the rest of this document. |
