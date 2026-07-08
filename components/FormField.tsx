import type { ChangeEvent } from "react";

type BaseProps = {
  id: string;
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

type InputProps = BaseProps & {
  as?: "input";
  type?: "text" | "date" | "time" | "number";
  /** Campo calculado/somente leitura (ex: total de horas). */
  readOnly?: boolean;
};

type TextareaProps = BaseProps & {
  as: "textarea";
  rows?: number;
};

type FormFieldProps = InputProps | TextareaProps;

const fieldClass =
  "w-full rounded-lg border border-neutral-300 bg-white px-3 py-2.5 text-neutral-900 " +
  "shadow-sm outline-none transition focus:border-kile-copper focus:ring-2 focus:ring-kile-copper/30 " +
  "placeholder:text-neutral-400";

/** Campo de formulário reutilizável (input ou textarea) com rótulo. */
export function FormField(props: FormFieldProps) {
  const { id, label, value, onChange, placeholder } = props;

  const handleChange = (
    e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>,
  ) => onChange(e.target.value);

  return (
    <div className="flex flex-col gap-1.5">
      <label
        htmlFor={id}
        className="text-xs font-semibold uppercase tracking-wide text-neutral-600"
      >
        {label}
      </label>
      {props.as === "textarea" ? (
        <textarea
          id={id}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          rows={props.rows ?? 3}
          className={`${fieldClass} resize-y`}
        />
      ) : (
        <input
          id={id}
          type={props.type ?? "text"}
          value={value}
          onChange={handleChange}
          placeholder={placeholder}
          readOnly={props.readOnly}
          className={`${fieldClass} ${
            props.readOnly ? "cursor-default bg-neutral-100 text-neutral-700" : ""
          }`}
        />
      )}
    </div>
  );
}
