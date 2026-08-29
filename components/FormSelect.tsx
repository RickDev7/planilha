import type { ChangeEvent } from "react";

export type SelectOption = {
  value: string;
  label: string;
};

const fieldClass =
  "w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-neutral-900 " +
  "shadow-sm outline-none transition focus:border-kile-copper focus:ring-2 focus:ring-kile-copper/30";

type FormSelectProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
};

/** Campo select reutilizável com o mesmo estilo do FormField. */
export function FormSelect({
  id,
  label,
  value,
  onChange,
  options,
  placeholder = "Bitte wählen…",
}: FormSelectProps) {
  const handleChange = (e: ChangeEvent<HTMLSelectElement>) =>
    onChange(e.target.value);

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-xs font-semibold uppercase tracking-wide text-neutral-600"
      >
        {label}
      </label>
      <select
        id={id}
        value={value}
        onChange={handleChange}
        className={fieldClass}
      >
        <option value="">{placeholder}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  );
}

export const inputClass =
  "w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-neutral-900 " +
  "shadow-sm outline-none transition focus:border-kile-copper focus:ring-2 focus:ring-kile-copper/30 " +
  "placeholder:text-neutral-400";

export const labelClass =
  "text-xs font-semibold uppercase tracking-wide text-neutral-600";

export const btnPrimary =
  "rounded-xl bg-kile-copper px-4 py-2.5 font-semibold text-white transition hover:bg-kile-copper/90 active:scale-[0.99]";

export const btnSecondary =
  "rounded-xl border border-neutral-300 bg-white px-4 py-2.5 font-semibold text-neutral-700 transition hover:bg-neutral-100 active:scale-[0.99]";

export const btnDanger =
  "rounded-xl border border-red-200 bg-white px-3 py-2 text-sm font-semibold text-red-600 transition hover:bg-red-50";
