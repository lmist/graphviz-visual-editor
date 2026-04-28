import React from 'react';
import { Paper } from '../components/ui/index.js';
import withRoot from '../withRoot.js';
import styles from './Workspace.module.css';
import ButtonAppBar from '../ButtonAppBar.js';
import Graph from '../Graph.js';
import TextEditor from '../TextEditor.js';
import MainMenu from '../MainMenu.js';
import HelpMenu from '../HelpMenu.js';
import SettingsDialog from '../SettingsDialog.js';
import OpenFromBrowserDialog from '../OpenFromBrowserDialog.js';
import SaveAsToBrowserDialog from '../SaveAsToBrowserDialog.js';
import InsertPanels from '../InsertPanels.js';
import FormatDrawer from '../FormatDrawer.js';
import { schemeCategory10 as d3_schemeCategory10} from 'd3-scale-chromatic';
import { schemePaired as d3_schemePaired} from 'd3-scale-chromatic';
import KeyboardShortcutsDialog from '../KeyboardShortcutsDialog.js';
import MouseOperationsDialog from '../MouseOperationsDialog.js';
import AboutDialog from '../AboutDialog.js';
import { parse as qs_parse } from 'qs';
import { stringify as qs_stringify } from 'qs';
import ExportAsUrlDialog from '../ExportAsUrlDialog.js';
import ExportAsSvgDialog from '../ExportAsSvgDialog.js'
import { graphvizVersion } from '../graphvizVersion.js';
import UpdatedSnackbar from '../UpdatedSnackbar.js';
import { backendGetState, backendRpc, backendSubscribe } from '../backendSync.js';
import packageJSON from '../../package.json';

const rootStyle = { textAlign: 'center' };
const paperStyle = {
  // viewport height - app bar - 2 * stage padding
  height: "calc(100vh - 64px - 2 * 16px)",
};
const paperWhenUpdatedSnackbarIsOpenStyle = {
  marginTop: "64px",
  height: "calc(100vh - 64px - 64px - 2 * 16px)",
};
const paperWhenFullscreenStyle = {
  height: "calc(100vh)",
  overflow: "hidden",
};

const defaultElevation = 2;
const focusedElevation = 8;
const PANE_HEADER_HEIGHT = 45;
const EDITOR_STATUS_HEIGHT = 41;
const AGENT_STRIP_HEIGHT = 45;

class Index extends React.Component {

  constructor(props) {
    super(props);
    let dotSrc = localStorage.getItem('dotSrc');
    if (dotSrc == null) {
      dotSrc = `strict digraph {
    a [shape="ellipse" style="filled" fillcolor="` + d3_schemeCategory10[0] + `"]
    b [shape="polygon" style="filled" fillcolor="` + d3_schemeCategory10[1] + `"]
    a -> b [fillcolor="` + d3_schemePaired[0] + `" color="` + d3_schemePaired[1] + `"]
}`;
    }
    this.state = {
      projects: JSON.parse(localStorage.getItem('projects')) || {},
      initialized: false,
      name: localStorage.getItem('name') || '',
      dotSrc: dotSrc,
      forceNewDotSrc: true,
      dotSrcLastChangeTime: +localStorage.getItem('dotSrcLastChangeTime') || Date.now(),
      svg: localStorage.getItem('svg') || '',
      hasUndo: false,
      hasRedo: false,
      mainMenuIsOpen: false,
      helpMenuIsOpen: false,
      settingsDialogIsOpen: false,
      openFromBrowserDialogIsOpen: false,
      saveToBrowserAsDialogIsOpen: false,
      replaceName: '',
      exportAsUrlDialogIsOpen: false,
      exportAsSvgDialogIsOpen: false,
      fullscreen: false,
      insertPanelsAreOpen: (localStorage.getItem('insertPanelsAreOpen') || 'false') === 'true',
      nodeFormatDrawerIsOpen: (localStorage.getItem('nodeFormatDrawerIsOpen') || 'false') === 'true',
      edgeFormatDrawerIsOpen: (localStorage.getItem('edgeFormatDrawerIsOpen') || 'false') === 'true',
      keyboardShortcutsDialogIsOpen: false,
      mouseOperationsDialogIsOpen: false,
      aboutDialogIsOpen: false,
      fitGraph : localStorage.getItem('fitGraph') === 'true',
      transitionDuration: localStorage.getItem('transitionDuration') || 1,
      tweenPaths : localStorage.getItem('tweenPaths') !== 'false',
      tweenShapes : localStorage.getItem('tweenShapes') !== 'false',
      tweenPrecision : localStorage.getItem('tweenPrecision') || '1%',
      engine : localStorage.getItem('engine') || 'dot',
      defaultNodeAttributes: JSON.parse(localStorage.getItem('defaultNodeAttributes')) || {},
      defaultEdgeAttributes: JSON.parse(localStorage.getItem('defaultEdgeAttributes')) || {},
      error: null,
      backendConnected: false,
      holdOff: localStorage.getItem('holdOff') || 0.2,
      fontSize: localStorage.getItem('fontSize') || 12,
      tabSize: +localStorage.getItem('tabSize') || 4,
      selectedGraphComponents: [],
      test: JSON.parse(localStorage.getItem('test')) || {},
      graphvizVersion: graphvizVersion,
      newGraphvizVersion: graphvizVersion !== localStorage.getItem('graphvizVersion'),
      updatedSnackbarIsOpen: packageJSON.version !== localStorage.getItem('version'),
    };
  }

