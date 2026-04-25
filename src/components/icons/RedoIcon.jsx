import React from 'react';
import PropTypes from 'prop-types';

function RedoIcon({ size = 24, className, style, ...rest }) {
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
      <path d="M20 7 H13 Q4 7 4 15" />
      <polyline points="15 2, 20 7, 15 12" />
    </svg>
  );
}

RedoIcon.propTypes = {
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  className: PropTypes.string,
  style: PropTypes.object,
};

export default RedoIcon;
