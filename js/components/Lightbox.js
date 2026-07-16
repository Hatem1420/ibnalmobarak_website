/**
 * js/components/Lightbox.js
 * Fullscreen image viewer used for swiper slides that aren't linked to a
 * program (no program_id): tapping the image shows it fullscreen instead
 * of doing nothing.
 */

import { $id } from "../utils/dom.js";

export class Lightbox {
  /**
   * @param {object} opts
   * @param {string} opts.overlayId
   * @param {string} opts.imgId
   * @param {() => void} [opts.onOpen] called when the lightbox opens (e.g. pause swiper autoplay)
   * @param {() => void} [opts.onClose] called when the lightbox closes (e.g. resume swiper autoplay)
   */
  constructor({ overlayId = "lightbox-overlay", imgId = "lightbox-img", onOpen, onClose } = {}) {
    this.overlayId = overlayId;
    this.imgId = imgId;
    this.onOpen = onOpen;
    this.onClose = onClose;
    this.#bindCloseControls();
  }

  #bindCloseControls() {
    const overlay = $id(this.overlayId);
    if (!overlay) return;
    overlay.addEventListener("click", (e) => { if (e.target === overlay) this.close(); });
    overlay.querySelector(".lightbox-close")?.addEventListener("click", () => this.close());
  }

  open(imageUrl) {
    if (!imageUrl) return;
    this.onOpen && this.onOpen();
    $id(this.imgId).src = imageUrl;
    $id(this.overlayId).classList.add("open");
  }

  close() {
    const overlay = $id(this.overlayId);
    if (!overlay) return;
    overlay.classList.remove("open");
    $id(this.imgId).src = "";
    this.onClose && this.onClose();
  }
}
