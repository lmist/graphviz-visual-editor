import React from 'react';
import ace from 'react-ace';
import 'ace-builds/src-noconflict/mode-dot.js';
import 'ace-builds/src-noconflict/theme-github.js';
import 'ace-builds/src-noconflict/ext-searchbox.js';
import IconButton from './components/ui/IconButton.jsx';
import ErrorOutlineIcon from './components/icons/ErrorOutlineIcon.jsx';
import { COLORS } from './design/tokens.js';
const AceEditor = typeof ace == 'function' ? ace : ace.default;

const AceEditor = typeof ace == 'function' ? ace : ace.default;
const SELECTED_WORD_CLASS = 'gv-ace-selected-word';

const errorButtonStyle = {
  position: 'absolute',
  top: 'calc(64px + 12px)',
};

const markerStyle = `.${SELECTED_WORD_CLASS} {
  position: absolute;
  background: ${COLORS.accent};
  border: 2px solid ${COLORS.fg};
}`;

class TextEditor extends React.Component {

  constructor(props) {
    super(props);
    this.pendingChanges = 0;
  }

  handleChange = (value, event) => {
    const hasUndo = this.editor.getSession().getUndoManager().hasUndo();
    const hasRedo = this.editor.getSession().getUndoManager().hasRedo();
    const undoRedoState = {hasUndo, hasRedo};
    this.props.onTextChange(value, undoRedoState);
  };

  handleBeforeLoad = (ace) => {
    this.ace = ace;
  };

  handleLoad = (editor) => {
    this.editor = editor;
    this.props.registerUndo(this.undo);
    this.props.registerRedo(this.redo);
    this.props.registerUndoReset(this.resetUndoStack);
  };

  handleErrorButtonClick = (event) => {
    this.editor.scrollToLine(this.props.error.line - 1, true);
  };

  undo = () => {
    this.editor.getSession().getUndoManager().undo();
  }

  redo = () => {
    this.editor.getSession().getUndoManager().redo();
  }

  resetUndoStack = () => {
    this.editor.getSession().getUndoManager().reset();
  }

  render() {
    var annotations = null;
    if (this.props.error) {
      annotations = [{
        row: this.props.error.line - 1,
        column: 0,
        text: this.props.error.message,
        type: "error",
        dummy: Date.now(), // Workaround for issue #33
      }];
      if (this.editor && !this.editor.isRowFullyVisible(this.props.error.line)) {
        if (!this.prevError ||
            this.props.error.message !== this.prevError.message ||
            (this.props.error.line !== this.prevError.line &&
             this.props.error.numLines - this.props.error.line !== this.prevNumLines - this.prevError.line)
           ) {
          this.editor.scrollToLine(this.props.error.line - 1, true);
        }
      }
      this.prevNumLines = this.props.error.numLines;
    }
    this.prevError = this.props.error;
    const locations = this.props.selectedGraphComponents.reduce(
      (locations, component) => locations.concat(
        component.locations
      ),
      []
    );
    const markers = locations.map((location) => ({
      startRow: location.start.line - 1,
      startCol: location.start.column - 1,
      endRow: location.end.line - 1,
      endCol: location.end.column - 1,
      className: SELECTED_WORD_CLASS,
      type: 'background',
    }));
    // FIXME: There must be a better way...
    let scrollbarWidth = 0;
    if (this.div) {
      const scrollbarDiv = this.div.querySelector('div.ace_scrollbar-v');
      const hasScrollbar = scrollbarDiv && scrollbarDiv.style['display'] !== 'none';
      if (hasScrollbar) {
        const scrollbarInnerDiv = scrollbarDiv.querySelector('div.ace_scrollbar-inner');
        scrollbarWidth = scrollbarInnerDiv.clientWidth - 5;
      }
    }
    return (
      <div id="text-editor-wrapper" ref={div => this.div = div}>
        <style>{markerStyle}</style>
        <AceEditor
          // FIXME: Remove workaround when https://github.com/securingsincity/react-ace/issues/767 is fixed
          key={this.props.holdOff}
          mode="dot"
          theme="github"
          fontSize={this.props.fontSize + 'px'}
          tabSize={this.props.tabSize}
          onChange={this.handleChange}
          onBeforeLoad={this.handleBeforeLoad}
          onLoad={this.handleLoad}
          onFocus={this.props.onFocus}
          onBlur={this.props.onBlur}
          name="text-editor"
          value={this.props.dotSrc}
          // viewport height - app bar - 2 * padding
          height={this.props.height}
          width={this.props.width}
          wrapEnabled
          showPrintMargin={false}
          debounceChangePeriod={this.props.holdOff * 1000}
          editorProps={{
            $blockScrolling: true
          }}
          annotations={annotations}
          markers={markers}
        />
        <IconButton
          id="error-button"
          style={{
            ...errorButtonStyle,
            left: `calc(${this.props.width} - 2 * 12px - 12px - ${scrollbarWidth}px`,
            display: this.props.error ? 'block' : 'none',
            zIndex: 1,
          }}
          aria-label="Error"
          onClick={this.handleErrorButtonClick}
        >
          <ErrorOutlineIcon style={{ color: COLORS.error }} />
        </IconButton>
      </div>
    );
  }
}

export default TextEditor;
