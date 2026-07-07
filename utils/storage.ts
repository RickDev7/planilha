import { EMPTY_SHEET, SIGNATURE_STORAGE_KEY, STORAGE_KEY } from "@/lib/constants";
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

/**
 * Persiste o rascunho atual. A assinatura NÃO entra no rascunho: ela tem
 * armazenamento próprio (permanente) para ser reutilizada em todas as folhas.
 */
export function saveSheet(sheet: ServiceSheet): void {
  if (typeof window === "undefined") return;
  try {
    const { assinatura: _assinatura, ...draft } = sheet;
    void _assinatura;
    window.localStorage.setItem(STORAGE_KEY, JSON.stringify(draft));
  } catch {
    // Sem espaço ou modo privado: ignora silenciosamente.
  }
}

/** Lê a assinatura permanente (data URL PNG) ou "" se não houver. */
export function loadSignature(): string {
  if (typeof window === "undefined") return "";
  try {
    return window.localStorage.getItem(SIGNATURE_STORAGE_KEY) ?? "";
  } catch {
    return "";
  }
}

/** Grava/substitui a assinatura permanente. */
export function saveSignature(dataUrl: string): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(SIGNATURE_STORAGE_KEY, dataUrl);
  } catch {
    // ignora
  }
}

/** Remove a assinatura permanente do armazenamento. */
export function clearSignature(): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.removeItem(SIGNATURE_STORAGE_KEY);
  } catch {
    // ignora
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
