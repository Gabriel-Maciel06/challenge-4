import React, { useId } from "react";

type TextareaProps = Omit<
  React.TextareaHTMLAttributes<HTMLTextAreaElement>,
  "ref"
> & {
  label?: string;
  error?: string;
  helperText?: string;
  required?: boolean;
  containerClassName?: string;
  textareaRef?: React.Ref<HTMLTextAreaElement>;
};

function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export default function Textarea({
  id,
  label,
  error,
  helperText,
  required,
  className,
  containerClassName,
  textareaRef,
  ...props
}: TextareaProps) {
  const autoId = useId();
  const taId = id ?? `ta_${autoId}`;

  const taClasses = cn(
    "mt-1 w-full rounded-lg border p-2.5 outline-none transition",
    error
      ? "border-rose-400 focus:border-rose-500 focus:ring-2 focus:ring-rose-200"
      : "border-slate-300 focus:border-sky-500 focus:ring-2 focus:ring-sky-200",
    className
  );

  const describedBy = error ? `${taId}-error` : helperText ? `${taId}-help` : undefined;

  return (
    <div className={containerClassName}>
      {label && (
        <label htmlFor={taId} className="block text-sm font-medium text-slate-800">
          {label} {required && <span className="text-rose-600">*</span>}
        </label>
      )}
      <textarea
        id={taId}
        aria-invalid={!!error || undefined}
        aria-describedby={describedBy}
        ref={textareaRef as any}
        {...props}
        className={taClasses}
      />
      {helperText && !error && (
        <p id={`${taId}-help`} className="mt-1 text-xs text-slate-500">
          {helperText}
        </p>
      )}
      {error && (
        <p id={`${taId}-error`} className="mt-1 text-sm text-rose-600">
          {error}
        </p>
      )}
    </div>
  );
}
