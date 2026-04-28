import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import Button from './Button.jsx';
import { COLORS } from '../../design/tokens.js';

describe('Button', () => {
  test('renders children', () => {
    render(<Button>Click me</Button>);
    expect(screen.getByRole('button', { name: 'Click me' })).toBeInTheDocument();
  });

  test('fires onClick', () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick}>Go</Button>);
    fireEvent.click(screen.getByRole('button', { name: 'Go' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test('respects disabled', () => {
    const onClick = jest.fn();
    render(<Button onClick={onClick} disabled>Nope</Button>);
    const btn = screen.getByRole('button', { name: 'Nope' });
    expect(btn).toBeDisabled();
    fireEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });

  test('accepts and ignores color/variant without crashing', () => {
    render(
      <Button color="secondary" variant="contained" id="ok">
        OK
      </Button>
    );
    expect(screen.getByRole('button', { name: 'OK' })).toHaveAttribute('id', 'ok');
  });

  test('inverts fg/bg on hover', () => {
    render(<Button>Hov</Button>);
    const btn = screen.getByRole('button', { name: 'Hov' });
    const before = btn.style.background;
    fireEvent.mouseEnter(btn);
    expect(btn.style.background).not.toBe(before);
    expect(btn).toHaveStyle({ color: COLORS.bg });
  });
});
