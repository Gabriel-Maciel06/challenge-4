import { useParams, Link } from "react-router-dom";
import type { Integrante } from "../types/integrante";
import data from "../data/integrantes.json";

export default function IntegranteDetalhe() {
  const { rm } = useParams();
  const integrantes = data as Integrante[];
  const integrante = integrantes.find((i) => String(i.rm) === String(rm));

  if (!integrante) {
    return (
      <main className="mx-auto max-w-lg px-4 py-16 text-center">
        <p className="text-slate-700">Integrante não encontrado.</p>
        <Link
          to="/integrantes"
          className="mt-4 inline-block rounded-full bg-sky-600 px-6 py-2 font-semibold text-white transition hover:bg-sky-500"
        >
          Voltar
        </Link>
      </main>
    );
  }

  return (
    <main className="mx-auto max-w-3xl px-4 py-12 sm:px-6 lg:px-8">
      <article className="overflow-hidden rounded-2xl border border-slate-200 bg-white shadow-sm">
        <div className="flex flex-col items-center gap-6 p-8 text-center sm:flex-row sm:text-left">
          <img
            src={integrante.avatar}
            alt={integrante.nome}
            className="h-32 w-32 rounded-full object-cover ring-4 ring-sky-100"
          />

          <div className="flex-1 space-y-3">
            <h1 className="text-2xl font-bold tracking-tight text-slate-900">
              {integrante.nome}
            </h1>
            <p className="text-slate-600">
              <span className="font-medium">RM:</span> {integrante.rm} <br />
              <span className="font-medium">Turma:</span> {integrante.turma}
            </p>

            {/* Contatos extras */}
            <div className="flex flex-wrap justify-center gap-3 sm:justify-start">
              {integrante.github && (
                <a
                  href={integrante.github}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      fillRule="evenodd"
                      d="M12 .5C5.65.5.5 5.65.5 12c0 5.1 3.3 9.4 7.9 10.9.6.1.8-.3.8-.6v-2c-3.2.7-3.9-1.5-3.9-1.5-.6-1.4-1.3-1.8-1.3-1.8-1-.7.1-.7.1-.7 1.2.1 1.9 1.2 1.9 1.2 1 .1.6 1.7 2.6 2.4.3-.7.6-1.2.9-1.5-2.6-.3-5.3-1.3-5.3-5.8 0-1.3.5-2.4 1.2-3.3-.1-.3-.5-1.6.1-3.4 0 0 1-.3 3.4 1.2a12 12 0 0 1 6.2 0c2.4-1.5 3.4-1.2 3.4-1.2.6 1.8.2 3.1.1 3.4.7.9 1.2 2 1.2 3.3 0 4.5-2.7 5.5-5.3 5.8.4.3.8 1 .8 2v3c0 .3.2.7.8.6a10.8 10.8 0 0 0 7.9-10.9C23.5 5.65 18.35.5 12 .5Z"
                    />
                  </svg>
                  GitHub
                </a>
              )}

              {integrante.linkedin && (
                <a
                  href={integrante.linkedin}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M20.45 20.45h-3.6v-5.6c0-1.34-.02-3.06-1.87-3.06-1.87 0-2.16 1.46-2.16 3v5.7h-3.6V9h3.45v1.56h.05c.48-.91 1.66-1.87 3.42-1.87 3.66 0 4.34 2.41 4.34 5.54v6.22zM5.34 7.43a2.09 2.09 0 1 1 0-4.18 2.09 2.09 0 0 1 0 4.18zM7.14 20.45H3.54V9h3.6v11.45zM22.23 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.46c.98 0 1.77-.77 1.77-1.72V1.72C24 .77 23.21 0 22.23 0z" />
                  </svg>
                  LinkedIn
                </a>
              )}

              {integrante.instagram && (
                <a
                  href={integrante.instagram}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-2 text-sm font-medium text-slate-700 shadow-sm transition hover:bg-slate-50 hover:text-slate-900"
                >
                  <svg
                    className="h-5 w-5"
                    fill="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path d="M7.75 2h8.5A5.75 5.75 0 0 1 22 7.75v8.5A5.75 5.75 0 0 1 16.25 22h-8.5A5.75 5.75 0 0 1 2 16.25v-8.5A5.75 5.75 0 0 1 7.75 2Zm0 1.5A4.25 4.25 0 0 0 3.5 7.75v8.5A4.25 4.25 0 0 0 7.75 20.5h8.5a4.25 4.25 0 0 0 4.25-4.25v-8.5A4.25 4.25 0 0 0 16.25 3.5h-8.5ZM12 7a5 5 0 1 1 0 10 5 5 0 0 1 0-10Zm0 1.5a3.5 3.5 0 1 0 0 7 3.5 3.5 0 0 0 0-7Zm5.25-.75a1.25 1.25 0 1 1 0 2.5 1.25 1.25 0 0 1 0-2.5Z" />
                  </svg>
                  Instagram
                </a>
              )}
            </div>
          </div>
        </div>

        <footer className="border-t border-slate-200 bg-slate-50 px-8 py-4 text-center sm:text-right">
          <Link
            to="/integrantes"
            className="inline-flex items-center justify-center rounded-full border border-slate-300 bg-white px-5 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-50 hover:text-slate-900"
          >
            Voltar à lista
          </Link>
        </footer>
      </article>
    </main>
  );
}