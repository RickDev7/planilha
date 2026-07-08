/**
 * Estrutura de dados da folha de serviço KILE.
 * Cada chave corresponde a um campo editável do formulário.
 */
export interface ServiceSheet {
  planeadaRealizacao: string;
  dataRealizacao: string;
  cliente: string;
  morada: string;
  codigoPostalCidade: string;
  local: string;
  tarefa: string;
  observacao: string;
  informacoes: string;
  von: string;
  bis: string;
  gesamt: string;
  data: string;
  /** Quantidade de trabalhadores que realizaram o trabalho. */
  mitarbeiterAnzahl: string;
  /** Assinatura do cliente como imagem PNG (data URL). Vazio se não assinada. */
  assinatura: string;
}

export type ServiceSheetField = keyof ServiceSheet;
