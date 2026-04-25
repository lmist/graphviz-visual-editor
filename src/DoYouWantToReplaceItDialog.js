import React from 'react';
import PropTypes from 'prop-types';
import withRoot from './withRoot.js';
import CloseIcon from './components/icons/CloseIcon.jsx';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from './components/ui/index.js';

const titleRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const contentStyle = {
  overflowY: 'visible',
};

class DoYouWantToReplaceItDialog extends React.Component {

  handleClose = () => {
    this.props.onClose();
  };

  handleReplace = () => {
    this.props.onReplace();
  };

  render() {
    return (
      <div>
        <Dialog
          id="replace-graph-dialog"
          open
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <div style={titleRowStyle}>
            <DialogTitle id="form-dialog-title">Replace "{this.props.name}"?</DialogTitle>
            <IconButton aria-label="Close" onClick={this.handleClose}>
              <CloseIcon />
            </IconButton>
          </div>
          <DialogContent style={contentStyle}>
            <DialogContentText>
              "{this.props.name}" already exists. Do you want to replace it?
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <Button onClick={this.handleClose} autoFocus id="cancel">
              Cancel
            </Button>
            <Button onClick={this.handleReplace} id="replace">
              Replace
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

DoYouWantToReplaceItDialog.propTypes = {
  name: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
  onReplace: PropTypes.func.isRequired,
};

export default withRoot(DoYouWantToReplaceItDialog);
