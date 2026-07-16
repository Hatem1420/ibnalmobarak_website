/**
 * js/components/HomeSwiper.js
 * Touch/drag-friendly image carousel shown at the top of the home page.
 * Uses each slide's preview image (YouTube thumbnail, Google Drive
 * thumbnail, or direct image URL) when available, otherwise a
 * type-colored gradient placeholder.
 */

import { $id, escapeHtml } from "../utils/dom.js";
import { TYPE_GRADIENTS } from "../utils/constants.js";

export class HomeSwiper {
  /**
   * @param {object} opts
   * @param {string} opts.wrapId
   * @param {string} opts.hintId
   * @param {(id: string) => void} opts.onOpenProgram slide is linked to a program
   * @param {(imageUrl: string) => void} opts.onOpenImage unlinked slide — show fullscreen image
   */
  constructor({ wrapId, hintId, onOpenProgram, onOpenImage }) {
    this.wrapId = wrapId;
    this.hintId = hintId;
    this.onOpenProgram = onOpenProgram;
    this.onOpenImage = onOpenImage;

    this.index = 0;
    this.count = 0;
    this.timer = null;
    this.drag = null;
    this.suppressClick = false;
  }

  render(items) {
    const wrap = $id(this.wrapId);
    const hint = $id(this.hintId);
    if (!wrap) return;

    this.#stopAutoplay();
    this.drag = null;
    this.index = 0;

    if (!items.length) {
      wrap.innerHTML = "";
      wrap.style.display = "none";
      if (hint) hint.style.display = "none";
      return;
    }

    wrap.style.display = "";
    if (hint) hint.style.display = "";

    wrap.innerHTML = `
      <div class="home-swiper" id="home-swiper">
        <div class="swiper-track" id="swiper-track">
          ${items.map(p => this.#slideHtml(p)).join("")}
        </div>
        ${items.length > 1 ? `
        <button type="button" class="swiper-arrow prev" aria-label="السابق"><i class="ti ti-chevron-right" aria-hidden="true"></i></button>
        <button type="button" class="swiper-arrow next" aria-label="التالي"><i class="ti ti-chevron-left" aria-hidden="true"></i></button>
        <div class="swiper-dots" id="swiper-dots">
          ${items.map((_, i) => `<button type="button" class="swiper-dot ${i === 0 ? "active" : ""}" aria-label="الشريحة ${i + 1}"></button>`).join("")}
        </div>` : ""}
      </div>
    `;

    this.count = items.length;
    this.#attachEvents();
    this.#startAutoplay();
  }

  #slideHtml(p) {
    const imageUrl = p.preview && p.preview.imageUrl;
    const bg = imageUrl
      ? `background-image:url('${imageUrl}')`
      : `background:${TYPE_GRADIENTS[p.type] || TYPE_GRADIENTS.edu}`;
    const clickableId = p.programId || "";

