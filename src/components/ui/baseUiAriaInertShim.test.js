// Unit test for the Base UI aria-hidden -> inert shim (gviz-uqv).
//
// We don't render a Base UI Dialog here; that would require a live focus
// trap and JSDOM doesn't reliably reproduce the focus/markOthers ordering
// race that motivated the shim. Instead, we simulate the exact sequence
// floating-ui-react performs: set the `data-base-ui-inert` marker, then
// `aria-hidden="true"`. The observer must collapse that into `inert`.

import {
  installBaseUiAriaInertShim,
  __resetBaseUiAriaInertShimForTests,
} from './baseUiAriaInertShim.js';

const BASE_UI_MARKER = 'data-base-ui-inert';

// The MutationObserver fires asynchronously on a microtask queue. Awaiting
// a resolved promise is enough to drain pending observer callbacks so we
// can assert post-mutation DOM state.
const flushMicrotasks = () => Promise.resolve();

describe('baseUiAriaInertShim', () => {
  let target;

  beforeEach(() => {
    __resetBaseUiAriaInertShimForTests();
    target = document.createElement('div');
    document.body.appendChild(target);
    installBaseUiAriaInertShim();
  });

  afterEach(() => {
    __resetBaseUiAriaInertShimForTests();
    if (target?.parentNode) target.parentNode.removeChild(target);
  });

  test('converts Base UI aria-hidden to inert', async () => {
    target.setAttribute(BASE_UI_MARKER, '');
    target.setAttribute('aria-hidden', 'true');
    await flushMicrotasks();

    expect(target.hasAttribute('aria-hidden')).toBe(false);
    expect(target.hasAttribute('inert')).toBe(true);
  });

  test('removes the shim-applied inert when Base UI removes its marker', async () => {
    target.setAttribute(BASE_UI_MARKER, '');
    target.setAttribute('aria-hidden', 'true');
    await flushMicrotasks();
    expect(target.hasAttribute('inert')).toBe(true);

    // Simulate library cleanup. removeAttribute('aria-hidden') is a no-op
    // because the shim already removed it; markOthers always also clears
    // its own marker, which is what triggers the shim's cleanup branch.
    target.removeAttribute('aria-hidden');
    target.removeAttribute(BASE_UI_MARKER);
    await flushMicrotasks();

    expect(target.hasAttribute('inert')).toBe(false);
  });

  test('does not touch aria-hidden on elements without the Base UI marker', async () => {
    target.setAttribute('aria-hidden', 'true');
    await flushMicrotasks();

    expect(target.getAttribute('aria-hidden')).toBe('true');
    expect(target.hasAttribute('inert')).toBe(false);
  });

  test('preserves an inert attribute that was set independently', async () => {
    target.setAttribute('inert', '');
    target.setAttribute(BASE_UI_MARKER, '');
    target.setAttribute('aria-hidden', 'true');
    await flushMicrotasks();

    expect(target.hasAttribute('aria-hidden')).toBe(false);
    expect(target.hasAttribute('inert')).toBe(true);

    target.removeAttribute(BASE_UI_MARKER);
    await flushMicrotasks();

    // The shim only removes inert it added itself (tracked via SHIM_FLAG).
    expect(target.hasAttribute('inert')).toBe(true);
  });

  test('idempotent install does not double-process mutations', async () => {
    installBaseUiAriaInertShim();
    installBaseUiAriaInertShim();

    target.setAttribute(BASE_UI_MARKER, '');
    target.setAttribute('aria-hidden', 'true');
    await flushMicrotasks();

    expect(target.hasAttribute('inert')).toBe(true);
    expect(target.hasAttribute('aria-hidden')).toBe(false);
  });
});
