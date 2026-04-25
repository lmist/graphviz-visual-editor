import React from 'react';
import PropTypes from 'prop-types';
import withRoot from './withRoot.js';
import CloseIcon from './components/icons/CloseIcon.jsx';
import Dialog from './components/ui/Dialog.jsx';
import DialogContent from './components/ui/DialogContent.jsx';
import DialogTitle from './components/ui/DialogTitle.jsx';
import IconButton from './components/ui/IconButton.jsx';
import Table from './components/ui/Table.jsx';
import TableBody from './components/ui/TableBody.jsx';
import TableCell from './components/ui/TableCell.jsx';
import TableRow from './components/ui/TableRow.jsx';

const mouseOperations = [
  {key: 'Mouse wheel', description: 'Zoom in or out.'},
  {key: 'Double-click the canvas', description: 'Zoom in.'},
  {key: 'Ctrl-drag the canvas', description: 'Pan the graph.'},
  {key: 'Click a node or an edge', description: 'Select the node or an edge.'},
  {key: 'Shift/Ctrl-click a node or an edge', description: 'Add the node or an edge to selection.'},
  {key: 'Drag the canvas', description: 'Select the nodes and edges within the dragged area.'},
  {key: 'Shift-drag the canvas', description: 'Add the nodes and edges within the dragged area to the selection.'},
  {key: 'Right-click a node', description: 'Start drawing an edge from the node.'},
  {key: 'Double-click a node', description: 'Connect the edge being drawn to the node.'},
  {key: 'Middle-click the canvas', description: 'Insert a node with the latest used shape and attributes.'},
  {key: 'Shift-middle-click the canvas', description: 'Insert a node with the latest inserted shape and default attributes.'},
  {key: 'Click an insert shape', description: 'Insert a node from the insert panel with default attributes.'},
  {key: 'Drag-and-drop an insert shape', description: 'Insert a node from the insert panel with default attributes.'},
];

const titleRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

class MouseOperationsDialog extends React.Component {

  handleClose = () => {
    this.props.onMouseOperationsDialogClose();
  };

  render() {
    return (
      <Dialog id="mouse-operations-dialog"
        open
        onClose={this.handleClose}
        scroll={'paper'}
        aria-labelledby="form-dialog-title"
      >
        <div style={titleRowStyle}>
          <DialogTitle id="form-dialog-title">Mouse operations in the graph</DialogTitle>
          <IconButton
            id="close-button"
            aria-label="Close"
            onClick={this.handleClose}
          >
            <CloseIcon />
          </IconButton>
        </div>
        <DialogContent>
          <Table size="small">
            <TableBody>
              {mouseOperations.map(mouseOperation => {
                return (
                  <TableRow key={mouseOperation.key}>
                    <TableCell component="th" scope="row" padding="none">
                      {mouseOperation.key}
                    </TableCell>
                    <TableCell>
                      {mouseOperation.description}
                    </TableCell>
                  </TableRow>
                );
              })}
            </TableBody>
          </Table>
        </DialogContent>
      </Dialog>
    );
  }
}

MouseOperationsDialog.propTypes = {
  onMouseOperationsDialogClose: PropTypes.func.isRequired,
};

export default withRoot(MouseOperationsDialog);
