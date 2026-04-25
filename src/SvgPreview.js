import React from 'react';
import { useState } from 'react';
import { useEffect } from 'react';
import PropTypes from 'prop-types';
import { COLORS, SPACING } from './design/tokens.js';

const previewWidth = 400;
const previewHeight = 250;
const previewPad = SPACING.xs;
const previewMargin = SPACING.sm;

const sectionStyle = {
  position: 'fixed',
  zIndex: 1,
  width: previewWidth + previewPad * 2,
  height: previewHeight + previewPad * 2,
  padding: previewPad,
  border: `1px solid ${COLORS.fg}`,
  background: COLORS.bg,
};

const SvgPreview = ({ svg, width, height }) => {

  const [preview, setPreview] = useState(false);
  const [x, setX] = useState(0);
  const [y, setY] = useState(0);

  let divPreview;
  let divThumbnail;

  useEffect(() => {
    const svgThumbnail = divThumbnail.querySelector('svg');
    if (svgThumbnail) {
      svgThumbnail.setAttribute('width', width);
      svgThumbnail.setAttribute('height', height);
      const g = svgThumbnail.querySelector('g');
      g.addEventListener('mouseenter', handleMouseEnter);
      g.addEventListener('mouseleave', handleMouseOut);
    }
    if (divPreview) {
      const svgPreview = divPreview.querySelector('svg');
      svgPreview.setAttribute('width', previewWidth);
      svgPreview.setAttribute('height', previewHeight);
    }
  });

  const handleMouseEnter = (event) => {
    setPreview(true);
    setX(event.clientX);
    setY(event.clientY);
  };

  const handleMouseOut = (event) => {
    setPreview(false);
  };

  return (
    <React.Fragment>
      <div
        id="svg-wrapper"
        ref={div => divThumbnail = div}
        dangerouslySetInnerHTML={{__html: svg}}
      >
      </div>
      {preview &&
        <section
          id="preview-pop-up"
          style={{
            ...sectionStyle,
            left: x + previewMargin,
            top: y + previewMargin,
          }}
        >
          <div
            ref={div => divPreview = div}
            dangerouslySetInnerHTML={{__html: svg}}
          >
          </div>
        </section>
      }
    </React.Fragment>
  );
}

SvgPreview.propTypes = {
  svg: PropTypes.string.isRequired,
  width: PropTypes.string.isRequired,
  height: PropTypes.string.isRequired,
};

export default SvgPreview;
