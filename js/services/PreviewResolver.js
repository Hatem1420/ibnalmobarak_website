/**
 * js/services/PreviewResolver.js
 * A single `preview_url` (or `image_url`) column can hold a YouTube
 * link/ID, a Google Drive share link, or a direct image URL. This
 * normalizes it into a small descriptor the rest of the app can render
 * without re-sniffing the URL:
 *   { kind: "youtube" | "drive" | "image" | "", raw, id, imageUrl }
 *     - kind "youtube": id is the 11-char video ID; imageUrl is its thumbnail.
 *     - kind "drive":   id is the Drive file ID; imageUrl is a thumbnail URL.
 *     - kind "image":   imageUrl is the URL itself (used as-is).
 */

const YOUTUBE_PATTERNS = [
  /(?:youtu\.be\/)([\w-]{11})/,
  /(?:youtube\.com\/watch\?v=)([\w-]{11})/,
  /(?:youtube\.com\/embed\/)([\w-]{11})/,
  /(?:youtube\.com\/shorts\/)([\w-]{11})/,
];

export class PreviewResolver {
  /**
   * @param {string} raw
   * @returns {{kind: string, raw: string, id: string, imageUrl: string}}
   */
  static resolve(raw) {
    const v = (raw || "").trim();
    if (!v) return { kind: "", raw: "", id: "", imageUrl: "" };

    const ytId = PreviewResolver.#matchYoutubeId(v);
    if (ytId) {
      return { kind: "youtube", raw: v, id: ytId, imageUrl: `https://img.youtube.com/vi/${ytId}/hqdefault.jpg` };
    }

    if (/drive\.google\.com/i.test(v)) {
      const driveId = PreviewResolver.#matchDriveId(v);
      if (driveId) {
        return { kind: "drive", raw: v, id: driveId, imageUrl: `https://drive.google.com/thumbnail?id=${driveId}&sz=w1200` };
      }
    }

    if (/^https?:\/\//i.test(v) || PreviewResolver.#looksLikeImageUrl(v)) {
      return { kind: "image", raw: v, id: "", imageUrl: v };
    }

    return { kind: "", raw: v, id: "", imageUrl: "" };
  }

  static #matchYoutubeId(v) {
    if (/^[\w-]{11}$/.test(v)) return v; // bare video ID
    for (const p of YOUTUBE_PATTERNS) {
      const m = v.match(p);
      if (m) return m[1];
    }
    return "";
  }

  static #matchDriveId(v) {
    const m = v.match(/\/file\/d\/([a-zA-Z0-9_-]+)/) || v.match(/[?&]id=([a-zA-Z0-9_-]+)/);
    return m ? m[1] : "";
  }

  static #looksLikeImageUrl(v) {
    return /\.(png|jpe?g|gif|webp|svg|bmp|avif)(\?.*)?$/i.test(v) || /googleusercontent\.com/i.test(v);
  }
}
