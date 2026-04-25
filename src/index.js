import { createRoot } from 'react-dom/client';
import './design/reset.css';
import './design/typography.css';
import Index from './pages/index.js';

const root = createRoot(document.querySelector('#root'));
root.render(<Index tab="home" />);
