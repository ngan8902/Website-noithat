const { defineConfig } = require("cypress");

module.exports = defineConfig({
  projectId: 'te1ye8',
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    baseUrl: 'http://localhost:3000',
    defaultCommandTimeout: 3000, 
  },
});
