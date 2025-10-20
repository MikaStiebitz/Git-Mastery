import { defineConfig } from 'vitest/config';
import path from 'path';

export default defineConfig({
  test: {
    globals: true,
    environment: 'jsdom',
    setupFiles: ['./src/test/setup.ts'],
    include: ['src/**/*.{test,spec}.{js,ts,jsx,tsx}'],
    coverage: {
      provider: 'v8',
      reporter: ['text', 'json', 'html'],
      include: ['src/commands/**/*', 'src/models/**/*'],
    },
  },
  resolve: {
    alias: {
      '~': path.resolve(__dirname, './src'),
    },
  },
});
