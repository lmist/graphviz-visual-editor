import React from 'react';
import PropTypes from 'prop-types';
import withRoot from './withRoot.js';
import CloseIcon from './components/icons/CloseIcon.jsx';
import Button from './components/ui/Button.jsx';
import Dialog from './components/ui/Dialog.jsx';
import DialogActions from './components/ui/DialogActions.jsx';
import DialogContent from './components/ui/DialogContent.jsx';
import DialogContentText from './components/ui/DialogContentText.jsx';
import DialogTitle from './components/ui/DialogTitle.jsx';
import IconButton from './components/ui/IconButton.jsx';

const titleRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const contentStyle = {
  overflowY: 'visible',
};

class DoYouWantToDeleteDialog extends React.Component {

  handleClose = () => {
    this.props.onClose();
  };

  handleDelete = () => {
    const askForConfirmationIfExist = false;
    this.props.onDelete(this.props.name, askForConfirmationIfExist);
  };

  render() {
    return (
      <Dialog
        id="delete-graph-dialog"
        open
        onClose={this.handleClose}
        aria-labelledby="form-dialog-title"
      >
        <div style={titleRowStyle}>
          <DialogTitle id="form-dialog-title">Delete {this.props.name}?</DialogTitle>
          <IconButton aria-label="Close" onClick={this.handleClose}>
            <CloseIcon />
          </IconButton>
        </div>
        <DialogContent style={contentStyle}>
          <DialogContentText>
            Do you want to delete <b>{this.props.name}</b> from the browser&apos;s local storage?
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <Button onClick={this.handleClose} id="cancel" autoFocus>
            Cancel
          </Button>
          <Button onClick={this.handleDelete} id="delete">
            Delete
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

DoYouWantToDeleteDialog.propTypes = {
  name: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onDelete: PropTypes.func.isRequired,
};

export default withRoot(DoYouWantToDeleteDialog);
