import React from 'react';
import PropTypes from 'prop-types';
import { COLORS, SPACING, TYPOGRAPHY, BORDERS } from '../../design/tokens.js';

const baseFieldStyle = {
  fontFamily: TYPOGRAPHY.ui,
  fontSize: TYPOGRAPHY.sizes.body,
  fontWeight: 400,
  color: COLORS.fg,
  background: COLORS.bg,
  padding: `${SPACING.xs}px ${SPACING.sm}px`,
  margin: 0,
  boxSizing: 'border-box',
  outline: 'none',
};

const wrapperStyle = (fullWidth) => ({
  display: 'inline-flex',
  alignItems: 'center',
  border: BORDERS.thin,
  background: COLORS.bg,
  width: fullWidth ? '100%' : undefined,
});

const bareFieldStyle = (fullWidth) => ({
  ...baseFieldStyle,
  border: BORDERS.thin,
  width: fullWidth ? '100%' : undefined,
  display: fullWidth ? 'block' : 'inline-block',
});

const adornedFieldStyle = {
  ...baseFieldStyle,
  border: 'none',
  flex: 1,
  minWidth: 0,
};

const adornmentSlotStyle = {
  fontFamily: TYPOGRAPHY.ui,
  fontSize: TYPOGRAPHY.sizes.body,
  color: COLORS.muted,
  padding: `0 ${SPACING.sm}px`,
  display: 'inline-flex',
  alignItems: 'center',
  whiteSpace: 'nowrap',
};

const focusRingProps = {
  onFocus: (e) => {
    e.currentTarget.style.outline = BORDERS.thick;
    e.currentTarget.style.outlineOffset = '2px';
  },
  onBlur: (e) => {
    e.currentTarget.style.outline = 'none';
  },
};

function Input({
  value,
  onChange,
  type = 'text',
  multiline = false,
  rows,
  fullWidth = false,
  autoFocus = false,
  endAdornment,
  startAdornment,
  className,
  style,
  ...rest
}) {
  const hasAdornment = Boolean(startAdornment || endAdornment);

  const commonProps = {
    value,
    onChange,
    autoFocus,
    ...rest,
  };

  if (multiline) {
    const textareaStyle = hasAdornment
      ? { ...adornedFieldStyle, resize: 'vertical', ...style }
      : { ...bareFieldStyle(fullWidth), resize: 'vertical', ...style };
    const textarea = (
      <textarea
        {...commonProps}
        rows={rows}
        className={className}
        style={textareaStyle}
        {...(hasAdornment ? {} : focusRingProps)}
      />
    );
    if (!hasAdornment) return textarea;
    return (
      <span style={wrapperStyle(fullWidth)} {...focusRingProps} tabIndex={-1}>
        {startAdornment != null && <span style={adornmentSlotStyle}>{startAdornment}</span>}
        {textarea}
        {endAdornment != null && <span style={adornmentSlotStyle}>{endAdornment}</span>}
      </span>
    );
  }

  const inputStyle = hasAdornment
    ? { ...adornedFieldStyle, ...style }
    : { ...bareFieldStyle(fullWidth), ...style };
  const input = (
    <input
      {...commonProps}
      type={type}
      className={className}
      style={inputStyle}
      {...(hasAdornment ? {} : focusRingProps)}
    />
  );

  if (!hasAdornment) return input;

  return (
    <span style={wrapperStyle(fullWidth)}>
      {startAdornment != null && <span style={adornmentSlotStyle}>{startAdornment}</span>}
      {input}
      {endAdornment != null && <span style={adornmentSlotStyle}>{endAdornment}</span>}
    </span>
  );
}

Input.propTypes = {
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onChange: PropTypes.func,
  type: PropTypes.string,
  multiline: PropTypes.bool,
  rows: PropTypes.number,
  fullWidth: PropTypes.bool,
  autoFocus: PropTypes.bool,
  endAdornment: PropTypes.node,
  startAdornment: PropTypes.node,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default Input;
