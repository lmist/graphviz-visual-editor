import React from 'react';
import PropTypes from 'prop-types';
import { COLORS } from '../../design/tokens.js';

const baseStyle = {
  display: 'flex',
  alignItems: 'center',
  width: '100%',
  background: COLORS.bg,
  color: COLORS.fg,
  borderBottom: '2px solid #000',
  boxShadow: 'none',
  boxSizing: 'border-box',
};

function AppBar({ position = 'static', children, className, style, ...rest }) {
  const resolvedStyle = {
    ...baseStyle,
    position,
    top: position === 'sticky' || position === 'fixed' ? 0 : undefined,
    left: position === 'fixed' ? 0 : undefined,
    right: position === 'fixed' ? 0 : undefined,
    zIndex: position === 'sticky' || position === 'fixed' ? 1100 : undefined,
    ...style,
  };

  return (
    <header className={className} style={resolvedStyle} {...rest}>
      {children}
    </header>
  );
}

AppBar.propTypes = {
  position: PropTypes.oneOf(['static', 'sticky', 'fixed', 'absolute', 'relative']),
  children: PropTypes.node,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default AppBar;
