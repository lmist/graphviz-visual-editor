import React from 'react';
import PropTypes from 'prop-types';
import { BORDERS, SPACING, TYPOGRAPHY } from '../../design/tokens.js';

const baseStyle = {
  margin: 0,
  padding: `${SPACING.md}px ${SPACING.lg}px`,
  fontFamily: TYPOGRAPHY.ui,
  fontSize: TYPOGRAPHY.sizes.h2,
  fontWeight: 700,
  lineHeight: 1.15,
  borderBottom: BORDERS.thin,
};

function DialogTitle({ id, className, style, children, ...rest }) {
  const resolvedStyle = { ...baseStyle, ...style };

  return (
    <h2 id={id} className={className} style={resolvedStyle} {...rest}>
      {children}
    </h2>
  );
}

DialogTitle.propTypes = {
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.node,
};

export default DialogTitle;
