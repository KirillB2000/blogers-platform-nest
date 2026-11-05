import { defineConfig } from 'vitest/config';
import tsconfigPaths from 'vite-tsconfig-paths';

export default defineConfig({
  plugins: [tsconfigPaths()],
  test: {
    env: {
      NODE_ENV: 'testing'
    },
    globals: true,
    root: './',
    include: ['**/*.e2e-spec.ts'],
    // Run e2e test files sequentially to avoid shared DB race conditions
    fileParallelism: false,
  },
});
