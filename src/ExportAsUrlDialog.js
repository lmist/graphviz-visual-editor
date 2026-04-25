import React from 'react';
import PropTypes from 'prop-types';
import withRoot from './withRoot.js';
import CloseIcon from './components/icons/CloseIcon.jsx';
import LinkIcon from './components/icons/LinkIcon.jsx';
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
  Input,
} from './components/ui';

const titleRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

class ExportAsUrlDialog extends React.Component {

  handleClose = () => {
    this.props.onClose();
  };

  handleCopy = () => {
    const input = document.getElementById('export');
    if (input) {
      input.select();
      document.execCommand('copy');
    }
  };

  handleOpen = () => {
    window.open(this.props.URL, '_blank', 'noopener,noreferrer');
  };

  render() {
    return (
      <Dialog
        id="export-graph-as-url-dialog"
        open
        onClose={this.handleClose}
        aria-labelledby="form-dialog-title"
      >
        <div style={titleRowStyle}>
          <DialogTitle id="form-dialog-title">
            Export graph as URL
          </DialogTitle>
          <IconButton aria-label="Close" onClick={this.handleClose}>
            <CloseIcon />
          </IconButton>
        </div>
        <DialogContent>
          <DialogContentText>
            The URL below is a link to the application with the DOT source code as an URL parameter. It can be used to share graphs with others.
          </DialogContentText>
          <br/>
          <Input
            size={60}
            autoFocus
            id="export"
            type="text"
            value={this.props.URL}
            readOnly
          />
          <Button
            id="copy"
            aria-label="Copy"
            onClick={this.handleCopy}
          >
            <LinkIcon />
            Copy
          </Button>
        </DialogContent>
        <DialogActions>
          <Button id="cancel" onClick={this.handleClose}>
            Cancel
          </Button>
          <Button id="open-link" onClick={this.handleOpen}>
            Open link
          </Button>
        </DialogActions>
      </Dialog>
    );
  }
}

ExportAsUrlDialog.propTypes = {
  URL: PropTypes.string.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default withRoot(ExportAsUrlDialog);