  componentDidMount() {
    const urlParams = qs_parse(window.location.search.slice(1));
    if (urlParams.dot) {
      const currentDotSrc = this.state.dotSrc;
      const newDotSrc = urlParams.dot;
      if (newDotSrc !== currentDotSrc) {
        const names = Object.keys(this.state.projects).filter((name) => {
          const project = this.state.projects[name];
          return newDotSrc === project.dotSrc;
        });
        if (names.length > 0) {
          this.handleOpenFromBrowser(names[0]);
        } else {
          const newName = this.createUntitledName(this.state.projects, this.state.name);
          this.handleSaveAsToBrowser(newName, newDotSrc);
        }
      }
      window.history.replaceState(null, null, window.location.pathname);
    }

    document.documentElement.addEventListener('mouseleave', () => {
      this.outsideOfDocument = true;
    });

    document.documentElement.addEventListener('mouseenter', () => {
      this.outsideOfDocument = false;
    })

    document.onblur = () => {
      // Needed when the user clicks outside the document,
      // e.g. the browser address bar
      if (this.outsideOfDocument) {
        this.setFocus(null);
      }
    }

    this.backendMounted = true;
    this.connectBackendSync();
  }

  componentWillUnmount() {
    this.backendMounted = false;
    if (this.backendUnsubscribe) {
      this.backendUnsubscribe();
    }
    if (this.backendPushTimer) {
      clearTimeout(this.backendPushTimer);
    }
    if (this.backendReconnectTimer) {
      clearTimeout(this.backendReconnectTimer);
    }
  }

  setPersistentState = (updater) => {
    this.setState((state) => {
      if (typeof updater === 'function') {
        var obj = updater(state);
      } else {
        obj = updater;
      }
      if (obj != null) {
        Object.keys(obj).forEach((key) => {
          let value = obj[key];
          if (typeof value === 'boolean') {
            value = value.toString();
          }
          else if (typeof value === 'object') {
            value = JSON.stringify(value);
          }
          localStorage.setItem(key, value);
        });
        if (!this.suppressBackendPush && Object.prototype.hasOwnProperty.call(obj, 'dotSrc')) {
          this.queueBackendDotPush(obj.dotSrc);
        }
      }
      return obj;
    });
  }

  scheduleBackendReconnect = () => {
    if (!this.backendMounted || this.backendReconnectTimer) {
      return;
    }
    this.backendReconnectTimer = window.setTimeout(() => {
      this.backendReconnectTimer = null;
      this.connectBackendSync();
    }, 2000);
  }

  connectBackendSync = async () => {
    try {
      const health = await backendGetState();
      this.backendConnected = true;
      this.setState({ backendConnected: true });
      if (this.backendReconnectTimer) {
        clearTimeout(this.backendReconnectTimer);
        this.backendReconnectTimer = null;
      }
      if (this.backendUnsubscribe) {
        this.backendUnsubscribe();
      }
      this.backendUnsubscribe = backendSubscribe(
        (snapshot) => this.handleBackendSnapshot(snapshot),
        () => {
          this.backendConnected = false;
          this.setState({ backendConnected: false });
          if (this.backendUnsubscribe) {
            this.backendUnsubscribe();
            this.backendUnsubscribe = null;
          }
          this.scheduleBackendReconnect();
        },
      );
      if (health && health.dot) {
        const localDot = this.state.dotSrc || '';
        const backendHasContent = health.summary && (health.summary.nodeCount > 0 || health.summary.edgeCount > 0);
        if (backendHasContent || !localDot.trim()) {
          this.handleBackendSnapshot(health);
        } else {
          this.queueBackendDotPush(localDot, true);
        }
      }
    } catch (error) {
      this.backendConnected = false;
      this.setState({ backendConnected: false });
      this.scheduleBackendReconnect();
    }
  }

  handleBackendSnapshot = (snapshot) => {
    if (!snapshot || typeof snapshot.dot !== 'string') {
      return;
    }
    if (snapshot.dot === this.state.dotSrc) {
      return;
    }
    this.suppressBackendPush = true;
    this.setPersistentState({
      dotSrc: snapshot.dot,
      forceNewDotSrc: true,
      dotSrcLastChangeTime: Date.now(),
    });
    window.setTimeout(() => {
      this.suppressBackendPush = false;
    }, 0);
  }

  queueBackendDotPush = (dotSrc, force = false) => {
    if (!this.backendConnected) {
      return;
    }
    if (this.suppressBackendPush && !force) {
      return;
    }
    this.pendingBackendDotSrc = dotSrc;
    if (this.backendPushTimer) {
      clearTimeout(this.backendPushTimer);
    }
    this.backendPushTimer = window.setTimeout(() => {
      const pendingDotSrc = this.pendingBackendDotSrc;
      this.pendingBackendDotSrc = null;
      if (!pendingDotSrc || !this.backendConnected) {
        return;
      }
      backendRpc('setDot', { dot: pendingDotSrc }).catch((error) => {
        // Keep the connection alive; invalid DOT should not disable sync.
        console.warn('Backend setDot failed:', error);
      });
    }, force ? 0 : 250);
  }

  handleTextChangeFromGraph = (text) => {
    const forceNewDotSrc = true;
    const undoRedoState = null;
    this.handleTextChange(text, undoRedoState, forceNewDotSrc);
  }

