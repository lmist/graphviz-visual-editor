import React from 'react';
import { Menu, MenuItem } from './components/ui/index.js';

class HelpMenu extends React.Component {

  handleClose = () => {
    this.props.onMenuClose();
  };

  handleKeyboardShortcutsClick = () => {
    this.props.onMenuClose();
    this.props.onKeyboardShortcutsClick();
  };

  handleMouseOperationsClick = () => {
    this.props.onMenuClose();
    this.props.onMouseOperationsClick();
  };

  handleAboutClick = () => {
    this.props.onMenuClose();
    this.props.onAboutClick();
  };

  render() {

    return (
      <Menu
        id="help-menu"
        anchorEl={this.props.anchorEl}
        open
        onClose={this.handleClose}
      >
        <MenuItem id="keyboard-shortcuts" onClick={this.handleKeyboardShortcutsClick}>Keyboard shortcuts</MenuItem>
        <MenuItem id="mouse-operations" onClick={this.handleMouseOperationsClick}>Mouse operations</MenuItem>
        <MenuItem id="about" onClick={this.handleAboutClick}>About</MenuItem>
      </Menu>
    );
  }
}

export default HelpMenu;
