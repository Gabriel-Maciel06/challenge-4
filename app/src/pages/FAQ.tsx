import { Link } from "react-router-dom";
import Accordion from "../components/Accordion";

type Item = { id: string; title: string; content: React.ReactNode };

const items: Item[] = [
  {
    id: "o-que-e",
    title: "O que é o projeto TELECARE+?",
    content: <>Um sistema pensado para conectar pessoas a serviços de cuidado digital de forma intuitiva e acessível.</>,
  },
  {
    id: "tecnologias",
    title: "Vocês utilizam alguma tecnologia específica?",
    content: (
      <>
        Nesta Sprint usamos <strong>React + Vite + TypeScript</strong> e <strong>TailwindCSS</strong>.
        (Na Sprint anterior, o protótipo foi feito com HTML5, CSS3 e JavaScript puro.)
      </>
    ),
  },
  {
    id: "mobile",
    title: "O projeto é compatível com dispositivos móveis?",
    content: (
      <>
        Sim. O layout segue abordagem <strong>mobile-first</strong> e é totalmente responsivo (XS→XL).
      </>
    ),
  },
];

export default function FAQ() {
  return (
    <main className="bg-gradient-to-b from-slate-50 to-white">
      <section aria-labelledby="faq-title" className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <header className="mb-8 text-center">
          <h1 id="faq-title" className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            FAQ
          </h1>
          <p className="mt-3 text-slate-600">Perguntas rápidas sobre o projeto.</p>
        </header>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <Accordion items={items} />
        </div>

        <footer className="mt-8 text-center text-sm text-slate-500">
          Precisa de mais detalhes? Veja{" "}
          <Link to="/sobre" className="underline hover:text-sky-700">Sobre o Projeto</Link>{" "}
          ou{" "}
          <Link to="/contato" className="underline hover:text-sky-700">Contato</Link>.
        </footer>
      </section>
    </main>
  );
}