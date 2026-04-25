import React from 'react';
import PropTypes from 'prop-types';
import { COLORS, TYPOGRAPHY } from '../../design/tokens.js';

const baseStyle = {
  fontFamily: TYPOGRAPHY.mono,
  fontSize: TYPOGRAPHY.sizes.caption,
  lineHeight: 1.4,
  margin: 0,
  marginTop: 4,
};

function FormHelperText({
  children,
  error = false,
  className,
  style,
  ...rest
}) {
  const resolvedStyle = {
    ...baseStyle,
    color: error ? COLORS.error : COLORS.muted,
    ...style,
  };

  return (
    <p className={className} style={resolvedStyle} {...rest}>
      {children}
    </p>
  );
}

FormHelperText.propTypes = {
  children: PropTypes.node,
  error: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default FormHelperText;
