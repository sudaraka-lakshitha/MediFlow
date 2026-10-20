import test from 'node:test';
import assert from 'node:assert/strict';
import vm from 'node:vm';
import { serviceWorkerSource } from './appShellCache.mjs';

function worker() {
  const handlers = {};
  const stored = new Map([['/index.html', 'PUBLIC SHELL'], ['/assets/app-hash.js', 'PUBLIC JS']]);
  const network = [], removed = [], precached = [];
  let claimed = false;
  const cache = {
    match: async key => stored.get(key),
    addAll: async requests => precached.push(...requests),
  };
  const context = {
    self: {
      location: {origin:'https://example.invalid'},
      addEventListener: (name, handler) => { handlers[name] = handler; },
      clients: { claim: async () => { claimed = true; } },
    },
    caches: {
      open: async name => { assert.equal(name, 'mediflow-public-ui-test'); return cache; },
      keys: async () => ['mediflow-public-ui-old', 'mediflow-public-ui-test', 'another-app-cache'],
      delete: async key => removed.push(key),
    },
    Request: class {
      constructor(path, options) { this.path = path; this.options = options; }
    },
    URL, Set,
    fetch: async request => { network.push(request.url); return 'NETWORK'; },
  };
  vm.runInNewContext(serviceWorkerSource('test', ['/index.html','/assets/app-hash.js']), context);
  const request = (path, {method='GET', mode='cors', headers={}} = {}) => {
    let response;
    handlers.fetch({
      request: {url:new URL(path, 'https://example.invalid').href, method, mode, headers:new Headers(headers)},
      respondWith: value => { response = value; },
    });
    return response;
  };
  return {handlers, request, removed, precached, network, claimed:()=>claimed};
}

test('only public build files are precached, without credentials', async () => {
  const w = worker(); let pending;
  w.handlers.install({waitUntil:p=>{pending=p;}});
  await pending;
  assert.deepEqual(w.precached.map(r=>r.path), ['/index.html','/assets/app-hash.js']);
  for(const r of w.precached) {
    assert.equal(r.options.credentials,'omit');
    assert.equal(r.options.cache,'reload');
  }
});

test('cached public UI serves repeat navigation and hashed assets', async () => {
  const w = worker();
  assert.equal(await w.request('/prescriptions?status=PENDING',{mode:'navigate'}), 'PUBLIC SHELL');
  assert.equal(await w.request('/assets/app-hash.js'), 'PUBLIC JS');
  assert.equal(w.network.length,0);
});

test('private, authenticated, external and mutation requests are not intercepted', () => {
  const w = worker();
  for(const path of ['/api/prescriptions','/api/sales/1/invoice.pdf','/uploads/file.pdf','/payment-requests/1/receipt','https://api.example.invalid/dashboard']) {
    assert.equal(w.request(path), undefined);
    assert.equal(w.request(path,{mode:'navigate'}), undefined);
  }
  assert.equal(w.request('/assets/app-hash.js',{headers:{Authorization:'Bearer test'}}),undefined);
  assert.equal(w.request('/assets/app-hash.js',{headers:{Range:'bytes=0-10'}}),undefined);
  assert.equal(w.request('/login',{method:'POST',mode:'navigate'}),undefined);
  assert.equal(w.request('/assets/not-in-build.js'),undefined);
});

test('activation removes only old MediFlow UI caches', async () => {
  const w = worker(); let pending;
  w.handlers.activate({waitUntil:p=>{pending=p;}});
  await pending;
  assert.deepEqual(w.removed, ['mediflow-public-ui-old']);
  assert.equal(w.claimed(),true);
});
