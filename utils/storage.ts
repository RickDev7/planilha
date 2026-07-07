import { EMPTY_SHEET, STORAGE_KEY } from "@/lib/constants";
import type { ServiceSheet } from "@/lib/types";

/** Lê o rascunho salvo no localStorage; devolve a folha vazia se não houver. */
export function loadSheet(): ServiceSheet {
  if (typeof window === "undefined") return EMPTY_SHEET;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY);
    if (!raw) return EMPTY_SHEET;
    return { ...EMPTY_SHEET, ...(JSON.parse(raw) as Partial<ServiceSheet>) };
  } catch {
    return EMPTY_SHEET;
  }
}

/** Persiste o rascunho atual para não perder dados ao recarregar/offline. */
export function saveSheet(sheet: ServiceSheet): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(sheet));
  } catch {
    // Sem espaço ou modo privado: ignora silenciosamente.
  }
}

/** Remove o rascunho salvo. */
export function clearSheet(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(STORAGE_KEY);
  } catch {
    // ignora
  }
}
