import React from 'react';
import PropTypes from 'prop-types';
import { TYPOGRAPHY, COLORS } from '../../design/tokens.js';

const baseStyle = {
  fontFamily: TYPOGRAPHY.mono,
  fontSize: TYPOGRAPHY.sizes.caption,
  fontWeight: 500,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: COLORS.fg,
  display: 'block',
};

function InputLabel({
  htmlFor,
  children,
  // shrink is accepted for MUI API parity but is a no-op: the
  // brutalist label is always small/uppercase regardless.
  // eslint-disable-next-line no-unused-vars
  shrink,
  className,
  style,
  ...rest
}) {
  const mergedStyle = { ...baseStyle, ...style };
  return (
    <label htmlFor={htmlFor} className={className} style={mergedStyle} {...rest}>
      {children}
    </label>
  );
}

InputLabel.propTypes = {
  htmlFor: PropTypes.string,
  children: PropTypes.node,
  shrink: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default InputLabel;
export { InputLabel };
