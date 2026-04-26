import React from 'react';
import PropTypes from 'prop-types';
import { Select as BaseSelect } from '@base-ui-components/react/select';
import { COLORS, SPACING, TYPOGRAPHY, BORDERS, SHADOWS, MOTION } from '../../design/tokens.js';

const triggerStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  gap: SPACING.sm,
  fontFamily: TYPOGRAPHY.mono,
  fontSize: TYPOGRAPHY.sizes.body,
  fontWeight: 400,
  color: COLORS.fg,
  background: COLORS.bg,
  border: BORDERS.thin,
  padding: `${SPACING.xs}px ${SPACING.sm}px`,
  margin: 0,
  cursor: 'pointer',
  outline: 'none',
  textAlign: 'left',
  minWidth: 0,
};

const popupStyle = {
  background: COLORS.bg,
  border: BORDERS.thin,
  boxShadow: SHADOWS.hover,
  padding: 0,
  margin: 0,
  outline: 'none',
  minWidth: 'var(--anchor-width)',
};

// Stack above Material UI Dialog (z-index 1300) so the listbox is not
// occluded by dialog content (e.g. <InputLabel> overlapping the first item).
const positionerStyle = {
  zIndex: 1500,
};

const itemStyle = {
  fontFamily: TYPOGRAPHY.mono,
  fontSize: TYPOGRAPHY.sizes.body,
  fontWeight: 400,
  color: COLORS.fg,
  background: COLORS.bg,
  padding: `${SPACING.xs}px ${SPACING.sm}px`,
  cursor: 'pointer',
  outline: 'none',
  transition: `background-color ${MOTION.duration} ${MOTION.easing}, color ${MOTION.duration} ${MOTION.easing}`,
};

const focusRing = {
  onFocus: (e) => {
    e.currentTarget.style.outline = BORDERS.thick;
    e.currentTarget.style.outlineOffset = '2px';
  },
  onBlur: (e) => {
    e.currentTarget.style.outline = 'none';
  },
};

const itemHover = {
  onMouseEnter: (e) => {
    e.currentTarget.style.background = COLORS.accent;
  },
  onMouseLeave: (e) => {
    e.currentTarget.style.background = COLORS.bg;
  },
};

const chevronStyle = {
  fontFamily: TYPOGRAPHY.mono,
  fontSize: TYPOGRAPHY.sizes.body,
  color: COLORS.fg,
  lineHeight: 1,
};

function Select({
  value,
  onChange,
  children,
  displayEmpty = false,
  MenuProps,
  className,
  style,
  id,
  name,
  disabled,
  ...rest
}) {
  const items = React.Children.toArray(children).filter(React.isValidElement);

  const labelByValue = new Map();
  items.forEach((child) => {
    if (child.props && 'value' in child.props) {
      labelByValue.set(child.props.value, child.props.children);
    }
  });

  const [open, setOpen] = React.useState(false);

  const handleValueChange = (next, event) => {
    if (!onChange) return;
    const synthetic = event && event.target
      ? { ...event, target: { ...event.target, value: next, name } }
      : { target: { value: next, name } };
    onChange(synthetic, next);
  };

  // Base UI Select.Item bails out of its built-in click handler when the item
  // is not yet "highlighted" (i.e. activeIndex hasn't propagated since the
  // pointer entered). Headless test runners dispatch the full mouse-event
  // sequence synchronously, so React doesn't get a chance to re-render between
  // mouseenter and click — the option is hovered visually but its click is
  // dropped. Commit the value via our own onClick so the test path matches the
  // user-facing behavior of "clicking an option selects it".
  const handleItemClick = (itemValue) => (event) => {
    handleValueChange(itemValue, event);
    setOpen(false);
  };

  const placement = MenuProps && MenuProps.placement;

  return (
    <BaseSelect.Root
      value={value}
      onValueChange={handleValueChange}
      open={open}
      onOpenChange={setOpen}
      disabled={disabled}
      {...rest}
    >
      <BaseSelect.Trigger
        id={id}
        className={className}
        style={{ ...triggerStyle, ...style }}
        {...focusRing}
      >
        <BaseSelect.Value>
          {(selected) => {
            if (selected == null || selected === '') {
              return displayEmpty ? ' ' : null;
            }
            const label = labelByValue.get(selected);
            return label != null ? label : String(selected);
          }}
        </BaseSelect.Value>
        <BaseSelect.Icon style={chevronStyle}>{'▼'}</BaseSelect.Icon>
      </BaseSelect.Trigger>
      <BaseSelect.Portal>
        <BaseSelect.Positioner sideOffset={4} side={placement} style={positionerStyle}>
          <BaseSelect.Popup style={popupStyle}>
            {items.map((child, idx) => {
              if (!('value' in (child.props || {}))) {
                return React.cloneElement(child, { key: child.key ?? idx });
              }
              const itemValue = child.props.value;
              const itemId = child.props.id;
              const label = child.props.children;
              return (
                <BaseSelect.Item
                  key={child.key ?? itemValue ?? idx}
                  id={itemId}
                  value={itemValue}
                  style={itemStyle}
                  onClick={handleItemClick(itemValue)}
                  {...itemHover}
                >
                  <BaseSelect.ItemText>{label}</BaseSelect.ItemText>
                </BaseSelect.Item>
              );
            })}
          </BaseSelect.Popup>
        </BaseSelect.Positioner>
      </BaseSelect.Portal>
    </BaseSelect.Root>
  );
}

Select.propTypes = {
  value: PropTypes.any,
  onChange: PropTypes.func,
  children: PropTypes.node,
  displayEmpty: PropTypes.bool,
  MenuProps: PropTypes.object,
  className: PropTypes.string,
  style: PropTypes.object,
  id: PropTypes.string,
  name: PropTypes.string,
  disabled: PropTypes.bool,
};

export default Select;
export { Select };
