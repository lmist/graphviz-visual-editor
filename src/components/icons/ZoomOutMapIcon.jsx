import React from 'react';
import PropTypes from 'prop-types';

function ZoomOutMapIcon({ size = 24, className, style, ...rest }) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 24 24"
      width={size}
      height={size}
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="square"
      strokeLinejoin="miter"
      focusable="false"
      aria-hidden="true"
      className={className}
      style={style}
      {...rest}
    >
      <polyline points="15,3 21,3 21,9" />
      <line x1="14" y1="10" x2="21" y2="3" />
      <polyline points="9,21 3,21 3,15" />
      <line x1="10" y1="14" x2="3" y2="21" />
      <polyline points="21,15 21,21 15,21" />
      <line x1="14" y1="14" x2="21" y2="21" />
      <polyline points="3,9 3,3 9,3" />
      <line x1="10" y1="10" x2="3" y2="3" />
    </svg>
  );
}

ZoomOutMapIcon.propTypes = {
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  className: PropTypes.string,
  style: PropTypes.object,
};

export default ZoomOutMapIcon;
