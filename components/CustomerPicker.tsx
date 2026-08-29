"use client";

import { useEffect, useMemo, useState } from "react";
import type { Customer } from "@/lib/types";
import { loadCustomers } from "@/utils/customers";
import {
  customerAddressKey,
  formatAddressOptionLabel,
  parseCustomerAddressKey,
  sheetFieldsFromCustomerAddress,
} from "@/utils/customers-format";
import { FormSelect } from "./FormSelect";

const NEW_CUSTOMER_VALUE = "__new_customer__";

type CustomerPickerProps = {
  selectedKey: string;
  onSelectKey: (key: string) => void;
  onApply: (
    fields: ReturnType<typeof sheetFieldsFromCustomerAddress>,
    key: string,
  ) => void;
  onRequestNew: () => void;
  /** Incrementar para recarregar a lista após cadastro. */
  refreshToken?: number;
};

/** Seletor de Kunde/Adresse com preenchimento automático do formulário. */
export function CustomerPicker({
  selectedKey,
  onSelectKey,
  onApply,
  onRequestNew,
  refreshToken = 0,
}: CustomerPickerProps) {
  const [customers, setCustomers] = useState<Customer[]>([]);

  useEffect(() => {
    setCustomers(loadCustomers());
  }, [refreshToken]);

  const options = useMemo(() => {
    const items = customers.flatMap((customer) =>
      customer.addresses.map((address) => ({
        value: customerAddressKey(customer.id, address.id),
        label: formatAddressOptionLabel(customer.name, address),
      })),
    );
    items.sort((a, b) => a.label.localeCompare(b.label, "de"));
    items.push({ value: NEW_CUSTOMER_VALUE, label: "➕ Neuer Kunde / neue Adresse" });
    return items;
  }, [customers]);

  const handleChange = (value: string) => {
    if (value === NEW_CUSTOMER_VALUE) {
      onRequestNew();
      return;
    }
    onSelectKey(value);
    if (!value) return;

    const parsed = parseCustomerAddressKey(value);
    if (!parsed) return;

    const customer = customers.find((c) => c.id === parsed.customerId);
    const address = customer?.addresses.find((a) => a.id === parsed.addressId);
    if (!customer || !address) return;

    onApply(sheetFieldsFromCustomerAddress(customer, address), value);
  };

  return (
    <div className="sm:col-span-2">
      <FormSelect
        id="kunde-adresse-select"
        label="Kunde / Adresse"
        value={selectedKey}
        onChange={handleChange}
        options={options}
        placeholder="🔎 Kunde / Adresse wählen…"
      />
    </div>
  );
}

export { NEW_CUSTOMER_VALUE };
