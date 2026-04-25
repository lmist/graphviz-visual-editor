import React from 'react';
import PropTypes from 'prop-types';
import { Checkbox as BaseCheckbox } from '@base-ui-components/react/checkbox';
import { COLORS, TYPOGRAPHY, BORDERS } from '../../design/tokens.js';

const SIZE = 16;

const rootStyle = (disabled) => ({
  width: SIZE,
  height: SIZE,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  border: BORDERS.thick,
  borderColor: COLORS.fg,
  background: COLORS.bg,
  padding: 0,
  margin: 0,
  boxSizing: 'border-box',
  cursor: disabled ? 'not-allowed' : 'pointer',
  opacity: disabled ? 0.5 : 1,
  outline: 'none',
});

const indicatorStyle = {
  fontFamily: TYPOGRAPHY.mono,
  fontSize: 12,
  lineHeight: 1,
  color: COLORS.fg,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
};

function Checkbox({
  checked,
  defaultChecked,
  onChange,
  disabled = false,
  indeterminate = false,
  // `color` is accepted for API parity with MUI but ignored — the
  // brutalist system uses a single fg/accent palette (see STYLE.md).
  color: _color,
  className,
  style,
  ...rest
}) {
  const handleCheckedChange = (next, event) => {
    if (onChange) onChange(event, next);
  };

  return (
    <BaseCheckbox.Root
      checked={checked}
      defaultChecked={defaultChecked}
      onCheckedChange={handleCheckedChange}
      disabled={disabled}
      indeterminate={indeterminate}
      className={className}
      style={{ ...rootStyle(disabled), ...style }}
      {...rest}
    >
      <BaseCheckbox.Indicator style={indicatorStyle}>
        {indeterminate ? '–' : '✓'}
      </BaseCheckbox.Indicator>
    </BaseCheckbox.Root>
  );
}

Checkbox.propTypes = {
  checked: PropTypes.bool,
  defaultChecked: PropTypes.bool,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  indeterminate: PropTypes.bool,
  color: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default Checkbox;
