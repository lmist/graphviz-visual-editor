import React from 'react';
import PropTypes from 'prop-types';
import 'react-perfect-scrollbar/dist/css/styles.css';
import './design/scrollbar.css';
import PerfectScrollbar from 'react-perfect-scrollbar'
import styles from './DotSrcPreview.module.css';

class DotSrcPreview extends React.Component {

  render() {
    return (
      <PerfectScrollbar className={styles.scrollbars}>
        <pre className={styles.pre}>
          {this.props.dotSrc}
        </pre>
      </PerfectScrollbar>
    );
  }
}

DotSrcPreview.propTypes = {
  dotSrc: PropTypes.string.isRequired,
  numLines: PropTypes.number.isRequired,
};

export default DotSrcPreview;
