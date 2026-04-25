import React from 'react';
import PropTypes from 'prop-types';
import { COLORS } from '../../design/tokens.js';

const baseStyle = {
  border: 0,
  margin: 0,
  flexShrink: 0,
  backgroundColor: COLORS.fg,
};

function Divider({ orientation = 'horizontal', className, style, ...rest }) {
  const isVertical = orientation === 'vertical';
  const resolvedStyle = {
    ...baseStyle,
    width: isVertical ? 1 : '100%',
    height: isVertical ? 'auto' : 1,
    alignSelf: isVertical ? 'stretch' : undefined,
    ...style,
  };

  return (
    <hr
      className={className}
      style={resolvedStyle}
      aria-orientation={isVertical ? 'vertical' : undefined}
      {...rest}
    />
  );
}

Divider.propTypes = {
  orientation: PropTypes.oneOf(['horizontal', 'vertical']),
  className: PropTypes.string,
  style: PropTypes.object,
};

export default Divider;
