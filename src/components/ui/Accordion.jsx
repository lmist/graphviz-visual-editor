import React from 'react';
import PropTypes from 'prop-types';
import { Accordion as BaseAccordion } from '@base-ui-components/react/accordion';
import { BORDERS } from '../../design/tokens.js';

const ITEM_VALUE = 'panel';

const baseStyle = {
  border: BORDERS.thin,
  borderRadius: BORDERS.radius,
};

function Accordion({
  expanded,
  onChange,
  children,
  className,
  style,
  ...rest
}) {
  const value = expanded ? [ITEM_VALUE] : [];

  const handleValueChange = (newValue, eventDetails) => {
    if (!onChange) return;
    const isExpanded =
      Array.isArray(newValue) && newValue.includes(ITEM_VALUE);
    const event = eventDetails?.event ?? null;
    onChange(event, isExpanded);
  };

  const resolvedStyle = { ...baseStyle, ...style };

  return (
    <BaseAccordion.Root
      value={value}
      onValueChange={handleValueChange}
      openMultiple={false}
      className={className}
      style={resolvedStyle}
      {...rest}
    >
      <BaseAccordion.Item value={ITEM_VALUE}>
        {children}
      </BaseAccordion.Item>
    </BaseAccordion.Root>
  );
}

Accordion.propTypes = {
  expanded: PropTypes.bool,
  onChange: PropTypes.func,
  children: PropTypes.node,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default Accordion;
