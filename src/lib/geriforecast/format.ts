const WEEKDAYS = ["zo", "ma", "di", "wo", "do", "vr", "za"];
const MONTHS_SHORT = ["jan", "feb", "mrt", "apr", "mei", "jun", "jul", "aug", "sep", "okt", "nov", "dec"];
const MONTHS_LONG = [
  "januari", "februari", "maart", "april", "mei", "juni",
  "juli", "augustus", "september", "oktober", "november", "december",
];

/** "do 30 okt" */
export function formatDayShort(d: Date) {
  return `${WEEKDAYS[d.getUTCDay()]} ${d.getUTCDate()} ${MONTHS_SHORT[d.getUTCMonth()]}`;
}

/** "zo 27 sep 23:00" */
export function formatHour(d: Date) {
  return `${formatDayShort(d)} ${String(d.getUTCHours()).padStart(2, "0")}:00`;
}

/** "30 september 2026" */
export function formatDateLong(d: Date) {
  return `${d.getUTCDate()} ${MONTHS_LONG[d.getUTCMonth()]} ${d.getUTCFullYear()}`;
}

/** "1,5" */
export function formatWeight(w: number) {
  return w.toFixed(1).replace(".", ",");
}
