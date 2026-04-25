import React from 'react';
import PropTypes from 'prop-types';
import { SPACING } from '../../design/tokens.js';

const baseStyle = {
  display: 'flex',
  flexWrap: 'wrap',
  gap: SPACING.sm,
};

function FormGroup({ children, row = false, className, style, ...rest }) {
  const resolvedStyle = {
    ...baseStyle,
    flexDirection: row ? 'row' : 'column',
    ...style,
  };

  return (
    <div className={className} style={resolvedStyle} {...rest}>
      {children}
    </div>
  );
}

FormGroup.propTypes = {
  children: PropTypes.node,
  row: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default FormGroup;
