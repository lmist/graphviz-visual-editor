import React from 'react';
import PropTypes from 'prop-types';
import { SPACING } from '../../design/tokens.js';

const baseStyle = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  flexWrap: 'nowrap',
  height: 56,
  width: '100%',
  gap: SPACING.md,
  paddingLeft: SPACING.lg,
  paddingRight: SPACING.lg,
  overflowX: 'auto',
  overflowY: 'hidden',
  scrollbarWidth: 'none',
  boxSizing: 'border-box',
};

function Toolbar({ id, className, style, children, ...rest }) {
  const resolvedStyle = { ...baseStyle, ...style };

  return (
    <div id={id} className={className} style={resolvedStyle} {...rest}>
      {children}
    </div>
  );
}

Toolbar.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.node,
};

export default Toolbar;
