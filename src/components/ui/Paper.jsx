import React from 'react';
import PropTypes from 'prop-types';
import { BORDERS, COLORS } from '../../design/tokens.js';

const baseStyle = {
  backgroundColor: COLORS.bg,
  border: BORDERS.thin,
  borderRadius: BORDERS.radius,
};

// eslint-disable-next-line no-unused-vars
function Paper({ id, elevation, className, style, children, ...rest }) {
  const resolvedStyle = { ...baseStyle, ...style };

  return (
    <div id={id} className={className} style={resolvedStyle} {...rest}>
      {children}
    </div>
  );
}

Paper.propTypes = {
  id: PropTypes.string,
  elevation: PropTypes.number,
  className: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.node,
};

export default Paper;
