import { Logo } from "./Logo";

/** Cabeçalho da interface (tela): apenas o logo da empresa. */
export function AppHeader() {
  return (
    <header className="screen-only flex justify-center rounded-2xl bg-kile-black px-5 py-6 shadow-lg sm:px-8">
      <Logo className="h-14 w-auto sm:h-16" height={64} />
    </header>
  );
}
