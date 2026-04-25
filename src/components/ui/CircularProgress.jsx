import React from 'react';
import PropTypes from 'prop-types';
import { COLORS } from '../../design/tokens.js';

const KEYFRAME_NAME = 'gviz-cp-rotate';
let keyframesInjected = false;

function ensureKeyframes() {
  if (keyframesInjected) return;
  if (typeof document === 'undefined') return;
  const style = document.createElement('style');
  style.setAttribute('data-gviz-circular-progress', '');
  style.textContent = `@keyframes ${KEYFRAME_NAME} { to { transform: rotate(360deg); } }`;
  document.head.appendChild(style);
  keyframesInjected = true;
}

const VIEWBOX = 24;
const INSET = 2;
const BAR_LENGTH = 5;

function CircularProgress({
  size = 24,
  color = COLORS.fg,
  thickness = 3.6,
  className,
  style,
  ...rest
}) {
  ensureKeyframes();

  const center = VIEWBOX / 2;
  const half = thickness / 2;
  const farEdge = VIEWBOX - INSET - BAR_LENGTH;

  const mergedStyle = {
    display: 'inline-block',
    width: size,
    height: size,
    animation: `${KEYFRAME_NAME} 1s linear infinite`,
    ...style,
  };

  return (
    <svg
      viewBox={`0 0 ${VIEWBOX} ${VIEWBOX}`}
      className={className}
      style={mergedStyle}
      role="progressbar"
      aria-label="Loading"
      {...rest}
    >
      <rect x={center - half} y={INSET} width={thickness} height={BAR_LENGTH} fill={color} />
      <rect x={farEdge} y={center - half} width={BAR_LENGTH} height={thickness} fill={color} />
      <rect x={center - half} y={farEdge} width={thickness} height={BAR_LENGTH} fill={color} />
      <rect x={INSET} y={center - half} width={BAR_LENGTH} height={thickness} fill={color} />
    </svg>
  );
}

CircularProgress.propTypes = {
  size: PropTypes.number,
  color: PropTypes.string,
  thickness: PropTypes.number,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default CircularProgress;
