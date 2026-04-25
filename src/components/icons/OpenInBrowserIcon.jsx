import React from 'react';
import PropTypes from 'prop-types';

function OpenInBrowserIcon({ size = 24, className, style, ...rest }) {
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
      <path d="M4 4h16v4H4z" />
      <path d="M12 11v9" />
      <path d="M8 15l4-4 4 4" />
    </svg>
  );
}

OpenInBrowserIcon.propTypes = {
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  className: PropTypes.string,
  style: PropTypes.object,
};

export default OpenInBrowserIcon;
