import { defineConfig } from 'cypress';

export default defineConfig({
  projectId: '8wm34o',
  defaultCommandTimeout: 10000,
  video: true,
  allowCypressEnv: false,
  e2e: {
    baseUrl: 'http://localhost:3000',
    setupNodeEvents(on, config) {
      return config;
    },
    excludeSpecPattern: '*~',
    specPattern: 'cypress/e2e/**/*.{js,jsx,ts,tsx}',
  },
})
