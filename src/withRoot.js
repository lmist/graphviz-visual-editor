import React from 'react';
import { cssVariables } from './design/tokens.js';

const STYLE_ELEMENT_ID = 'brutalist-design-tokens';

function ensureDesignTokensInjected() {
  if (typeof document === 'undefined') return;
  if (document.getElementById(STYLE_ELEMENT_ID)) return;
  const style = document.createElement('style');
  style.id = STYLE_ELEMENT_ID;
  style.textContent = cssVariables;
  document.head.appendChild(style);
}

ensureDesignTokensInjected();

function withRoot(Component) {
  function WithRoot(props) {
    return <Component {...props} />;
  }

  return WithRoot;
}

export default withRoot;
