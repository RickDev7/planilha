"use client";

import { useMemo, useState } from "react";
import { generateId } from "@/lib/id";
import type { FremdfirmaRecord } from "@/lib/types";
import {
  deleteFremdfirma,
  loadFremdfirmen,
  saveFremdfirmen,
  searchFremdfirmen,
  upsertFremdfirma,
} from "@/utils/fremdfirmen";
import {
  btnDanger,
  btnPrimary,
  btnSecondary,
  inputClass,
  labelClass,
} from "../FormSelect";

/** CRUD simples de Fremdfirmen (somente nome). */
export function FremdfirmaManager() {
  const [records, setRecords] = useState<FremdfirmaRecord[]>(() =>
    loadFremdfirmen(),
  );
  const [query, setQuery] = useState("");
  const [editing, setEditing] = useState<FremdfirmaRecord | null>(null);

  const filtered = useMemo(
    () => searchFremdfirmen(records, query),
    [records, query],
  );

  const refresh = (next: FremdfirmaRecord[]) => {
    saveFremdfirmen(next);
    setRecords(next);
  };

  const startNew = () => setEditing({ id: generateId(), name: "" });

  const saveForm = () => {
    if (!editing || !editing.name.trim()) return;
    refresh(
      upsertFremdfirma({ ...editing, name: editing.name.trim() }),
    );
    setEditing(null);
  };

  const handleDelete = (id: string) => {
    if (!window.confirm("Fremdfirma löschen?")) return;
    refresh(deleteFremdfirma(id));
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
        <button type="button" onClick={startNew} className={btnPrimary}>
          + Neue Fremdfirma
        </button>
      </div>

      {editing && (
        <div className="space-y-3 rounded-xl border border-kile-copper/30 bg-kile-copper/5 p-4">
          <div className="flex flex-col gap-1.5">
            <label htmlFor="ef-name" className={labelClass}>
              Firmenname
            </label>
            <input
              id="ef-name"
              value={editing.name}
              onChange={(e) => setEditing({ ...editing, name: e.target.value })}
              className={inputClass}
              placeholder="z. B. Müller Gebäudeservice GmbH"
            />
          </div>
          <div className="flex gap-2">
            <button type="button" onClick={saveForm} className={btnPrimary}>
              Speichern
            </button>
            <button
              type="button"
              onClick={() => setEditing(null)}
              className={btnSecondary}
            >
              Abbrechen
            </button>
          </div>
        </div>
      )}

      {filtered.length === 0 ? (
        <p className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 px-4 py-8 text-center text-sm text-neutral-500">
          Keine Fremdfirmen gespeichert.
        </p>
      ) : (
        <ul className="space-y-2">
          {filtered.map((record) => (
            <li
              key={record.id}
              className="flex flex-wrap items-center justify-between gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-3 shadow-sm"
            >
              <span className="font-medium text-neutral-900">{record.name}</span>
              <div className="flex gap-2">
                <button
                  type="button"
                  onClick={() => setEditing({ ...record })}
                  className={btnSecondary}
                >
                  Bearbeiten
                </button>
                <button
                  type="button"
                  onClick={() => handleDelete(record.id)}
                  className={btnDanger}
                >
                  Löschen
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
