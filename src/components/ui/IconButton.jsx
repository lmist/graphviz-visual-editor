import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { BORDERS, COLORS, MOTION } from '../../design/tokens.js';

const baseStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: 40,
  height: 40,
  padding: 0,
  margin: 0,
  border: BORDERS.thick,
  borderColor: COLORS.fg,
  borderRadius: BORDERS.radius,
  background: COLORS.bg,
  color: COLORS.fg,
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

function IconButton({
  onClick,
  // `color` and `size` are accepted for API parity with MUI but ignored
  // visually — the brutalist system uses one 40px square look.
  color: _color,
  size: _size,
  disabled = false,
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

IconButton.propTypes = {
  onClick: PropTypes.func,
  color: PropTypes.string,
  size: PropTypes.string,
  disabled: PropTypes.bool,
  id: PropTypes.string,
  type: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  'aria-label': PropTypes.string,
  children: PropTypes.node,
};

export default IconButton;
