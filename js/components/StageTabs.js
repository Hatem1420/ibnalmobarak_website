/**
 * js/components/StageTabs.js
 * Renders the "current / upcoming / past" mini-card lists for the
 * currently selected stage tab in the Stages section.
 */

import { $id, $all, escapeHtml } from "../utils/dom.js";
import { TYPE_LABELS, TYPE_ICONS, ICON_CLASS } from "../utils/constants.js";

export class StageTabs {
  /**
   * @param {object} opts
   * @param {(id: string) => void} opts.onOpenProgram
   * @param {(stage: string) => void} opts.onStageChange
   */
  constructor({ onOpenProgram, onStageChange }) {
    this.onOpenProgram = onOpenProgram;
    this.onStageChange = onStageChange;
    this.#bindTabButtons();
  }

  #bindTabButtons() {
    $all(".stage-tab").forEach(btn => {
      btn.addEventListener("click", () => {
        $all(".stage-tab").forEach(t => t.classList.remove("active"));
        btn.classList.add("active");
        this.onStageChange(btn.dataset.stage);
      });
    });
  }

  render(programs, currentStage) {
    const items = programs.filter(p => p.stage === currentStage);
    this.#renderMini("current-progs", items.filter(p => p.timing === "current"), "لا توجد برامج جارية حالياً لهذه المرحلة");
    this.#renderMini("upcoming-progs", items.filter(p => p.timing === "upcoming"), "لا توجد برامج قادمة حالياً لهذه المرحلة");
    this.#renderMini("past-progs", items.filter(p => p.timing === "past"), "لا توجد برامج سابقة مسجّلة لهذه المرحلة");
  }

  #renderMini(containerId, list, emptyMsg) {
    const el = $id(containerId);
    if (!el) return;
    if (!list.length) { el.innerHTML = `<div class="empty-state">${emptyMsg}</div>`; return; }

    el.innerHTML = list.map((p, idx) => this.#miniCardHtml(p, idx)).join("");

    el.querySelectorAll(".mini-card").forEach((card, idx) => {
      card.addEventListener("click", () => this.onOpenProgram(list[idx].id));
    });
  }

  #miniCardHtml(p, idx) {
    const isLive = p.timing === "current";
    return `
    <div class="mini-card ${isLive ? "is-live" : ""}" style="animation-delay: ${0.1 + (idx * 0.08)}s">
      <div class="mini-top">
        <div class="${ICON_CLASS[p.type] || "mini-icon edu"}"><i class="ti ${p.icon || TYPE_ICONS[p.type] || "ti-book"}" aria-hidden="true"></i></div>
        ${isLive ? `<span class="live-tag">${this.#liveDotHtml()} جارٍ الآن</span>` : `<span class="tag" style="font-size:10px">${TYPE_LABELS[p.type] || p.type}</span>`}
      </div>
      <div class="mini-title">${escapeHtml(p.title)}</div>
      <div class="mini-date">
        <i class="ti ti-calendar" aria-hidden="true"></i> ${escapeHtml(p.date)}
        ${p.points ? `<span style="margin-inline-start:6px"><i class="ti ti-star" aria-hidden="true"></i> ${escapeHtml(p.points)}</span>` : ""}
        ${p.preview.kind === "youtube" ? `<i class="ti ti-brand-youtube" style="margin-inline-start:5px;color:var(--red-mid)" aria-hidden="true"></i>` : ""}
        ${(p.preview.kind === "image" || p.preview.kind === "drive") ? `<i class="ti ti-photo" style="margin-inline-start:5px;color:var(--gray-hint)" aria-hidden="true"></i>` : ""}
      </div>
    </div>
  `;
  }

  #liveDotHtml() {
    return `<span class="live-dot" aria-hidden="true"></span>`;
  }
}
