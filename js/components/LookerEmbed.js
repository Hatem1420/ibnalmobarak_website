/**
 * js/components/LookerEmbed.js
 * Lazily embeds the Looker Studio "grades" report the first time the
 * Grades section is opened.
 */

import { $id } from "../utils/dom.js";

export class LookerEmbed {
  /** @param {object} config window.SITE_CONFIG-shaped object */
  constructor(config, { wrapId = "looker-embed-wrap" } = {}) {
    this.config = config;
    this.wrapId = wrapId;
    this.initialized = false;
  }

  init() {
    if (this.initialized) return;
    const wrap = $id(this.wrapId);
    if (!wrap) return;
    const url = this.config.LOOKER_STUDIO_EMBED_URL;

    if (!url || url.includes("REPORT_ID")) {
      wrap.innerHTML = `
        <div class="embed-area">
          <i class="ti ti-brand-google" aria-hidden="true"></i>
          <h3>لم يتم ربط تقرير Looker Studio بعد</h3>
          <p>افتح تقريرك في Looker Studio ← مشاركة ← تضمين تقرير، ثم الصق الرابط في config.js داخل LOOKER_STUDIO_EMBED_URL</p>
          <div class="embed-link"><i class="ti ti-external-link" aria-hidden="true"></i><span>config.js</span></div>
        </div>`;
      return;
    }

    wrap.innerHTML = `<iframe src="${url}" frameborder="0" style="border:0" allowfullscreen loading="lazy" title="تقرير الدرجات"></iframe>`;
    this.initialized = true;
  }
}
