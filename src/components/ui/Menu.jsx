import React from 'react';
import PropTypes from 'prop-types';
import { Menu as BaseMenu } from '@base-ui-components/react/menu';
import { COLORS, BORDERS, SHADOWS } from '../../design/tokens.js';

const popupStyle = {
  background: COLORS.bg,
  border: BORDERS.thick,
  boxShadow: SHADOWS.hover,
  color: COLORS.fg,
  padding: 0,
  margin: 0,
  outline: 'none',
  listStyle: 'none',
};

function Menu({ id, anchorEl, open, onClose, children }) {
  const handleOpenChange = (next) => {
    if (!next && onClose) onClose();
  };

  return (
    <BaseMenu.Root open={open} onOpenChange={handleOpenChange}>
      <BaseMenu.Portal>
        <BaseMenu.Positioner anchor={anchorEl} sideOffset={4}>
          <BaseMenu.Popup id={id} style={popupStyle}>
            {children}
          </BaseMenu.Popup>
        </BaseMenu.Positioner>
      </BaseMenu.Portal>
    </BaseMenu.Root>
  );
}

Menu.propTypes = {
  id: PropTypes.string,
  anchorEl: PropTypes.any,
  open: PropTypes.bool,
  onClose: PropTypes.func,
  children: PropTypes.node,
};

export default Menu;
export { Menu };
