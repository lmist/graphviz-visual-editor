import React from 'react';
import PropTypes from 'prop-types';

function CloseFullscreenIcon({ size = 24, className, style, ...rest }) {
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
      <polyline points="10,4 10,10 4,10" />
      <line x1="10" y1="10" x2="4" y2="4" />
      <polyline points="14,20 14,14 20,14" />
      <line x1="14" y1="14" x2="20" y2="20" />
    </svg>
  );
}

CloseFullscreenIcon.propTypes = {
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  className: PropTypes.string,
  style: PropTypes.object,
};

export default CloseFullscreenIcon;
