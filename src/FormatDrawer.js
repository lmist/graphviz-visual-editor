import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  Checkbox,
  DialogTitle,
  Divider,
  Drawer,
  FormControl,
  FormControlLabel,
  FormGroup,
  IconButton,
  Switch,
} from './components/ui/index.js';
import ChevronLeftIcon from './components/icons/ChevronLeftIcon.jsx';
import ChevronRightIcon from './components/icons/ChevronRightIcon.jsx';
import { SPACING } from './design/tokens.js';
import ColorPicker from './ColorPicker.js';

const drawerWidth = '100%';

const drawerPaperStyle = {
  width: drawerWidth,
  height: `calc(100vh - 64px - 2 * 12px)`,
  textAlign: 'left',
};

const drawerHeaderStyle = {
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'flex-end',
  padding: '0 8px',
  textTransform: 'capitalize',
  minHeight: 64,
};

const styleSwitchStyle = {
  marginLeft: SPACING.md,
};

const styleCheckboxStyle = {
  marginLeft: 0,
};

const colorFormControlStyle = {
  marginLeft: SPACING.md,
  marginBottom: SPACING.sm,
};

const colorSwitchStyle = {
  marginLeft: 0,
};

const emptyStyle = '';

const nodeStyles = [
  'dashed',
  'dotted',
  'solid',
  'invis',
  'bold',
  'filled',
  'striped',
  'wedged',
  'diagonals',
  'rounded',
  'radial',
];

const edgeStyles = [
  'dashed',
  'dotted',
  'solid',
  'invis',
  'bold',
  'tapered',
];

const emptyColor = '';

function isRtl() {
  if (typeof document === 'undefined') return false;
  return document.documentElement.dir === 'rtl';
}

const FormatDrawer = ({
  type,
  defaultAttributes,
  onClick,
  onFormatDrawerClose,
  onStyleChange,
  onColorChange,
  onFillColorChange,
}) => {
  const [colorColorPickerIsOpen, setColorColorPickerIsOpen] = useState(false);
  const [fillColorColorPickerIsOpen, setFillColorColorPickerIsOpen] = useState(false);

  function getStyleSet() {
    if (defaultAttributes.style == null) {
      return new Set([]);
    } else {
      let styleSet = new Set(defaultAttributes.style.split(', '));
      styleSet.add(emptyStyle);
      return styleSet;
    }
  }

  function setStyle(styleSet) {
    if (styleSet.size === 0) {
      onStyleChange(null);
    } else {
      styleSet.delete(emptyStyle);
      onStyleChange([...styleSet].join(', '));
    }
  }

  const handleClick = () => {
    setColorColorPickerIsOpen(false);
    setFillColorColorPickerIsOpen(false);
    onClick();
  };

  const handleDrawerClose = () => {
    onFormatDrawerClose();
  };

  const handleStyleSwitchChange = (_event, checked) => {
    let styleSet = getStyleSet();
    styleSet.clear();
    if (checked) {
      styleSet.add(emptyStyle);
    }
    setStyle(styleSet);
  };

  const handleStyleChange = (styleName) => (_event, checked) => {
    let styleSet = getStyleSet();
    if (checked) {
      styleSet.delete(emptyStyle);
      styleSet.add(styleName);
    } else {
      styleSet.delete(styleName);
    }
    setStyle(styleSet);
  };

  const handleColorSwitchChange = (_event, checked) => {
    if (checked) {
      onColorChange(emptyColor);
    } else {
      onColorChange(null);
    }
  };

  const handleColorChange = (color) => {
    onColorChange(color);
  };

  const handleFillColorSwitchChange = (_event, checked) => {
    if (checked) {
      onFillColorChange(emptyColor);
    } else {
      onFillColorChange(null);
    }
  };
  const handleFillColorChange = (color) => {
    onFillColorChange(color);
  };

  const styles = type === 'node' ? nodeStyles : edgeStyles;
  const currentStyle = getStyleSet();
  const rtl = isRtl();

  return (
    <div style={{ flexGrow: 1 }}>
      <Drawer
        id="format-drawer"
        variant="persistent"
        anchor="left"
        open
        style={drawerPaperStyle}
        onClick={handleClick}
      >
        <div style={drawerHeaderStyle}>
          <DialogTitle id="form-dialog-title">
            Default {type} attributes
          </DialogTitle>
          <IconButton id="close-button" aria-label="Close" onClick={handleDrawerClose}>
            {rtl ? <ChevronRightIcon /> : <ChevronLeftIcon />}
          </IconButton>
        </div>
        <Divider />
        <FormControl>
          <FormGroup row>
            <FormControlLabel
              style={styleSwitchStyle}
              control={
                <Switch
                  id="style-switch"
                  checked={currentStyle.size !== 0}
                  onChange={handleStyleSwitchChange}
                />
              }
              label="style"
              labelPlacement="start"
            />
          </FormGroup>
          <FormGroup row id="styles">
            {styles.map((style) => (
              <FormControlLabel
                key={style}
                style={styleCheckboxStyle}
                control={
                  <Checkbox
                    id={style}
                    checked={currentStyle.has(style)}
                    onChange={handleStyleChange(style)}
                    value={style}
                  />
                }
                label={style}
              />
            ))}
          </FormGroup>
        </FormControl>
        <FormControl style={colorFormControlStyle} id="color-picker-form">
          <FormGroup row>
            <FormControlLabel
              style={colorSwitchStyle}
              control={
                <Switch
                  id="color-switch"
                  checked={defaultAttributes.color != null}
                  onChange={handleColorSwitchChange}
                />
              }
              label="color"
              labelPlacement="start"
            />
          </FormGroup>
          <FormGroup row>
            <ColorPicker
              id="color-picker"
              open={colorColorPickerIsOpen}
              setOpen={setColorColorPickerIsOpen}
              invert={true}
              color={defaultAttributes.color || ''}
              onChange={(color) => handleColorChange(color)}
            />
          </FormGroup>
        </FormControl>
        <FormControl style={colorFormControlStyle} id="fillcolor-picker-form">
          <FormGroup row>
            <FormControlLabel
              style={colorSwitchStyle}
              control={
                <Switch
                  id="fillcolor-switch"
                  checked={defaultAttributes.fillcolor != null}
                  onChange={handleFillColorSwitchChange}
                />
              }
              label="fillcolor"
              labelPlacement="start"
            />
          </FormGroup>
          <FormGroup row>
            <ColorPicker
              id="fillcolor-picker"
              open={fillColorColorPickerIsOpen}
              setOpen={setFillColorColorPickerIsOpen}
              color={defaultAttributes.fillcolor || ''}
              onChange={(color) => handleFillColorChange(color)}
            />
          </FormGroup>
        </FormControl>
      </Drawer>
    </div>
  );
};

FormatDrawer.propTypes = {
  type: PropTypes.string.isRequired,
  defaultAttributes: PropTypes.object.isRequired,
  onClick: PropTypes.func.isRequired,
  onFormatDrawerClose: PropTypes.func.isRequired,
  onStyleChange: PropTypes.func.isRequired,
  onColorChange: PropTypes.func.isRequired,
  onFillColorChange: PropTypes.func.isRequired,
};

export default FormatDrawer;
