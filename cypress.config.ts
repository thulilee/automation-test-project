import { defineConfig } from "cypress";

export default defineConfig({
  e2e: {
    setupNodeEvents(on, config) {
      // implement node event listeners here
    },
    specPattern: "src/ui/test/*.cy.ts",
    baseUrl: "https://en.wikipedia.org/wiki/Main_Page",
    supportFile: "src/UI/support/e2e.ts",
  },
});
