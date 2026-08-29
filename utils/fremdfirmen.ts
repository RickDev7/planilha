import { FREMDFIRMEN_STORAGE_KEY } from "@/lib/constants";
import { generateId } from "@/lib/id";
import type { FremdfirmaRecord } from "@/lib/types";

function readFremdfirmen(): FremdfirmaRecord[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(FREMDFIRMEN_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as FremdfirmaRecord[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeFremdfirmen(records: FremdfirmaRecord[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(FREMDFIRMEN_STORAGE_KEY, JSON.stringify(records));
  } catch {
    // ignora
  }
}

export function loadFremdfirmen(): FremdfirmaRecord[] {
  return readFremdfirmen();
}

export function saveFremdfirmen(records: FremdfirmaRecord[]): void {
  writeFremdfirmen(records);
}

export function upsertFremdfirma(record: FremdfirmaRecord): FremdfirmaRecord[] {
  const records = readFremdfirmen();
  const index = records.findIndex((r) => r.id === record.id);
  if (index >= 0) records[index] = record;
  else records.push(record);
  writeFremdfirmen(records);
  return records;
}

export function createFremdfirma(name: string): FremdfirmaRecord {
  return { id: generateId(), name: name.trim() };
}

export function deleteFremdfirma(id: string): FremdfirmaRecord[] {
  const records = readFremdfirmen().filter((r) => r.id !== id);
  writeFremdfirmen(records);
  return records;
}

export function searchFremdfirmen(
  records: FremdfirmaRecord[],
  query: string,
): FremdfirmaRecord[] {
  const q = query.trim().toLowerCase();
  if (!q) return records;
  return records.filter((r) => r.name.toLowerCase().includes(q));
}
