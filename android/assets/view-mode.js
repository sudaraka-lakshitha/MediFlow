(() => {
  const desktop = __DESKTOP_MODE__;
  let viewport = document.querySelector('meta[name="viewport"]');
  if (!viewport) {
    viewport = document.createElement('meta');
    viewport.name = 'viewport';
    document.head.appendChild(viewport);
  }
  if (!viewport.hasAttribute('data-mediflow-mobile-viewport')) {
    viewport.setAttribute('data-mediflow-mobile-viewport', viewport.getAttribute('content') || 'width=device-width, initial-scale=1');
  }
  viewport.setAttribute('content', desktop
    ? 'width=1280, user-scalable=yes'
    : viewport.getAttribute('data-mediflow-mobile-viewport'));
})();
