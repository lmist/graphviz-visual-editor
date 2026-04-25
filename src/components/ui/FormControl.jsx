import React from 'react';
import PropTypes from 'prop-types';
import { SPACING } from '../../design/tokens.js';

const MARGIN_MAP = {
  none: 0,
  dense: SPACING.sm,
  normal: SPACING.md,
};

const baseStyle = {
  display: 'flex',
  flexDirection: 'column',
  border: 0,
  padding: 0,
  margin: 0,
  minWidth: 0,
};

function FormControl({
  children,
  fullWidth = false,
  component: Component = 'fieldset',
  margin = 'none',
  className,
  style,
  ...rest
}) {
  const marginValue = MARGIN_MAP[margin] ?? 0;
  const resolvedStyle = {
    ...baseStyle,
    width: fullWidth ? '100%' : undefined,
    marginTop: marginValue,
    marginBottom: marginValue,
    ...style,
  };

  return (
    <Component className={className} style={resolvedStyle} {...rest}>
      {children}
    </Component>
  );
}

FormControl.propTypes = {
  children: PropTypes.node,
  fullWidth: PropTypes.bool,
  component: PropTypes.elementType,
  margin: PropTypes.oneOf(['none', 'dense', 'normal']),
  className: PropTypes.string,
  style: PropTypes.object,
};

export default FormControl;
