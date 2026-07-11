import type { ServiceSheet } from "./types";

/** Dados fixos da empresa exibidos no cabeçalho e no PDF. */
export const COMPANY = {
  name: "Kile Gebäudereinigung",
  title: "KILE Gebäudereinigung",
  address: "Bei der Grodener-Kirche 7",
  city: "27472 Cuxhaven",
  phone: "Tel: 04721 66 40011",
  email: "E-Mail: service@kile-cux.de",
} as const;

/** Estado inicial (todos os campos vazios). */
export const EMPTY_SHEET: ServiceSheet = {
  planeadaRealizacao: "",
  dataRealizacao: "",
  cliente: "",
  morada: "",
  codigoPostalCidade: "",
  local: "",
  tarefa: "",
  observacao: "",
  von: "",
  bis: "",
  gesamt: "",
  data: "",
  fremdfirma: "",
  fremdpersonalAnzahl: "",
  assinatura: "",
};

/** Chave usada para persistir o rascunho no navegador (offline). */
export const STORAGE_KEY = "kile-service-sheet";

/** Chave para a assinatura permanente (reutilizada em todas as folhas). */
export const SIGNATURE_STORAGE_KEY = "kile-signature";
