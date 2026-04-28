import React from 'react';
import PropTypes from 'prop-types';
import { SPACING } from '../../design/tokens.js';

const baseStyle = {
  display: 'grid',
  gap: SPACING.md,
  padding: `${SPACING.md}px ${SPACING.lg}px ${SPACING.lg}px`,
  overflowY: 'auto',
  minWidth: 0,
  flex: '1 1 auto',
};

function DialogContent({ id, children, className, classes, style, ...rest }) {
  void classes;
  const resolvedStyle = { ...baseStyle, ...style };

  return (
    <div id={id} className={className} style={resolvedStyle} {...rest}>
      {children}
    </div>
  );
}

DialogContent.propTypes = {
  id: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  classes: PropTypes.object,
  style: PropTypes.object,
};

export default DialogContent;
