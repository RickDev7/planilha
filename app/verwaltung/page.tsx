"use client";

import Link from "next/link";
import { useState } from "react";
import { AppHeader } from "@/components/AppHeader";
import { CustomerManager } from "@/components/admin/CustomerManager";
import { FremdfirmaManager } from "@/components/admin/FremdfirmaManager";

type Tab = "customers" | "fremdfirmen";

export default function VerwaltungPage() {
  const [tab, setTab] = useState<Tab>("customers");

  return (
    <main className="mx-auto min-h-dvh w-full max-w-3xl px-4 py-5 sm:px-6 sm:py-8">
      <AppHeader />
      <div className="screen-only mt-5 space-y-5">
        <div className="flex items-center justify-between gap-3">
          <h1 className="text-xl font-bold text-neutral-900">Verwaltung</h1>
          <Link
            href="/"
            className="rounded-lg border border-neutral-300 bg-white px-3 py-2 text-sm font-semibold text-neutral-700 transition hover:bg-neutral-100"
          >
            ← Serviceblatt
          </Link>
        </div>

        <div className="flex gap-2 rounded-xl border border-neutral-200 bg-white p-1">
          <TabButton
            active={tab === "customers"}
            onClick={() => setTab("customers")}
          >
            Kunden / Adressen
          </TabButton>
          <TabButton
            active={tab === "fremdfirmen"}
            onClick={() => setTab("fremdfirmen")}
          >
            Fremdfirmen
          </TabButton>
        </div>

        {tab === "customers" ? <CustomerManager /> : <FremdfirmaManager />}
      </div>
      <footer className="screen-only mt-8 pb-6 text-center text-xs text-neutral-400">
        KILE Gebäudereinigung · Funktioniert offline
      </footer>
    </main>
  );
}

function TabButton({
  active,
  onClick,
  children,
}: {
  active: boolean;
  onClick: () => void;
  children: React.ReactNode;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={`flex-1 rounded-lg px-3 py-2.5 text-sm font-semibold transition ${
        active
          ? "bg-kile-copper text-white shadow-sm"
          : "text-neutral-600 hover:bg-neutral-50"
      }`}
    >
      {children}
    </button>
  );
}
