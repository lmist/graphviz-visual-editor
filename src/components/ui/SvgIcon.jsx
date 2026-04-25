import React from 'react';
import PropTypes from 'prop-types';
import { COLORS } from '../../design/tokens.js';

const FONT_SIZE_PX = {
  inherit: '1em',
  small: 20,
  medium: 24,
  large: 32,
};

function resolveSize(fontSize) {
  if (fontSize == null) return 24;
  if (typeof fontSize === 'number') return fontSize;
  if (Object.prototype.hasOwnProperty.call(FONT_SIZE_PX, fontSize)) {
    return FONT_SIZE_PX[fontSize];
  }
  return fontSize;
}

function resolveColor(color) {
  if (color == null || color === 'inherit') return undefined;
  if (Object.prototype.hasOwnProperty.call(COLORS, color)) return COLORS[color];
  return color;
}

function SvgIcon({
  children,
  viewBox = '0 0 24 24',
  color = 'inherit',
  fontSize = 'medium',
  className,
  style,
  ...rest
}) {
  const size = resolveSize(fontSize);
  const resolvedColor = resolveColor(color);

  const svgStyle = {
    display: 'inline-block',
    flexShrink: 0,
    width: size,
    height: size,
    fill: 'currentColor',
    ...(resolvedColor ? { color: resolvedColor } : null),
    ...style,
  };

  return (
    <svg
      viewBox={viewBox}
      focusable="false"
      aria-hidden="true"
      className={className}
      style={svgStyle}
      {...rest}
    >
      {children}
    </svg>
  );
}

SvgIcon.propTypes = {
  children: PropTypes.node,
  viewBox: PropTypes.string,
  color: PropTypes.oneOfType([
    PropTypes.oneOf(['inherit', 'fg', 'bg', 'accent', 'error', 'muted']),
    PropTypes.string,
  ]),
  fontSize: PropTypes.oneOfType([
    PropTypes.oneOf(['inherit', 'small', 'medium', 'large']),
    PropTypes.number,
    PropTypes.string,
  ]),
  className: PropTypes.string,
  style: PropTypes.object,
};

export default SvgIcon;
