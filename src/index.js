import { createRoot } from 'react-dom/client';
import './design/reset.css';
import './design/typography.css';
import Index from './pages/index.js';

const root = createRoot(document.querySelector('#root'));

// Dev-only primitive playground: mount via `?playground=1` in development.
// The dynamic import + NODE_ENV check keeps the harness out of production
// bundles entirely (CRA strips the dead branch at build time).
const params = new URLSearchParams(window.location.search);
if (process.env.NODE_ENV !== 'production' && params.get('playground') === '1') {
  import('./components/ui/__playground__/Playground.jsx').then(({ default: Playground }) => {
    root.render(<Playground />);
  });
} else {
  root.render(<Index tab="home" />);
}
