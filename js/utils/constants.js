/**
 * js/utils/constants.js
 * Static lookup tables (labels, icons, colors) used when rendering
 * program data. Kept separate from logic so copy/design tweaks never
 * require touching component code.
 */

export const STAGE_LABELS = {
  secondary: "الثانوية",
  middle: "المتوسطة",
  "upper-primary": "الابتدائية العليا",
  "lower-primary": "الابتدائية الأولية",
  all: "جميع المراحل",
};

export const TYPE_LABELS = {
  cultural: "ثقافي",
  tech: "تقني",
  edu: "تعليمي",
  moral: "تربوي",
};

export const TYPE_ICONS = {
  cultural: "ti-bulb",
  tech: "ti-device-laptop",
  edu: "ti-book",
  moral: "ti-heart",
};

export const ICON_CLASS = {
  cultural: "mini-icon cultural",
  tech: "mini-icon tech",
  edu: "mini-icon edu",
  moral: "mini-icon moral",
};

// Background used for swiper slides that have no thumbnail image to show.
export const TYPE_GRADIENTS = {
  cultural: "linear-gradient(135deg, var(--purple-mid), var(--purple-dark))",
  tech: "linear-gradient(135deg, var(--blue-mid), var(--blue-dark))",
  edu: "linear-gradient(135deg, var(--teal-mid), var(--teal-dark))",
  moral: "linear-gradient(135deg, var(--amber-mid), var(--amber-dark))",
};

export const TIMING_META = {
  current: { label: "جارٍ الآن", icon: "ti-clock" },
  upcoming: { label: "قادم", icon: "ti-hourglass" },
  past: { label: "سابق", icon: "ti-history" },
};

/** Picks an icon representing the delivery platform of a program. */
export function platformIcon(platform) {
  const p = (platform || "").toLowerCase();
  if (/google/.test(p)) return "ti-brand-google";
  if (/teams|zoom|meet|video|فيديو/.test(p)) return "ti-video";
  if (/whatsapp|واتس/.test(p)) return "ti-brand-whatsapp";
  if (/حضور|onsite|in.?person|قاعة|ميداني/.test(p)) return "ti-map-pin";
  return "ti-device-desktop";
}
