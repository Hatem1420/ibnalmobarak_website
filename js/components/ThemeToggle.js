/**
 * js/components/ThemeToggle.js
 * Light/dark theme switch. The initial theme (before this component even
 * runs) is applied by an inline script in <head> to avoid a flash of the
 * wrong theme; this component only handles the toggle button afterwards.
 */

import { $id } from "../utils/dom.js";

export class ThemeToggle {
  constructor({ buttonId = "theme-toggle", iconId = "theme-icon" } = {}) {
    this.button = $id(buttonId);
    this.icon = $id(iconId);
    if (!this.button) return;

    this.#updateIcon();
    this.button.addEventListener("click", () => this.#toggle());
  }

  #toggle() {
    const current = document.documentElement.getAttribute("data-theme");
    if (current === "dark") {
      document.documentElement.removeAttribute("data-theme");
      localStorage.setItem("theme", "light");
    } else {
      document.documentElement.setAttribute("data-theme", "dark");
      localStorage.setItem("theme", "dark");
    }
    this.#updateIcon();
  }

  #updateIcon() {
    if (!this.icon) return;
    if (document.documentElement.getAttribute("data-theme") === "dark") {
      this.icon.className = "ti ti-sun";
      this.icon.style.transform = "rotate(180deg)";
    } else {
      this.icon.className = "ti ti-moon";
      this.icon.style.transform = "rotate(0deg)";
    }
  }
}
