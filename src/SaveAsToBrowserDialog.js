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
  TextField,
} from './components/ui/index.js';
import DoYouWantToReplaceItDialog from './DoYouWantToReplaceItDialog.js';

const titleRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const contentStyle = {
  overflowY: 'visible',
};

class SaveAsToBrowserDialog extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      doYouWantToReplaceItDialogIsOpen: false,
    };
    this.name = this.props.defaultNewName;
  }

  handleClose = () => {
    this.props.onClose();
  };

  handleChange = (event) => {
    this.name = event.target.value;
  };

  handleKeyPress = (event) => {
    if (event.key === 'Enter') {
      this.handleSave();
    }
  };

  handleSave = () => {
    const newName = this.name;
    const currentName = this.props.name;
    if (this.props.projects[newName] == null || newName === currentName) {
      this.handleConfirmedSave();
    } else {
      this.setState({
        doYouWantToReplaceItDialogIsOpen: true,
        replaceName: newName,
      });
    }
  };

  handleConfirmedSave = () => {
    this.setState({
      doYouWantToReplaceItDialogIsOpen: false,
    });
    this.props.onSave(this.name);
  };

  handleDoYouWantToReplaceItClose = () => {
    this.setState({
      doYouWantToReplaceItDialogIsOpen: false,
    });
  }

  render() {
    return (
      <div>
        <Dialog
          id="save-to-browser-dialog"
          open
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <div style={titleRowStyle}>
            <DialogTitle id="form-dialog-title">
              {this.props.rename ? 'Rename graph' : 'Save graph to browser'}
            </DialogTitle>
            <IconButton aria-label="Close" onClick={this.handleClose}>
              <CloseIcon />
            </IconButton>
          </div>
          <DialogContent style={contentStyle}>
            <DialogContentText>
              {this.props.rename ?
                "Give the current graph a new name in the browser's local storage." :
                "Save a the current graph to the browser's local storage under a new name."
              }
            </DialogContentText>
            <TextField
              autoFocus
              id="name"
              label="New name"
              type="text"
              placeholder={this.props.defaultNewName}
              fullWidth
              onChange={this.handleChange}
              onKeyPress={this.handleKeyPress}
            />
          </DialogContent>
          <DialogActions>
            <Button onClick={this.props.onClose}>
              Cancel
            </Button>
            <Button onClick={this.handleSave} id="save">
              {this.props.rename ? 'Rename' : 'Save'}
            </Button>
          </DialogActions>
        </Dialog>
        {this.state.doYouWantToReplaceItDialogIsOpen &&
          <DoYouWantToReplaceItDialog
            name={this.state.replaceName}
            onReplace={this.handleConfirmedSave}
            onClose={this.handleDoYouWantToReplaceItClose}
          />
        }
      </div>
    );
  }
}

SaveAsToBrowserDialog.propTypes = {
  onSave: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  defaultNewName: PropTypes.string.isRequired,
  projects: PropTypes.object.isRequired,
  rename: PropTypes.bool,
};

export default withRoot(SaveAsToBrowserDialog);
