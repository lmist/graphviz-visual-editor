import React from 'react';
import PropTypes from 'prop-types';
import { RadioGroup as BaseRadioGroup } from '@base-ui-components/react/radio-group';
import { COLORS, SPACING, TYPOGRAPHY } from '../../design/tokens.js';

const groupStyle = {
  display: 'flex',
  flexDirection: 'column',
  gap: SPACING.xs,
  fontFamily: TYPOGRAPHY.ui,
  fontSize: TYPOGRAPHY.sizes.body,
  color: COLORS.fg,
};

function RadioGroup({
  id,
  value,
  onChange,
  name,
  children,
  className,
  style,
  ...rest
}) {
  const handleValueChange = onChange
    ? (nextValue, event) => onChange(event, nextValue)
    : undefined;

  // Base UI's RadioGroup routes the `id` prop onto its hidden <input>
  // rather than the rendered <div>. Cypress helpers anchor by
  // `#tween-precision-radio-group` and then walk into child radios, so we
  // place the id on the rendered group element via the `render` prop.
  return (
    <BaseRadioGroup
      value={value}
      onValueChange={handleValueChange}
      name={name}
      className={className}
      style={{ ...groupStyle, ...style }}
      render={(rootProps) => (
        <div {...rootProps} id={id ?? rootProps.id} />
      )}
      {...rest}
    >
      {children}
    </BaseRadioGroup>
  );
}

RadioGroup.propTypes = {
  id: PropTypes.string,
  value: PropTypes.any,
  onChange: PropTypes.func,
  name: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default RadioGroup;
export { RadioGroup };
