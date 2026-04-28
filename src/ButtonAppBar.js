import React from 'react';
import PropTypes from 'prop-types';
import {
  ArrowClockwise,
  ArrowCounterClockwise,
  DownloadSimple,
  FolderOpen,
  FrameCorners,
  GearSix,
  GithubLogo,
  List,
  MagnifyingGlassMinus,
  MagnifyingGlassPlus,
  Plus,
  Question,
} from '@phosphor-icons/react';
import { AppBar, Toolbar, Typography, Button, IconButton, Icon } from './components/ui/index.js';
import { BORDERS, COLORS, SPACING, TYPOGRAPHY } from './design/tokens.js';

const rootStyle = { flexGrow: 1 };
const titleStyle = { flex: '1 0 148px', display: 'inline-flex', alignItems: 'center', gap: SPACING.sm, minWidth: 148 };
const logoIconStyle = { width: 32, height: 32 };
const logoImgStyle = { display: 'block', height: '100%', width: '100%' };
const gitHubLinkStyle = { color: 'inherit', textDecoration: 'none' };
const titleTextStyle = {
  display: 'inline-flex',
  flexDirection: 'column',
  alignItems: 'flex-start',
  minWidth: 0,
  overflow: 'hidden',
};
const titleKickerStyle = {
  fontFamily: TYPOGRAPHY.mono,
  fontSize: 10,
  fontWeight: 600,
  letterSpacing: '0.14em',
  lineHeight: 1,
  textTransform: 'uppercase',
  color: COLORS.muted,
};
const titleNameStyle = {
  fontFamily: 'Georgia, "Times New Roman", serif',
  fontSize: 17,
  fontWeight: 700,
  lineHeight: 1.05,
  whiteSpace: 'nowrap',
  maxWidth: 150,
  overflow: 'hidden',
  textOverflow: 'ellipsis',
};
const statusClusterStyle = {
  display: 'inline-flex',
  alignItems: 'center',
  flexShrink: 0,
  gap: SPACING.sm,
  marginLeft: SPACING.sm,
  marginRight: SPACING.sm,
};
const statusPillStyle = (tone) => ({
  display: 'inline-flex',
  alignItems: 'center',
  gap: SPACING.xs,
  minHeight: 28,
  padding: `${SPACING.xs}px ${SPACING.sm}px`,
  border: BORDERS.thin,
  background: COLORS.bg,
  color: tone === 'error' ? COLORS.error : COLORS.fg,
  fontFamily: TYPOGRAPHY.mono,
  fontSize: 11,
  fontWeight: 600,
  letterSpacing: '0.08em',
  lineHeight: 1,
  textTransform: 'uppercase',
  whiteSpace: 'nowrap',
});
const statusDotStyle = (tone) => ({
  width: 7,
  height: 7,
  background: tone === 'error' ? COLORS.error : tone === 'synced' ? COLORS.accent : COLORS.muted,
});

function ButtonAppBar({
  backendConnected = false,
  hasError = false,
  dotSrc = '',
  name = '',
  nodeCount = 0,
  ...props
}) {
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

  const syncTone = hasError ? 'error' : backendConnected ? 'synced' : 'local';
  const syncLabel = hasError ? 'Parse error' : backendConnected ? 'Synced' : 'Local only';
  const graphLabel = dotSrc ? `${nodeCount} lines` : 'No graph';

  return (
    <div style={rootStyle}>
      <AppBar position="static">
        <Toolbar id="toolbar">
          <IconButton
            id="menu"
            aria-label="Menu"
            onClick={handleMenuButtonClick}
          >
            <List />
          </IconButton>
          <IconButton
            id="new"
            aria-label="New"
            onClick={handleNewButtonClick}
          >
            <Plus />
          </IconButton>
          <IconButton
            id="open"
            aria-label="OpenInBrowser"
            onClick={handleOpenInBrowserButtonClick}
          >
            <FolderOpen />
          </IconButton>
          <IconButton
            id="save-as"
            aria-label="SaveAlt"
            onClick={handleSaveAltButtonClick}
          >
            <DownloadSimple />
          </IconButton>
          <IconButton
            id="undo"
            disabled={!props.hasUndo}
            aria-label="Undo"
            onClick={handleUndoButtonClick}
          >
            <ArrowCounterClockwise />
          </IconButton>
          <IconButton
            id="redo"
            disabled={!props.hasRedo}
            aria-label="Redo"
            onClick={handleRedoButtonClick}
          >
            <ArrowClockwise />
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
            <span style={titleTextStyle}>
              <span style={titleKickerStyle}>I. Agent drafting table</span>
              <span style={titleNameStyle}>{name || 'Untitled Graph'}</span>
            </span>
          </Typography>
          <span style={statusClusterStyle} aria-label={`Workspace status: ${syncLabel}, ${graphLabel}`}>
            <span style={statusPillStyle(syncTone)}>
              <span style={statusDotStyle(syncTone)} />
              {syncLabel}
            </span>
            <span style={statusPillStyle('local')}>{graphLabel}</span>
          </span>
          <IconButton
            id="zoom-in"
            aria-label="ZoomIn"
            onClick={handleZoomInButtonClick}
          >
            <MagnifyingGlassPlus />
          </IconButton>
          <IconButton
            id="zoom-out"
            aria-label="ZoomOut"
            onClick={handleZoomOutButtonClick}
          >
            <MagnifyingGlassMinus />
          </IconButton>
          <IconButton
            id="zoom-out-map"
            aria-label="ZoomOutMap"
            onClick={handleZoomOutMapButtonClick}
          >
            <FrameCorners />
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
            <GearSix />
          </IconButton>
          <a
            id="github"
            style={gitHubLinkStyle}
            href="https://github.com/magjac/graphviz-visual-editor"
            target="_blank"
            rel="noreferrer noopener"
          >
            <IconButton aria-label="GitHub">
              <GithubLogo />
            </IconButton>
          </a>
          <IconButton
            id="help"
            aria-label="Help"
            onClick={handleHelpButtonClick}
          >
            <Question />
          </IconButton>
        </Toolbar>
      </AppBar>
    </div>
  );
}

ButtonAppBar.propTypes = {
  hasUndo: PropTypes.bool.isRequired,
  hasRedo: PropTypes.bool.isRequired,
  backendConnected: PropTypes.bool,
  hasError: PropTypes.bool,
  dotSrc: PropTypes.string,
  name: PropTypes.string,
  nodeCount: PropTypes.number,
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
