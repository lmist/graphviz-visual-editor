import React from 'react';
import PropTypes from 'prop-types';

function ExpandMoreIcon({ size = 24, className, style, ...rest }) {
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
      <path d="M6 9l6 6 6-6" />
    </svg>
  );
}

ExpandMoreIcon.propTypes = {
  size: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  className: PropTypes.string,
  style: PropTypes.object,
};

export default ExpandMoreIcon;
