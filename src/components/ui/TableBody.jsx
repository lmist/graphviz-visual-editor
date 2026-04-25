import React from 'react';
import PropTypes from 'prop-types';
import { COLORS, TYPOGRAPHY } from '../../design/tokens.js';

const bodyStyle = {
  fontFamily: TYPOGRAPHY.ui,
  fontSize: TYPOGRAPHY.sizes.body,
  color: COLORS.fg,
};

function TableBody({ children, className, style, ...rest }) {
  return (
    <tbody className={className} style={{ ...bodyStyle, ...style }} {...rest}>
      {children}
    </tbody>
  );
}

TableBody.propTypes = {
  children: PropTypes.node,
  className: PropTypes.string,
  style: PropTypes.object,
};

export default TableBody;
export { TableBody };
