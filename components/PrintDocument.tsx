import { COMPANY } from "@/lib/constants";
import type { ServiceSheet } from "@/lib/types";
import { formatDate } from "@/utils/format";

interface PrintDocumentProps {
  sheet: ServiceSheet;
}

interface Field {
  label: string;
  value: string;
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
    { label: "Fremdfirma", value: sheet.fremdfirma },
    {
      label: "Eingesetztes Fremdpersonal",
      value: sheet.fremdpersonalAnzahl
        ? `${sheet.fremdpersonalAnzahl} Personen`
        : "",
    },
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
        {/* Cabeçalho (logo + contato, sem título textual) */}
        <div className="p-header">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="p-logo" src="/logo.png" alt="KILE Gebäudereinigung" />
          <div className="p-header-contact">
            {COMPANY.address} · {COMPANY.city} · {COMPANY.phone} · {COMPANY.email}
          </div>
        </div>

        <div className="p-content">
          <div className="p-section">
            <div className="p-section-title">Servicedaten</div>
            <div className="p-grid">
              {serviceFields.map((f) => (
                <Field key={f.label} field={f} />
              ))}
            </div>
          </div>

          <div className="p-section p-section-grow">
            <div className="p-section-title">Aufgabe und Bemerkungen</div>
            <div className="p-textstack">
              <Field field={{ label: "Aufgabe", value: sheet.tarefa }} tall />
              <Field field={{ label: "Bemerkung", value: sheet.observacao }} tall />
            </div>
          </div>

          <div className="p-section p-section-hours">
            <div className="p-section-title">Uhrzeiten</div>
            <div className="p-grid p-grid-4">
              {timeFields.map((f) => (
                <Field key={f.label} field={f} />
              ))}
            </div>
          </div>
        </div>

        <div className="p-signatures">
          <div className="p-sign-block">
            <div className="p-sign-space">{formatDate(sheet.data)}</div>
            <div className="p-sign-line" />
            <div className="p-sign-label">Datum</div>
          </div>
          <div className="p-sign-block">
            <div className="p-sign-space">
              {sheet.assinatura ? (
                /* eslint-disable-next-line @next/next/no-img-element */
                <img
                  className="p-sign-img"
                  src={sheet.assinatura}
                  alt="Unterschrift"
                />
              ) : null}
            </div>
            <div className="p-sign-line" />
            <div className="p-sign-label">Unterschrift Mitarbeiter</div>
          </div>
        </div>
      </div>
    </div>
  );
}

function Field({
  field,
  tall,
  grow,
}: {
  field: Field;
  tall?: boolean;
  grow?: boolean;
}) {
  const cls = grow ? " p-field-grow" : tall ? " p-field-tall" : "";
  return (
    <div className={`p-field${grow ? " p-field-grow-wrap" : ""}`}>
      <div className="p-field-label">{field.label}</div>
      <div className={`p-field-value${cls}`}>{field.value}</div>
    </div>
  );
}
