import React from 'react';
import PropTypes from 'prop-types';
import { COLORS, TYPOGRAPHY } from '../../design/tokens.js';

const baseStyle = {
  fontFamily: TYPOGRAPHY.mono,
  fontSize: TYPOGRAPHY.sizes.caption,
  textTransform: 'uppercase',
  letterSpacing: '0.05em',
  color: COLORS.fg,
  padding: 0,
  margin: 0,
};

function FormLabel({
  children,
  component: Component = 'legend',
  className,
  style,
  ...rest
}) {
  const resolvedStyle = { ...baseStyle, ...style };
  return (
    <Component className={className} style={resolvedStyle} {...rest}>
      {children}
    </Component>
  );
}

FormLabel.propTypes = {
  children: PropTypes.node,
  component: PropTypes.elementType,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default FormLabel;