  handleTextChange = (text, undoRedoState, forceNewDotSrc) => {
    this.setPersistentState((state) => {
      const newState = {
        name: state.name || (text ? this.createUntitledName(state.projects) : ''),
        dotSrc: text,
        forceNewDotSrc: forceNewDotSrc,
      };
      if (!this.disableDotSrcLastChangeTimeUpdate) {
        newState.dotSrcLastChangeTime = Date.now();
      }
      this.disableDotSrcLastChangeTimeUpdate = false;
      return newState;
    });
    if (this.resetUndoAtNextTextChange) {
      this.resetUndoStack();
      undoRedoState = {
        hasUndo: false,
        hasRedo: false,
      };
      this.resetUndoAtNextTextChange = false;
    }
    this.setState(undoRedoState);
  }

  handleMainMenuButtonClick = (anchorEl) => {
    this.setState({
      mainMenuIsOpen: true,
      mainMenuAnchorEl: anchorEl,
    });
  }

  handleNewClick = () => {
    this.handleSaveAsToBrowser('');
    this.resetUndoAtNextTextChange = true;
  }

  handleRenameClick = () => {
    this.setState({
      rename: true,
      saveToBrowserAsDialogIsOpen: true,
    });
  }

  handleExportAsUrlClick = () => {
    this.setState({
      exportAsUrlDialogIsOpen: true,
    });
  }

  handleExportAsSvgClick = () => {
    this.setState({
      exportAsSvgDialogIsOpen: true,
    });
  }

  handleExportAsUrlClose = () => {
    this.setState({
      exportAsUrlDialogIsOpen: false,
    });
  }

  handleExportAsSvgClose = () => {
    this.setState({
      exportAsSvgDialogIsOpen: false,
    });
  }

  handleUndoButtonClick = () => {
    this.undo();
  }

  handleRedoButtonClick = () => {
    this.redo();
  }

  handleMainMenuClose = () => {
    this.setState({
      mainMenuIsOpen: false,
    });
  }

  handleHelpButtonClick = (anchorEl) => {
    this.setState({
      helpMenuIsOpen: true,
      helpMenuAnchorEl: anchorEl,
    });
  }

  handleHelpMenuClose = () => {
    this.setState({
      helpMenuIsOpen: false,
    });
  }

  handleInsertButtonClick = () => {
    this.setFocusIf('insertPanelsAreOpen', null, 'InsertPanels')
    this.setPersistentState({
      insertPanelsAreOpen: !this.state.insertPanelsAreOpen,
    });
  }

  handleNodeFormatButtonClick = () => {
    this.setFocusIf('nodeFormatDrawerIsOpen', null, 'NodeFormatDrawer')
    this.setPersistentState({
      nodeFormatDrawerIsOpen: !this.state.nodeFormatDrawerIsOpen,
      edgeFormatDrawerIsOpen: false,
    });
  }

  handleNodeFormatDrawerClose = () => {
    this.setPersistentState({
      nodeFormatDrawerIsOpen: false,
    });
    this.setFocus(null);
  }

  handleEdgeFormatButtonClick = () => {
    this.setFocusIf('edgeFormatDrawerIsOpen', null, 'EdgeFormatDrawer')
    this.setPersistentState({
      edgeFormatDrawerIsOpen: !this.state.edgeFormatDrawerIsOpen,
      nodeFormatDrawerIsOpen: false,
    });
  }

  handleEdgeFormatDrawerClose = () => {
    this.setPersistentState({
      edgeFormatDrawerIsOpen: false,
    });
    this.setFocus(null);
  }

  handleSettingsClick = () => {
    this.setState({
      settingsDialogIsOpen: true,
    });
  }

  handleSettingsClose = () => {
    this.setState({
      settingsDialogIsOpen: false,
    });
  }

  handleOpenFromBrowserClick = () => {
    this.setState({
      openFromBrowserDialogIsOpen: true,
    });
  }

  handleOpenFromBrowserClose = () => {
    this.setState({
      openFromBrowserDialogIsOpen: false,
    });
  }

  handleOpenFromBrowser = (newCurrentName) => {
    const currentName = this.state.name;
    if (newCurrentName !== currentName) {
      this.setPersistentState(state => {
        const projects = {...state.projects};
        if (currentName) {
          const currentProject = {
            dotSrc: state.dotSrc,
            forceNewDotSrc: true,
            dotSrcLastChangeTime: state.dotSrcLastChangeTime,
            svg: this.getSvgString(),
          };
          projects[currentName] = currentProject;
        }
        const newCurrentProject = projects[newCurrentName];
        delete projects[newCurrentName];
        this.disableDotSrcLastChangeTimeUpdate = true;
        return {
          name: newCurrentName,
          ...newCurrentProject,
          projects: projects,
        }
      });
      this.resetUndoAtNextTextChange = true;
    }
    this.handleOpenFromBrowserClose();
  }

  createUntitledName = (projects, currentName) => {
    const baseName = 'Untitled Graph';
    let newName = baseName;
    while (projects[newName] || newName === currentName) {
      newName = baseName + ' ' + (+newName.replace(baseName, '') + 1);
    }
    return newName;
  }

