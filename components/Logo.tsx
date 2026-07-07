interface LogoProps {
  className?: string;
  /** Altura em pixels (tela). No PDF a altura é controlada por CSS. */
  height?: number;
}

/**
 * Logotipo da empresa. Usa <img> simples (sem otimização de servidor)
 * para funcionar offline e no documento de impressão.
 */
export function Logo({ className, height = 56 }: LogoProps) {
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src="/logo.png"
      alt="KILE Gebäudereinigung"
      height={height}
      style={{ height }}
      className={className}
    />
  );
}
