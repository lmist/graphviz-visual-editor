import React from 'react';
import PropTypes from 'prop-types';
import { SPACING } from '../../design/tokens.js';

const baseStyle = {
  padding: `${SPACING.sm}px ${SPACING.md}px ${SPACING.md}px`,
};

function AccordionDetails({ children, className, style, ...rest }) {
  const resolvedStyle = { ...baseStyle, ...style };

  return (
    <div className={className} style={resolvedStyle} {...rest}>
      {children}
    </div>
  );
}

AccordionDetails.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default AccordionDetails;
