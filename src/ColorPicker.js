import React from 'react';
import PropTypes from 'prop-types';
import { ChromePicker } from 'react-color';
import TextField from './components/ui/TextField.jsx';
import { BORDERS, COLORS, SPACING, TYPOGRAPHY } from './design/tokens.js';

const swatchStyle = {
  padding: `${SPACING.xs}px`,
  verticalAlign: 'middle',
  border: BORDERS.thin,
  borderRadius: BORDERS.radius,
  display: 'inline-block',
  cursor: 'pointer',
  boxSizing: 'border-box',
};

const colorBoxStyle = {
  width: '36px',
  height: '14px',
  border: BORDERS.thin,
  borderRadius: BORDERS.radius,
  boxSizing: 'border-box',
};

const popoverStyle = {
  position: 'absolute',
  width: '100%',
  zIndex: 2,
};

const inputWrapperStyle = {
  marginLeft: `${SPACING.md}px`,
  verticalAlign: 'middle',
  width: 100,
  display: 'inline-block',
};

const chromePickerStyles = {
  default: {
    picker: {
      borderRadius: 0,
      border: BORDERS.thin,
      boxShadow: 'none',
      fontFamily: TYPOGRAPHY.mono,
    },
  },
};

function ColorPicker({ color, open, setOpen, onChange, invert }) {
  const handleClick = (event) => {
    event.stopPropagation();
    setOpen(!open);
  };

  const handleInputChange = (event) => {
    onChange(event.target.value);
  };

  const handleChange = (c) => {
    // Workaround for https://github.com/casesandberg/react-color/issues/655
    const a = Math.round(c.rgb.a * 255);
    onChange(c.hex + (a === 255 ? '' : Math.floor(a / 16).toString(16) + (a % 16).toString(16)));
  };

  const borderBackground = invert ? color : COLORS.bg;
  const contentBackground = invert ? COLORS.bg : color;

  return (
    <div>
      <div
        id="color-picker-swatch"
        style={{ ...swatchStyle, background: borderBackground }}
        onClick={handleClick}
      >
        <div style={{ ...colorBoxStyle, background: contentBackground }} />
      </div>
      <TextField
        id="color-input"
        value={color}
        onChange={handleInputChange}
        style={inputWrapperStyle}
        InputProps={{ style: { color, fontFamily: TYPOGRAPHY.mono } }}
      />
      {open ? (
        <div id="color-picker-popover" style={popoverStyle}>
          <ChromePicker color={color} onChange={handleChange} styles={chromePickerStyles} />
        </div>
      ) : null}
    </div>
  );
}

ColorPicker.propTypes = {
  color: PropTypes.string,
  open: PropTypes.bool,
  setOpen: PropTypes.func,
  onChange: PropTypes.func,
  invert: PropTypes.bool,
};

export default ColorPicker;
