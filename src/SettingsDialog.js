import React from 'react';
import PropTypes from 'prop-types';
import withRoot from './withRoot.js';
import CloseIcon from './components/icons/CloseIcon.jsx';
import Dialog from './components/ui/Dialog.jsx';
import DialogContent from './components/ui/DialogContent.jsx';
import DialogContentText from './components/ui/DialogContentText.jsx';
import DialogTitle from './components/ui/DialogTitle.jsx';
import FormControl from './components/ui/FormControl.jsx';
import FormControlLabel from './components/ui/FormControlLabel.jsx';
import FormGroup from './components/ui/FormGroup.jsx';
import FormHelperText from './components/ui/FormHelperText.jsx';
import FormLabel from './components/ui/FormLabel.jsx';
import IconButton from './components/ui/IconButton.jsx';
import Input from './components/ui/Input.jsx';
import InputAdornment from './components/ui/InputAdornment.jsx';
import InputLabel from './components/ui/InputLabel.jsx';
import MenuItem from './components/ui/MenuItem.jsx';
import Radio from './components/ui/Radio.jsx';
import RadioGroup from './components/ui/RadioGroup.jsx';
import Select from './components/ui/Select.jsx';
import Switch from './components/ui/Switch.jsx';

const engines = [
  'circo',
  'dot',
  'fdp',
  'neato',
  'osage',
  'patchwork',
  'twopi',
];

const titleRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const contentStyle = {
  overflowY: 'visible',
};

const formControlStyle = {
  marginTop: 8,
  marginBottom: 8,
  marginLeft: 8,
  marginRight: 8,
  minWidth: 120,
};

const formGroupStyle = {
  marginTop: 8,
  marginLeft: 8,
};

const formControlLabelStyle = {};

const radioGroupStyle = {
  marginTop: 8,
  marginLeft: 0,
};

const transitionDurationStyle = {
  width: '7.6em',
};

const tweenPrecisionAbsoluteInputStyle = {
  marginTop: 8,
  marginLeft: 12,
  width: '6.9em',
};

const tweenPrecisionRelativeInputStyle = {
  marginTop: 8,
  marginLeft: 12,
  width: '4.8em',
};

const holdOffInputStyle = {
  width: '7.6em',
};

const fontSizeInputStyle = {
  width: '5em',
};

const tabSizeInputStyle = {
  width: '7.1em',
};

class SettingsDialog extends React.Component {

  handleClose = () => {
    this.props.onSettingsClose();
  };

  handleEngineSelectChange = (event) => {
    this.props.onEngineSelectChange(event.target.value);
  };

  handleFitSwitchChange = (_event, checked) => {
    this.props.onFitGraphSwitchChange(checked);
  };

  handleTransitionDurationChange = (event) => {
    this.props.onTransitionDurationChange(event.target.value);
  };

  handleTweenPathsSwitchChange = (_event, checked) => {
    this.props.onTweenPathsSwitchChange(checked);
  };

  handleTweenShapesSwitchChange = (_event, checked) => {
    this.props.onTweenShapesSwitchChange(checked);
  };

  handleTweenPrecisionChange = (event) => {
    let tweenPrecision = event.target.value;
    if (event.target.value === 'absolute' || tweenPrecision > 1) {
      tweenPrecision = Math.max(Math.ceil(tweenPrecision), 1);
    }
    this.props.onTweenPrecisionChange(tweenPrecision.toString() + (this.props.tweenPrecision.includes('%') ? '%': ''));
  };

  handleTweenPrecisionIsRelativeRadioChange = (_event, value) => {
    let tweenPrecision = +this.props.tweenPrecision.split('%')[0];
    if (value === 'absolute' || tweenPrecision > 1) {
      tweenPrecision = Math.max(Math.ceil(tweenPrecision), 1);
    }
    this.props.onTweenPrecisionChange(tweenPrecision.toString() + (value === 'relative' ? '%': ''));
  };

  handleHoldOffChange = (event) => {
    this.props.onHoldOffChange(event.target.value);
  };

  handleFontSizeChange = (event) => {
    this.props.onFontSizeChange(event.target.value);
  };

