import React from 'react';
import PropTypes from 'prop-types';
import { Dialog as BaseDialog } from '@base-ui-components/react/dialog';
import './baseUiAriaInertShim.js';
import { BORDERS, COLORS, SHADOWS, SPACING } from '../../design/tokens.js';

const MAX_WIDTHS = {
  xs: 444,
  sm: 600,
  md: 960,
  lg: 1280,
  xl: 1920,
};

const backdropStyle = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0, 0, 0, 0.4)',
  zIndex: 1300,
};

const positionerStyle = {
  position: 'fixed',
  inset: 0,
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  padding: `clamp(${SPACING.sm}px, 3vw, ${SPACING.xl}px)`,
  zIndex: 1300,
  pointerEvents: 'none',
};

const basePopupStyle = {
  background: COLORS.bg,
  color: COLORS.fg,
  border: BORDERS.thick,
  borderRadius: BORDERS.radius,
  boxShadow: SHADOWS.deep,
  display: 'flex',
  flexDirection: 'column',
  boxSizing: 'border-box',
  pointerEvents: 'auto',
  minWidth: 0,
};

function resolvePopupStyle({ fullWidth, maxWidth, scroll, style }) {
  const resolved = { ...basePopupStyle };

  const widthCap = maxWidth === false ? null : MAX_WIDTHS[maxWidth] || MAX_WIDTHS.sm;
  if (widthCap != null) {
    resolved.maxWidth = widthCap;
  }
  if (fullWidth) {
    resolved.width = '100%';
  }

  resolved.maxHeight = `calc(100dvh - clamp(${SPACING.md}px, 6vw, ${SPACING.xl * 2}px))`;
  if (scroll === 'body') {
    resolved.overflowY = 'auto';
  } else {
    resolved.overflow = 'hidden';
  }

  return { ...resolved, ...style };
}

function Dialog({
  open = false,
  onClose,
  fullWidth = false,
  maxWidth = 'sm',
  scroll = 'paper',
  id,
  className,
  style,
  children,
  ...rest
}) {
  const handleOpenChange = (nextOpen) => {
    if (!nextOpen && onClose) onClose();
  };

  const popupStyle = resolvePopupStyle({ fullWidth, maxWidth, scroll, style });

  return (
    <BaseDialog.Root open={open} onOpenChange={handleOpenChange}>
      {open && (
        <BaseDialog.Portal>
          <BaseDialog.Backdrop style={backdropStyle} />
          <div style={positionerStyle}>
            <BaseDialog.Popup
              id={id}
              className={className}
              style={popupStyle}
              {...rest}
            >
              {children}
            </BaseDialog.Popup>
          </div>
        </BaseDialog.Portal>
      )}
    </BaseDialog.Root>
  );
}

Dialog.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  fullWidth: PropTypes.bool,
  maxWidth: PropTypes.oneOf(['xs', 'sm', 'md', 'lg', 'xl', false]),
  scroll: PropTypes.oneOf(['paper', 'body']),
  id: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.node,
};

export default Dialog;
export { Dialog };
