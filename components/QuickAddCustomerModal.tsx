"use client";

import { useEffect, useState } from "react";
import type { Customer, CustomerAddress } from "@/lib/types";
import {
  addAddressToCustomer,
  createCustomer,
  loadCustomers,
  upsertCustomer,
} from "@/utils/customers";
import { customerAddressKey, sheetFieldsFromCustomerAddress } from "@/utils/customers-format";
import { btnPrimary, btnSecondary, inputClass, labelClass } from "./FormSelect";

type QuickAddCustomerModalProps = {
  open: boolean;
  onClose: () => void;
  onSaved: (selectKey: string, fields: ReturnType<typeof sheetFieldsFromCustomerAddress>) => void;
};

const emptyAddress = (): Omit<CustomerAddress, "id"> => ({
  street: "",
  plz: "",
  ort: "",
  einsatzort: "",
  defaultAufgabe: "",
  defaultBemerkung: "",
});

/** Modal rápido para cadastrar Kunde/endereço a partir do formulário de serviço. */
export function QuickAddCustomerModal({
  open,
  onClose,
  onSaved,
}: QuickAddCustomerModalProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [mode, setMode] = useState<"new" | "existing">("new");
  const [existingCustomerId, setExistingCustomerId] = useState("");
  const [name, setName] = useState("");
  const [address, setAddress] = useState(emptyAddress);

  useEffect(() => {
    if (open) {
      setCustomers(loadCustomers());
      setMode("new");
      setExistingCustomerId("");
      setName("");
      setAddress(emptyAddress());
    }
  }, [open]);

  if (!open) return null;

  const setField =
    (field: keyof Omit<CustomerAddress, "id">) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      setAddress((prev) => ({ ...prev, [field]: e.target.value }));

  const handleSave = () => {
    if (mode === "new") {
      if (!name.trim() || !address.street.trim()) return;
      const customer = createCustomer(name, address);
      upsertCustomer(customer);
      const savedAddress = customer.addresses[0];
      const key = customerAddressKey(customer.id, savedAddress.id);
      onSaved(key, sheetFieldsFromCustomerAddress(customer, savedAddress));
    } else {
      if (!existingCustomerId || !address.street.trim()) return;
      const updated = addAddressToCustomer(existingCustomerId, address);
      const customer = updated.find((c) => c.id === existingCustomerId);
      const savedAddress = customer?.addresses[customer.addresses.length - 1];
      if (!customer || !savedAddress) return;
      const key = customerAddressKey(customer.id, savedAddress.id);
      onSaved(key, sheetFieldsFromCustomerAddress(customer, savedAddress));
    }
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
      <div
        className="max-h-[90dvh] w-full max-w-lg overflow-y-auto rounded-2xl bg-white p-5 shadow-xl sm:p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-customer-title"
      >
        <h2
          id="quick-customer-title"
          className="text-lg font-bold text-neutral-900"
        >
          Neuer Kunde / neue Adresse
        </h2>

        <div className="mt-4 flex gap-2">
          <button
            type="button"
            onClick={() => setMode("new")}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold ${
              mode === "new"
                ? "bg-kile-copper text-white"
                : "border border-neutral-300 bg-white text-neutral-700"
            }`}
          >
            Neuer Kunde
          </button>
          <button
            type="button"
            onClick={() => setMode("existing")}
            className={`flex-1 rounded-lg px-3 py-2 text-sm font-semibold ${
              mode === "existing"
                ? "bg-kile-copper text-white"
                : "border border-neutral-300 bg-white text-neutral-700"
            }`}
          >
            Adresse hinzufügen
          </button>
        </div>

        <div className="mt-4 space-y-4">
          {mode === "new" ? (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="qc-name" className={labelClass}>
                Kunde
              </label>
              <input
                id="qc-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className={inputClass}
                placeholder="Name des Kunden"
              />
            </div>
          ) : (
            <div className="flex flex-col gap-1.5">
              <label htmlFor="qc-existing" className={labelClass}>
                Bestehender Kunde
              </label>
              <select
                id="qc-existing"
                value={existingCustomerId}
                onChange={(e) => setExistingCustomerId(e.target.value)}
                className={inputClass}
              >
                <option value="">Bitte wählen…</option>
                {customers.map((c) => (
                  <option key={c.id} value={c.id}>
                    {c.name}
                  </option>
                ))}
              </select>
            </div>
          )}

          <FieldInput
            id="qc-street"
            label="Straße"
            value={address.street}
            onChange={setField("street")}
            placeholder="Straße und Hausnummer"
          />
          <div className="grid grid-cols-2 gap-3">
            <FieldInput
              id="qc-plz"
              label="PLZ"
              value={address.plz}
              onChange={setField("plz")}
              placeholder="27576"
            />
            <FieldInput
              id="qc-ort"
              label="Ort"
              value={address.ort}
              onChange={setField("ort")}
              placeholder="Cuxhaven"
            />
          </div>
          <FieldInput
            id="qc-einsatzort"
            label="Einsatzort"
            value={address.einsatzort}
            onChange={setField("einsatzort")}
            placeholder="Ort der Durchführung"
          />
          <FieldTextarea
            id="qc-aufgabe"
            label="Aufgabe (Standard, optional)"
            value={address.defaultAufgabe ?? ""}
            onChange={setField("defaultAufgabe")}
          />
          <FieldTextarea
            id="qc-bemerkung"
            label="Bemerkung (Standard, optional)"
            value={address.defaultBemerkung ?? ""}
            onChange={setField("defaultBemerkung")}
          />
        </div>

        <div className="mt-6 flex gap-3">
          <button type="button" onClick={onClose} className={`flex-1 ${btnSecondary}`}>
            Abbrechen
          </button>
          <button type="button" onClick={handleSave} className={`flex-1 ${btnPrimary}`}>
            Speichern
          </button>
        </div>
      </div>
    </div>
  );
}

function FieldInput({
  id,
  label,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <input
        id={id}
        value={value}
        onChange={onChange}
        className={inputClass}
        placeholder={placeholder}
      />
    </div>
  );
}

function FieldTextarea({
  id,
  label,
  value,
  onChange,
}: {
  id: string;
  label: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      <textarea
        id={id}
        value={value}
        onChange={onChange}
        rows={3}
        className={`${inputClass} resize-y`}
      />
    </div>
  );
}
