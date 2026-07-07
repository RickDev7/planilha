import { COMPANY } from "@/lib/constants";
import { Logo } from "./Logo";

/** Cabeçalho da interface (tela): logo + título da empresa. */
export function AppHeader() {
  return (
    <header className="screen-only rounded-2xl bg-kile-black px-5 py-5 shadow-lg sm:px-8">
      <div className="flex flex-col items-center gap-3 text-center sm:flex-row sm:justify-between sm:text-left">
        <Logo className="h-12 w-auto sm:h-14" height={56} />
        <div>
          <h1 className="text-lg font-bold tracking-wide text-kile-copper-light sm:text-2xl">
            {COMPANY.title}
          </h1>
        </div>
      </div>
    </header>
  );
}
