import React from 'react';
import PropTypes from 'prop-types';

function OpenInFullIcon({ size = 24, className, style, ...rest }) {
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
      <polyline points="10,4 4,4 4,10" />
      <line x1="4" y1="4" x2="11" y2="11" />
      <polyline points="14,20 20,20 20,14" />
      <line x1="20" y1="20" x2="13" y2="13" />
    </svg>
  );
}

OpenInFullIcon.propTypes = {
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  className: PropTypes.string,
  style: PropTypes.object,
};

export default OpenInFullIcon;
