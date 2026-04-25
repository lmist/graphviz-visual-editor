// Workaround for Base UI v1.0.0-rc.0 (gviz-uqv).
//
// Problem
// -------
// When a modal Base UI Dialog/Drawer opens, its internal floating-ui-react
// FloatingFocusManager calls markOthers() to apply `aria-hidden="true"` to
// every direct child of <body> that is not on the path to the popup. On
// close, the focus-restoration cleanup runs in a useLayoutEffect cleanup
// (queued microtask) while the markOthers cleanup runs in a useEffect
// cleanup (next task). The microtask drains first, so for one paint frame
// the trigger button (e.g. the "help" button inside #root) is focused while
// its ancestor #root still carries `aria-hidden="true"`. Browsers report
// this as "Blocked aria-hidden on an element because its descendant
// retained focus."
//
// Mitigation
// ----------
// Convert any Base-UI-set `aria-hidden="true"` into `inert`. `inert` does
// not generate the focus/aria-hidden conflict warning and is the modern,
// focus-safe equivalent for this use case. We detect Base UI's marker
// (`data-base-ui-inert`, set by floating-ui-react/utils/markOthers) so we
// never touch app-controlled aria-hidden attributes.
//
// Removing this shim
// ------------------
// Once Base UI/floating-ui-react prefers `inert` over `aria-hidden` (or
// orders the focus-restore cleanup after the markOthers cleanup), delete
// this file and its imports.

const SHIM_FLAG = 'data-base-ui-aria-inert-shim';
const BASE_UI_MARKER = 'data-base-ui-inert';

let installed = false;
let observer = null;

function convert(target) {
  if (!(target instanceof Element)) return;

  if (target.hasAttribute(BASE_UI_MARKER)) {
    if (target.getAttribute('aria-hidden') === 'true') {
      target.removeAttribute('aria-hidden');
      if (!target.hasAttribute('inert')) {
        target.setAttribute('inert', '');
        target.setAttribute(SHIM_FLAG, '');
      }
    }
  } else if (target.hasAttribute(SHIM_FLAG)) {
    target.removeAttribute('inert');
    target.removeAttribute(SHIM_FLAG);
  }
}

export function installBaseUiAriaInertShim() {
  if (installed) return;
  if (typeof window === 'undefined') return;
  if (typeof MutationObserver === 'undefined') return;
  if (!document || !document.body) return;

  installed = true;

  observer = new MutationObserver((mutations) => {
    for (const mutation of mutations) {
      convert(mutation.target);
    }
  });

  observer.observe(document.body, {
    attributes: true,
    attributeFilter: ['aria-hidden', BASE_UI_MARKER],
    subtree: true,
  });
}

// Test-only helper: tear down the shim so individual tests can install a
// fresh observer against a freshly rendered DOM. Not part of the public
// API; only the shim's own test imports it.
export function __resetBaseUiAriaInertShimForTests() {
  if (observer) {
    observer.disconnect();
    observer = null;
  }
  installed = false;
}

// Auto-install on module load. Importing this file as a side effect is the
// intended usage from Dialog.jsx and Drawer.jsx.
installBaseUiAriaInertShim();
