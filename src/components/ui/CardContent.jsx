import React from 'react';
import PropTypes from 'prop-types';
import { SPACING } from '../../design/tokens.js';

const baseStyle = {
  padding: SPACING.md,
};

function CardContent({ children, className, style, ...rest }) {
  const resolvedStyle = { ...baseStyle, ...style };

  return (
    <div className={className} style={resolvedStyle} {...rest}>
      {children}
    </div>
  );
}

CardContent.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default CardContent;
