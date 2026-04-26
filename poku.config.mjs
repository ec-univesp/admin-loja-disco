import { defineConfig } from 'poku';
import { reactTestingPlugin } from '@pokujs/react/plugin';

export default defineConfig({
  parallel: true,
  concurrency: 4,
  timeout: 10000,
  include: ['src/test', 'src/**/__tests__'],
  plugins: [reactTestingPlugin({ dom: 'happy-dom' })],
});
