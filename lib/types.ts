/**
 * Estrutura de dados da folha de serviço KILE.
 * Cada chave corresponde a um campo editável do formulário.
 */
export interface ServiceSheet {
  /** Nome do Objektleiter / Hausmeister responsável pela execução. */
  responsavel: string;
  dataRealizacao: string;
  cliente: string;
  morada: string;
  codigoPostalCidade: string;
  local: string;
  tarefa: string;
  observacao: string;
  von: string;
  bis: string;
  gesamt: string;
  data: string;
  /** Empresa externa (Fremdfirma). */
  fremdfirma: string;
  /** Quantidade de pessoal externo empregado. */
  fremdpersonalAnzahl: string;
  /** Assinatura do funcionário como imagem PNG (data URL). Vazio se não assinada. */
  assinatura: string;
}

export type ServiceSheetField = keyof ServiceSheet;

/** Endereço vinculado a um cliente (um Kunde pode ter vários). */
export interface CustomerAddress {
  id: string;
  street: string;
  plz: string;
  ort: string;
  einsatzort: string;
  defaultAufgabe?: string;
  defaultBemerkung?: string;
}

/** Cliente cadastrado com um ou mais endereços. */
export interface Customer {
  id: string;
  name: string;
  addresses: CustomerAddress[];
}

/** Empresa externa cadastrada (somente nome). */
export interface FremdfirmaRecord {
  id: string;
  name: string;
}
