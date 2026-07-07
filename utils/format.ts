/** Converte "YYYY-MM-DD" (input date) para "DD.MM.YYYY". Mantém original se não casar. */
export function formatDate(value: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) return value;
  const [, y, m, d] = match;
  return `${d}.${m}.${y}`;
}
