/**
 * js/components/ProgramCards.js
 * Renders the "is_new" program cards grid on the home page.
 */

import { $id, escapeHtml } from "../utils/dom.js";
import { TYPE_LABELS, TYPE_ICONS, TIMING_META } from "../utils/constants.js";

export class ProgramCards {
  /**
   * @param {string} containerId
   * @param {(id: string) => void} onOpenProgram called with a program id when a card is clicked
   */
  constructor(containerId, onOpenProgram) {
    this.containerId = containerId;
    this.onOpenProgram = onOpenProgram;
  }

  renderEmpty(message) {
    const el = $id(this.containerId);
    if (!el) return;
    el.innerHTML = `<div class="empty-state"><i class="ti ti-inbox" style="font-size:22px;display:block;margin-bottom:8px"></i>${message}</div>`;
  }

  renderSkeleton(count) {
    const el = $id(this.containerId);
    if (!el) return;
    el.innerHTML = Array.from({ length: count }).map(() => `
      <div class="skeleton-card">
        <div class="skeleton-line w40" style="height:18px;margin-bottom:14px"></div>
        <div class="skeleton-line w90"></div>
        <div class="skeleton-line w60"></div>
      </div>
    `).join("");
  }

  render(items) {
    const el = $id(this.containerId);
    if (!el) return;
    if (!items.length) { this.renderEmpty("لا توجد برامج جديدة معلنة حالياً"); return; }

    el.innerHTML = items.map((p, idx) => this.#cardHtml(p, idx)).join("");

    // Delegate clicks rather than relying on inline onclick strings.
    el.querySelectorAll(".program-card").forEach((card, idx) => {
      card.addEventListener("click", () => this.onOpenProgram(items[idx].id));
    });
  }

  #cardHtml(p, idx) {
    const timing = TIMING_META[p.timing] || TIMING_META.current;
    const isLive = p.timing === "current";

    return `
      <div class="program-card ${idx === 0 ? "featured" : ""} ${isLive ? "is-live" : ""}" style="animation-delay: ${0.1 + (idx * 0.1)}s">
        <div class="card-badges">
          ${this.#badgeHtml("new", "جديد")}
          <div class="badge badge-${p.timing === "current" ? "current" : p.timing === "upcoming" ? "coming" : "past"} ${isLive ? "badge-live" : ""}">
            ${isLive ? this.#liveDotHtml() : `<i class="ti ${timing.icon}" aria-hidden="true"></i>`} ${timing.label}
          </div>
        </div>
        <div class="card-title">${escapeHtml(p.title)}</div>
        <div class="card-desc">${escapeHtml(p.description)}</div>
        <div class="card-tags">
          <span class="tag"><i class="ti ${TYPE_ICONS[p.type] || "ti-tag"}" aria-hidden="true"></i> ${TYPE_LABELS[p.type] || p.type}</span>
          ${p.points ? `<span class="tag tag-points"><i class="ti ti-star" aria-hidden="true"></i> ${escapeHtml(p.points)} نقطة</span>` : ""}
          ${p.preview.kind === "youtube" ? `<span class="tag video-tag"><i class="ti ti-brand-youtube" aria-hidden="true"></i> فيديو</span>` : ""}
          ${p.preview.kind === "image" || p.preview.kind === "drive" ? `<span class="tag video-tag"><i class="ti ti-photo" aria-hidden="true"></i> صورة</span>` : ""}
        </div>
        <div class="card-footer">
          <span class="card-date"><i class="ti ti-calendar" aria-hidden="true"></i> ${escapeHtml(p.date)}</span>
          <button class="details-btn">التفاصيل <i class="ti ti-arrow-left" aria-hidden="true"></i></button>
        </div>
      </div>
    `;
  }

  #liveDotHtml() {
    return `<span class="live-dot" aria-hidden="true"></span>`;
  }

  #badgeHtml(kind, label) {
    const icons = { new: "ti-sparkles", current: "ti-clock", coming: "ti-hourglass", past: "ti-history" };
    return `<div class="badge badge-${kind}"><i class="ti ${icons[kind]}" aria-hidden="true"></i> ${label}</div>`;
  }
}
