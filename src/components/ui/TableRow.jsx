import React from 'react';
import PropTypes from 'prop-types';
import { COLORS } from '../../design/tokens.js';

const HOVER_BG = '#f0f0f0';

function TableRow({
  children,
  hover = false,
  selected = false,
  className,
  style,
  onMouseEnter,
  onMouseLeave,
  ...rest
}) {
  const baseStyle = {
    background: selected ? COLORS.accent : 'transparent',
    fontWeight: selected ? 700 : 400,
    color: COLORS.fg,
  };

  const handleMouseEnter = (e) => {
    if (hover && !selected) {
      e.currentTarget.style.background = HOVER_BG;
    }
    if (onMouseEnter) onMouseEnter(e);
  };

  const handleMouseLeave = (e) => {
    if (hover && !selected) {
      e.currentTarget.style.background = 'transparent';
    }
    if (onMouseLeave) onMouseLeave(e);
  };

  return (
    <tr
      className={className}
      style={{ ...baseStyle, ...style }}
      onMouseEnter={handleMouseEnter}
      onMouseLeave={handleMouseLeave}
      {...rest}
    >
      {children}
    </tr>
  );
}

TableRow.propTypes = {
  children: PropTypes.node,
  hover: PropTypes.bool,
  selected: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
  onMouseEnter: PropTypes.func,
  onMouseLeave: PropTypes.func,
};

export default TableRow;
export { TableRow };
