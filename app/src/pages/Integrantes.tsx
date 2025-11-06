import { useEffect, useMemo, useState } from "react";
import type { Integrante } from "../types/integrante";
import data from "../data/integrantes.json";
import CardIntegrante from "../components/CardIntegrante";
// Integração com API removida por solicitação: usamos apenas o arquivo local integrantes.json

type SortKey = "nome" | "rm"; // <-- sem 'turma'

export default function Integrantes() {
  const [integrantes, setIntegrantes] = useState<Integrante[]>([]);
  const [q, setQ] = useState("");
  const [sortKey, setSortKey] = useState<SortKey>("nome");
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    // Usa somente o arquivo local
    setLoading(true);
    setIntegrantes(data as Integrante[]);
    setLoading(false);
  }, []);



  const faltandoCampos = useMemo(() => {
    return integrantes
      .map((i, idx) => {
        const miss: string[] = [];
        if (!i?.nome) miss.push("nome");
        if (!i?.rm) miss.push("rm");
        if (!i?.turma) miss.push("turma");
        return { idx, miss, i };
      })
      .filter((x) => x.miss.length > 0);
  }, [integrantes]);

  const filtered = useMemo(() => {
    const text = q.trim().toLowerCase();

    const base = text
      ? integrantes.filter((i: any) => {
          const hay = `${i?.nome ?? ""} ${i?.rm ?? ""} ${i?.email ?? ""} ${i?.github ?? ""}`
            .toLowerCase();
          return hay.includes(text);
        })
      : integrantes;

    const sorted = [...base].sort((a: any, b: any) => {
      const av = (a?.[sortKey] ?? "").toString().toLowerCase();
      const bv = (b?.[sortKey] ?? "").toString().toLowerCase();
      if (av < bv) return -1;
      if (av > bv) return 1;
      return 0;
    });

    return sorted;
  }, [integrantes, q, sortKey]);

  return (
    <section className="mx-auto max-w-7xl px-4 py-10 sm:px-6 lg:px-8">
      {/* Header */}
      <header className="mb-8 text-center">
        <h1 className="text-balance text-3xl font-bold tracking-tight text-slate-900">
          <span className="bg-gradient-to-r from-sky-600 to-indigo-600 bg-clip-text text-transparent">
            Integrantes
          </span>
        </h1>
        <p className="mt-2 text-sm text-slate-600">
          Equipe do projeto e suas informações básicas.
        </p>

        {/* Barra de ferramentas */}
        <div className="mt-6 flex flex-col items-center justify-between gap-3 sm:flex-row">
          {/* Busca (sem turma) */}
          <label className="relative w-full sm:w-80">
            <span className="sr-only">Buscar integrante</span>
            <input
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Buscar por nome ou RM..."
              className="w-full rounded-full border border-slate-300 bg-white px-4 py-2.5 pr-9 text-sm shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
            />
            <svg
              className="pointer-events-none absolute right-3 top-1/2 h-5 w-5 -translate-y-1/2 text-slate-400"
              viewBox="0 0 24 24"
              fill="none"
              aria-hidden="true"
            >
              <path
                d="M21 21l-4.3-4.3M11 19a8 8 0 1 1 0-16 8 8 0 0 1 0 16Z"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
            </svg>
          </label>

          {/* Ordenação (sem turma) + Contagem */}
          <div className="flex items-center gap-3">
            <div className="inline-flex items-center gap-2 rounded-full border border-slate-200 bg-white px-4 py-1.5 text-sm text-slate-700 shadow-sm">
              <span className="inline-block h-2 w-2 rounded-full bg-emerald-500" />
              <span aria-live="polite">
                {filtered.length} integrante{filtered.length === 1 ? "" : "s"}
              </span>
            </div>

            <label className="flex items-center gap-2 text-sm text-slate-700">
              <span>Ordenar por:</span>
              <select
                value={sortKey}
                onChange={(e) => setSortKey(e.target.value as SortKey)}
                className="rounded-full border border-slate-300 bg-white px-3 py-1.5 text-sm shadow-sm outline-none transition focus:border-sky-500 focus:ring-2 focus:ring-sky-200"
              >
                <option value="nome">Nome</option>
                <option value="rm">RM</option>
              </select>
            </label>
          </div>
        </div>

        <div className="mx-auto mt-6 h-px w-24 bg-gradient-to-r from-transparent via-slate-300 to-transparent" />
      </header>

        {loading && (
          <div className="mb-4 text-center text-sm text-slate-600">Carregando integrantes...</div>
        )}

      {/* Aviso de campos faltando */}
      {faltandoCampos.length > 0 && (
        <div
          role="alert"
          className="mb-6 rounded-xl border border-amber-300 bg-amber-50 px-4 py-3 text-amber-900"
        >
          <p className="font-medium">Atenção: integrantes com dados incompletos</p>
          <ul className="mt-1 list-disc pl-5 text-sm">
            {faltandoCampos.slice(0, 6).map(({ i, miss }, idx) => (
              <li key={idx}>
                {i?.nome ?? "Sem nome"} — faltando: {miss.join(", ")}
              </li>
            ))}
          </ul>
          {faltandoCampos.length > 6 && (
            <p className="mt-1 text-sm">e mais {faltandoCampos.length - 6}…</p>
          )}
        </div>
      )}



      {/* Grid */}
      {filtered.length > 0 ? (
        <ul
          className="grid animate-fade-in grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3"
          style={{ animationDuration: "400ms" }}
          aria-label="Lista de integrantes"
        >
          {filtered.map((i) => (
            <CardIntegrante
              key={String((i as any)?.rm ?? (i as any)?.nome)}
              data={i}
            />
          ))}
        </ul>
      ) : (
        // Estado vazio
        <div className="mx-auto max-w-md rounded-2xl border border-dashed border-slate-300 bg-white/70 p-8 text-center">
          <div className="mx-auto mb-3 h-12 w-12 rounded-full bg-slate-200" />
          <h2 className="text-lg font-semibold text-slate-800">
            Nenhum integrante encontrado
          </h2>
          <p className="mt-1 text-sm text-slate-600">
            Ajuste a busca.
          </p>
        </div>
      )}



      {/* Animação utilitária local (sem libs) */}
      <style>{`
        @keyframes fade-in { 
          from { opacity: 0; transform: translateY(6px); } 
          to { opacity: 1; transform: translateY(0); } 
        }
        .animate-fade-in { animation: fade-in 0.4s ease-out both; }
      `}</style>
    </section>
  );
}
