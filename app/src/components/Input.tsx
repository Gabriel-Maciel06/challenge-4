import React, { useId } from "react";

type InputProps = Omit<
  React.InputHTMLAttributes<HTMLInputElement>,
  "ref"
> & {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  containerClassName?: string;
  inputRef?: React.Ref<HTMLInputElement>;
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function Input({
  id,
  label,
  error,
  helperText,
  required,
  className,
  containerClassName,
  inputRef,
  ...props
}: InputProps) {
  const autoId = useId();
  const inputId = id ?? `in_${autoId}`;

  const inputClasses = cn(
    "mt-1 w-full rounded-lg border p-2.5 outline-none transition",
    error
      ? "border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-200"
      : "border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200",
    className
  );

  const describedBy = error ? `${inputId}-error` : helperText ? `${inputId}-help` : undefined;

  return (
    <div className={containerClassName}>
      {label && (
        <label htmlFor={inputId} className="block text-sm font-medium text-slate-800">
          {label} {required && <span className="text-rose-600">*</span>}
        </label>
      )}
      <input
        id={inputId}
        aria-invalid={!!error || undefined}
        aria-describedby={describedBy}
        ref={inputRef as any}
        {...props}
        className={inputClasses}
      />
      {helperText && !error && (
        <p id={`${inputId}-help`} className="mt-1 text-xs text-slate-500">
          {helperText}
        </p>
      )}
      {error && (
        <p id={`${inputId}-error`} className="mt-1 text-sm text-rose-600">
          {error}
        </p>
      )}
    </div>
  );
}
