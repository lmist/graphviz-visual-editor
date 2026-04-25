import React, { useId } from 'react';
import PropTypes from 'prop-types';
import { COLORS } from '../../design/tokens.js';
import FormControl from './FormControl.jsx';
import Input from './Input.jsx';
import InputLabel from './InputLabel.jsx';
import FormHelperText from './FormHelperText.jsx';
import Select from './Select.jsx';

function TextField({
  id,
  label,
  value,
  onChange,
  helperText,
  error = false,
  multiline = false,
  rows,
  fullWidth = false,
  autoFocus = false,
  type = 'text',
  InputProps,
  select = false,
  children,
  className,
  style,
  ...rest
}) {
  const reactId = useId();
  const fieldId = id || `tf-${reactId}`;
  const helperId = helperText ? `${fieldId}-help` : undefined;

  const errorStyle = error ? { borderColor: COLORS.error } : null;
  const inputProps = InputProps || {};

  const control = select ? (
    <Select
      id={fieldId}
      value={value}
      onChange={onChange}
      fullWidth={fullWidth}
      autoFocus={autoFocus}
      aria-describedby={helperId}
      aria-invalid={error || undefined}
      style={errorStyle || undefined}
      {...rest}
    >
      {children}
    </Select>
  ) : (
    <Input
      id={fieldId}
      value={value}
      onChange={onChange}
      type={type}
      multiline={multiline}
      rows={rows}
      fullWidth={fullWidth}
      autoFocus={autoFocus}
      aria-describedby={helperId}
      aria-invalid={error || undefined}
      style={errorStyle || undefined}
      {...inputProps}
      {...rest}
    />
  );

  return (
    <FormControl fullWidth={fullWidth} className={className} style={style}>
      {label != null && <InputLabel htmlFor={fieldId}>{label}</InputLabel>}
      {control}
      {helperText != null && (
        <FormHelperText id={helperId} error={error}>
          {helperText}
        </FormHelperText>
      )}
    </FormControl>
  );
}

TextField.propTypes = {
  id: PropTypes.string,
  label: PropTypes.node,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  helperText: PropTypes.node,
  error: PropTypes.bool,
  multiline: PropTypes.bool,
  rows: PropTypes.number,
  fullWidth: PropTypes.bool,
  autoFocus: PropTypes.bool,
  type: PropTypes.string,
  InputProps: PropTypes.object,
  select: PropTypes.bool,
  children: PropTypes.node,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default TextField;
