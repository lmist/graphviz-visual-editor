import React from 'react';
import PropTypes from 'prop-types';
import { BORDERS, SPACING } from '../../design/tokens.js';
import { TableSizeContext } from './Table.jsx';

const PADDING_BY_SIZE = {
  medium: `${SPACING.sm}px ${SPACING.md}px`,
  small: `${SPACING.xs}px ${SPACING.sm}px`,
};

const PADDING_OVERRIDES = {
  none: 0,
  checkbox: `0 ${SPACING.xs}px`,
};

const SORT_ARIA = {
  asc: 'ascending',
  desc: 'descending',
};

function TableCell({
  children,
  align = 'inherit',
  padding = 'normal',
  component,
  scope,
  sortDirection,
  className,
  style,
  ...rest
}) {
  const size = React.useContext(TableSizeContext);
  const isHeader = component === 'th' || scope != null;
  const Tag = component || (isHeader ? 'th' : 'td');

  const resolvedPadding =
    padding in PADDING_OVERRIDES
      ? PADDING_OVERRIDES[padding]
      : PADDING_BY_SIZE[size] ?? PADDING_BY_SIZE.medium;

  const resolvedStyle = {
    padding: resolvedPadding,
    textAlign: align === 'inherit' ? undefined : align,
    borderBottom: BORDERS.thin,
    verticalAlign: 'inherit',
    ...style,
  };

  const ariaSort = sortDirection ? SORT_ARIA[sortDirection] : undefined;

  return (
    <Tag
      className={className}
      style={resolvedStyle}
      scope={scope}
      aria-sort={ariaSort}
      {...rest}
    >
      {children}
    </Tag>
  );
}

TableCell.propTypes = {
  children: PropTypes.node,
  align: PropTypes.oneOf(['inherit', 'left', 'center', 'right', 'justify']),
  padding: PropTypes.oneOf(['normal', 'checkbox', 'none']),
  component: PropTypes.elementType,
  scope: PropTypes.string,
  sortDirection: PropTypes.oneOf([false, 'asc', 'desc']),
  className: PropTypes.string,
  style: PropTypes.object,
};

export default TableCell;
export { TableCell };
