export type Level = "Rustig" | "Normaal" | "Druk" | "Zeer druk";

/** Druktegetal: 100 is een gemiddeld uur. */
export function levelOf(value: number): Level {
  if (value < 80) return "Rustig";
  if (value < 110) return "Normaal";
  if (value < 150) return "Druk";
  return "Zeer druk";
}
