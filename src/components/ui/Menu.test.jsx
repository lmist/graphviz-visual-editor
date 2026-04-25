import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Menu from './Menu.jsx';
import MenuItem from './MenuItem.jsx';

// Regression: MenuItem must register with Base UI's Menu so arrow-key
// navigation works. A plain <li> renders visually but Menu's roving
// focus controller can't see it. ESC also has to close the menu.

function Harness({ onClose }) {
  const [anchor, setAnchor] = React.useState(null);
  return (
    <div>
      <button ref={setAnchor} id="trigger">Open</button>
      {anchor && (
        <Menu id="m" anchorEl={anchor} open onClose={onClose}>
          <MenuItem id="one" onClick={() => {}}>One</MenuItem>
          <MenuItem id="two" onClick={() => {}}>Two</MenuItem>
          <MenuItem id="three" onClick={() => {}}>Three</MenuItem>
        </Menu>
      )}
    </div>
  );
}

describe('Menu keyboard navigation', () => {
  test('renders items as menu items registered with Base UI', () => {
    render(<Harness onClose={() => {}} />);
    const items = screen.getAllByRole('menuitem');
    expect(items).toHaveLength(3);
    expect(items[0]).toHaveTextContent('One');
  });

  test('ESC closes the menu', () => {
    const onClose = jest.fn();
    render(<Harness onClose={onClose} />);
    const popup = screen.getAllByRole('menuitem')[0].closest('[role="menu"]');
    fireEvent.keyDown(popup, { key: 'Escape' });
    expect(onClose).toHaveBeenCalled();
  });
});
