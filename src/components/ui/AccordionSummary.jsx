import React from 'react';
import PropTypes from 'prop-types';
import { Accordion } from '@base-ui-components/react/accordion';
import { COLORS, SPACING, TYPOGRAPHY, MOTION } from '../../design/tokens.js';

const headerStyle = {
  margin: 0,
  padding: 0,
  fontFamily: TYPOGRAPHY.ui,
  fontSize: TYPOGRAPHY.sizes.body,
  fontWeight: 600,
};

const triggerStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'space-between',
  width: '100%',
  padding: `${SPACING.sm}px ${SPACING.md}px`,
  margin: 0,
  background: COLORS.bg,
  color: COLORS.fg,
  border: 'none',
  borderRadius: 0,
  fontFamily: 'inherit',
  fontSize: 'inherit',
  fontWeight: 'inherit',
  textAlign: 'left',
  cursor: 'pointer',
};

const iconWrapBaseStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  marginLeft: SPACING.sm,
  transition: `transform ${MOTION.duration} ${MOTION.easing}`,
  transformOrigin: 'center',
};

function AccordionSummary({ expandIcon, children, className, style, ...rest }) {
  const resolvedStyle = style ? { ...triggerStyle, ...style } : triggerStyle;
  return (
    <Accordion.Header style={headerStyle}>
      <Accordion.Trigger
        className={className}
        style={resolvedStyle}
        {...rest}
        render={(props, state) => (
          <button type="button" {...props}>
            <span>{children}</span>
            {expandIcon != null && (
              <span
                aria-hidden="true"
                style={{
                  ...iconWrapBaseStyle,
                  transform: state.open ? 'rotate(180deg)' : 'rotate(0deg)',
                }}
              >
                {expandIcon}
              </span>
            )}
          </button>
        )}
      />
    </Accordion.Header>
  );
}

AccordionSummary.propTypes = {
  expandIcon: PropTypes.node,
  children: PropTypes.node,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default AccordionSummary;
