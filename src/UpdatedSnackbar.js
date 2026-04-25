import React from 'react';
import PropTypes from 'prop-types';
import Snackbar from './components/ui/Snackbar.jsx';
import SnackbarContent from './components/ui/SnackbarContent.jsx';
import IconButton from './components/ui/IconButton.jsx';
import CloseIcon from './components/icons/CloseIcon.jsx';
import { COLORS, SPACING } from './design/tokens.js';
import packageJSON from '../package.json';
import versions from './versions.json';
import graphvizVersions from './graphviz-versions.json';

const snackbarStyle = {
  display: 'block',
  marginTop: `${SPACING.xl + 16}px`,
  maxWidth: 'none',
  width: '100%',
  left: 0,
  right: 0,
  transform: 'none',
  padding: 0,
  background: 'transparent',
  border: 'none',
  boxShadow: 'none',
};

const contentStyle = {
  maxWidth: 'inherit',
  width: 'inherit',
};

const linkStyle = {
  color: COLORS.fg,
  textDecoration: 'underline',
};

function UpdatedSnackbar({ graphvizVersion, newGraphvizVersion, onUpdatedSnackbarClose }) {
  const handleClose = React.useCallback(() => {
    onUpdatedSnackbarClose();
  }, [onUpdatedSnackbarClose]);

  React.useEffect(() => {
    const onKeyDown = (event) => {
      if (event.key === 'Escape') {
        handleClose();
      }
    };
    document.addEventListener('keydown', onKeyDown);
    return () => document.removeEventListener('keydown', onKeyDown);
  }, [handleClose]);

  const version = packageJSON.version;
  const changelogHeaderId = (() => {
    if (versions[version] == null) {
      return version;
    }
    const releaseDate = versions[version].release_date;
    return version.replace(/\./g, '') + '---' + releaseDate;
  })();
  const graphvizReleaseDate = graphvizVersions[graphvizVersion].release_date;
  const graphvizChangelogHeaderId = graphvizVersion.replace(/\./g, '') + '--' + graphvizReleaseDate;

  return (
    <Snackbar
      open={true}
      anchorOrigin={{ vertical: 'top', horizontal: 'center' }}
      style={snackbarStyle}
    >
      <SnackbarContent
        style={contentStyle}
        aria-describedby="client-snackbar"
        message={
          <span id="message-id">
            The Graphviz Visual Editor has been updated to version
            {' '}
            <a
              href={'https://github.com/magjac/graphviz-visual-editor/blob/master/CHANGELOG.md#' + changelogHeaderId}
              target="_blank"
              rel="noreferrer noopener"
              style={linkStyle}
            >
              {version}
            </a>
            . The underlying Graphviz software
            {newGraphvizVersion && ' has been updated to '}
            {!newGraphvizVersion && ' is still '}
            version
            {' '}
            <a
              href={'https://gitlab.com/graphviz/graphviz/-/blob/main/CHANGELOG.md#' + graphvizChangelogHeaderId}
              target="_blank"
              rel="noreferrer noopener"
              style={linkStyle}
            >
              {graphvizVersion}
            </a>
            .
          </span>
        }
        action={
          <IconButton
            key="close"
            aria-label="Close"
            onClick={handleClose}
          >
            <CloseIcon />
          </IconButton>
        }
      />
    </Snackbar>
  );
}

UpdatedSnackbar.propTypes = {
  graphvizVersion: PropTypes.string.isRequired,
  newGraphvizVersion: PropTypes.bool,
  onUpdatedSnackbarClose: PropTypes.func.isRequired,
};

export default UpdatedSnackbar;
