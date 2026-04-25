import React from 'react';
import PropTypes from 'prop-types';
import { AppBar, Toolbar, Typography, Button, IconButton, Icon } from './components/ui';
import MenuIcon from './components/icons/MenuIcon.jsx';
import AddIcon from './components/icons/AddIcon.jsx';
import OpenInBrowserIcon from './components/icons/OpenInBrowserIcon.jsx';
import SaveAltIcon from './components/icons/SaveAltIcon.jsx';
import UndoIcon from './components/icons/UndoIcon.jsx';
import RedoIcon from './components/icons/RedoIcon.jsx';
import ZoomInIcon from './components/icons/ZoomInIcon.jsx';
import ZoomOutIcon from './components/icons/ZoomOutIcon.jsx';
import ZoomOutMapIcon from './components/icons/ZoomOutMapIcon.jsx';
import SettingsIcon from './components/icons/SettingsIcon.jsx';
import HelpIcon from './components/icons/HelpIcon.jsx';
import GitHubIcon from './GitHubIcon.js';
import { SPACING } from './design/tokens.js';

const rootStyle = { flexGrow: 1 };
const titleStyle = { flexGrow: 1, display: 'inline-flex', alignItems: 'center', gap: SPACING.sm };
const logoIconStyle = { width: 32, height: 32 };
const logoImgStyle = { display: 'block', height: '100%', width: '100%' };
const gitHubLinkStyle = { color: 'inherit', textDecoration: 'none' };

function ButtonAppBar(props) {
  const handleMenuButtonClick = (event) => {
    props.onMenuButtonClick(event.currentTarget);
  };

  const handleNewButtonClick = (event) => {
    props.onNewButtonClick(event.currentTarget);
  };

  const handleOpenInBrowserButtonClick = (event) => {
    props.onOpenInBrowserButtonClick(event.currentTarget);
  };

  const handleSaveAltButtonClick = (event) => {
    props.onSaveAltButtonClick(event.currentTarget);
  };

  const handleUndoButtonClick = (event) => {
    props.onUndoButtonClick(event.currentTarget);
  };

  const handleRedoButtonClick = (event) => {
    props.onRedoButtonClick(event.currentTarget);
  };

  const handleZoomInButtonClick = () => {
    props.onZoomInButtonClick && props.onZoomInButtonClick();
  };

  const handleZoomOutButtonClick = () => {
    props.onZoomOutButtonClick && props.onZoomOutButtonClick();
  };

  const handleZoomOutMapButtonClick = () => {
    props.onZoomOutMapButtonClick && props.onZoomOutMapButtonClick();
  };

  const handleZoomResetButtonClick = () => {
    props.onZoomResetButtonClick && props.onZoomResetButtonClick();
  };

  const handleInsertClick = () => {
    props.onInsertClick();
  };

  const handleNodeFormatClick = () => {
    props.onNodeFormatClick('draw');
  };

  const handleEdgeFormatClick = () => {
    props.onEdgeFormatClick('draw');
  };

  const handleSettingsButtonClick = (event) => {
    props.onSettingsButtonClick(event.currentTarget);
  };

  const handleHelpButtonClick = (event) => {
    props.onHelpButtonClick(event.currentTarget);
  };

  return (
    <div style={rootStyle}>
      <AppBar position="static">
        <Toolbar id="toolbar">
          <IconButton
            id="menu"
            aria-label="Menu"
            onClick={handleMenuButtonClick}
          >
            <MenuIcon />
          </IconButton>
          <IconButton
            id="new"
            aria-label="New"
            onClick={handleNewButtonClick}
          >
            <AddIcon />
          </IconButton>
          <IconButton
            id="open"
            aria-label="OpenInBrowser"
            onClick={handleOpenInBrowserButtonClick}
          >
            <OpenInBrowserIcon />
          </IconButton>
          <IconButton
            id="save-as"
            aria-label="SaveAlt"
            onClick={handleSaveAltButtonClick}
          >
            <SaveAltIcon />
          </IconButton>
          <IconButton
            id="undo"
            disabled={!props.hasUndo}
            aria-label="Undo"
            onClick={handleUndoButtonClick}
          >
            <UndoIcon />
          </IconButton>
          <IconButton
            id="redo"
            disabled={!props.hasRedo}
            aria-label="Redo"
            onClick={handleRedoButtonClick}
          >
            <RedoIcon />
          </IconButton>
          <Typography variant="h6" color="inherit" style={titleStyle}>
            <Icon style={logoIconStyle}>
              <img
                style={logoImgStyle}
                src="GraphvizLogo.png"
                width="32"
                height="32"
                alt=""
              />
            </Icon>
            Graphviz Visual Editor
          </Typography>
          <IconButton
            id="zoom-in"
            aria-label="ZoomIn"
            onClick={handleZoomInButtonClick}
          >
            <ZoomInIcon />
          </IconButton>
          <IconButton
            id="zoom-out"
            aria-label="ZoomOut"
            onClick={handleZoomOutButtonClick}
          >
            <ZoomOutIcon />
          </IconButton>
          <IconButton
            id="zoom-out-map"
            aria-label="ZoomOutMap"
            onClick={handleZoomOutMapButtonClick}
          >
            <ZoomOutMapIcon />
          </IconButton>
          <Button id="zoom-reset" onClick={handleZoomResetButtonClick}>
            1:1
          </Button>
          <Button onClick={handleInsertClick}>Insert</Button>
          <Button onClick={handleNodeFormatClick}>Node format</Button>
          <Button onClick={handleEdgeFormatClick}>Edge format</Button>
          <IconButton
            id="settings"
            aria-label="Settings"
            onClick={handleSettingsButtonClick}
          >
            <SettingsIcon />
          </IconButton>
          <a
            id="github"
            style={gitHubLinkStyle}
            href="https://github.com/magjac/graphviz-visual-editor"
            target="_blank"
            rel="noreferrer noopener"
          >
            <IconButton aria-label="GitHub">
              <GitHubIcon viewBox="-2.4 -2.4 28.8 28.8" />
            </IconButton>
          </a>
          <IconButton
            id="help"
            aria-label="Help"
            onClick={handleHelpButtonClick}
          >
            <HelpIcon />
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  );
}

ButtonAppBar.propTypes = {
  hasUndo: PropTypes.bool.isRequired,
  hasRedo: PropTypes.bool.isRequired,
  onMenuButtonClick: PropTypes.func.isRequired,
  onNewButtonClick: PropTypes.func.isRequired,
  onOpenInBrowserButtonClick: PropTypes.func.isRequired,
  onSaveAltButtonClick: PropTypes.func.isRequired,
  onUndoButtonClick: PropTypes.func.isRequired,
  onRedoButtonClick: PropTypes.func.isRequired,
  onZoomInButtonClick: PropTypes.func.isRequired,
  onZoomOutButtonClick: PropTypes.func.isRequired,
  onZoomOutMapButtonClick: PropTypes.func.isRequired,
  onZoomResetButtonClick: PropTypes.func.isRequired,
  onInsertClick: PropTypes.func.isRequired,
  onNodeFormatClick: PropTypes.func.isRequired,
  onEdgeFormatClick: PropTypes.func.isRequired,
  onSettingsButtonClick: PropTypes.func.isRequired,
  onHelpButtonClick: PropTypes.func.isRequired,
};

export default ButtonAppBar;