    return `
      <div class="swiper-slide" data-id="${escapeHtml(clickableId)}" data-image="${escapeHtml(imageUrl || "")}" style="${bg}">
        <div class="swiper-slide-overlay">
          <span class="badge badge-new"><i class="ti ti-sparkles" aria-hidden="true"></i> جديد</span>
          <div class="swiper-slide-title">${escapeHtml(p.title)}</div>
          <div class="swiper-slide-meta">
            ${p.date ? `<span><i class="ti ti-calendar" aria-hidden="true"></i> ${escapeHtml(p.date)}</span>` : ""}
            ${p.time ? `<span><i class="ti ti-clock" aria-hidden="true"></i> ${escapeHtml(p.time)}</span>` : ""}
            ${p.points ? `<span><i class="ti ti-star" aria-hidden="true"></i> ${escapeHtml(p.points)} نقطة</span>` : ""}
          </div>
        </div>
      </div>
    `;
  }

  goTo(i, animate = true) {
    const track = $id("swiper-track");
    if (!track || !track.children.length) return;
    const count = track.children.length;
    this.index = ((i % count) + count) % count;
    track.style.transition = animate ? "" : "none";
    track.style.transform = `translateX(${this.index * 100}%)`;
    document.querySelectorAll("#swiper-dots .swiper-dot").forEach((d, idx) => d.classList.toggle("active", idx === this.index));
  }

  step(dir) {
    this.goTo(this.index + dir);
    this.#restartAutoplay();
  }

  #startAutoplay() {
    this.#stopAutoplay();
    if (this.count <= 1) return;
    this.timer = setInterval(() => this.goTo(this.index + 1), 6000);
  }

  #stopAutoplay() {
    if (this.timer) { clearInterval(this.timer); this.timer = null; }
  }

  #restartAutoplay() { this.#startAutoplay(); }

  /** Public: called by ThemeToggle/section switches that might steal focus, kept for parity. */
  stopAutoplay() { this.#stopAutoplay(); }
  restartAutoplay() { this.#restartAutoplay(); }

  #attachEvents() {
    const el = $id("home-swiper");
    const track = $id("swiper-track");
    if (!el || !track) return;

    const onDown = (clientX) => {
      this.drag = { startX: clientX, lastX: clientX, width: el.getBoundingClientRect().width || 1 };
      track.style.transition = "none";
      this.#stopAutoplay();
    };
    const onMove = (clientX) => {
      if (!this.drag) return;
      this.drag.lastX = clientX;
      const delta = clientX - this.drag.startX;
      track.style.transform = `translateX(calc(${this.index * 100}% + ${delta}px))`;
    };
    const onUp = () => {
      if (!this.drag) return;
      const delta = this.drag.lastX - this.drag.startX;
      const threshold = this.drag.width * 0.15;
      track.style.transition = "";
      if (delta > threshold) this.goTo(this.index + 1);
      else if (delta < -threshold) this.goTo(this.index - 1);
      else this.goTo(this.index);

      if (Math.abs(delta) > 5) {
        this.suppressClick = true;
        setTimeout(() => { this.suppressClick = false; }, 60);
      }
      this.drag = null;
      this.#restartAutoplay();
    };

    // Arrows/dots are controls, not drag surfaces — never start a drag from
    // them, or their own click handling gets swallowed by pointer capture
    // (this is what broke arrow/dot clicks and the lightbox on desktop mouse).
    const isControl = (target) => !!target.closest(".swiper-arrow, .swiper-dot");

    el.addEventListener("pointerdown", e => {
      if (isControl(e.target)) return;
      try { el.setPointerCapture(e.pointerId); } catch (_) {}
      onDown(e.clientX);
    });
    el.addEventListener("pointermove", e => onMove(e.clientX));
    el.addEventListener("pointerup", onUp);
    el.addEventListener("pointercancel", onUp);
    el.addEventListener("mouseenter", () => this.#stopAutoplay());
    el.addEventListener("mouseleave", () => { if (!this.drag) this.#restartAutoplay(); });

    // Arrow / dot controls
    el.querySelector(".swiper-arrow.prev")?.addEventListener("click", () => this.step(-1));
    el.querySelector(".swiper-arrow.next")?.addEventListener("click", () => this.step(1));
    document.querySelectorAll("#swiper-dots .swiper-dot").forEach((dot, i) => {
      dot.addEventListener("click", () => { this.goTo(i); this.#restartAutoplay(); });
    });

    track.addEventListener("click", e => {
      if (this.suppressClick) return;
      if (isControl(e.target)) return; // let the arrow/dot's own handler act
      const slide = e.target.closest(".swiper-slide");
      if (!slide) return;
      if (slide.dataset.id) {
        this.onOpenProgram(slide.dataset.id); // slide is linked to a program
      } else if (slide.dataset.image) {
        this.onOpenImage(slide.dataset.image); // unlinked slide — show fullscreen image
      }
    });
  }
}
