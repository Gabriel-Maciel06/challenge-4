import { useRef, useState, useId, useCallback } from "react";
import type { ReactNode } from "react";

type Item = { title: string; content: ReactNode };
type AccordionProps = { items: Item[]; defaultOpen?: number | null };

export default function Accordion({ items, defaultOpen = 0 }: AccordionProps) {
  const [open, setOpen] = useState<number | null>(defaultOpen ?? null);
  const btnRefs = useRef<Array<HTMLButtonElement | null>>([]);
  const baseId = useId();

  const setBtnRef = useCallback((idx: number, el: HTMLButtonElement | null) => {
    btnRefs.current[idx] = el; // sem retorno => tipo void
  }, []);

  const toggle = (idx: number) => setOpen((o) => (o === idx ? null : idx));
  const focusBtn = (idx: number) => btnRefs.current[idx]?.focus();

  const onKeyDown = (e: React.KeyboardEvent, idx: number) => {
    switch (e.key) {
      case "Enter":
      case " ":
        e.preventDefault();
        toggle(idx);
        break;
      case "ArrowDown":
        e.preventDefault();
        focusBtn((idx + 1) % items.length);
        break;
      case "ArrowUp":
        e.preventDefault();
        focusBtn((idx - 1 + items.length) % items.length);
        break;
      case "Home":
        e.preventDefault();
        focusBtn(0);
        break;
      case "End":
        e.preventDefault();
        focusBtn(items.length - 1);
        break;
    }
  };

  return (
    <div className="divide-y rounded-2xl border border-slate-200 bg-white">
      {items.map((it, idx) => {
        const isOpen = open === idx;
        const btnId = `${baseId}-btn-${idx}`;
        const panelId = `${baseId}-panel-${idx}`;
        return (
          <div key={idx}>
            <button
              ref={(el) => setBtnRef(idx, el)}
              id={btnId}
              aria-expanded={isOpen}
              aria-controls={panelId}
              onClick={() => toggle(idx)}
              onKeyDown={(e) => onKeyDown(e, idx)}
              className="flex w-full items-center justify-between gap-3 px-4 py-3 text-left font-medium text-slate-800 outline-none transition hover:bg-slate-50 focus-visible:ring-2 focus-visible:ring-sky-200"
            >
              <span>{it.title}</span>
              <svg
                className={`h-5 w-5 shrink-0 transition-transform ${isOpen ? "rotate-180" : ""}`}
                viewBox="0 0 24 24"
                fill="none"
                aria-hidden="true"
              >
                <path d="M6 9l6 6 6-6" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
              </svg>
            </button>

            <div
              id={panelId}
              role="region"
              aria-labelledby={btnId}
              hidden={!isOpen}
              className="px-4 pb-4 text-sm text-slate-600"
            >
              {it.content}
            </div>
          </div>
        );
      })}
    </div>
  );
}