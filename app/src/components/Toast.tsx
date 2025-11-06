import React, { createContext, useContext, useEffect, useMemo, useRef, useState } from "react";

type ToastType = "success" | "error";

export type Toast = {
  id: string;
  message: string;
  type: ToastType;
  duration?: number; // ms
};

type ToastContextType = {
  show: (message: string, type?: ToastType, opts?: { duration?: number }) => void;
  success: (message: string, opts?: { duration?: number }) => void;
  error: (message: string, opts?: { duration?: number }) => void;
};

const ToastContext = createContext<ToastContextType | null>(null);

export function ToastProvider({ children }: { children: React.ReactNode }) {
  const [toasts, setToasts] = useState<Toast[]>([]);
  const timers = useRef<Record<string, number | undefined>>({});

  const remove = (id: string) => {
    setToasts((t) => t.filter((x) => x.id !== id));
    if (timers.current[id]) {
      window.clearTimeout(timers.current[id]);
      delete timers.current[id];
    }
  };

  const push = (message: string, type: ToastType = "success", opts?: { duration?: number }) => {
    const id = `${Date.now()}-${Math.random().toString(36).slice(2)}`;
    const duration = opts?.duration ?? 3000;
    const toast: Toast = { id, message, type, duration };
    setToasts((t) => [...t, toast]);
    timers.current[id] = window.setTimeout(() => remove(id), duration);
  };

  const value = useMemo<ToastContextType>(() => ({
    show: (message, type = "success", opts) => push(message, type, opts),
    success: (message, opts) => push(message, "success", opts),
    error: (message, opts) => push(message, "error", opts),
  }), []);

  // Cleanup timers on unmount
  useEffect(() => () => {
    Object.values(timers.current).forEach((t) => t && window.clearTimeout(t));
  }, []);

  return (
    <ToastContext.Provider value={value}>
      {children}
      {/* Container */}
      <div className="pointer-events-none fixed right-4 top-20 z-50 flex w-full max-w-sm flex-col gap-2">
        {toasts.map((t) => (
          <div
            key={t.id}
            className={
              "pointer-events-auto flex items-start gap-2 rounded-md border p-3 text-sm shadow-md transition-all " +
              (t.type === "success"
                ? "border-green-200 bg-green-50 text-green-800"
                : "border-red-200 bg-red-50 text-red-800")
            }
            role="status"
          >
            <div className="flex-1">{t.message}</div>
            <button
              aria-label="Fechar"
              className="ml-2 rounded p-1 text-xs opacity-70 hover:opacity-100"
              onClick={() => remove(t.id)}
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </ToastContext.Provider>
  );
}

export function useToast() {
  const ctx = useContext(ToastContext);
  if (!ctx) throw new Error("useToast deve ser usado dentro de ToastProvider");
  return ctx;
}
