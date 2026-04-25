import React from 'react';
import PropTypes from 'prop-types';
import { SPACING } from '../../design/tokens.js';

const baseStyle = {
  padding: `${SPACING.sm}px ${SPACING.md}px ${SPACING.md}px`,
  overflowY: 'auto',
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
