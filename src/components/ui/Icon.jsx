import React from 'react';
import { SPACING } from '../../design/tokens.js';

const baseStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  justifyContent: 'center',
  width: SPACING.lg,
  height: SPACING.lg,
  flexShrink: 0,
  lineHeight: 1,
};

export default function Icon({ className, children, style, ...rest }) {
  return (
    <span
      className={className}
      style={style ? { ...baseStyle, ...style } : baseStyle}
      {...rest}
    >
      {children}
    </span>
  );
}
