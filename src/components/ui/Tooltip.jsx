import React from 'react';
import PropTypes from 'prop-types';
import { Tooltip as BaseTooltip } from '@base-ui-components/react/tooltip';
import { BORDERS, COLORS, SPACING, TYPOGRAPHY } from '../../design/tokens.js';

const PLACEMENT_MAP = {
  top: { side: 'top', align: 'center' },
  'top-start': { side: 'top', align: 'start' },
  'top-end': { side: 'top', align: 'end' },
  bottom: { side: 'bottom', align: 'center' },
  'bottom-start': { side: 'bottom', align: 'start' },
  'bottom-end': { side: 'bottom', align: 'end' },
  left: { side: 'left', align: 'center' },
  'left-start': { side: 'left', align: 'start' },
  'left-end': { side: 'left', align: 'end' },
  right: { side: 'right', align: 'center' },
  'right-start': { side: 'right', align: 'start' },
  'right-end': { side: 'right', align: 'end' },
};

const popupStyle = {
  background: COLORS.bg,
  color: COLORS.fg,
  border: BORDERS.thin,
  borderRadius: BORDERS.radius,
  fontFamily: TYPOGRAPHY.mono,
  fontSize: TYPOGRAPHY.sizes.caption,
  lineHeight: 1.4,
  padding: `${SPACING.xs}px ${SPACING.sm}px`,
  maxWidth: 320,
  boxShadow: 'none',
  zIndex: 1500,
};

function Tooltip({
  title,
  placement = 'bottom',
  enterDelay = 0,
  children,
}) {
  if (title == null || title === '' || title === false) {
    return children;
  }

  const { side, align } = PLACEMENT_MAP[placement] || PLACEMENT_MAP.bottom;

  return (
    <BaseTooltip.Provider delay={enterDelay}>
      <BaseTooltip.Root>
        <BaseTooltip.Trigger render={children} />
        <BaseTooltip.Portal>
          <BaseTooltip.Positioner side={side} align={align} sideOffset={SPACING.xs}>
            <BaseTooltip.Popup style={popupStyle}>{title}</BaseTooltip.Popup>
          </BaseTooltip.Positioner>
        </BaseTooltip.Portal>
      </BaseTooltip.Root>
    </BaseTooltip.Provider>
  );
}

Tooltip.propTypes = {
  title: PropTypes.node,
  placement: PropTypes.oneOf(Object.keys(PLACEMENT_MAP)),
  enterDelay: PropTypes.number,
  children: PropTypes.element.isRequired,
};

export default Tooltip;
export { Tooltip };
