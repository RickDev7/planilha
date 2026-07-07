import { AppHeader } from "@/components/AppHeader";
import { ServiceForm } from "@/components/ServiceForm";

export default function Home() {
  return (
    <main className="mx-auto min-h-dvh w-full max-w-3xl px-4 py-5 sm:px-6 sm:py-8">
      <AppHeader />
      <ServiceForm />
      <footer className="screen-only mt-8 pb-6 text-center text-xs text-neutral-400">
        KILE Gebäudereinigung · Funktioniert offline
      </footer>
    </main>
  );
}
