/**
 * Safety net behind the system prompt's "never use em dashes or en dashes"
 * instruction — models occasionally slip one in anyway. Only strips the
 * Unicode dash characters (—, –), never the ASCII hyphen, so compound words
 * like "AI-drafted" or "1-star" survive untouched.
 */
export function stripDashes(text: string): string {
  return text
    .replace(/\s*[—–]\s*/g, ", ")
    .replace(/,\s*,/g, ",")
    .replace(/,(\s*[.!?])/g, "$1")
    .replace(/\s+,/g, ",")
    .replace(/[ \t]{2,}/g, " ")
    .trim();
}
