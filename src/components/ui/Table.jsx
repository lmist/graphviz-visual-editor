import React from 'react';
import PropTypes from 'prop-types';
import { BORDERS, TYPOGRAPHY } from '../../design/tokens.js';

export const TableSizeContext = React.createContext('medium');

function Table({ size = 'medium', className, style, children, ...rest }) {
  const mergedStyle = {
    borderCollapse: 'collapse',
    border: BORDERS.thin,
    fontFamily: TYPOGRAPHY.ui,
    fontSize: TYPOGRAPHY.sizes.body,
    width: '100%',
    ...style,
  };

  return (
    <TableSizeContext.Provider value={size}>
      <table
        className={className}
        style={mergedStyle}
        data-size={size}
        {...rest}
      >
        {children}
      </table>
    </TableSizeContext.Provider>
  );
}

Table.propTypes = {
  size: PropTypes.oneOf(['small', 'medium']),
  className: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.node,
};

export default Table;
export { Table };
