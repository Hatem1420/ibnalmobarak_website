/**
 * js/utils/dom.js
 * Small, framework-free DOM & string helpers shared across components.
 */

/** Escapes a value for safe interpolation into innerHTML. */
export function escapeHtml(str) {
  if (str == null) return "";
  return String(str)
    .replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;").replace(/'/g, "&#39;");
}

/** Shorthand for document.getElementById, returns null safely if missing. */
export function $id(id) {
  return document.getElementById(id);
}

/** Shorthand for querySelectorAll -> real array. */
export function $all(selector, root = document) {
  return Array.from(root.querySelectorAll(selector));
}
