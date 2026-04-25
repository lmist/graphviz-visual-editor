import React from 'react';
import PropTypes from 'prop-types';
import { COLORS, SPACING, TYPOGRAPHY } from '../../design/tokens.js';

const baseStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  fontFamily: TYPOGRAPHY.mono,
  fontSize: TYPOGRAPHY.sizes.body,
  color: COLORS.muted,
  whiteSpace: 'nowrap',
};

function InputAdornment({ position = 'end', children, className, style, ...rest }) {
  const positionStyle =
    position === 'start'
      ? { paddingRight: SPACING.sm }
      : { paddingLeft: SPACING.sm };

  return (
    <span
      className={className}
      style={{ ...baseStyle, ...positionStyle, ...style }}
      {...rest}
    >
      {children}
    </span>
  );
}

InputAdornment.propTypes = {
  position: PropTypes.oneOf(['start', 'end']),
  children: PropTypes.node,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default InputAdornment;
