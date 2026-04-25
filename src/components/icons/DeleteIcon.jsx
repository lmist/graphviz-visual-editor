import React from 'react';
import PropTypes from 'prop-types';

function DeleteIcon({ size = 24, className, style, ...rest }) {
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
      <path d="M4 6 H20" />
      <path d="M9 6 V3 H15 V6" />
      <path d="M6 6 L7 21 H17 L18 6" />
      <path d="M10 10 V17" />
      <path d="M14 10 V17" />
    </svg>
  );
}

DeleteIcon.propTypes = {
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  className: PropTypes.string,
  style: PropTypes.object,
};

export default DeleteIcon;
