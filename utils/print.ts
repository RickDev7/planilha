/**
 * Abre a caixa de impressão do navegador (Salvar como PDF).
 * Aguarda um frame para o documento de impressão estar renderizado.
 */
export function generatePdf(suggestedName: string): void {
  if (typeof window === "undefined") return;

  const previousTitle = document.title;
  document.title = suggestedName;

  const restore = () => {
    document.title = previousTitle;
    window.removeEventListener("afterprint", restore);
  };
  window.addEventListener("afterprint", restore);

  // Garante que o DOM de impressão foi pintado antes de abrir o diálogo.
  requestAnimationFrame(() => {
    requestAnimationFrame(() => window.print());
  });
}

/** Monta um nome de arquivo a partir do cliente e da data. */
export function buildPdfName(cliente: string, data: string): string {
  const safeClient = cliente.trim().replace(/[^\p{L}\p{N}_-]+/gu, "-") || "folha";
  const datePart = data || new Date().toISOString().slice(0, 10);
  return `KILE-${safeClient}-${datePart}`;
}
