/**
 * js/services/CsvParser.js
 * Minimal RFC4180-ish CSV parser: handles quoted fields, escaped quotes,
 * commas and newlines inside quotes. Pure/static — no state, no I/O.
 */

export class CsvParser {
  /**
   * Parses raw CSV text into an array of plain objects keyed by header row.
   * @param {string} text
   * @returns {Array<Object>}
   */
  static parse(text) {
    const rows = CsvParser.#parseRows(text);
    if (!rows.length) return [];

    const headers = rows[0].map(h => h.trim());
    return rows.slice(1)
      .filter(r => r.some(cell => cell.trim() !== ""))
      .map(r => {
        const obj = {};
        headers.forEach((h, idx) => { obj[h] = (r[idx] ?? "").trim(); });
        return obj;
      });
  }

  static #parseRows(text) {
    const rows = [];
    let row = [];
    let field = "";
    let inQuotes = false;

    for (let i = 0; i < text.length; i++) {
      const c = text[i];
      const next = text[i + 1];

      if (inQuotes) {
        if (c === '"' && next === '"') { field += '"'; i++; }
        else if (c === '"') { inQuotes = false; }
        else { field += c; }
      } else {
        if (c === '"') inQuotes = true;
        else if (c === ',') { row.push(field); field = ""; }
        else if (c === '\r') { /* ignore */ }
        else if (c === '\n') { row.push(field); rows.push(row); row = []; field = ""; }
        else field += c;
      }
    }
    if (field.length || row.length) { row.push(field); rows.push(row); }
    return rows;
  }
}
