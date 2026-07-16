/**
 * js/state/AppState.js
 * Single source of truth for data shared across components (loaded
 * programs, swiper items, currently selected stage tab). Components
 * subscribe to change events instead of reading globals directly.
 */

export class AppState {
  constructor() {
    this.programs = [];
    this.swiperItems = null; // from the dedicated Swiper GID tab, if configured
    this.currentStage = "secondary";
    this.#listeners = new Set();
  }

  #listeners;

  /** @param {(state: AppState) => void} fn */
  subscribe(fn) {
    this.#listeners.add(fn);
    return () => this.#listeners.delete(fn);
  }

  #notify() {
    this.#listeners.forEach(fn => fn(this));
  }

  setPrograms(programs) {
    this.programs = programs;
    this.#notify();
  }

  setSwiperItems(items) {
    this.swiperItems = items;
    this.#notify();
  }

  setStage(stage) {
    this.currentStage = stage;
    this.#notify();
  }

  findProgramById(id) {
    return this.programs.find(p => p.id === id);
  }
}