  handleTabSizeChange = (event) => {
    this.props.onTabSizeChange(event.target.value);
  };

  render() {
    const tweenPrecisionIsRelative = this.props.tweenPrecision.includes('%');
    const tweenPrecision = +this.props.tweenPrecision.split('%')[0];
    const tweenPrecisionType = tweenPrecisionIsRelative ? 'relative' :  'absolute';
    const tweenPrecisionUnit = tweenPrecisionIsRelative ? '%' :  'points';
    const enableTweenPrecisionSetting = this.props.tweenPaths || this.props.tweenShapes;
    const tweenPrecisionStep = (tweenPrecisionIsRelative && tweenPrecision <= 1) ? 0.1 : 1;
    const tweenPrecisionInputStyle = tweenPrecisionIsRelative ? tweenPrecisionRelativeInputStyle : tweenPrecisionAbsoluteInputStyle;
    return (
      <React.Fragment>
        <Dialog
          id="settings-dialog"
          open
          onClose={this.handleClose}
          scroll={'paper'}
          aria-labelledby="settings-rendering-title"
        >
          <div style={titleRowStyle}>
            <DialogTitle id="settings-rendering-title">Graph rendering</DialogTitle>
            <IconButton aria-label="Close" onClick={this.handleClose}>
              <CloseIcon />
            </IconButton>
          </div>
          <DialogContent style={contentStyle}>
            <DialogContentText>
              These settings affects how the graph is rendered.
            </DialogContentText>
            <FormControl style={formControlStyle}>
              <InputLabel htmlFor="engine-selector" id="engine-selector-label">Engine</InputLabel>
              <Select
                id="engine-selector"
                name="engine"
                aria-labelledby="engine-selector-label"
                value={this.props.engine}
                onChange={this.handleEngineSelectChange}
              >
                {engines.map((engine) =>
                  <MenuItem
                    id={engine}
                    key={engine}
                    value={engine}
                  >
                    {engine}
                  </MenuItem>
                )}
              </Select>
              <FormHelperText>Graphviz layout engine</FormHelperText>
            </FormControl>
          </DialogContent>
          <DialogTitle id="settings-viewing-title">Graph viewing</DialogTitle>
          <DialogContent style={contentStyle}>
            <DialogContentText>
              These settings affects how the graph is viewed. They do not affect the graph itself.
            </DialogContentText>
            <FormGroup row style={formGroupStyle}>
              <FormControlLabel
                style={formControlLabelStyle}
                control={
                  <Switch
                    id="fit-switch"
                    checked={this.props.fitGraph}
                    onChange={this.handleFitSwitchChange}
                  />
                }
                label="Fit graph to available area"
              />
            </FormGroup>
            <FormControl
              style={formControlStyle}
              aria-describedby="transition-duration-helper-text">
              <InputLabel shrink={true}>Transition duration</InputLabel>
              <Input
                style={transitionDurationStyle}
                id="transition-duration"
                type="number"
                value={this.props.transitionDuration}
                onChange={this.handleTransitionDurationChange}
                endAdornment={<InputAdornment position="end"> seconds</InputAdornment>}
                aria-label="transitionDuration"
                min={0.1}
                max={99}
                step={0.1}
              />
            </FormControl>
            <FormGroup row style={formGroupStyle}>
              <FormControlLabel
                style={formControlLabelStyle}
                control={
                  <Switch
                    id="path-tween-switch"
                    checked={this.props.tweenPaths}
                    onChange={this.handleTweenPathsSwitchChange}
                  />
                }
                label="Enable path tweening during transitions"
              />
            </FormGroup>
            <FormGroup row style={formGroupStyle}>
              <FormControlLabel
                style={formControlLabelStyle}
                control={
                  <Switch
                    id="shape-tween-switch"
                    checked={this.props.tweenShapes}
                    onChange={this.handleTweenShapesSwitchChange}
                  />
                }
                label="Enable shape tweening during transitions"
              />
            </FormGroup>
            <FormControl
              id="tween-precision-form"
              component="fieldset"
              style={formControlStyle}>
              <FormLabel component="legend">Tweening precision</FormLabel>
              <RadioGroup
                id="tween-precision-radio-group"
                name="tweenPrecision"
                style={radioGroupStyle}
                value={tweenPrecisionType}
                onChange={this.handleTweenPrecisionIsRelativeRadioChange}
              >
                <FormControlLabel
                  style={formControlLabelStyle}
                  value="absolute"
                  disabled={!enableTweenPrecisionSetting}
                  control={<Radio id="absolute"/>}
                  label="Absolute"
                />
                <FormControlLabel
                  style={formControlLabelStyle}
                  value="relative"
                  disabled={!enableTweenPrecisionSetting}
                  control={<Radio id="relative"/>}
                  label="Relative"
                />
              </RadioGroup>
              <Input
                style={tweenPrecisionInputStyle}
                id="tween-precision-input"
                type="number"
                value={tweenPrecision}
                disabled={!enableTweenPrecisionSetting}
                onChange={this.handleTweenPrecisionChange}
                endAdornment={<InputAdornment id="tween-precision-input-adornment" position="end"> {tweenPrecisionUnit} </InputAdornment>}
                aria-label="tweenPrecision"
                min={tweenPrecisionStep}
                max={tweenPrecisionIsRelative ? 100 : 999}
                step={tweenPrecisionStep}
              />
            </FormControl>
          </DialogContent>
          <DialogTitle id="settings-editor-title">Text Editor</DialogTitle>
          <DialogContent style={contentStyle}>
            <FormControl
              style={formControlStyle}
              aria-describedby="font-size-helper-text">
              <InputLabel shrink={true}>Font size</InputLabel>
              <Input
                style={fontSizeInputStyle}
                id="font-size"
                type="number"
                value={this.props.fontSize}
                onChange={this.handleFontSizeChange}
                endAdornment={<InputAdornment position="end"> px</InputAdornment>}
                aria-label="FontSize"
                min={1}
                max={99}
                step={1}
              />
            </FormControl>
          </DialogContent>
          <DialogContent style={contentStyle}>
            <FormControl
              style={formControlStyle}
              aria-describedby="tab-size-helper-text">
              <InputLabel shrink={true}>Tab size</InputLabel>
              <Input
                style={tabSizeInputStyle}
                id="tab-size"
                type="number"
                value={this.props.tabSize}
                onChange={this.handleTabSizeChange}
                endAdornment={<InputAdornment position="end"> spaces</InputAdornment>}
                aria-label="TabSize"
                min={1}
                max={99}
                step={1}
              />
            </FormControl>
          </DialogContent>
          <DialogContent style={contentStyle}>
            <FormControl
              style={formControlStyle}
              aria-describedby="holdoff-helper-text">
              <InputLabel shrink={true}>Hold-off time</InputLabel>
              <Input
                style={holdOffInputStyle}
                id="holdoff"
                type="number"
                value={this.props.holdOff}
                onChange={this.handleHoldOffChange}
                endAdornment={<InputAdornment position="end"> seconds</InputAdornment>}
                aria-label="Holdoff"
                min={0.0}
                max={9.9}
                step={0.1}
              />
              <FormHelperText id="holdoff-helper-text">Time of editor inactivity after which graph rendering starts</FormHelperText>
            </FormControl>
          </DialogContent>
        </Dialog>
      </React.Fragment>
    );
  }
}

SettingsDialog.propTypes = {
  engine: PropTypes.string,
  fitGraph: PropTypes.bool,
  transitionDuration: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  tweenPaths: PropTypes.bool,
  tweenShapes: PropTypes.bool,
  tweenPrecision: PropTypes.string,
  holdOff: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  fontSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  tabSize: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
  onSettingsClose: PropTypes.func,
  onEngineSelectChange: PropTypes.func,
  onFitGraphSwitchChange: PropTypes.func,
  onTransitionDurationChange: PropTypes.func,
  onTweenPathsSwitchChange: PropTypes.func,
  onTweenShapesSwitchChange: PropTypes.func,
  onTweenPrecisionChange: PropTypes.func,
  onHoldOffChange: PropTypes.func,
  onFontSizeChange: PropTypes.func,
  onTabSizeChange: PropTypes.func,
};

export default withRoot(SettingsDialog);
