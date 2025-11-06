import React from "react";

export type BadgeVariant = "publico" | "paciente" | "equipe" | "warning" | "neutral";
export type BadgeSize = "xs" | "sm";

type Props = {
  variant?: BadgeVariant;
  size?: BadgeSize;
  className?: string;
  children: React.ReactNode;
  as?: React.ElementType;
};

const VARIANT_CLASS: Record<BadgeVariant, string> = {
  publico: "bg-slate-100 text-slate-800",
  paciente: "bg-emerald-100 text-emerald-800",
  equipe: "bg-indigo-100 text-indigo-800",
  warning: "bg-amber-100 text-amber-800",
  neutral: "bg-slate-100 text-slate-800",
};

const SIZE_CLASS: Record<BadgeSize, string> = {
  xs: "px-2 py-0.5 text-xs",
  sm: "px-2.5 py-1 text-sm",
};

export default function Badge({ variant = "neutral", size = "xs", className = "", children, as = "span" }: Props) {
  const Comp: any = as;
  return (
    <Comp
      className={[
        "inline-flex items-center gap-1 rounded-full font-medium align-middle",
        VARIANT_CLASS[variant],
        SIZE_CLASS[size],
        className,
      ].join(" ")}
    >
      {children}
    </Comp>
  );
}