  handleOpenFromBrowserDelete = (nameToDelete) => {
    this.setPersistentState((state) => {
      const currentName = state.name;
      if (nameToDelete === currentName) {
        return {
          name: '',
          dotSrc: '',
          forceNewDotSrc: true,
          dotSrcLastChangeTime: Date.now(),
        }
      } else {
        const projects = {...state.projects};
        delete projects[nameToDelete];
        return {
          projects: projects,
        }
      }
    });
  }

  handleSaveAsToBrowserClick = () => {
    this.setState({
      rename: false,
      saveToBrowserAsDialogIsOpen: true,
    });
  }

  handleSaveAsToBrowserClose = () => {
    this.setState({
      saveToBrowserAsDialogIsOpen: false,
    });
  }

  handleSaveAsToBrowser = (newName, newDotSrc) => {
    const currentName = this.state.name;
    if (newName !== currentName) {
      this.setPersistentState((state) => {
        const projects = {...state.projects};
        delete projects[newName];
        if (currentName && !state.rename) {
          const currentProject = {
            dotSrc: this.state.dotSrc,
            dotSrcLastChangeTime: state.dotSrcLastChangeTime,
            svg: this.getSvgString(),
          };
          projects[currentName] = currentProject;
        }
        return {
          projects: {
            ...projects,
          },
          name: newName,
          dotSrc: newDotSrc ? newDotSrc : (newName ? state.dotSrc : ''),
          forceNewDotSrc: true,
          dotSrcLastChangeTime: newDotSrc ? Date.now() : state.dotSrcLastChangeTime,
        };
      });
    }
    this.handleSaveAsToBrowserClose();
  }

  handleEngineSelectChange = (engine) => {
    this.setPersistentState({
      engine: engine,
    });
  }

  handleFitGraphSwitchChange = (fitGraph) => {
    this.setPersistentState({
      fitGraph: fitGraph,
    });
  }

  handleTransitionDurationChange = (transitionDuration) => {
    this.setPersistentState({
      transitionDuration: transitionDuration,
    });
  }

  handleTweenPathsSwitchChange = (tweenPaths) => {
    this.setPersistentState({
      tweenPaths: tweenPaths,
    });
  }

  handleTweenShapesSwitchChange = (tweenShapes) => {
    this.setPersistentState({
      tweenShapes: tweenShapes,
    });
  }

  handleTweenPrecisionChange = (tweenPrecision) => {
    this.setPersistentState({
      tweenPrecision: tweenPrecision,
    });
  }

  handleHoldOffChange = (holdOff) => {
    this.setPersistentState({
      holdOff: holdOff,
    });
  }

  handleFontSizeChange = (fontSize) => {
    this.setPersistentState({
      fontSize: fontSize,
    });
  }

  handleTabSizeChange = (tabSize) => {
    this.setPersistentState({
      tabSize: tabSize,
    });
  }

  handleNodeStyleChange = (style) => {
    this.setPersistentState(state => ({
      defaultNodeAttributes: {
          ...state.defaultNodeAttributes,
        style: style,
      },
    }));
  }

  handleNodeColorChange = (color) => {
    this.setPersistentState(state => ({
      defaultNodeAttributes: {
          ...state.defaultNodeAttributes,
        color: color,
      },
    }));
  }

  handleNodeFillColorChange = (color) => {
    this.setPersistentState(state => ({
      defaultNodeAttributes: {
          ...state.defaultNodeAttributes,
        fillcolor: color,
      },
    }));
  }

  handleEdgeStyleChange = (style) => {
    this.setPersistentState(state => ({
      defaultEdgeAttributes: {
          ...state.defaultEdgeAttributes,
        style: style,
      },
    }));
  }

  handleEdgeColorChange = (color) => {
    this.setPersistentState(state => ({
      defaultEdgeAttributes: {
          ...state.defaultEdgeAttributes,
        color: color,
      },
    }));
  }

  handleEdgeFillColorChange = (color) => {
    this.setPersistentState(state => ({
      defaultEdgeAttributes: {
          ...state.defaultEdgeAttributes,
        fillcolor: color,
      },
    }));
  }

  handleKeyboardShortcutsClick = () => {
    this.setState({
      keyboardShortcutsDialogIsOpen: true,
    });
  }

  handleKeyboardShortcutsDialogClose = () => {
    this.setState({
      keyboardShortcutsDialogIsOpen: false,
    });
  }

  handleMouseOperationsClick = () => {
    this.setState({
      mouseOperationsDialogIsOpen: true,
    });
  }

  handleMouseOperationsDialogClose = () => {
    this.setState({
      mouseOperationsDialogIsOpen: false,
    });
  }

  handleAboutClick = () => {
    this.setState({
      aboutDialogIsOpen: true,
    });
  }

  handleAboutDialogClose = () => {
    this.setState({
      aboutDialogIsOpen: false,
    });
  }

  registerNodeShapeClick = (handleNodeShapeClick) => {
    this.handleNodeShapeClick = handleNodeShapeClick;
  }

  registerNodeShapeDragStart = (handleNodeShapeDragStart) => {
    this.handleNodeShapeDragStart = handleNodeShapeDragStart;
  }

  registerNodeShapeDragEnd = (handleNodeShapeDragEnd) => {
    this.handleNodeShapeDragEnd = handleNodeShapeDragEnd;
  }

  handleZoomInButtonClick = () => {}
  handleZoomOutButtonClick = () => {}
  handleZoomOutMapButtonClick = () => {}
  handleZoomResetButtonClick = () => {}

