import React from 'react';
import PropTypes from 'prop-types';
import { COLORS, SPACING, TYPOGRAPHY } from '../../design/tokens.js';

const PLACEMENT_DIRECTION = {
  end: 'row',
  start: 'row-reverse',
  top: 'column-reverse',
  bottom: 'column',
};

const baseStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  gap: SPACING.sm,
  cursor: 'pointer',
  fontFamily: TYPOGRAPHY.ui,
  fontSize: TYPOGRAPHY.sizes.body,
  fontWeight: 400,
  color: COLORS.fg,
  userSelect: 'none',
};

function FormControlLabel({
  control,
  label,
  value,
  labelPlacement = 'end',
  disabled = false,
  className,
  style,
  ...rest
}) {
  const direction = PLACEMENT_DIRECTION[labelPlacement] ?? 'row';
  const resolvedStyle = {
    ...baseStyle,
    flexDirection: direction,
    ...(disabled ? { color: COLORS.muted, cursor: 'not-allowed' } : null),
    ...style,
  };

  const controlProps = {};
  if (value !== undefined) controlProps.value = value;
  if (disabled) controlProps.disabled = true;
  const resolvedControl = React.cloneElement(control, controlProps);

  return (
    <label className={className} style={resolvedStyle} {...rest}>
      {resolvedControl}
      <span>{label}</span>
    </label>
  );
}

FormControlLabel.propTypes = {
  control: PropTypes.element.isRequired,
  label: PropTypes.node,
  value: PropTypes.any,
  labelPlacement: PropTypes.oneOf(['start', 'end', 'top', 'bottom']),
  disabled: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default FormControlLabel;
export { FormControlLabel };
