import type { Customer, CustomerAddress } from "@/lib/types";

/** Combina PLZ e Ort no formato usado pelo formulário/PDF. */
export function formatPlzOrt(plz: string, ort: string): string {
  return [plz.trim(), ort.trim()].filter(Boolean).join(" ");
}

/** Rótulo legível para um endereço na lista de seleção. */
export function formatAddressOptionLabel(
  customerName: string,
  address: CustomerAddress,
): string {
  const location = formatPlzOrt(address.plz, address.ort);
  const parts = [customerName, address.street];
  if (location) parts.push(location);
  if (address.einsatzort) parts.push(`(${address.einsatzort})`);
  return parts.join(" — ");
}

/** Chave composta usada nos seletores (customerId:addressId). */
export function customerAddressKey(customerId: string, addressId: string): string {
  return `${customerId}:${addressId}`;
}

/** Separa a chave composta em IDs. */
export function parseCustomerAddressKey(key: string): {
  customerId: string;
  addressId: string;
} | null {
  const [customerId, addressId] = key.split(":");
  if (!customerId || !addressId) return null;
  return { customerId, addressId };
}

/** Preenche os campos da folha a partir de um cliente/endereço cadastrados. */
export function sheetFieldsFromCustomerAddress(
  customer: Customer,
  address: CustomerAddress,
): Pick<
  import("@/lib/types").ServiceSheet,
  "cliente" | "morada" | "codigoPostalCidade" | "local" | "tarefa" | "observacao"
> {
  return {
    cliente: customer.name,
    morada: address.street,
    codigoPostalCidade: formatPlzOrt(address.plz, address.ort),
    local: address.einsatzort,
    tarefa: address.defaultAufgabe ?? "",
    observacao: address.defaultBemerkung ?? "",
  };
}
