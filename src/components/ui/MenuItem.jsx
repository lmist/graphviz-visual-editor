import React from 'react';
import PropTypes from 'prop-types';
import { Menu as BaseMenu } from '@base-ui-components/react/menu';
import { COLORS, SPACING, TYPOGRAPHY, MOTION } from '../../design/tokens.js';

// Renders BaseMenu.Item so the parent Menu's keyboard navigation
// (arrow keys, type-ahead, roving focus) registers each row. A plain
// <li> would render visually but stay invisible to Menu's roving
// focus controller.
//
// MenuItem is also accepted as a child of Select for ergonomic parity
// with MUI, but Select.jsx maps those children into BaseSelect.Item
// before render — MenuItem itself is never mounted inside a Select,
// so depending on BaseMenu.Item context here is safe.

const baseStyle = {
  fontFamily: TYPOGRAPHY.ui,
  fontSize: TYPOGRAPHY.sizes.body,
  fontWeight: 400,
  color: COLORS.fg,
  background: COLORS.bg,
  minHeight: 32,
  padding: `${SPACING.xs}px ${SPACING.md}px`,
  margin: 0,
  listStyle: 'none',
  cursor: 'pointer',
  display: 'flex',
  alignItems: 'center',
  userSelect: 'none',
  whiteSpace: 'nowrap',
  outline: 'none',
  transition: `background-color ${MOTION.duration} ${MOTION.easing}, color ${MOTION.duration} ${MOTION.easing}`,
};

const disabledStyle = {
  color: COLORS.muted,
  cursor: 'not-allowed',
};

// Hover/highlight invert: swap fg/bg so the active row reads as a hard
// black bar with white text. Base UI sets data-highlighted on the
// keyboard-focused row; we apply the same visuals for hover via JS.
function MenuItem({
  id,
  value,
  children,
  onClick,
  disabled = false,
  className,
  style,
  ...rest
}) {
  const mergedStyle = {
    ...baseStyle,
    ...(disabled ? disabledStyle : null),
    ...style,
  };

  const applyActive = (el) => {
    el.style.background = COLORS.fg;
    el.style.color = COLORS.bg;
  };
  const applyIdle = (el) => {
    el.style.background = COLORS.bg;
    el.style.color = COLORS.fg;
  };

  const handleMouseEnter = (e) => {
    if (disabled) return;
    applyActive(e.currentTarget);
  };
  const handleMouseLeave = (e) => {
    if (disabled) return;
    applyIdle(e.currentTarget);
  };
  const handleFocus = (e) => {
    if (disabled) return;
    applyActive(e.currentTarget);
  };
  const handleBlur = (e) => {
    if (disabled) return;
    applyIdle(e.currentTarget);
  };

  return (
    <BaseMenu.Item
      id={id}
      data-value={value}
      onClick={disabled ? undefined : onClick}
      disabled={disabled}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      onFocus={handleFocus}
      onBlur={handleBlur}
      className={className}
      style={mergedStyle}
      {...rest}
    >
      {children}
    </BaseMenu.Item>
  );
}

MenuItem.propTypes = {
  id: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  children: PropTypes.node,
  onClick: PropTypes.func,
  disabled: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default MenuItem;
export { MenuItem };
