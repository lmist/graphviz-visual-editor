import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { BORDERS, COLORS, MOTION, SPACING, TYPOGRAPHY } from '../../design/tokens.js';

const baseStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  gap: SPACING.xs,
  padding: `${SPACING.xs}px ${SPACING.md}px`,
  margin: 0,
  border: BORDERS.thick,
  borderColor: COLORS.fg,
  borderRadius: BORDERS.radius,
  background: COLORS.bg,
  color: COLORS.fg,
  fontFamily: TYPOGRAPHY.ui,
  fontSize: TYPOGRAPHY.sizes.body,
  fontWeight: 600,
  lineHeight: 1.2,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  boxSizing: 'border-box',
  appearance: 'none',
  WebkitAppearance: 'none',
  cursor: 'pointer',
  transition: `background ${MOTION.duration} ${MOTION.easing}, color ${MOTION.duration} ${MOTION.easing}`,
};

const hoverStyle = {
  background: COLORS.fg,
  color: COLORS.bg,
};

const disabledStyle = {
  cursor: 'not-allowed',
  opacity: 0.5,
};

function Button({
  onClick,
  // `color` and `variant` are accepted for API parity with MUI but
  // ignored visually — the brutalist system uses one button look
  // (see src/design/STYLE.md). Disabled is the only state shift.
  color: _color,
  variant: _variant,
  disabled = false,
  autoFocus = false,
  id,
  type = 'button',
  className,
  style,
  children,
  ...rest
}) {
  const [hovered, setHovered] = useState(false);

  const resolvedStyle = {
    ...baseStyle,
    ...(hovered && !disabled ? hoverStyle : null),
    ...(disabled ? disabledStyle : null),
    ...style,
  };

  return (
    <button
      id={id}
      type={type}
      onClick={onClick}
      disabled={disabled}
      autoFocus={autoFocus}
      className={className}
      style={resolvedStyle}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      {...rest}
    >
      {children}
    </button>
  );
}

Button.propTypes = {
  onClick: PropTypes.func,
  color: PropTypes.string,
  variant: PropTypes.string,
  disabled: PropTypes.bool,
  autoFocus: PropTypes.bool,
  id: PropTypes.string,
  type: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.node,
};

export default Button;
