// Brutalist primitive barrel.
//
// Re-exports headless Base UI primitives wrapped to match the rules in
// src/design/STYLE.md. Callers should import from this path
// (`src/components/ui`) so primitive implementations can move without
// touching call sites. Empty until E2 primitive tasks land.

export { default as TableHead } from './TableHead.jsx';
export { default as Table, TableSizeContext } from './Table.jsx';
