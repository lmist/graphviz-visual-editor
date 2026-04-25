import React from 'react';
import PropTypes from 'prop-types';
import withRoot from './withRoot.js';
import CloseIcon from './components/icons/CloseIcon.jsx';
import Dialog from './components/ui/Dialog.jsx';
import DialogContent from './components/ui/DialogContent.jsx';
import DialogContentText from './components/ui/DialogContentText.jsx';
import DialogTitle from './components/ui/DialogTitle.jsx';
import IconButton from './components/ui/IconButton.jsx';
import Table from './components/ui/Table.jsx';
import TableBody from './components/ui/TableBody.jsx';
import TableCell from './components/ui/TableCell.jsx';
import TableRow from './components/ui/TableRow.jsx';

const keyboardShortcuts = [
  {key: 'Ctrl-A', description: 'Select all nodes and edges.'},
  {key: 'Ctrl-Shift-A', description: 'Select all edges.'},
  {key: 'Ctrl-C', description: 'Copy the selected node.'},
  {key: 'Ctrl-V', description: 'Paste the cut/copied node.'},
  {key: 'Ctrl-X', description: 'Cut the selected node.'},
  {key: 'Ctrl-Y', description: 'Redo. Reimplement the last DOT source change.'},
  {key: 'Ctrl-Z', description: 'Undo. Revert the last DOT source change.'},
  {key: 'DEL', description: 'Delete the selected nodes and edges.'},
  {key: 'ESC', description: 'De-select the selected nodes and edges. Abort the current drawing operation.'},
  {key: 'f', description: 'Toggle fullscreen graph mode.'},
  {key: '?', description: 'Show keyboard shortcuts.'},
];

const titleRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const tableStyle = {
  marginBottom: 16,
};

class KeyboardShortcutsDialog extends React.Component {

  handleClose = () => {
    this.props.onKeyboardShortcutsDialogClose();
  };

  render() {
    return (
      <Dialog id="keyboard-shortcuts-dialog"
        open
        onClose={this.handleClose}
        scroll={'paper'}
        aria-labelledby="form-dialog-title"
      >
        <div style={titleRowStyle}>
          <DialogTitle id="form-dialog-title">Keyboard shortcuts in the graph</DialogTitle>
          <IconButton
            id="close-button"
            aria-label="Close"
            onClick={this.handleClose}
          >
            <CloseIcon />
          </IconButton>
        </div>
        <DialogContent>
          <Table size="small" style={tableStyle}>
            <TableBody>
              {keyboardShortcuts.map(keyboardShortcut => {
                return (
                  <TableRow key={keyboardShortcut.key}>
                    <TableCell component="th" scope="row" padding="none">
                      {keyboardShortcut.key}
                    </TableCell>
                    <TableCell>
                      {keyboardShortcut.description}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
          <DialogContentText variant="body1">
            For keyboard shortcuts in the text editor, please visit <a href="https://github.com/ajaxorg/ace/wiki/Default-Keyboard-Shortcuts" target="_blank" rel="noreferrer noopener">Ace Default Keyboard Shortcuts</a>
          </DialogContentText>
        </DialogContent>
      </Dialog>
    );
  }
}

KeyboardShortcutsDialog.propTypes = {
  onKeyboardShortcutsDialogClose: PropTypes.func.isRequired,
};

export default withRoot(KeyboardShortcutsDialog);
