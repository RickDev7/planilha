"use client";

import { useMemo, useState } from "react";
import { generateId } from "@/lib/id";
import type { Customer, CustomerAddress } from "@/lib/types";
import {
  deleteAddressFromCustomer,
  deleteCustomer,
  loadCustomers,
  saveCustomers,
  searchCustomers,
  upsertCustomer,
} from "@/utils/customers";
import { formatPlzOrt } from "@/utils/customers-format";
import {
  btnDanger,
  btnPrimary,
  btnSecondary,
  inputClass,
  labelClass,
} from "../FormSelect";

const emptyAddress = (): CustomerAddress => ({
  id: generateId(),
  street: "",
  plz: "",
  ort: "",
  einsatzort: "",
  defaultAufgabe: "",
  defaultBemerkung: "",
});

/** CRUD de Kunden und Adressen. */
export function CustomerManager() {
  const [customers, setCustomers] = useState<Customer[]>(() => loadCustomers());
  const [query, setQuery] = useState("");
  const [editingCustomer, setEditingCustomer] = useState<Customer | null>(null);
  const [editingAddress, setEditingAddress] = useState<{
    customerId: string;
    address: CustomerAddress;
  } | null>(null);

  const filtered = useMemo(
    () => searchCustomers(customers, query),
    [customers, query],
  );

  const refresh = (next: Customer[]) => {
    saveCustomers(next);
    setCustomers(next);
  };

  const startNewCustomer = () => {
    setEditingCustomer({
      id: generateId(),
      name: "",
      addresses: [emptyAddress()],
    });
    setEditingAddress(null);
  };

  const startEditCustomer = (customer: Customer) => {
    setEditingCustomer({ ...customer });
    setEditingAddress(null);
  };

  const startNewAddress = (customerId: string) => {
    setEditingAddress({ customerId, address: emptyAddress() });
    setEditingCustomer(null);
  };

  const startEditAddress = (customerId: string, address: CustomerAddress) => {
    setEditingAddress({ customerId, address: { ...address } });
    setEditingCustomer(null);
  };

  const saveCustomerForm = () => {
    if (!editingCustomer || !editingCustomer.name.trim()) return;
    const normalized: Customer = {
      ...editingCustomer,
      name: editingCustomer.name.trim(),
      addresses: editingCustomer.addresses.filter((a) => a.street.trim()),
    };
    if (normalized.addresses.length === 0) {
      normalized.addresses = [emptyAddress()];
    }
    refresh(upsertCustomer(normalized));
    setEditingCustomer(null);
  };

  const saveAddressForm = () => {
    if (!editingAddress || !editingAddress.address.street.trim()) return;
    const customersCopy = loadCustomers();
    const customer = customersCopy.find((c) => c.id === editingAddress.customerId);
    if (!customer) return;
    const idx = customer.addresses.findIndex((a) => a.id === editingAddress.address.id);
    const addr = {
      ...editingAddress.address,
      street: editingAddress.address.street.trim(),
    };
    if (idx >= 0) customer.addresses[idx] = addr;
    else customer.addresses.push(addr);
    refresh(customersCopy);
    setEditingAddress(null);
  };

  const handleDeleteCustomer = (customerId: string) => {
    if (!window.confirm("Kunde und alle Adressen löschen?")) return;
    refresh(deleteCustomer(customerId));
  };

  const handleDeleteAddress = (customerId: string, addressId: string) => {
    if (!window.confirm("Adresse löschen?")) return;
    refresh(deleteAddressFromCustomer(customerId, addressId));
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
        <input
          type="search"
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Suchen…"
          className={inputClass}
        />
        <button type="button" onClick={startNewCustomer} className={btnPrimary}>
          + Neuer Kunde
        </button>
      </div>

      {editingCustomer && (
        <EditorCard title="Kunde bearbeiten">
          <Field label="Kunde" id="ec-name">
            <input
              id="ec-name"
              value={editingCustomer.name}
              onChange={(e) =>
                setEditingCustomer({ ...editingCustomer, name: e.target.value })
              }
              className={inputClass}
            />
          </Field>
          <p className="text-xs text-neutral-500">
            Beim Anlegen eines neuen Kunden wird mindestens eine Adresse benötigt.
          </p>
          {editingCustomer.addresses.map((address, index) => (
            <AddressFields
              key={address.id}
              prefix={`ec-${index}`}
              address={address}
              onChange={(next) => {
                const addresses = [...editingCustomer.addresses];
                addresses[index] = next;
                setEditingCustomer({ ...editingCustomer, addresses });
              }}
            />
          ))}
          <div className="flex gap-2">
            <button
              type="button"
              onClick={() =>
                setEditingCustomer({
                  ...editingCustomer,
                  addresses: [...editingCustomer.addresses, emptyAddress()],
                })
              }
              className={btnSecondary}
            >
              + Adresse
            </button>
            <button type="button" onClick={saveCustomerForm} className={btnPrimary}>
              Speichern
            </button>
            <button
              type="button"
              onClick={() => setEditingCustomer(null)}
              className={btnSecondary}
            >
              Abbrechen
            </button>
          </div>
        </EditorCard>
      )}

      {editingAddress && (
        <EditorCard title="Adresse bearbeiten">
          <AddressFields
            prefix="ea"
            address={editingAddress.address}
            onChange={(next) =>
              setEditingAddress({ ...editingAddress, address: next })
            }
          />
          <div className="flex gap-2">
            <button type="button" onClick={saveAddressForm} className={btnPrimary}>
              Speichern
            </button>
            <button
              type="button"
              onClick={() => setEditingAddress(null)}
              className={btnSecondary}
            >
              Abbrechen
            </button>
          </div>
        </EditorCard>
      )}

      {filtered.length === 0 ? (
        <p className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 px-4 py-8 text-center text-sm text-neutral-500">
          Keine Kunden gespeichert.
        </p>
      ) : (
        <ul className="space-y-3">
          {filtered.map((customer) => (
            <li
              key={customer.id}
              className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm"
            >
              <div className="flex flex-wrap items-start justify-between gap-2">
                <div>
                  <h3 className="font-semibold text-neutral-900">{customer.name}</h3>
                  <p className="text-xs text-neutral-500">
                    {customer.addresses.length} Adresse(n)
                  </p>
                </div>
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => startEditCustomer(customer)}
                    className={btnSecondary}
                  >
                    Bearbeiten
                  </button>
                  <button
                    type="button"
                    onClick={() => startNewAddress(customer.id)}
                    className={btnSecondary}
                  >
                    + Adresse
                  </button>
                  <button
                    type="button"
                    onClick={() => handleDeleteCustomer(customer.id)}
                    className={btnDanger}
                  >
                    Löschen
                  </button>
                </div>
              </div>
              <ul className="mt-3 space-y-2 border-t border-neutral-100 pt-3">
                {customer.addresses.map((address) => (
                  <li
                    key={address.id}
                    className="flex flex-wrap items-start justify-between gap-2 rounded-lg bg-neutral-50 px-3 py-2 text-sm"
                  >
                    <div>
                      <p className="font-medium text-neutral-800">{address.street}</p>
                      <p className="text-neutral-600">
                        {formatPlzOrt(address.plz, address.ort)}
                        {address.einsatzort ? ` · ${address.einsatzort}` : ""}
                      </p>
                    </div>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={() => startEditAddress(customer.id, address)}
                        className="text-xs font-semibold text-kile-copper"
                      >
                        Bearbeiten
                      </button>
                      <button
                        type="button"
                        onClick={() =>
                          handleDeleteAddress(customer.id, address.id)
                        }
                        className="text-xs font-semibold text-red-600"
                      >
                        Löschen
                      </button>
                    </div>
                  </li>
                ))}
              </ul>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}

function EditorCard({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-4 rounded-xl border border-kile-copper/30 bg-kile-copper/5 p-4">
      <h3 className="font-semibold text-neutral-900">{title}</h3>
      {children}
    </div>
  );
}

function Field({
  label,
  id,
  children,
}: {
  label: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-1.5">
      <label htmlFor={id} className={labelClass}>
        {label}
      </label>
      {children}
    </div>
  );
}

function AddressFields({
  prefix,
  address,
  onChange,
}: {
  prefix: string;
  address: CustomerAddress;
  onChange: (address: CustomerAddress) => void;
}) {
  const set =
    (field: keyof CustomerAddress) =>
    (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) =>
      onChange({ ...address, [field]: e.target.value });

  return (
    <div className="space-y-3 rounded-lg border border-neutral-200 bg-white p-3">
      <Field label="Straße" id={`${prefix}-street`}>
        <input
          id={`${prefix}-street`}
          value={address.street}
          onChange={set("street")}
          className={inputClass}
        />
      </Field>
      <div className="grid grid-cols-2 gap-3">
        <Field label="PLZ" id={`${prefix}-plz`}>
          <input
            id={`${prefix}-plz`}
            value={address.plz}
            onChange={set("plz")}
            className={inputClass}
          />
        </Field>
        <Field label="Ort" id={`${prefix}-ort`}>
          <input
            id={`${prefix}-ort`}
            value={address.ort}
            onChange={set("ort")}
            className={inputClass}
          />
        </Field>
      </div>
      <Field label="Einsatzort" id={`${prefix}-einsatzort`}>
        <input
          id={`${prefix}-einsatzort`}
          value={address.einsatzort}
          onChange={set("einsatzort")}
          className={inputClass}
        />
      </Field>
      <Field label="Aufgabe (Standard)" id={`${prefix}-aufgabe`}>
        <textarea
          id={`${prefix}-aufgabe`}
          value={address.defaultAufgabe ?? ""}
          onChange={set("defaultAufgabe")}
          rows={2}
          className={`${inputClass} resize-y`}
        />
      </Field>
      <Field label="Bemerkung (Standard)" id={`${prefix}-bemerkung`}>
        <textarea
          id={`${prefix}-bemerkung`}
          value={address.defaultBemerkung ?? ""}
          onChange={set("defaultBemerkung")}
          rows={2}
          className={`${inputClass} resize-y`}
        />
      </Field>
    </div>
  );
}
