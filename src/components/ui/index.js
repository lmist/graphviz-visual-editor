// Brutalist primitive barrel.
//
// Re-exports headless primitives wrapped to match the rules in
// src/design/STYLE.md. Callers should import from this path
// (`src/components/ui`) so primitive implementations can move without
// touching call sites.

export { default as CircularProgress } from './CircularProgress.jsx';
export { default as FormControl } from './FormControl.jsx';
export { default as Icon } from './Icon.jsx';
export { default as Input } from './Input.jsx';
export { default as Table, TableSizeContext } from './Table.jsx';
export { default as TableHead } from './TableHead.jsx';
export { default as Typography } from './Typography.jsx';
