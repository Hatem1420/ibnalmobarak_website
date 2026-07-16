/**
 * js/components/StatusBanner.js
 * Renders the small loading/error/live banner shown above the home cards
 * and stage sections while data is fetched from Google Sheets.
 */

import { $id } from "../utils/dom.js";

const ICONS = { loading: "ti-loader-2", error: "ti-alert-triangle", live: "ti-circle-check" };

export class StatusBanner {
  /**
   * @param {string} elId DOM id of the banner container
   * @param {string} retryGlobalFnName name of a function exposed on `window`
   *   (see main.js, which exposes `window.loadEverything`) to call when the
   *   retry button is clicked. Kept as a plain global reference since this
   *   button is rendered as a raw HTML string, not a live DOM node with a
   *   listener attached.
   */
  constructor(elId, retryGlobalFnName = "loadEverything") {
    this.elId = elId;
    this.retryGlobalFnName = retryGlobalFnName;
  }

  set(kind, message, withRetry = false, success) {
    const el = $id(this.elId);
    if (!el) return;
    if (success) el.style.display = "none";
    el.className = `data-status ${kind}`;
    el.innerHTML = `
      <i class="ti ${ICONS[kind]}" aria-hidden="true"></i>
      <span>${message}</span>
      ${withRetry ? `<button class="retry-btn" onclick="${this.retryGlobalFnName}()">إعادة المحاولة</button>` : ""}
    `;
  }
}
