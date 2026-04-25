import React from 'react';
import PropTypes from 'prop-types';
import { TYPOGRAPHY } from '../../design/tokens.js';

const baseStyle = {
  background: 'none',
  border: 0,
  padding: 0,
  margin: 0,
  font: 'inherit',
  color: 'inherit',
  cursor: 'pointer',
  display: 'inline-flex',
  alignItems: 'center',
  gap: 4,
  textAlign: 'inherit',
};

const glyphStyle = {
  fontFamily: TYPOGRAPHY.mono,
  fontSize: 'inherit',
  lineHeight: 1,
};

function TableSortLabel({
  active = false,
  direction = 'asc',
  onClick,
  children,
  className,
  style,
  ...rest
}) {
  const glyph = direction === 'desc' ? '▼' : '▲';
  const mergedStyle = { ...baseStyle, ...style };

  return (
    <button
      type="button"
      onClick={onClick}
      className={className}
      style={mergedStyle}
      aria-sort={active ? (direction === 'desc' ? 'descending' : 'ascending') : undefined}
      {...rest}
    >
      <span>{children}</span>
      {active ? <span aria-hidden="true" style={glyphStyle}>{glyph}</span> : null}
    </button>
  );
}

TableSortLabel.propTypes = {
  active: PropTypes.bool,
  direction: PropTypes.oneOf(['asc', 'desc']),
  onClick: PropTypes.func,
  children: PropTypes.node,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default TableSortLabel;
export { TableSortLabel };
