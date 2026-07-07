/** Converte "YYYY-MM-DD" (input date) para "DD.MM.YYYY". Mantém original se não casar. */
export function formatDate(value: string): string {
  const match = /^(\d{4})-(\d{2})-(\d{2})$/.exec(value.trim());
  if (!match) return value;
  const [, y, m, d] = match;
  return `${d}.${m}.${y}`;
}

/**
 * Calcula a duração entre dois horários "HH:MM" e devolve no formato "Xh MMmin"
 * (ex: "3h30"). Se o fim for anterior ao início, assume virada de meia-noite.
 * Devolve "" quando algum horário está incompleto/ inválido.
 */
export function computeDuration(von: string, bis: string): string {
  const parse = (v: string) => {
    const m = /^(\d{2}):(\d{2})$/.exec(v.trim());
    if (!m) return null;
    const h = Number(m[1]);
    const min = Number(m[2]);
    if (h > 23 || min > 59) return null;
    return h * 60 + min;
  };

  const start = parse(von);
  const end = parse(bis);
  if (start === null || end === null) return "";

  let diff = end - start;
  if (diff < 0) diff += 24 * 60; // atravessou a meia-noite
  if (diff === 0) return "";

  const hours = Math.floor(diff / 60);
  const minutes = diff % 60;
  return `${hours}h${String(minutes).padStart(2, "0")}`;
}
