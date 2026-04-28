import React from 'react';
import PropTypes from 'prop-types';
import { BORDERS, COLORS, SPACING, TYPOGRAPHY } from '../../design/tokens.js';

const baseStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: SPACING.md,
  padding: `${SPACING.sm}px ${SPACING.md}px`,
  backgroundColor: COLORS.bg,
  color: COLORS.fg,
  border: BORDERS.thick,
  borderRadius: BORDERS.radius,
  fontFamily: TYPOGRAPHY.ui,
  fontSize: TYPOGRAPHY.sizes.body,
  boxSizing: 'border-box',
};

const messageStyle = {
  flex: 1,
  minWidth: 0,
  overflowWrap: 'anywhere',
};

const actionStyle = {
  display: 'flex',
  alignItems: 'center',
  flexShrink: 0,
};

function SnackbarContent({
  message,
  action,
  className,
  style,
  ...rest
}) {
  const resolvedStyle = { ...baseStyle, ...style };

  return (
    <div className={className} style={resolvedStyle} {...rest}>
      <div style={messageStyle}>{message}</div>
      {action != null && <div style={actionStyle}>{action}</div>}
    </div>
  );
}

SnackbarContent.propTypes = {
  message: PropTypes.node,
  action: PropTypes.node,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default SnackbarContent;
