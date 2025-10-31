export default function Footer() {
  return (
    <footer className="bg-[#004E89] text-white">
      <div className="mx-auto flex max-w-7xl flex-col items-center justify-between gap-4 px-4 py-8 text-center text-sm sm:flex-row sm:text-left">
        {/* Marca */}
        <p className="order-2 sm:order-1">
          &copy; {new Date().getFullYear()} <span className="font-semibold">TELECARE+</span> — Todos os direitos reservados.
        </p>

        {/* Links extras */}
        <nav className="order-1 flex gap-6 sm:order-2">
          <a
            href="/sobre"
            className="transition-colors hover:text-[#d4ecff] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            Sobre
          </a>
          <a
            href="/faq"
            className="transition-colors hover:text-[#d4ecff] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            FAQ
          </a>
          <a
            href="/contato"
            className="transition-colors hover:text-[#d4ecff] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
          >
            Contato
          </a>
        </nav>
      </div>
    </footer>
  );
}