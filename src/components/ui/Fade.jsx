import React, { useEffect, useRef, useState } from 'react';
import PropTypes from 'prop-types';
import { MOTION } from '../../design/tokens.js';

function Fade({
  in: inProp = false,
  timeout,
  unmountOnExit = false,
  style,
  children,
  ...rest
}) {
  const duration = typeof timeout === 'number' ? `${timeout}ms` : MOTION.duration;
  const [mounted, setMounted] = useState(inProp);
  const [opacity, setOpacity] = useState(inProp ? 1 : 0);
  const rafRef = useRef(null);

  useEffect(() => {
    if (inProp) {
      setMounted(true);
      rafRef.current = requestAnimationFrame(() => {
        rafRef.current = requestAnimationFrame(() => setOpacity(1));
      });
    } else {
      setOpacity(0);
    }
    return () => {
      if (rafRef.current !== null) cancelAnimationFrame(rafRef.current);
    };
  }, [inProp]);

  const handleTransitionEnd = (event) => {
    if (event.propertyName !== 'opacity') return;
    if (!inProp && unmountOnExit) setMounted(false);
  };

  if (!mounted && unmountOnExit && !inProp) return null;

  const mergedStyle = {
    opacity,
    transition: `opacity ${duration} ${MOTION.easing}`,
    ...style,
  };

  return (
    <div style={mergedStyle} onTransitionEnd={handleTransitionEnd} {...rest}>
      {children}
    </div>
  );
}

Fade.propTypes = {
  in: PropTypes.bool,
  timeout: PropTypes.number,
  unmountOnExit: PropTypes.bool,
  style: PropTypes.object,
  children: PropTypes.node,
};

export default Fade;
