"use client";

import { useEffect, useState } from "react";
import { EMPTY_SHEET } from "@/lib/constants";
import type { ServiceSheet, ServiceSheetField } from "@/lib/types";
import {
  clearSheet,
  clearSignature,
  loadSheet,
  loadSignature,
  saveSheet,
  saveSignature,
} from "@/utils/storage";
import { buildPdfName, generatePdf } from "@/utils/print";
import { computeDuration } from "@/utils/format";
import { FormField } from "./FormField";
import { SignaturePad } from "./SignaturePad";
import { PrintDocument } from "./PrintDocument";
import { CustomerPicker } from "./CustomerPicker";
import { FremdfirmaPicker } from "./FremdfirmaPicker";
import { QuickAddCustomerModal } from "./QuickAddCustomerModal";
import { QuickAddFremdfirmaModal } from "./QuickAddFremdfirmaModal";
import { sheetFieldsFromCustomerAddress } from "@/utils/customers-format";

export function ServiceForm() {
  const [sheet, setSheet] = useState<ServiceSheet>(EMPTY_SHEET);
  const [hydrated, setHydrated] = useState(false);
  const [signatureSaved, setSignatureSaved] = useState(false);
  const [selectedCustomerKey, setSelectedCustomerKey] = useState("");
  const [selectedFremdfirmaId, setSelectedFremdfirmaId] = useState("");
  const [customerRefresh, setCustomerRefresh] = useState(0);
  const [fremdfirmaRefresh, setFremdfirmaRefresh] = useState(0);
  const [showCustomerModal, setShowCustomerModal] = useState(false);
  const [showFremdfirmaModal, setShowFremdfirmaModal] = useState(false);

  useEffect(() => {
    const savedSignature = loadSignature();
    setSheet({ ...loadSheet(), assinatura: savedSignature });
    setSignatureSaved(Boolean(savedSignature));
    setHydrated(true);
  }, []);

  useEffect(() => {
    if (hydrated) saveSheet(sheet);
  }, [sheet, hydrated]);

  const update = (field: ServiceSheetField) => (value: string) =>
    setSheet((prev) => {
      const next = { ...prev, [field]: value };
      if (field === "von" || field === "bis") {
        next.gesamt = computeDuration(next.von, next.bis);
      }
      return next;
    });

  const updateWithCustomerClear =
    (
      field:
        | "cliente"
        | "morada"
        | "codigoPostalCidade"
        | "local"
        | "tarefa"
        | "observacao",
    ) =>
    (value: string) => {
      setSelectedCustomerKey("");
      update(field)(value);
    };

  const updateFremdfirmaField = (value: string) => {
    setSelectedFremdfirmaId("");
    update("fremdfirma")(value);
  };

  const applyCustomerFields = (
    fields: ReturnType<typeof sheetFieldsFromCustomerAddress>,
    key: string,
  ) => {
    setSelectedCustomerKey(key);
    setSheet((prev) => ({
      ...prev,
      ...fields,
      gesamt: prev.gesamt,
      assinatura: prev.assinatura,
    }));
  };

  const applyFremdfirma = (name: string, id: string) => {
    setSelectedFremdfirmaId(id);
    update("fremdfirma")(name);
  };

  const handleClear = () => {
    if (window.confirm("Alle Formularfelder löschen?")) {
      setSelectedCustomerKey("");
      setSelectedFremdfirmaId("");
      setSheet({ ...EMPTY_SHEET, assinatura: loadSignature() });
      clearSheet();
    }
  };

  const handleSaveSignature = () => {
    if (!sheet.assinatura) return;
    saveSignature(sheet.assinatura);
    setSignatureSaved(true);
  };

  const handleClearSavedSignature = () => {
    clearSignature();
    setSignatureSaved(false);
    setSheet((prev) => ({ ...prev, assinatura: "" }));
  };

  const handleGeneratePdf = () =>
    generatePdf(buildPdfName(sheet.cliente, sheet.data));

  return (
    <>
      <form
        className="screen-only mt-5 space-y-6"
        onSubmit={(e) => e.preventDefault()}
      >
        <Section title="Servicedaten">
          <CustomerPicker
            selectedKey={selectedCustomerKey}
            onSelectKey={setSelectedCustomerKey}
            onApply={applyCustomerFields}
            onRequestNew={() => setShowCustomerModal(true)}
            refreshToken={customerRefresh}
          />
          <FormField
            id="responsavel"
            label="Objektleiter / Hausmeister"
            value={sheet.responsavel}
            onChange={update("responsavel")}
            placeholder="Name"
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
            onChange={updateWithCustomerClear("cliente")}
            placeholder="Name des Kunden"
          />
          <FormField
            id="morada"
            label="Adresse"
            value={sheet.morada}
            onChange={updateWithCustomerClear("morada")}
            placeholder="Straße und Hausnummer"
          />
          <FormField
            id="codigoPostalCidade"
            label="PLZ / Ort"
            value={sheet.codigoPostalCidade}
            onChange={updateWithCustomerClear("codigoPostalCidade")}
            placeholder="00000 Ort"
          />
          <FormField
            id="local"
            label="Einsatzort"
            value={sheet.local}
            onChange={updateWithCustomerClear("local")}
            placeholder="Ort der Durchführung"
          />
          <FremdfirmaPicker
            selectedId={selectedFremdfirmaId}
            onSelectId={setSelectedFremdfirmaId}
            onApply={applyFremdfirma}
            onRequestNew={() => setShowFremdfirmaModal(true)}
            refreshToken={fremdfirmaRefresh}
          />
          <FormField
            id="fremdfirma"
            label="Fremdfirma"
            value={sheet.fremdfirma}
            onChange={updateFremdfirmaField}
            placeholder="Name der Fremdfirma"
          />
          <FormField
            id="fremdpersonalAnzahl"
            label="Eingesetztes Fremdpersonal"
            type="number"
            value={sheet.fremdpersonalAnzahl}
            onChange={update("fremdpersonalAnzahl")}
            placeholder="Personen"
          />
        </Section>

        <Section title="Aufgabe und Bemerkungen">
          <div className="sm:col-span-2">
            <FormField
              as="textarea"
              id="tarefa"
              label="Aufgabe"
              value={sheet.tarefa}
              onChange={updateWithCustomerClear("tarefa")}
              rows={5}
            />
          </div>
          <div className="sm:col-span-2">
            <FormField
              as="textarea"
              id="observacao"
              label="Bemerkung"
              value={sheet.observacao}
              onChange={updateWithCustomerClear("observacao")}
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
            placeholder="automatisch"
            readOnly
          />
          <FormField
            id="data"
            label="Datum"
            type="date"
            value={sheet.data}
            onChange={update("data")}
          />
        </Section>

        <Section title="Unterschrift">
          <div className="sm:col-span-2">
            <SignaturePad
              value={sheet.assinatura}
              onChange={update("assinatura")}
              onSave={handleSaveSignature}
              onClearSaved={handleClearSavedSignature}
              saved={signatureSaved}
            />
          </div>
        </Section>

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

      <QuickAddCustomerModal
        open={showCustomerModal}
        onClose={() => setShowCustomerModal(false)}
        onSaved={(key, fields) => {
          setCustomerRefresh((n) => n + 1);
          applyCustomerFields(fields, key);
        }}
      />
      <QuickAddFremdfirmaModal
        open={showFremdfirmaModal}
        onClose={() => setShowFremdfirmaModal(false)}
        onSaved={(id, name) => {
          setFremdfirmaRefresh((n) => n + 1);
          applyFremdfirma(name, id);
        }}
      />

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
