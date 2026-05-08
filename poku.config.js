import { defineConfig } from 'poku';
import { reactTestingPlugin } from '@pokujs/react/plugin';
import { coverage } from '@pokujs/monocart';
import { fileURLToPath } from 'node:url';
import { resolve, dirname } from 'node:path';

const here = dirname(fileURLToPath(import.meta.url));
const svgLoaderRegister = resolve(here, 'src/test/setup/register-loaders.mjs');

const reactPlugin = reactTestingPlugin({ dom: 'happy-dom' });
const reactPluginWithSvg = {
  ...reactPlugin,
  runner(command, file) {
    const next = reactPlugin.runner ? reactPlugin.runner(command, file) : command;
    const fileIndex = next.lastIndexOf(file);
    if (fileIndex === -1) return next;
    const importFlag = `--import=${svgLoaderRegister}`;
    if (next.includes(importFlag)) return next;
    return [...next.slice(0, fileIndex), importFlag, ...next.slice(fileIndex)];
  },
};

export default defineConfig({
  parallel: true,
  concurrency: 4,
  timeout: 10000,
  include: ['src'],
  plugins: [
    reactPluginWithSvg,
    coverage({
      requireFlag: true,
      all: { dir: ['src'] },
      entryFilter: {
        '**/node_modules/**': false,
        '**/__tests__/**': false,
        '**/test/**': false,
        '**/*.d.ts': false,
        '**/*.types.ts': false,
        '**/*.svg': false,
        '**': true,
      },
      sourceFilter: {
        '**/__tests__/**': false,
        '**/test/**': false,
        '**/*.d.ts': false,
        '**/*.types.ts': false,
        '**/node_modules/**': false,
        'src/app/layout.tsx': false,
        'src/app/not-found.tsx': false,
        'src/shared/icons/**': false,
        'src/**/*.{ts,tsx}': true,
      },
      reports: ['v8', 'console-summary'],
      thresholds: {
        lines: 80,
        functions: 80,
        branches: 80,
        statements: 80,
      },
    }),
  ],
});