  registerZoomInButtonClick = (handleZoomInButtonClick) => {
    this.handleZoomInButtonClick = handleZoomInButtonClick;
  }

  registerZoomOutButtonClick = (handleZoomOutButtonClick) => {
    this.handleZoomOutButtonClick = handleZoomOutButtonClick;
  }

  registerZoomOutMapButtonClick = (handleZoomOutMapButtonClick) => {
    this.handleZoomOutMapButtonClick = handleZoomOutMapButtonClick;
  }

  registerZoomResetButtonClick = (handleZoomResetButtonClick) => {
    this.handleZoomResetButtonClick = handleZoomResetButtonClick;
  }

  registerGetSvg = (getSvg) => {
    this.getSvg = getSvg;
  }

  getSvgString() {
    const svg = this.getSvg();
    const serializer = new XMLSerializer();
    return svg ? serializer.serializeToString(svg) : this.state.svg;
  }

  handleGraphComponentSelect = (components) => {
    this.setState({
      selectedGraphComponents: components,
    });
  }

  handleGraphInitialized = () => {
    this.setState({
      graphInitialized: true,
    });
    this.setPersistentState({
      svg: this.getSvgString(),
    });
  }

  handleError = (error) => {
    if (error) {
      error.numLines = this.state.dotSrc.split('\n').length;
    }
    if (JSON.stringify(error) !== JSON.stringify(this.state.error)) {
      this.setState({
        error: error,
      });
    }
  }

  registerUndo = (undo) => {
    this.undo = undo;
  }

  registerRedo = (redo) => {
    this.redo = redo;
  }

  registerUndoReset = (resetUndoStack) => {
    this.resetUndoStack = resetUndoStack;
  }

  handleTextEditorFocus = () => {
    this.setFocus('TextEditor');
  }

  handleTextEditorBlur = () => {
    // Needed when the user clicks outside of a pane,
    // e.g. the app bar or the background
    this.setFocusIfFocusIs('TextEditor', null);
  }

  handleGraphFocus = () => {
    this.setFocus('Graph');
  }

  handleInsertPanelsClick = () => {
    this.setFocus('InsertPanels');
  }

  handleNodeFormatDrawerClick = () => {
    this.setFocusIf('nodeFormatDrawerIsOpen', 'NodeFormatDrawer', null)
  }

  handleEdgeFormatDrawerClick = () => {
    this.setFocus('EdgeFormatDrawer');
    this.setFocusIf('edgeFormatDrawerIsOpen', 'EdgeFormatDrawer', null)
  }

  handleUpdatedSnackbarClose = () => {
    this.setState({ "updatedSnackbarIsOpen": false });
    this.setPersistentState({
      "version": packageJSON.version,
      "graphvizVersion": this.state.graphvizVersion,
    })
  }

  handleToggleFullscreen = () => {
    // return focus to the document body. This remove focus from the fullscreen
    // icon button and allows keyboard shortcuts in the graph to continue to
    // work.
    document.activeElement.blur();
    this.setState((state) => ({
      fullscreen: !state.fullscreen,
    }));
  }

  setFocus = (focusedPane) => {
    this.setState((state) => (state.focusedPane !== focusedPane && {
      focusedPane: focusedPane,
    }) || null);
  }

  setFocusIfFocusIs = (currentlyFocusedPane, newFocusedPane) => {
    this.setState((state) => (state.focusedPane === currentlyFocusedPane && {
      focusedPane: newFocusedPane,
    }) || null);
  }

  setFocusIf = (stateProperty, focusedPaneIf, focusedPaneElse) => {
    this.setState((state) => {
      const focusedPane = state[stateProperty] ? focusedPaneIf: focusedPaneElse;
      return (state.focusedPane !== focusedPane && {
        focusedPane: focusedPane,
      }) || null;
    });
  }

  getDotLineCount = () => {
    if (!this.state.dotSrc) return 0;
    return this.state.dotSrc.split('\n').length;
  }

  getWorkspaceStatus = () => {
    if (this.state.error) {
      return {
        tone: 'error',
        label: 'Parse error',
        detail: `Line ${this.state.error.line}: ${this.state.error.message}`,
      };
    }
    if (this.state.backendConnected) {
      return {
        tone: 'synced',
        label: 'Synced',
        detail: 'Agent and editor are reading the same graph state.',
      };
    }
    return {
      tone: 'local',
      label: 'Local only',
      detail: 'Backend sync is unavailable. Your browser copy remains editable.',
    };
  }

  renderStatusPill = (status) => (
    <span className={`${styles.statusPill} ${styles[`status${status.tone[0].toUpperCase()}${status.tone.slice(1)}`]}`}>
      {status.label}
    </span>
  )

  renderEditorStatus = (status) => (
    <div className={styles.editorStatus}>
      <div className={styles.editorStatusRow}>
        {this.renderStatusPill(status)}
        <span className={styles.editorStatusText}>
          {this.getDotLineCount()} lines · {this.state.engine}
        </span>
      </div>
      {this.state.error && (
        <div className={`${styles.editorStatusText} ${styles.errorText}`}>
          Line {this.state.error.line}: {this.state.error.message}
        </div>
      )}
    </div>
  )

  renderAgentStrip = (status) => (
    <div className={styles.agentStrip}>
      <span className={styles.agentGlyph}>II</span>
      <span className={styles.agentCopy}>
        <span className={styles.agentTitle}>Agent output watch</span>
        <span className={styles.agentBody}>{status.detail}</span>
      </span>
    </div>
  )

