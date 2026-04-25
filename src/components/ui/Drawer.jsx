import React from 'react';
import PropTypes from 'prop-types';
import { Dialog as BaseDialog } from '@base-ui-components/react/dialog';
import './baseUiAriaInertShim.js';
import { COLORS, BORDERS } from '../../design/tokens.js';

const basePanelStyle = {
  background: COLORS.bg,
  color: COLORS.fg,
  boxSizing: 'border-box',
  display: 'flex',
  flexDirection: 'column',
  overflow: 'auto',
};

const backdropStyle = {
  position: 'fixed',
  inset: 0,
  background: 'rgba(0, 0, 0, 0.4)',
};

function getAnchorStyle(anchor, variant) {
  const innerEdge = anchor === 'right' ? 'borderLeft' : 'borderRight';
  const style = {
    ...basePanelStyle,
    [innerEdge]: BORDERS.thin,
  };
  if (variant === 'temporary') {
    style.position = 'fixed';
    style.top = 0;
    style.bottom = 0;
    style[anchor === 'right' ? 'right' : 'left'] = 0;
    style.height = '100vh';
  } else {
    style.position = 'relative';
    style.height = '100%';
  }
  return style;
}

function Drawer({
  open = false,
  onClose,
  anchor = 'left',
  variant = 'temporary',
  id,
  children,
  className,
  style,
  ...rest
}) {
  const panelStyle = { ...getAnchorStyle(anchor, variant), ...style };

  if (variant === 'persistent') {
    if (!open) return null;
    return (
      <div id={id} className={className} style={panelStyle} {...rest}>
        {children}
      </div>
    );
  }

  const handleOpenChange = (nextOpen) => {
    if (!nextOpen && onClose) onClose();
  };

  return (
    <BaseDialog.Root open={open} onOpenChange={handleOpenChange} {...rest}>
      <BaseDialog.Portal>
        <BaseDialog.Backdrop style={backdropStyle} />
        <BaseDialog.Popup id={id} className={className} style={panelStyle}>
          {children}
        </BaseDialog.Popup>
      </BaseDialog.Portal>
    </BaseDialog.Root>
  );
}

Drawer.propTypes = {
  open: PropTypes.bool,
  onClose: PropTypes.func,
  anchor: PropTypes.oneOf(['left', 'right']),
  variant: PropTypes.oneOf(['persistent', 'temporary']),
  id: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default Drawer;
export { Drawer };
