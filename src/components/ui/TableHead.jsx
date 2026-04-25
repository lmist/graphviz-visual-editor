import React from 'react';
import PropTypes from 'prop-types';
import { BORDERS, COLORS, TYPOGRAPHY } from '../../design/tokens.js';

const headStyle = {
  fontFamily: TYPOGRAPHY.mono,
  fontSize: TYPOGRAPHY.sizes.caption,
  fontWeight: 600,
  letterSpacing: '0.05em',
  textTransform: 'uppercase',
  color: COLORS.fg,
  background: COLORS.bg,
  borderBottom: BORDERS.thick,
};

function TableHead({ children, className, style, ...rest }) {
  return (
    <thead className={className} style={{ ...headStyle, ...style }} {...rest}>
      {children}
    </thead>
  );
}

TableHead.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default TableHead;
export { TableHead };
