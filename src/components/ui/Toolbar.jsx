import React from 'react';
import PropTypes from 'prop-types';
import { SPACING } from '../../design/tokens.js';

const baseStyle = {
  display: 'flex',
  flexDirection: 'row',
  alignItems: 'center',
  alignContent: 'center',
  flexWrap: 'wrap',
  minHeight: 56,
  width: '100%',
  gap: SPACING.sm,
  paddingLeft: SPACING.md,
  paddingRight: SPACING.md,
  paddingTop: SPACING.xs,
  paddingBottom: SPACING.xs,
  overflow: 'visible',
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
