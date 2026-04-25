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

  return (
    <BaseRadioGroup
      value={value}
      onValueChange={handleValueChange}
      name={name}
      className={className}
      style={{ ...groupStyle, ...style }}
      {...rest}
    >
      {children}
    </BaseRadioGroup>
  );
}

RadioGroup.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func,
  name: PropTypes.string,
  children: PropTypes.node,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default RadioGroup;
export { RadioGroup };
