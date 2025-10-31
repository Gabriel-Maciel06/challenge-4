import { useEffect, useRef, useState } from "react";
import { Link, NavLink, useLocation } from "react-router-dom";

export default function Navbar() {
  const [open, setOpen] = useState(false);
  const btnRef = useRef<HTMLButtonElement | null>(null);
  const firstLinkRef = useRef<HTMLAnchorElement | null>(null);
  const { pathname } = useLocation();

  useEffect(() => { setOpen(false); }, [pathname]);
  useEffect(() => {
    document.body.classList.toggle("overflow-hidden", open);
    return () => document.body.classList.remove("overflow-hidden");
  }, [open]);
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);
  useEffect(() => {
    if (open) setTimeout(() => firstLinkRef.current?.focus(), 40);
    else setTimeout(() => btnRef.current?.focus(), 0);
  }, [open]);

  const navItems = [
    { to: "/", label: "Início" },
    { to: "/integrantes", label: "Integrantes" },
    { to: "/faq", label: "FAQ" },
    { to: "/contato", label: "Contato" },
  ];

  const linkBase =
    "relative transition-colors hover:text-[#d4ecff] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60";
  const activeDeco =
    "after:absolute after:-bottom-2 after:left-0 after:h-[2px] after:w-full after:bg-[#d4ecff]";

  return (
    <>
      {/* HEADER FIXO (evita clipping e rolagem lateral) */}
      <header className="fixed inset-x-0 top-0 z-[100] bg-[#004E89] text-white shadow-md">
        <nav aria-label="Principal" className="mx-auto flex h-14 md:h-16 w-full max-w-7xl items-center justify-between gap-3 px-4 sm:px-6">
          <Link to="/" className="min-w-0 truncate py-1 text-lg font-extrabold tracking-tight md:text-xl">
            TELECARE+
          </Link>

          <ul className="hidden items-center gap-6 md:flex lg:gap-8">
            {navItems.map((item) => (
              <li key={item.to}>
                <NavLink
                  to={item.to}
                  className={({ isActive }) =>
                    `${linkBase} ${isActive ? `font-semibold text-[#d4ecff] ${activeDeco}` : ""}`
                  }
                >
                  {item.label}
                </NavLink>
              </li>
            ))}
          </ul>

          <button
            ref={btnRef}
            type="button"
            aria-label={open ? "Fechar menu" : "Abrir menu"}
            aria-controls="mobile-menu"
            aria-expanded={open}
            onClick={() => setOpen((v) => !v)}
            className="md:hidden inline-flex h-11 w-11 items-center justify-center rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            <div className="relative h-5 w-6">
              <span className={`absolute left-0 top-0 block h-0.5 w-6 bg-white transition-transform ${open ? "translate-y-[10px] rotate-45" : ""}`} />
              <span className={`absolute left-0 top-1/2 block h-0.5 w-6 -translate-y-1/2 bg-white transition-opacity ${open ? "opacity-0" : "opacity-100"}`} />
              <span className={`absolute bottom-0 left-0 block h-0.5 w-6 bg-white transition-transform ${open ? "-translate-y-[10px] -rotate-45" : ""}`} />
            </div>
          </button>
        </nav>
      </header>

      {/* ESPAÇADOR abaixo do header fixo (evita sobreposição do conteúdo) */}
      <div style={{ height: "4rem" }} className="md:hidden" />
      <div style={{ height: "4.5rem" }} className="hidden md:block" />

      {/* BACKDROP */}
      <div
        className={`md:hidden fixed inset-0 z-[95] bg-black/40 transition-opacity ${open ? "opacity-100" : "opacity-0 pointer-events-none"}`}
        onClick={() => setOpen(false)}
        aria-hidden="true"
      />

      {/* MENU MOBILE FULLSCREEN (slide down, sem largura extra) */}
      <div
        id="mobile-menu"
        role="dialog"
        aria-modal="true"
        className={`md:hidden fixed inset-0 z-[100] flex flex-col bg-[#0B3E74] text-white transition-transform duration-300 ${open ? "translate-y-0" : "-translate-y-full"}`}
        style={{
          paddingTop: "calc(env(safe-area-inset-top, 0) + 0.75rem)",
          paddingBottom: "calc(env(safe-area-inset-bottom, 0) + 1rem)",
        }}
      >
        <div className="flex items-center justify-between px-5 py-3 border-b border-white/10">
          <span className="text-base font-semibold">Menu</span>
          <button
            aria-label="Fechar menu"
            onClick={() => setOpen(false)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-md focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            ✕
          </button>
        </div>

        <ul className="flex-1 overflow-auto px-5 py-6 space-y-2">
          {navItems.map((item, idx) => (
            <li key={item.to}>
              <NavLink
                to={item.to}
                ref={idx === 0 ? firstLinkRef : undefined}
                className={({ isActive }) =>
                  `block rounded-lg px-4 py-3 text-lg transition-colors ${
                    isActive ? "bg-white/10 font-semibold text-[#d4ecff]" : "hover:bg-white/5"
                  }`
                }
                onClick={() => setOpen(false)}
              >
                {item.label}
              </NavLink>
            </li>
          ))}
        </ul>

        <div className="px-5 pb-4 text-center text-xs text-white/70">
          © {new Date().getFullYear()} TELECARE+
        </div>
      </div>
    </>
  );
}