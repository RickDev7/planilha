import Link from "next/link";
import { Logo } from "./Logo";

/** Cabeçalho da interface (tela): logo + navegação. */
export function AppHeader() {
  return (
    <header className="screen-only rounded-2xl bg-kile-black px-5 py-5 shadow-lg sm:px-8">
      <div className="flex flex-col items-center gap-4 sm:flex-row sm:justify-between">
        <Logo className="h-14 w-auto sm:h-16" height={64} />
        <nav className="flex gap-2 text-sm">
          <Link
            href="/"
            className="rounded-lg px-3 py-2 font-semibold text-white/90 transition hover:bg-white/10 hover:text-white"
          >
            Serviceblatt
          </Link>
          <Link
            href="/verwaltung"
            className="rounded-lg px-3 py-2 font-semibold text-white/90 transition hover:bg-white/10 hover:text-white"
          >
            Verwaltung
          </Link>
        </nav>
      </div>
    </header>
  );
}
