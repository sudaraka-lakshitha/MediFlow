import { createHash } from 'node:crypto';

// Only public, build-generated UI files are cached. Never cache API responses,
// uploaded documents, receipts, or third-party requests.
export function serviceWorkerSource(version, files) {
  return `
const CACHE_PREFIX = 'mediflow-public-ui-';
const CACHE_NAME = CACHE_PREFIX + ${JSON.stringify(version)};
const PUBLIC_FILES = ${JSON.stringify(files)};
const ASSETS = new Set(PUBLIC_FILES.filter(path => path !== '/index.html'));
const APP_ROUTES = new Set(['/', '/login', '/register', '/forgot-password',
  '/prescriptions', '/prescription-uploads', '/cashier', '/patients', '/catalog',
  '/inventory', '/inventory/movements', '/drug-research', '/sales', '/reports',
  '/users', '/discounts', '/data-exports', '/audit', '/settings', '/profile',
  '/health-record']);

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(
    PUBLIC_FILES.map(path => new Request(path, { cache: 'reload', credentials: 'omit' }))
  )));
  // Do not replace a running version during prescription entry or payment.
  // The update activates after all tabs using the old version have closed.
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    for (const key of await caches.keys()) {
      if (key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME) await caches.delete(key);
    }
    await self.clients.claim();
  })());
});
self.addEventListener('fetch', event => {
  const request = event.request;
  const url = new URL(request.url);
  if (request.method !== 'GET' || url.origin !== self.location.origin) return;
  if (request.headers.has('Authorization') || request.headers.has('Range')) return;
  const navigation = request.mode === 'navigate' && APP_ROUTES.has(url.pathname);
  if (!navigation && !ASSETS.has(url.pathname)) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(navigation ? '/index.html' : url.pathname);
    // Missing files use the network, but are never added dynamically: the
    // cache cannot accidentally grow to contain user-specific responses.
    return cached || fetch(request);
  })());
});
`;
}

export function appShellCache() {
  return {
    name: 'mediflow-public-ui-cache',
    apply: 'build',
    enforce: 'post',
    generateBundle(_options, bundle) {
      const files = Object.keys(bundle).filter(path => path === 'index.html' || path.startsWith('assets/')).sort();
      if (!files.includes('index.html')) throw new Error('Cannot cache UI without its entry document');
      const hash = createHash('sha256');
      for (const path of files) {
        const entry = bundle[path];
        hash.update(path).update(entry.type === 'chunk' ? entry.code : entry.source);
      }
      this.emitFile({
        type: 'asset',
        fileName: 'sw.js',
        source: serviceWorkerSource(hash.digest('hex').slice(0, 16), files.map(path => '/' + path)),
      });
    },
  };
}
