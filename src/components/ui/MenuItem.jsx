import React from 'react';
import PropTypes from 'prop-types';
import { COLORS, SPACING, TYPOGRAPHY, MOTION } from '../../design/tokens.js';

// Single primitive shared by both Menu.Popup and Select.Popup contexts.
// The parent popup decides ARIA role: pass role="option" inside Select,
// otherwise default `menuitem` covers Menu usage. Keeping styling and
// prop surface unified avoids two near-identical components — the only
// real divergence between Base UI's Menu.Item and Select.Item is the
// role and the `value` semantics (Select reads it for selection; Menu
// ignores it). Passing `value` through as a data attribute keeps the
// prop available to both consumers without coupling this primitive to
// either one.

const baseStyle = {
  fontFamily: TYPOGRAPHY.ui,
  fontSize: TYPOGRAPHY.sizes.body,
  fontWeight: 400,
  color: COLORS.fg,
  background: COLORS.bg,
  padding: `${SPACING.xs}px ${SPACING.sm}px`,
  margin: 0,
  listStyle: 'none',
  cursor: 'pointer',
  userSelect: 'none',
  whiteSpace: 'nowrap',
  transition: `background-color ${MOTION.duration} ${MOTION.easing}, color ${MOTION.duration} ${MOTION.easing}`,
};

const disabledStyle = {
  color: COLORS.muted,
  cursor: 'not-allowed',
  pointerEvents: 'none',
};

function MenuItem({
  id,
  value,
  children,
  onClick,
  disabled = false,
  role = 'menuitem',
  className,
  style,
  ...rest
}) {
  const mergedStyle = {
    ...baseStyle,
    ...(disabled ? disabledStyle : null),
    ...style,
  };

  // Hover invert: swap fg/bg so the hovered row reads as a hard black bar
  // with white text. This matches STYLE.md's "honest, not decorative"
  // rule — accent is reserved for selection/focus, not casual hover.
  const handleMouseEnter = (e) => {
    if (disabled) return;
    e.currentTarget.style.background = COLORS.fg;
    e.currentTarget.style.color = COLORS.bg;
  };
  const handleMouseLeave = (e) => {
    if (disabled) return;
    e.currentTarget.style.background = COLORS.bg;
    e.currentTarget.style.color = COLORS.fg;
  };

  return (
    <li
      id={id}
      role={role}
      aria-disabled={disabled || undefined}
      data-value={value}
      onClick={disabled ? undefined : onClick}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      className={className}
      style={mergedStyle}
      tabIndex={disabled ? -1 : 0}
      {...rest}
    >
      {children}
    </li>
  );
}

MenuItem.propTypes = {
  id: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  children: PropTypes.node,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  role: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default MenuItem;
export { MenuItem };
