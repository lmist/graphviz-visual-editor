import React from 'react';
import PropTypes from 'prop-types';

function HelpIcon({ size = 24, className, style, ...rest }) {
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
      <circle cx="12" cy="12" r="9" />
      <path d="M9 9.5a3 3 0 0 1 6 0c0 2-3 2.5-3 4.5" />
      <line x1="12" y1="17" x2="12" y2="17.5" />
    </svg>
  );
}

HelpIcon.propTypes = {
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  className: PropTypes.string,
  style: PropTypes.object,
};

export default HelpIcon;
