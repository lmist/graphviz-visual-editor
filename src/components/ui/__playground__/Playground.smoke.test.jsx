import React from 'react';
import { render } from '@testing-library/react';
import '@testing-library/jest-dom';
import Playground from './Playground.jsx';

// Smoke: the harness must mount without throwing. We don't assert visuals;
// the harness exists so a human can eyeball the system in the browser.
test('Playground renders without crashing', () => {
  expect(() => render(<Playground />)).not.toThrow();
});
