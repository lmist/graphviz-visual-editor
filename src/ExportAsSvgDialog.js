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
import Input from './components/ui/Input.jsx';

const titleRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

const contentStyle = {
  overflowY: 'visible',
};

class ExportAsSvgDialog extends React.Component {

  constructor(props) {
    super(props);
    this.state = {
      filename: props.defaultFilename,
    };
  }

  handleClose = () => {
    this.props.onClose();
  };

  handleExportSvg = () => {
    // TODO: move downloadFile function to a utility module
    function downloadFile(fileData, fileName, mimeType) {
      const fileBlob = new Blob([fileData], {type: mimeType})
      const fileObjectURL = window.URL.createObjectURL(fileBlob)
      const tempLink = document.createElement('a')
      tempLink.href = fileObjectURL
      tempLink.download = fileName
      document.body.appendChild(tempLink)
      tempLink.click()
      document.body.removeChild(tempLink)
    }
    const fileData = this.props.getSvgString()
    const fileName = this.state.filename
    const mimeType = 'image/svg+xml'
    downloadFile(fileData, fileName, mimeType)
    this.props.onClose()
  }

  handleChange = (event) => {
    this.setState({
      filename: event.target.value
    })
  };

  render() {
    return (
      <div>
        <Dialog
          id="export-graph-as-svg-dialog"
          open
          onClose={this.handleClose}
          aria-labelledby="form-dialog-title"
        >
          <div style={titleRowStyle}>
            <DialogTitle id="form-dialog-title">
              Export Graph as SVG
            </DialogTitle>
            <IconButton aria-label="Close" onClick={this.handleClose}>
              <CloseIcon />
            </IconButton>
          </div>
          <DialogContent style={contentStyle}>
            <DialogContentText>
              Choose a name for the exported SVG file
            </DialogContentText>
            <br/>
            <Input
              size={60}
              autoFocus
              id="export"
              type="text"
              value={this.state.filename}
              onChange={this.handleChange}
            />
          </DialogContent>
          <DialogActions>
            <Button id="cancel" onClick={this.handleClose} color="secondary">
              Cancel
            </Button>
            <Button id="export-svg" onClick={this.handleExportSvg} color="secondary" variant="contained">
              Export SVG
            </Button>
          </DialogActions>
        </Dialog>
      </div>
    );
  }
}

ExportAsSvgDialog.propTypes = {
  defaultFilename: PropTypes.string.isRequired,
  getSvgString: PropTypes.func.isRequired,
  onClose: PropTypes.func.isRequired,
};

export default withRoot(ExportAsSvgDialog);
