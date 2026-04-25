import React from 'react';
import PropTypes from 'prop-types';
import { TYPOGRAPHY } from '../../design/tokens.js';

const VARIANT_TAG = {
  h1: 'h1',
  h2: 'h2',
  h3: 'h3',
  h4: 'h4',
  h5: 'h5',
  h6: 'h6',
  subtitle1: 'h6',
  body1: 'p',
  body2: 'p',
  caption: 'span',
};

const VARIANT_STYLE = {
  h1: { fontSize: TYPOGRAPHY.sizes.h1, fontWeight: 700, lineHeight: 1.1 },
  h2: { fontSize: TYPOGRAPHY.sizes.h2, fontWeight: 700, lineHeight: 1.15 },
  h3: { fontSize: TYPOGRAPHY.sizes.h3, fontWeight: 700, lineHeight: 1.2 },
  h4: { fontSize: TYPOGRAPHY.sizes.h4, fontWeight: 600, lineHeight: 1.25 },
  h5: { fontSize: TYPOGRAPHY.sizes.body, fontWeight: 600, lineHeight: 1.3 },
  h6: { fontSize: TYPOGRAPHY.sizes.body, fontWeight: 600, lineHeight: 1.3 },
  subtitle1: { fontSize: TYPOGRAPHY.sizes.body, fontWeight: 500, lineHeight: 1.4 },
  body1: { fontSize: TYPOGRAPHY.sizes.body, fontWeight: 400, lineHeight: 1.5 },
  body2: { fontSize: TYPOGRAPHY.sizes.caption, fontWeight: 400, lineHeight: 1.5 },
  caption: { fontSize: TYPOGRAPHY.sizes.caption, fontWeight: 400, lineHeight: 1.4 },
};

function Typography({
  variant = 'body1',
  gutterBottom = false,
  color,
  align,
  noWrap = false,
  className,
  style,
  children,
  ...rest
}) {
  const Tag = VARIANT_TAG[variant] || 'span';
  const variantStyle = VARIANT_STYLE[variant] || VARIANT_STYLE.body1;

  const mergedStyle = {
    fontFamily: TYPOGRAPHY.ui,
    margin: 0,
    ...variantStyle,
    ...(gutterBottom ? { marginBottom: '0.35em' } : null),
    ...(align ? { textAlign: align } : null),
    ...(noWrap
      ? { whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }
      : null),
    ...(color && color !== 'inherit' ? { color } : null),
    ...(color === 'inherit' ? { color: 'inherit' } : null),
    ...style,
  };

  return (
    <Tag className={className} style={mergedStyle} {...rest}>
      {children}
    </Tag>
  );
}

Typography.propTypes = {
  variant: PropTypes.oneOf([
    'h1',
    'h2',
    'h3',
    'h4',
    'h5',
    'h6',
    'body1',
    'body2',
    'caption',
    'subtitle1',
  ]),
  gutterBottom: PropTypes.bool,
  color: PropTypes.string,
  align: PropTypes.oneOf(['left', 'center', 'right', 'justify', 'inherit']),
  noWrap: PropTypes.bool,
  className: PropTypes.string,
  style: PropTypes.object,
  children: PropTypes.node,
};

export default Typography;
export { Typography };
