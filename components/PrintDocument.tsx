import { COMPANY } from "@/lib/constants";
import type { ServiceSheet } from "@/lib/types";
import { formatDate } from "@/utils/format";

interface PrintDocumentProps {
  sheet: ServiceSheet;
}

interface Field {
  label: string;
  value: string;
  /** Ocupa a largura inteira (campos de texto longos). */
  full?: boolean;
}

/**
 * Documento A4 pronto para impressão que espelha o layout do PWA
 * (cabeçalho, seções em cards e campos rotulados). Fica oculto na tela
 * e só aparece na impressão / geração de PDF.
 */
export function PrintDocument({ sheet }: PrintDocumentProps) {
  const serviceFields: Field[] = [
    { label: "Geplante Durchführung", value: formatDate(sheet.planeadaRealizacao) },
    { label: "Durchführungsdatum", value: formatDate(sheet.dataRealizacao) },
    { label: "Kunde", value: sheet.cliente },
    { label: "Adresse", value: sheet.morada },
    { label: "PLZ / Ort", value: sheet.codigoPostalCidade },
    { label: "Einsatzort", value: sheet.local },
  ];

  const timeFields: Field[] = [
    { label: "Von", value: sheet.von },
    { label: "Bis", value: sheet.bis },
    { label: "Gesamt", value: sheet.gesamt },
    { label: "Datum", value: formatDate(sheet.data) },
  ];

  return (
    <div className="print-only" aria-hidden="true">
      <div className="sheet">
        {/* Cabeçalho (igual ao PWA) */}
        <div className="p-header">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="p-logo" src="/logo.png" alt="KILE Gebäudereinigung" />
          <div className="p-header-title">{COMPANY.title}</div>
          <div className="p-header-contact">
            {COMPANY.address} · {COMPANY.city} · {COMPANY.phone} · {COMPANY.email}
          </div>
        </div>

        {/* Seção: Dados do serviço */}
        <div className="p-section">
          <div className="p-section-title">Servicedaten</div>
          <div className="p-grid">
            {serviceFields.map((f) => (
              <Field key={f.label} field={f} />
            ))}
          </div>
        </div>

        {/* Seção: Tarefa e observações */}
        <div className="p-section">
          <div className="p-section-title">Aufgabe und Bemerkungen</div>
          <div className="p-grid">
            <Field field={{ label: "Aufgabe", value: sheet.tarefa, full: true }} tall />
            <Field field={{ label: "Bemerkung", value: sheet.observacao, full: true }} tall />
            <Field field={{ label: "Informationen", value: sheet.informacoes, full: true }} tall />
          </div>
        </div>

        {/* Seção: Horários */}
        <div className="p-section">
          <div className="p-section-title">Uhrzeiten</div>
          <div className="p-grid p-grid-4">
            {timeFields.map((f) => (
              <Field key={f.label} field={f} />
            ))}
          </div>
        </div>

        {/* Assinatura (para assinar após imprimir) */}
        <div className="p-signatures">
          <div className="p-sign-block">
            <div className="p-sign-space">{formatDate(sheet.data)}</div>
            <div className="p-sign-line" />
            <div className="p-sign-label">Datum</div>
          </div>
          <div className="p-sign-block">
            <div className="p-sign-space" />
            <div className="p-sign-line" />
            <div className="p-sign-label">Unterschrift Kunde</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({ field, tall }: { field: Field; tall?: boolean }) {
  return (
    <div className={`p-field${field.full ? " p-field-full" : ""}`}>
      <div className="p-field-label">{field.label}</div>
      <div className={`p-field-value${tall ? " p-field-tall" : ""}`}>
        {field.value}
      </div>
    </div>
  );
}
