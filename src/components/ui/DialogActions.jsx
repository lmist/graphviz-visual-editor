import React from 'react';
import PropTypes from 'prop-types';
import { BORDERS, SPACING } from '../../design/tokens.js';

const baseStyle = {
  display: 'flex',
  flexDirection: 'row',
  justifyContent: 'flex-end',
  alignItems: 'center',
  gap: SPACING.sm,
  padding: `${SPACING.sm}px ${SPACING.lg}px ${SPACING.md}px`,
  borderTop: BORDERS.thin,
  flex: '0 0 auto',
};

function DialogActions({ id, className, style, children, ...rest }) {
  const resolvedStyle = { ...baseStyle, ...style };

  return (
    <div id={id} className={className} style={resolvedStyle} {...rest}>
      {children}
    </div>
  );
}

DialogActions.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.node,
};

export default DialogActions;
