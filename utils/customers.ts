import { CUSTOMERS_STORAGE_KEY } from "@/lib/constants";
import { generateId } from "@/lib/id";
import type { Customer, CustomerAddress } from "@/lib/types";

function readCustomers(): Customer[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(CUSTOMERS_STORAGE_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw) as Customer[];
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}

function writeCustomers(customers: Customer[]): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(CUSTOMERS_STORAGE_KEY, JSON.stringify(customers));
  } catch {
    // ignora (modo privado, quota)
  }
}

export function loadCustomers(): Customer[] {
  return readCustomers();
}

export function saveCustomers(customers: Customer[]): void {
  writeCustomers(customers);
}

export function findCustomerAddress(
  customers: Customer[],
  customerId: string,
  addressId: string,
): { customer: Customer; address: CustomerAddress } | null {
  const customer = customers.find((c) => c.id === customerId);
  if (!customer) return null;
  const address = customer.addresses.find((a) => a.id === addressId);
  if (!address) return null;
  return { customer, address };
}

export function upsertCustomer(customer: Customer): Customer[] {
  const customers = readCustomers();
  const index = customers.findIndex((c) => c.id === customer.id);
  if (index >= 0) customers[index] = customer;
  else customers.push(customer);
  writeCustomers(customers);
  return customers;
}

export function deleteCustomer(customerId: string): Customer[] {
  const customers = readCustomers().filter((c) => c.id !== customerId);
  writeCustomers(customers);
  return customers;
}

export function createCustomer(name: string, address: Omit<CustomerAddress, "id">): Customer {
  return {
    id: generateId(),
    name: name.trim(),
    addresses: [{ ...address, id: generateId() }],
  };
}

export function addAddressToCustomer(
  customerId: string,
  address: Omit<CustomerAddress, "id">,
): Customer[] {
  const customers = readCustomers();
  const customer = customers.find((c) => c.id === customerId);
  if (!customer) return customers;
  customer.addresses.push({ ...address, id: generateId() });
  writeCustomers(customers);
  return customers;
}

export function updateAddressInCustomer(
  customerId: string,
  address: CustomerAddress,
): Customer[] {
  const customers = readCustomers();
  const customer = customers.find((c) => c.id === customerId);
  if (!customer) return customers;
  const index = customer.addresses.findIndex((a) => a.id === address.id);
  if (index >= 0) customer.addresses[index] = address;
  writeCustomers(customers);
  return customers;
}

export function deleteAddressFromCustomer(
  customerId: string,
  addressId: string,
): Customer[] {
  const customers = readCustomers();
  const customer = customers.find((c) => c.id === customerId);
  if (!customer) return customers;
  customer.addresses = customer.addresses.filter((a) => a.id !== addressId);
  if (customer.addresses.length === 0) {
    return deleteCustomer(customerId);
  }
  writeCustomers(customers);
  return customers;
}

export function searchCustomers(customers: Customer[], query: string): Customer[] {
  const q = query.trim().toLowerCase();
  if (!q) return customers;
  return customers.filter((customer) => {
    if (customer.name.toLowerCase().includes(q)) return true;
    return customer.addresses.some(
      (a) =>
        a.street.toLowerCase().includes(q) ||
        a.plz.toLowerCase().includes(q) ||
        a.ort.toLowerCase().includes(q) ||
        a.einsatzort.toLowerCase().includes(q),
    );
  });
}
