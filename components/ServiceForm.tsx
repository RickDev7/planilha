"use client";

import { useEffect, useState } from "react";
import { EMPTY_SHEET } from "@/lib/constants";
import type { ServiceSheet, ServiceSheetField } from "@/lib/types";
import { clearSheet, loadSheet, saveSheet } from "@/utils/storage";
import { buildPdfName, generatePdf } from "@/utils/print";
import { FormField } from "./FormField";
import { PrintDocument } from "./PrintDocument";

export function ServiceForm() {
  const [sheet, setSheet] = useState<ServiceSheet>(EMPTY_SHEET);
  const [hydrated, setHydrated] = useState(false);

  // Carrega o rascunho salvo apenas no cliente (evita mismatch de hidratação).
  useEffect(() => {
    setSheet(loadSheet());
    setHydrated(true);
  }, []);

  // Persiste automaticamente a cada alteração.
  useEffect(() => {
    if (hydrated) saveSheet(sheet);
  }, [sheet, hydrated]);

  const update = (field: ServiceSheetField) => (value: string) =>
    setSheet((prev) => ({ ...prev, [field]: value }));

  const handleClear = () => {
    if (window.confirm("Alle Formularfelder löschen?")) {
      setSheet(EMPTY_SHEET);
      clearSheet();
    }
  };

  const handleGeneratePdf = () =>
    generatePdf(buildPdfName(sheet.cliente, sheet.data));

  return (
    <>
      {/* Formulário visível na tela */}
      <form
        className="screen-only mt-5 space-y-6"
        onSubmit={(e) => e.preventDefault()}
      >
        <Section title="Servicedaten">
          <FormField
            id="planeadaRealizacao"
            label="Geplante Durchführung"
            type="date"
            value={sheet.planeadaRealizacao}
            onChange={update("planeadaRealizacao")}
          />
          <FormField
            id="dataRealizacao"
            label="Durchführungsdatum"
            type="date"
            value={sheet.dataRealizacao}
            onChange={update("dataRealizacao")}
          />
          <FormField
            id="cliente"
            label="Kunde"
            value={sheet.cliente}
            onChange={update("cliente")}
            placeholder="Name des Kunden"
          />
          <FormField
            id="morada"
            label="Adresse"
            value={sheet.morada}
            onChange={update("morada")}
            placeholder="Straße und Hausnummer"
          />
          <FormField
            id="codigoPostalCidade"
            label="PLZ / Ort"
            value={sheet.codigoPostalCidade}
            onChange={update("codigoPostalCidade")}
            placeholder="00000 Ort"
          />
          <FormField
            id="local"
            label="Einsatzort"
            value={sheet.local}
            onChange={update("local")}
            placeholder="Ort der Durchführung"
          />
        </Section>

        <Section title="Aufgabe und Bemerkungen">
          <div className="sm:col-span-2">
            <FormField
              as="textarea"
              id="tarefa"
              label="Aufgabe"
              value={sheet.tarefa}
              onChange={update("tarefa")}
              rows={3}
            />
          </div>
          <div className="sm:col-span-2">
            <FormField
              as="textarea"
              id="observacao"
              label="Bemerkung"
              value={sheet.observacao}
              onChange={update("observacao")}
              rows={3}
            />
          </div>
          <div className="sm:col-span-2">
            <FormField
              as="textarea"
              id="informacoes"
              label="Informationen"
              value={sheet.informacoes}
              onChange={update("informacoes")}
              rows={5}
            />
          </div>
        </Section>

        <Section title="Uhrzeiten">
          <FormField
            id="von"
            label="Von"
            type="time"
            value={sheet.von}
            onChange={update("von")}
          />
          <FormField
            id="bis"
            label="Bis"
            type="time"
            value={sheet.bis}
            onChange={update("bis")}
          />
          <FormField
            id="gesamt"
            label="Gesamt"
            value={sheet.gesamt}
            onChange={update("gesamt")}
            placeholder="z. B. 3h30"
          />
          <FormField
            id="data"
            label="Datum"
            type="date"
            value={sheet.data}
            onChange={update("data")}
          />
        </Section>

        {/* Botões de ação */}
        <div className="sticky bottom-0 -mx-4 flex gap-3 border-t border-neutral-200 bg-[var(--background)]/95 px-4 py-4 backdrop-blur sm:mx-0 sm:rounded-xl sm:border sm:px-5">
          <button
            type="button"
            onClick={handleClear}
            className="flex-1 rounded-xl border border-neutral-300 bg-white px-4 py-3 font-semibold text-neutral-700 transition hover:bg-neutral-100 active:scale-[0.99]"
          >
            Löschen
          </button>
          <button
            type="button"
            onClick={handleGeneratePdf}
            className="flex-[2] rounded-xl bg-kile-copper px-4 py-3 font-semibold text-white shadow-md transition hover:bg-kile-copper/90 active:scale-[0.99]"
          >
            PDF erstellen
          </button>
        </div>
      </form>

      {/* Documento imprimível (oculto na tela) */}
      <PrintDocument sheet={sheet} />
    </>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-neutral-200 bg-white p-4 shadow-sm sm:p-6">
      <h2 className="mb-4 text-sm font-bold uppercase tracking-wide text-kile-copper">
        {title}
      </h2>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">{children}</div>
    </section>
  );
}
