import React from 'react';
import PropTypes from 'prop-types';
import { SPACING } from '../../design/tokens.js';

const baseStyle = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  height: 56,
  gap: SPACING.md,
  paddingLeft: SPACING.md,
  paddingRight: SPACING.md,
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
