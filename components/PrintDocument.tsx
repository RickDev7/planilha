import { COMPANY } from "@/lib/constants";
import type { ServiceSheet } from "@/lib/types";
import { formatDate } from "@/utils/format";

interface PrintDocumentProps {
  sheet: ServiceSheet;
}

interface ServiceRow {
  label: string;
  value: string;
}

/**
 * Documento A4 pronto para impressão, reproduzindo o layout da folha KILE
 * inteiramente em HTML/CSS (sem imagem de fundo). Fica oculto na tela e só
 * aparece na impressão / geração de PDF.
 */
export function PrintDocument({ sheet }: PrintDocumentProps) {
  const serviceRows: ServiceRow[] = [
    { label: "Geplante Durchführung", value: formatDate(sheet.planeadaRealizacao) },
    { label: "Durchführungsdatum", value: formatDate(sheet.dataRealizacao) },
    { label: "Kunde", value: sheet.cliente },
    { label: "Adresse", value: sheet.morada },
    { label: "PLZ / Ort", value: sheet.codigoPostalCidade },
    { label: "Einsatzort", value: sheet.local },
    { label: "Aufgabe", value: sheet.tarefa },
    { label: "Bemerkung", value: sheet.observacao },
  ];

  return (
    <div className="print-only" aria-hidden="true">
      <div className="sheet">
        {/* Cabeçalho */}
        <div className="sheet-header">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img className="sheet-logo" src="/logo.png" alt="KILE Gebäudereinigung" />
          <div className="sheet-company">
            <div className="company-name">{COMPANY.name}</div>
            <div>{COMPANY.address}</div>
            <div>{COMPANY.city}</div>
            <div>{COMPANY.phone}</div>
            <div>{COMPANY.email}</div>
          </div>
        </div>

        {/* Barra de seções */}
        <div className="sheet-band">
          <div className="band-green">Datum</div>
          <div className="band-green">Uhrzeit</div>
          <div className="band-red">Informationen</div>
        </div>

        {/* Corpo em duas colunas */}
        <div className="sheet-body">
          {/* Lista de Serviços */}
          <div className="service-list">
            <div className="list-title">Leistungsliste</div>
            {serviceRows.map((row) => (
              <div className="list-row" key={row.label}>
                <div className="list-label">{row.label}</div>
                <div className="list-value">{row.value}</div>
              </div>
            ))}
          </div>

          {/* Área direita: horários + informações */}
          <div className="sheet-right">
            <div className="time-table">
              <div className="time-head">
                <div>Von</div>
                <div>Bis</div>
                <div>Gesamt</div>
              </div>
              <div className="time-values">
                <div>{sheet.von}</div>
                <div>{sheet.bis}</div>
                <div>{sheet.gesamt}</div>
              </div>
            </div>

            <div className="notes">
              <div className="notes-title">Informationen</div>
              <div className="notes-body">{sheet.informacoes}</div>
            </div>
          </div>
        </div>

        {/* Rodapé com espaço para assinar após a impressão */}
        <div className="sheet-footer">
          <div className="foot-block">
            <div className="sign-space">{formatDate(sheet.data)}</div>
            <div className="foot-line" />
            <div className="foot-label">Datum</div>
          </div>
          <div className="foot-block">
            <div className="sign-space" />
            <div className="foot-line" />
            <div className="foot-label">Unterschrift Kunde</div>
          </div>
        </div>
      </div>
    </div>
  );
}
