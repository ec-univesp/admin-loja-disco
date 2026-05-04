import { afterEach } from 'poku';
import { cleanup } from '@pokujs/react/react-testing';
import { server } from './server';
import { resetDb } from './db';

let started = false;

function ensureServer() {
  if (!started) {
    server.listen({ onUnhandledRequest: 'error' });
    started = true;
    process.on('beforeExit', () => server.close());
  }
}

interface SetupOptions {
  apiMock?: boolean;
  reactDom?: boolean;
}

export function setupTestEnv({ apiMock = false, reactDom = false }: SetupOptions = {}) {
  if (apiMock) ensureServer();
  afterEach(() => {
    if (reactDom) cleanup();
    if (apiMock) {
      server.resetHandlers();
      resetDb();
    }
  });
}

export function setupApiMock() {
  setupTestEnv({ apiMock: true });
}

export function setupReactDom() {
  setupTestEnv({ reactDom: true });
}

export function setupApiAndReact() {
  setupTestEnv({ apiMock: true, reactDom: true });
}
