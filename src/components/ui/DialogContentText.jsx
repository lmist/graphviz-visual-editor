import React from 'react';
import PropTypes from 'prop-types';
import { COLORS, TYPOGRAPHY } from '../../design/tokens.js';

const VARIANT_SIZE = {
  body1: TYPOGRAPHY.sizes.body,
  body2: TYPOGRAPHY.sizes.caption,
};

function DialogContentText({
  variant = 'body1',
  className,
  style,
  children,
  ...rest
}) {
  const fontSize = VARIANT_SIZE[variant] || VARIANT_SIZE.body1;
  const mergedStyle = {
    fontFamily: TYPOGRAPHY.ui,
    fontSize,
    fontWeight: 400,
    lineHeight: 1.5,
    color: COLORS.fg,
    margin: 0,
    ...style,
  };

  return (
    <p className={className} style={mergedStyle} {...rest}>
      {children}
    </p>
  );
}

DialogContentText.propTypes = {
  variant: PropTypes.oneOf(['body1', 'body2']),
  className: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.node,
};

export default DialogContentText;
