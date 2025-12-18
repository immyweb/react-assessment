import { defineConfig } from 'vitest/config';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  test: {
    // Test environment
    environment: 'jsdom',

    // Global test setup
    globals: true,

    // Setup files to run before each test file
    setupFiles: ['./src/test-setup.js'],

    // Include patterns for test files
    include: [
      'src/tests/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      'src/exercises/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}',
      'src/answers/**/*.{test,spec}.{js,mjs,cjs,ts,mts,cts,jsx,tsx}'
    ],

    // Coverage configuration (disabled)
    // coverage: {
    //   provider: 'v8',
    //   reporter: ['text', 'json', 'html'],
    //   exclude: [
    //     'node_modules/',
    //     'src/test-setup.js',
    //     '**/*.d.ts',
    //     '**/*.config.{js,ts}',
    //     '**/coverage/**'
    //   ]
    // },

    // Browser testing configuration (optional, can be enabled for specific tests)
    // browser: {
    //   enabled: false, // Set to true when you want to run browser tests
    //   provider: 'playwright',
    //   name: 'chromium',
    //   headless: true,
    //   instances: [
    //     { browser: 'chromium' }
    // Uncomment for cross-browser testing
    // { browser: 'firefox' },
    // { browser: 'webkit' }
    // ]
    // },

    // Test execution options
    pool: 'threads',
    poolOptions: {
      threads: {
        singleThread: false,
        maxThreads: 4,
        minThreads: 1
      }
    },

    // Timeouts
    testTimeout: 2500,
    hookTimeout: 10000,

    // Reporter configuration
    // reporter: ['verbose', 'html'],
    // outputFile: {
    //   html: './coverage/test-report.html'
    // },

    // Watch mode options
    watch: true,
    watchExclude: ['**/node_modules/**', '**/coverage/**']
  }
});
