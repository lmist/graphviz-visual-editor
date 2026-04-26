import React from 'react';
import PropTypes from 'prop-types';
import { Radio as BaseRadio } from '@base-ui-components/react/radio';
import { COLORS, BORDERS } from '../../design/tokens.js';

// Square brutalist radio. Lives inside RadioGroup, which owns selection
// state; `value` identifies this option to the group. `checked`/`onChange`
// are accepted for MUI parity but only take effect when used standalone
// (Base UI's Radio.Root forwards `checked`/`onCheckedChange` through).
// `color` is accepted and ignored — brutalist palette is fixed.

const SIZE = 16;
const INDICATOR = 8;

const rootStyle = {
  appearance: 'none',
  width: SIZE,
  height: SIZE,
  padding: 0,
  margin: 0,
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  background: COLORS.bg,
  border: BORDERS.thick,
  borderRadius: 0,
  cursor: 'pointer',
  flexShrink: 0,
  boxSizing: 'border-box',
};

const disabledStyle = {
  cursor: 'not-allowed',
  background: COLORS.bg,
  borderColor: COLORS.muted,
};

const indicatorStyle = {
  display: 'block',
  width: INDICATOR,
  height: INDICATOR,
  background: COLORS.fg,
};

function Radio({
  id,
  value,
  checked,
  onChange,
  onCheckedChange: externalOnCheckedChange,
  disabled = false,
  color, // eslint-disable-line no-unused-vars
  className,
  style,
  ...rest
}) {
  // Consume onCheckedChange so it doesn't leak into {...rest} and onto DOM
  // nodes via Base UI's CompositeItem (gviz-gnr). Prefer the external handler;
  // otherwise translate MUI's onChange(event, checked) signature.
  const handleCheckedChange = externalOnCheckedChange
    || (onChange ? (nextChecked, event) => onChange(event, nextChecked) : undefined);

  const mergedStyle = {
    ...rootStyle,
    ...(disabled ? disabledStyle : null),
    ...style,
  };

  // Base UI's Radio.Root renders a <span> by default and routes the `id`
  // prop onto its hidden <input>. Cypress helpers and any consumer that
  // anchors via `button#<id>` need the id on the rendered control itself,
  // so we render as a real <button role="radio"> and place our id there.
  return (
    <BaseRadio.Root
      value={value}
      checked={checked}
      onCheckedChange={handleCheckedChange}
      disabled={disabled}
      className={className}
      style={mergedStyle}
      nativeButton
      render={(rootProps) => (
        <button type="button" {...rootProps} id={id ?? rootProps.id} />
      )}
      {...rest}
    >
      <BaseRadio.Indicator style={indicatorStyle} />
    </BaseRadio.Root>
  );
}

Radio.propTypes = {
  id: PropTypes.string,
  value: PropTypes.any,
  checked: PropTypes.bool,
  onChange: PropTypes.func,
  disabled: PropTypes.bool,
  color: PropTypes.string,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default Radio;
export { Radio };
