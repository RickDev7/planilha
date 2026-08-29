"use client";

import { useEffect, useMemo, useState } from "react";
import { loadFremdfirmen } from "@/utils/fremdfirmen";
import { FormSelect } from "./FormSelect";

export const NONE_FREMDFIRMA = "__none__";
export const NEW_FREMDFIRMA = "__new_fremdfirma__";

type FremdfirmaPickerProps = {
  selectedId: string;
  onSelectId: (id: string) => void;
  onApply: (name: string, id: string) => void;
  onRequestNew: () => void;
  refreshToken?: number;
};

/** Seletor de Fremdfirma com opção "Keine Fremdfirma". */
export function FremdfirmaPicker({
  selectedId,
  onSelectId,
  onApply,
  onRequestNew,
  refreshToken = 0,
}: FremdfirmaPickerProps) {
  const [records, setRecords] = useState(loadFremdfirmen);

  useEffect(() => {
    setRecords(loadFremdfirmen());
  }, [refreshToken]);

  const options = useMemo(() => {
    const items = records
      .map((r) => ({ value: r.id, label: r.name }))
      .sort((a, b) => a.label.localeCompare(b.label, "de"));
    return [
      { value: NONE_FREMDFIRMA, label: "Keine Fremdfirma" },
      ...items,
      { value: NEW_FREMDFIRMA, label: "➕ Neue Fremdfirma" },
    ];
  }, [records]);

  const handleChange = (value: string) => {
    if (value === NEW_FREMDFIRMA) {
      onRequestNew();
      return;
    }
    onSelectId(value);
    if (value === NONE_FREMDFIRMA || !value) {
      onApply("", NONE_FREMDFIRMA);
      return;
    }
    const record = records.find((r) => r.id === value);
    if (record) onApply(record.name, value);
  };

  return (
    <div className="sm:col-span-2">
      <FormSelect
        id="fremdfirma-select"
        label="Fremdfirma"
        value={selectedId}
        onChange={handleChange}
        options={options}
        placeholder="Fremdfirma wählen…"
      />
    </div>
  );
}
