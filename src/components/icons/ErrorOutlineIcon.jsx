import React from 'react';
import PropTypes from 'prop-types';

function ErrorOutlineIcon({ size = 24, className, style, ...rest }) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
      focusable="false"
      aria-hidden="true"
      className={className}
      style={{ display: 'inline-block', flexShrink: 0, ...style }}
      {...rest}
    >
      <circle cx="12" cy="12" r="10" />
      <path d="M12 8v4" />
      <path d="M12 16h.01" />
    </svg>
  );
}

ErrorOutlineIcon.propTypes = {
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  className: PropTypes.string,
  style: PropTypes.object,
};

export default ErrorOutlineIcon;
