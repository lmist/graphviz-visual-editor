import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import '@testing-library/jest-dom';
import IconButton from './IconButton.jsx';

describe('IconButton', () => {
  test('renders children with aria-label', () => {
    render(
      <IconButton aria-label="Close">
        <span>x</span>
      </IconButton>
    );
    expect(screen.getByRole('button', { name: 'Close' })).toBeInTheDocument();
  });

  test('fires onClick', () => {
    const onClick = jest.fn();
    render(
      <IconButton aria-label="Go" onClick={onClick}>
        <span>i</span>
      </IconButton>
    );
    fireEvent.click(screen.getByRole('button', { name: 'Go' }));
    expect(onClick).toHaveBeenCalledTimes(1);
  });

  test('respects disabled', () => {
    const onClick = jest.fn();
    render(
      <IconButton aria-label="Nope" onClick={onClick} disabled>
        <span>i</span>
      </IconButton>
    );
    const btn = screen.getByRole('button', { name: 'Nope' });
    expect(btn).toBeDisabled();
    fireEvent.click(btn);
    expect(onClick).not.toHaveBeenCalled();
  });

  test('accepts and ignores color/size without crashing', () => {
    render(
      <IconButton aria-label="OK" color="inherit" size="large" id="ok">
        <span>i</span>
      </IconButton>
    );
    expect(screen.getByRole('button', { name: 'OK' })).toHaveAttribute('id', 'ok');
  });

  test('renders 40x40 square', () => {
    render(
      <IconButton aria-label="Sq">
        <span>i</span>
      </IconButton>
    );
    const btn = screen.getByRole('button', { name: 'Sq' });
    expect(btn.style.width).toBe('40px');
    expect(btn.style.height).toBe('40px');
    expect(btn.style.padding).toBe('0px');
  });
});
