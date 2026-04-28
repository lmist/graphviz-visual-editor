import React from 'react';
import PropTypes from 'prop-types';
import { BORDERS, COLORS, SHADOWS } from '../../design/tokens.js';

const baseStyle = {
  backgroundColor: COLORS.bg,
  border: BORDERS.thin,
  borderRadius: BORDERS.radius,
  overflow: 'hidden',
};

function Card({ id, raised = false, className, style, children, ...rest }) {
  const resolvedStyle = {
    ...baseStyle,
    ...(raised ? { boxShadow: SHADOWS.hover } : null),
    ...style,
  };

  return (
    <article id={id} className={className} style={resolvedStyle} {...rest}>
      {children}
    </article>
  );
}

Card.propTypes = {
  id: PropTypes.string,
  raised: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.node,
};

export default Card;
