import React from 'react';
import PropTypes from 'prop-types';
import { BORDERS, COLORS, SHADOWS, SPACING, TYPOGRAPHY } from '../../design/tokens.js';

const DEFAULT_ANCHOR = { vertical: 'bottom', horizontal: 'left' };

const verticalStyle = {
  top: { top: SPACING.lg, bottom: 'auto' },
  bottom: { top: 'auto', bottom: SPACING.lg },
};

const horizontalStyle = {
  left: { left: SPACING.lg, right: 'auto', transform: 'none' },
  right: { left: 'auto', right: SPACING.lg, transform: 'none' },
  center: { left: '50%', right: 'auto', transform: 'translateX(-50%)' },
};

const baseStyle = {
  position: 'fixed',
  zIndex: 1400,
  minWidth: 240,
  maxWidth: '100vw',
  background: COLORS.bg,
  color: COLORS.fg,
  border: BORDERS.thick,
  boxShadow: SHADOWS.hover,
  fontFamily: TYPOGRAPHY.ui,
  fontSize: TYPOGRAPHY.sizes.body,
  padding: `${SPACING.sm}px ${SPACING.md}px`,
  display: 'flex',
  alignItems: 'center',
  gap: SPACING.md,
  borderRadius: BORDERS.radius,
};

const messageStyle = {
  flex: '1 1 auto',
  minWidth: 0,
};

const actionStyle = {
  flex: '0 0 auto',
  display: 'flex',
  alignItems: 'center',
  gap: SPACING.xs,
};

function Snackbar({
  open,
  onClose,
  autoHideDuration,
  anchorOrigin = DEFAULT_ANCHOR,
  message,
  action,
  children,
  className,
  style,
  ...rest
}) {
  React.useEffect(() => {
    if (!open) return undefined;
    if (autoHideDuration == null) return undefined;
    if (typeof onClose !== 'function') return undefined;
    const timer = setTimeout(() => {
      onClose(null, 'timeout');
    }, autoHideDuration);
    return () => clearTimeout(timer);
  }, [open, autoHideDuration, onClose]);

  if (!open) return null;

  const vertical = (anchorOrigin && anchorOrigin.vertical) || DEFAULT_ANCHOR.vertical;
  const horizontal = (anchorOrigin && anchorOrigin.horizontal) || DEFAULT_ANCHOR.horizontal;

  const resolvedStyle = {
    ...baseStyle,
    ...(verticalStyle[vertical] || verticalStyle.bottom),
    ...(horizontalStyle[horizontal] || horizontalStyle.left),
    ...style,
  };

  return (
    <div
      role="alert"
      aria-live="polite"
      className={className}
      style={resolvedStyle}
      {...rest}
    >
      {children != null ? (
        children
      ) : (
        <>
          {message != null && <div style={messageStyle}>{message}</div>}
          {action != null && <div style={actionStyle}>{action}</div>}
        </>
      )}
    </div>
  );
}

Snackbar.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  autoHideDuration: PropTypes.number,
  anchorOrigin: PropTypes.shape({
    vertical: PropTypes.oneOf(['top', 'bottom']),
    horizontal: PropTypes.oneOf(['left', 'center', 'right']),
  }),
  message: PropTypes.node,
  action: PropTypes.node,
  children: PropTypes.node,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default Snackbar;
