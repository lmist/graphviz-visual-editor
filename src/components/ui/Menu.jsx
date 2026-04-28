import React from 'react';
import PropTypes from 'prop-types';
import { Menu as BaseMenu } from '@base-ui-components/react/menu';
import { COLORS, BORDERS, SHADOWS, SPACING } from '../../design/tokens.js';

const popupStyle = {
  background: COLORS.bg,
  border: BORDERS.thick,
  boxShadow: SHADOWS.hover,
  color: COLORS.fg,
  padding: `${SPACING.xs}px 0`,
  margin: 0,
  outline: 'none',
  listStyle: 'none',
  minWidth: 184,
};

const positionerStyle = {
  zIndex: 1500,
};

// The wrapper accepts an imperative `anchorEl` (a DOM node held by the
// parent) instead of a child Trigger, matching MUI's classic Menu API.
// finalFocus restores focus to that anchor on close — without it,
// closing the menu via ESC or item-activation drops focus on document
// body and breaks keyboard-only flows.
function Menu({ id, anchorEl, open, onClose, children }) {
  const handleOpenChange = (next) => {
    if (!next && onClose) onClose();
  };

  const finalFocus = React.useCallback(() => {
    if (anchorEl && typeof anchorEl.focus === 'function') {
      return anchorEl;
    }
    return true;
  }, [anchorEl]);

  return (
    <BaseMenu.Root open={open} onOpenChange={handleOpenChange}>
      <BaseMenu.Portal>
        <BaseMenu.Positioner anchor={anchorEl} sideOffset={4} style={positionerStyle}>
          <BaseMenu.Popup id={id} style={popupStyle} finalFocus={finalFocus}>
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
