import React from 'react';
import PropTypes from 'prop-types';
import { Switch as BaseSwitch } from '@base-ui-components/react/switch';
import { COLORS, BORDERS, MOTION } from '../../design/tokens.js';

const WIDTH = 32;
const HEIGHT = 16;
const THUMB = 12;
const INSET = 1;

const rootStyle = (disabled) => ({
  position: 'relative',
  width: WIDTH,
  height: HEIGHT,
  display: 'inline-block',
  border: BORDERS.thin,
  borderColor: disabled ? COLORS.muted : COLORS.fg,
  background: COLORS.bg,
  padding: 0,
  margin: 0,
  boxSizing: 'border-box',
  cursor: disabled ? 'not-allowed' : 'pointer',
  opacity: disabled ? 0.5 : 1,
  outline: 'none',
  transition: `background-color ${MOTION.duration} ${MOTION.easing}`,
});

const checkedRootStyle = {
  background: COLORS.accent,
};

const thumbStyle = {
  position: 'absolute',
  top: INSET,
  left: INSET,
  width: THUMB,
  height: THUMB,
  background: COLORS.fg,
  transition: `transform ${MOTION.duration} ${MOTION.easing}`,
};

const checkedThumbStyle = {
  transform: `translateX(${WIDTH - THUMB - INSET * 2 - 2}px)`,
};

function Switch({
  checked,
  defaultChecked,
  onChange,
  disabled = false,
  name,
  // `color` is accepted for MUI API parity but ignored — the brutalist
  // system uses a fixed palette (see STYLE.md).
  color: _color,
  className,
  style,
  ...rest
}) {
  const handleCheckedChange = (next, event) => {
    if (onChange) onChange(event, next);
  };

  const isChecked = checked ?? defaultChecked ?? false;

  return (
    <BaseSwitch.Root
      checked={checked}
      defaultChecked={defaultChecked}
      onCheckedChange={handleCheckedChange}
      disabled={disabled}
      name={name}
      className={className}
      style={{
        ...rootStyle(disabled),
        ...(isChecked ? checkedRootStyle : null),
        ...style,
      }}
      {...rest}
    >
      <BaseSwitch.Thumb
        style={{
          ...thumbStyle,
          ...(isChecked ? checkedThumbStyle : null),
        }}
      />
    </BaseSwitch.Root>
  );
}

Switch.propTypes = {
  checked: PropTypes.bool,
  defaultChecked: PropTypes.bool,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  name: PropTypes.string,
  color: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default Switch;
export { Switch };
