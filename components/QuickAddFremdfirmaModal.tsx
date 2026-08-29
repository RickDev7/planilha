"use client";

import { useEffect, useState } from "react";
import { createFremdfirma, upsertFremdfirma } from "@/utils/fremdfirmen";
import { btnPrimary, btnSecondary, inputClass, labelClass } from "./FormSelect";

type QuickAddFremdfirmaModalProps = {
  open: boolean;
  onClose: () => void;
  onSaved: (id: string, name: string) => void;
};

/** Modal rápido para cadastrar somente o nome de uma Fremdfirma. */
export function QuickAddFremdfirmaModal({
  open,
  onClose,
  onSaved,
}: QuickAddFremdfirmaModalProps) {
  const [name, setName] = useState("");

  useEffect(() => {
    if (open) setName("");
  }, [open]);

  if (!open) return null;

  const handleSave = () => {
    if (!name.trim()) return;
    const record = createFremdfirma(name);
    upsertFremdfirma(record);
    onSaved(record.id, record.name);
    onClose();
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-black/40 p-4 sm:items-center">
      <div
        className="w-full max-w-md rounded-2xl bg-white p-5 shadow-xl sm:p-6"
        role="dialog"
        aria-modal="true"
        aria-labelledby="quick-fremdfirma-title"
      >
        <h2
          id="quick-fremdfirma-title"
          className="text-lg font-bold text-neutral-900"
        >
          Neue Fremdfirma
        </h2>
        <div className="mt-4 flex flex-col gap-1.5">
          <label htmlFor="qf-name" className={labelClass}>
            Firmenname
          </label>
          <input
            id="qf-name"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className={inputClass}
            placeholder="z. B. Müller Gebäudeservice GmbH"
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
