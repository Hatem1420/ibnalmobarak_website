/**
 * js/main.js
 * Bootstrap entry point. Loaded as a module from index.html after
 * config.js (which defines window.SITE_CONFIG).
 */

import { App } from "./core/App.js";

document.addEventListener("DOMContentLoaded", () => {
  const app = new App(window.SITE_CONFIG);

  // Exposed globally so the StatusBanner's inline retry button (rendered as
  // raw HTML string, matching the original app's markup) can trigger a reload.
  window.loadEverything = () => app.loadEverything();

  app.start();
});
