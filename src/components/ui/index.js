// Brutalist primitive barrel.
//
// Re-exports headless primitives wrapped to match the rules in
// src/design/STYLE.md. Callers should import from this path
// (`src/components/ui`) so primitive implementations can move without
// touching call sites.

export { default as CircularProgress } from './CircularProgress.jsx';
export { default as FormControl } from './FormControl.jsx';
export { default as FormControlLabel } from './FormControlLabel.jsx';
export { default as FormGroup } from './FormGroup.jsx';
export { default as FormHelperText } from './FormHelperText.jsx';
export { default as FormLabel } from './FormLabel.jsx';
export { default as Icon } from './Icon.jsx';
export { default as Input } from './Input.jsx';
export { default as InputAdornment } from './InputAdornment.jsx';
export { default as InputLabel } from './InputLabel.jsx';
export { default as MenuItem } from './MenuItem.jsx';
export { default as Select } from './Select.jsx';
export { default as SvgIcon } from './SvgIcon.jsx';
export { default as Table, TableSizeContext } from './Table.jsx';
export { default as TableBody } from './TableBody.jsx';
export { default as TableCell } from './TableCell.jsx';
export { default as TableHead } from './TableHead.jsx';
export { default as TableRow } from './TableRow.jsx';
export { default as TableSortLabel } from './TableSortLabel.jsx';
export { default as Typography } from './Typography.jsx';
