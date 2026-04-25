import React from 'react';
import PropTypes from 'prop-types';
import withRoot from './withRoot.js';
import CloseIcon from './components/icons/CloseIcon.jsx';
import {
  Dialog,
  DialogContent,
  DialogContentText,
  DialogTitle,
  IconButton,
} from './components/ui';
import graphvizVersions from './graphviz-versions.json';
import packageJSON from '../package.json';
import versions from './versions.json';

const titleRowStyle = {
  display: 'flex',
  justifyContent: 'space-between',
  alignItems: 'center',
};

class AboutDialog extends React.Component {

  handleClose = () => {
    this.props.onAboutDialogClose();
  };

  render() {
    const version = packageJSON.version;
    const changelogHeaderId = (() => {
      if (versions[version] == null) {
        return version;
      }
      else {
        const releaseDate = versions[version].release_date;
        return version.replace(/\./g, '') + "---" + releaseDate;
      }
    })();
    const graphvizVersion = this.props.graphvizVersion;
    const graphvizReleaseDate = graphvizVersions[graphvizVersion].release_date;
    const graphvizChangelogHeaderId = graphvizVersion.replace(/\./g, '') + "-" + graphvizReleaseDate;
    return (
      <div>
        <Dialog id="about-dialog"
          open
          onClose={this.handleClose}
          scroll={'paper'}
          aria-labelledby="form-dialog-title"
        >
          <div style={titleRowStyle}>
            <DialogTitle id="form-dialog-title">About the Graphviz Visual Editor</DialogTitle>
            <IconButton
              id="close-button"
              aria-label="Close"
              onClick={this.handleClose}
            >
              <CloseIcon />
            </IconButton>
          </div>
          <DialogContent>
            <DialogContentText>
              Version
              {' '}
              <a
                href={"https://github.com/magjac/graphviz-visual-editor/blob/master/CHANGELOG.md#" + changelogHeaderId}
                target="_blank"
                rel="noreferrer noopener"
              >
                 {packageJSON.version}
              </a>
            </DialogContentText>
            <br/>
            <DialogContentText>
              The Graphviz Visual Editor is a web application for
              interactive visual editing of
              {' '}
              <a
                href="http://www.graphviz.org"
                target="_blank"
                rel="noreferrer noopener"
              >
                Graphviz
              </a>
              {' '}
              graphs described in the
              {' '}
              <a
                href="https://www.graphviz.org/doc/info/lang.html"
                target="_blank"
                rel="noreferrer noopener"
              >
                DOT
              </a>
              {' '}
              language.
              It is <u>not</u> a general drawing application.
              It can only generate graphs that are possible to describe with DOT.
            </DialogContentText>
            <br/>
            <DialogContentText>
              The Graphviz Visual Editor is an
              {' '}
              <a
                href="https://en.wikipedia.org/wiki/Open-source_software"
                target="_blank"
                rel="noreferrer noopener"
              >
                open source
              </a>
              {' '}
              project and is hosted at
              {' '}
              <a
                href="https://github.com/magjac/graphviz-visual-editor"
                target="_blank"
                rel="noreferrer noopener"
              >
                GitHub
              </a>
              . See the
              {' '}
              <a
                href="https://github.com/magjac/graphviz-visual-editor/blob/master/README.md"
                target="_blank"
                rel="noreferrer noopener"
              >
                README
              </a>
              {' '}
              for more information.
            </DialogContentText>
            <br/>
            <DialogContentText>
              Based on Graphviz version
              {' '}
              <a
                href={"https://gitlab.com/graphviz/graphviz/-/blob/main/CHANGELOG.md#" + graphvizChangelogHeaderId}
                target="_blank"
                rel="noreferrer noopener"
              >
                 {graphvizVersion}
              </a>
            </DialogContentText>
          </DialogContent>
        </Dialog>
      </div>
    );
  }
}

AboutDialog.propTypes = {
  onAboutDialogClose: PropTypes.func.isRequired,
  graphvizVersion: PropTypes.string.isRequired,
};

export default withRoot(AboutDialog);