  renderCanvasOverlay = (status) => {
    if (this.state.fullscreen && !this.state.error && this.state.dotSrc) {
      return null;
    }
    if (this.state.error) {
      return (
        <div className={`${styles.canvasOverlay} ${styles.canvasOverlayError}`} role="status">
          <h2 className={styles.canvasOverlayTitle}>Graph did not render</h2>
          <p className={styles.canvasOverlayBody}>
            Line {this.state.error.line}: fix the DOT source to resume visual sync.
          </p>
        </div>
      );
    }
    if (!this.state.dotSrc.trim()) {
      return (
        <div className={styles.canvasOverlay} role="status">
          <h2 className={styles.canvasOverlayTitle}>No graph yet</h2>
          <p className={styles.canvasOverlayBody}>
            Paste DOT on the left, start a new graph, or let the agent draft one through sync.
          </p>
        </div>
      );
    }
    if (!this.state.backendConnected) {
      return (
        <div className={styles.canvasOverlay} role="status">
          <h2 className={styles.canvasOverlayTitle}>Local editing mode</h2>
          <p className={styles.canvasOverlayBody}>{status.detail}</p>
        </div>
      );
    }
    return null;
  }

  render() {
    const workspaceStatus = this.getWorkspaceStatus();
    const editorIsOpen = !this.state.nodeFormatDrawerIsOpen && !this.state.edgeFormatDrawerIsOpen && !this.state.fullscreen;
    const textEditorHasFocus = this.state.focusedPane === 'TextEditor';
    const nodeFormatDrawerHasFocus = this.state.focusedPane === 'NodeFormatDrawer';
    const edgeFormatDrawerHasFocus = this.state.focusedPane === 'EdgeFormatDrawer';
    const insertPanelsHaveFocus = this.state.focusedPane === 'InsertPanels';
    const graphHasFocus = this.state.focusedPane === 'Graph';
    const leftPaneElevation = textEditorHasFocus || nodeFormatDrawerHasFocus || edgeFormatDrawerHasFocus? focusedElevation : defaultElevation;
    const rightPaneElevation = this.state.fullscreen ? 0 : graphHasFocus ? focusedElevation : defaultElevation;
    const midPaneElevation = insertPanelsHaveFocus ? focusedElevation : defaultElevation;

    var columns;
    if (this.state.fullscreen) {
      columns = {
        textEditor: false,
        insertPanels: false,
        graph: 12,
      }
    } else if (this.state.insertPanelsAreOpen && this.state.graphInitialized) {
      columns = {
        textEditor: 3,
        insertPanels: 3,
        graph: 6,
      }
    } else { /* browse */
      columns = {
        textEditor: 4,
        insertPanels: false,
        graph: 8,
      }
    }
    const paperPaneStyle = this.state.updatedSnackbarIsOpen ? paperWhenUpdatedSnackbarIsOpenStyle : this.state.fullscreen ? paperWhenFullscreenStyle : paperStyle;
    return (
      <div
        style={rootStyle}
        className={`${styles.workspace} ${this.state.fullscreen ? styles.workspaceFullscreen : ''}`}
      >
        <script src={process.env.PUBLIC_URL.replace(/\.$/, '') + "@hpcc-js/wasm/dist/graphviz.umd.js"} type="javascript/worker"></script>
        {!this.state.fullscreen &&
          <ButtonAppBar
            hasUndo={this.state.hasUndo}
            hasRedo={this.state.hasRedo}
            backendConnected={this.state.backendConnected}
            hasError={Boolean(this.state.error)}
            dotSrc={this.state.dotSrc}
            name={this.state.name}
            nodeCount={this.getDotLineCount()}
            onMenuButtonClick={this.handleMainMenuButtonClick}
            onNewButtonClick={this.handleNewClick}
            onUndoButtonClick={this.handleUndoButtonClick}
            onRedoButtonClick={this.handleRedoButtonClick}
            onInsertClick={this.handleInsertButtonClick}
            onNodeFormatClick={this.handleNodeFormatButtonClick}
            onEdgeFormatClick={this.handleEdgeFormatButtonClick}
            onZoomInButtonClick={this.handleZoomInButtonClick}
            onZoomOutButtonClick={this.handleZoomOutButtonClick}
            onZoomOutMapButtonClick={this.handleZoomOutMapButtonClick}
            onZoomResetButtonClick={this.handleZoomResetButtonClick}
            onSettingsButtonClick={this.handleSettingsClick}
            onOpenInBrowserButtonClick={this.handleOpenFromBrowserClick}
            onSaveAltButtonClick={this.handleSaveAsToBrowserClick}
            onHelpButtonClick={this.handleHelpButtonClick}
          >
          </ButtonAppBar>
        }
        {this.state.mainMenuIsOpen &&
          <MainMenu
            anchorEl={this.state.mainMenuAnchorEl}
            onMenuClose={this.handleMainMenuClose}
            onSettingsClick={this.handleSettingsClick}
            onOpenFromBrowserClick={this.handleOpenFromBrowserClick}
            onSaveAsToBrowserClick={this.handleSaveAsToBrowserClick}
            onNewClick={this.handleNewClick}
            onRenameClick={this.handleRenameClick}
            onExportAsUrlClick={this.handleExportAsUrlClick}
            onExportAsSvgClick={this.handleExportAsSvgClick}
          />
        }
        {this.state.settingsDialogIsOpen &&
          <SettingsDialog
            engine={this.state.engine}
            fitGraph={this.state.fitGraph}
            transitionDuration={this.state.transitionDuration}
            tweenPaths={this.state.tweenPaths}
            tweenShapes={this.state.tweenShapes}
            tweenPrecision={this.state.tweenPrecision}
            onEngineSelectChange={this.handleEngineSelectChange}
            onFitGraphSwitchChange={this.handleFitGraphSwitchChange}
            onTransitionDurationChange={this.handleTransitionDurationChange}
            onTweenPathsSwitchChange={this.handleTweenPathsSwitchChange}
            onTweenShapesSwitchChange={this.handleTweenShapesSwitchChange}
            onTweenPrecisionChange={this.handleTweenPrecisionChange}
            holdOff={this.state.holdOff}
            onHoldOffChange={this.handleHoldOffChange}
            fontSize={this.state.fontSize}
            onFontSizeChange={this.handleFontSizeChange}
            tabSize={this.state.tabSize}
            onTabSizeChange={this.handleTabSizeChange}
            onSettingsClose={this.handleSettingsClose}
          />
        }
        {this.state.openFromBrowserDialogIsOpen &&
          <OpenFromBrowserDialog
            projects={this.state.projects}
            dotSrc={this.state.dotSrc}
            dotSrcLastChangeTime={this.state.dotSrcLastChangeTime}
            svg={this.getSvgString()}
            name={this.state.name}
            onOpen={this.handleOpenFromBrowser}
            onClose={this.handleOpenFromBrowserClose}
            onDelete={this.handleOpenFromBrowserDelete}
          />
        }
        {this.state.saveToBrowserAsDialogIsOpen &&
          <SaveAsToBrowserDialog
            name={this.state.name}
            rename={this.state.rename}
            defaultNewName={this.state.name || this.createUntitledName(this.state.projects)}
            projects={this.state.projects}
            onSave={this.handleSaveAsToBrowser}
            onClose={this.handleSaveAsToBrowserClose}
          />
        }
        {this.state.exportAsUrlDialogIsOpen &&
          <ExportAsUrlDialog
            URL={window.location.href + '?' + qs_stringify({dot: this.state.dotSrc})}
            onClose={this.handleExportAsUrlClose}
          />
        }
        {this.state.exportAsSvgDialogIsOpen &&
          <ExportAsSvgDialog
            defaultFilename={(this.state.name || this.createUntitledName(this.state.projects)) + '.svg'}
            getSvgString={this.getSvgString.bind(this)}
            onClose={this.handleExportAsSvgClose}
          />
        }
        {this.state.updatedSnackbarIsOpen &&
          <UpdatedSnackbar
            newGraphvizVersion={this.state.newGraphvizVersion}
            graphvizVersion={this.state.graphvizVersion}
            onUpdatedSnackbarClose={this.handleUpdatedSnackbarClose}
          />
        }
        <div
          className={`${styles.stage} ${this.state.fullscreen ? styles.stageFullscreen : ''}`}
          style={{
            display: 'grid',
            gridTemplateColumns: [
              !this.state.fullscreen ? `minmax(0, ${columns.textEditor}fr)` : null,
              this.state.insertPanelsAreOpen && this.state.graphInitialized && !this.state.fullscreen ? `minmax(0, ${columns.insertPanels}fr)` : null,
              `minmax(0, ${columns.graph}fr)`,
            ].filter(Boolean).join(' '),
          }}
        >
          <div className={`${styles.paneShell} ${this.state.fullscreen ? styles.paneHidden : ''}`}>
            <Paper
              elevation={leftPaneElevation}
              className={styles.paneSurface}
              style={paperPaneStyle}
            >
              <div className={styles.paneHeader}>
                <span>
                  <span className={styles.paneKicker}>I. Source</span>
                  <span className={styles.paneTitle}>DOT drafting bay</span>
                </span>
                <span className={styles.paneMeta}>
                  {this.renderStatusPill(workspaceStatus)}
                </span>
              </div>
              {this.state.nodeFormatDrawerIsOpen &&
                <FormatDrawer
                  type='node'
                  defaultAttributes={this.state.defaultNodeAttributes}
                  onClick={this.handleNodeFormatDrawerClick}
                  onFormatDrawerClose={this.handleNodeFormatDrawerClose}
                  onStyleChange={this.handleNodeStyleChange}
                  onColorChange={this.handleNodeColorChange}
                  onFillColorChange={this.handleNodeFillColorChange}
                />
              }
              {this.state.edgeFormatDrawerIsOpen &&
                <FormatDrawer
                  type='edge'
                  defaultAttributes={this.state.defaultEdgeAttributes}
                  onClick={this.handleEdgeFormatDrawerClick}
                  onFormatDrawerClose={this.handleEdgeFormatDrawerClose}
                  onStyleChange={this.handleEdgeStyleChange}
                  onColorChange={this.handleEdgeColorChange}
                  onFillColorChange={this.handleEdgeFillColorChange}
                />
              }
              <div style={{display: editorIsOpen ? 'block' : 'none'}}>
                {this.renderEditorStatus(workspaceStatus)}
                <TextEditor
                  width="100%"
                  height={`calc(100vh - 64px - 2 * 16px - ${PANE_HEADER_HEIGHT + EDITOR_STATUS_HEIGHT + AGENT_STRIP_HEIGHT}px - ${this.state.updatedSnackbarIsOpen ? "64px" : "0px"})`}
                  dotSrc={this.state.forceNewDotSrc ? this.state.dotSrc : null}
                  onTextChange={this.handleTextChange}
                  onFocus={this.handleTextEditorFocus}
                  onBlur={this.handleTextEditorBlur}
                  error={this.state.error}
                  selectedGraphComponents={this.state.selectedGraphComponents}
                  holdOff={this.state.holdOff}
                  fontSize={this.state.fontSize}
                  tabSize={this.state.tabSize}
                  registerUndo={this.registerUndo}
                  registerRedo={this.registerRedo}
                  registerUndoReset={this.registerUndoReset}
                />
                {this.renderAgentStrip(workspaceStatus)}
              </div>
            </Paper>
          </div>
          {this.state.insertPanelsAreOpen && this.state.graphInitialized && !this.state.fullscreen && (
            <div className={styles.paneShell}>
              <Paper
                elevation={midPaneElevation}
                className={styles.paneSurface}
                style={paperPaneStyle}
              >
                <div className={styles.paneHeader}>
                  <span>
                    <span className={styles.paneKicker}>II. Insert</span>
                    <span className={styles.paneTitle}>Shape inventory</span>
                  </span>
                </div>
                <InsertPanels
                    onClick={this.handleInsertPanelsClick}
                    onNodeShapeClick={this.handleNodeShapeClick}
                    onNodeShapeDragStart={this.handleNodeShapeDragStart}
                    onNodeShapeDragEnd={this.handleNodeShapeDragEnd}
                />
              </Paper>
            </div>
          )}
          <div className={styles.paneShell}>
            <Paper
              elevation={rightPaneElevation}
              className={styles.paneSurface}
              style={paperPaneStyle}
            >
              {!this.state.fullscreen && (
                <div className={styles.paneHeader}>
                  <span>
                    <span className={styles.paneKicker}>III. Graph</span>
                    <span className={styles.paneTitle}>Visual model</span>
                  </span>
                  <span className={styles.paneMeta}>
                    {this.state.selectedGraphComponents.length} selected
                  </span>
                </div>
              )}
              <div
                className={styles.canvasFrame}
                style={{ height: this.state.fullscreen ? '100%' : `calc(100% - ${PANE_HEADER_HEIGHT}px)` }}
              >
                <Graph
                  hasFocus={graphHasFocus}
                  dotSrc={this.state.dotSrc}
                  engine={this.state.engine}
                  fit={this.state.fitGraph}
                  transitionDuration={this.state.transitionDuration}
                  tweenPaths={this.state.tweenPaths}
                  tweenShapes={this.state.tweenShapes}
                  tweenPrecision={this.state.tweenPrecision}
                  defaultNodeAttributes={this.state.defaultNodeAttributes}
                  defaultEdgeAttributes={this.state.defaultEdgeAttributes}
                  fullscreen={this.state.fullscreen}
                  onFocus={this.handleGraphFocus}
                  onTextChange={this.handleTextChangeFromGraph}
                  onHelp={this.handleKeyboardShortcutsClick}
                  onSelect={this.handleGraphComponentSelect}
                  onUndo={this.undo}
                  onRedo={this.redo}
                  onToggleFullscreen={this.handleToggleFullscreen}
                  registerNodeShapeClick={this.registerNodeShapeClick}
                  registerNodeShapeDragStart={this.registerNodeShapeDragStart}
                  registerNodeShapeDragEnd={this.registerNodeShapeDragEnd}
                  registerZoomInButtonClick={this.registerZoomInButtonClick}
                  registerZoomOutButtonClick={this.registerZoomOutButtonClick}
                  registerZoomOutMapButtonClick={this.registerZoomOutMapButtonClick}
                  registerZoomResetButtonClick={this.registerZoomResetButtonClick}
                  registerGetSvg={this.registerGetSvg}
                  onInitialized={this.handleGraphInitialized}
                  onError={this.handleError}
                  test={this.state.test}
                />
                {this.renderCanvasOverlay(workspaceStatus)}
              </div>
            </Paper>
          </div>
        </div>
        {this.state.helpMenuIsOpen &&
          <HelpMenu
            anchorEl={this.state.helpMenuAnchorEl}
            onMenuClose={this.handleHelpMenuClose}
            onKeyboardShortcutsClick={this.handleKeyboardShortcutsClick}
            onMouseOperationsClick={this.handleMouseOperationsClick}
            onAboutClick={this.handleAboutClick}
          />
        }
        {this.state.keyboardShortcutsDialogIsOpen &&
          <KeyboardShortcutsDialog
            onKeyboardShortcutsDialogClose={this.handleKeyboardShortcutsDialogClose}
          />
        }
        {this.state.mouseOperationsDialogIsOpen &&
          <MouseOperationsDialog
            onMouseOperationsDialogClose={this.handleMouseOperationsDialogClose}
          />
        }
        {this.state.aboutDialogIsOpen &&
          <AboutDialog
            graphvizVersion={this.state.graphvizVersion}
            onAboutDialogClose={this.handleAboutDialogClose}
          />
        }
      </div>
    );
  }
}

export default withRoot(Index);
