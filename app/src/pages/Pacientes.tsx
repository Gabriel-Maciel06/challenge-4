import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import pacienteService from "../services/pacienteService";
import type { IPaciente } from "../types/paciente";
import Loading from "../components/Loading";
import FormPaciente from "../components/FormPaciente";
import { useToast } from "../components/Toast";
import { HttpError } from "../services/api";
import Badge from "../components/Badge";

export default function Pacientes() {
  const [pacientes, setPacientes] = useState<IPaciente[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const navigate = useNavigate();
  const { success, error: errorToast } = useToast();

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await pacienteService.listar();
      setPacientes(data || []);
      setPage(1);
    } catch (err: any) {
      console.error(err);
      setError("Não foi possível carregar pacientes");
      errorToast("Não foi possível carregar pacientes");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  async function handleCreate(payload: Partial<IPaciente>) {
    try {
      await pacienteService.criar(payload as any);
      await load();
      setShowForm(false);
      success("Paciente criado com sucesso!");
    } catch (err: any) {
      console.error(err);
      const msg = err?.message || "Erro ao criar paciente";
      setError(msg);
      errorToast(msg);
    }
  }

  async function handleDelete(id: number) {
    const confirmar = window.confirm("Deseja realmente excluir este paciente?");
    if (!confirmar) return;
    try {
      await pacienteService.excluir(id);
      setPacientes((s) => {
        const filtered = s.filter((p) => p.id !== id);
        const totalPages = Math.max(1, Math.ceil(filtered.length / pageSize));
        if (page > totalPages) setPage(totalPages);
        return filtered;
      });
      success("Paciente excluído");
    } catch (err: any) {
      console.error(err);
      let msg = err?.message || "Erro ao excluir paciente";
      // Tratamento mais amigável para erros do backend
      const http = err as HttpError;
      const backendMsg = (http as any)?.body?.mensagem || (http as any)?.body?.message;
      if (backendMsg) msg = backendMsg;
      if (http?.status === 409) {
        msg = backendMsg || "Não é possível excluir: paciente possui registros vinculados.";
      }
      setError(msg);
      errorToast(msg);
    }
  }

  const total = pacientes.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const end = Math.min(start + pageSize, total);
  const pagina = pacientes.slice(start, end);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">
          Pacientes
          <span className="ml-2 align-middle"><Badge variant="equipe">Perfil: Equipe da clínica</Badge></span>
        </h1>
        <div className="flex gap-2">
          <button onClick={() => setShowForm((s) => !s)} className="rounded bg-blue-600 text-white px-4 py-2">{showForm ? "Fechar" : "Novo"}</button>
        </div>
      </div>

      <div className="mt-4">
        {showForm && (
          <div className="mb-4 rounded border bg-white p-4">
            <FormPaciente onSave={handleCreate} onCancel={() => setShowForm(false)} />
          </div>
        )}

  {loading && <Loading />}

        {!loading && !error && (
          <>
            <div className="mt-4 space-y-3 md:hidden">
              {pagina.map((p, i) => (
                <div key={p.id ?? `${p.nome || 'sem-nome'}-${i}`}
                     className="rounded border bg-white p-3 shadow-sm">
                  <div className="flex items-start justify-between gap-3">
                    <div>
                      <div className="text-sm text-slate-500">ID</div>
                      <div className="text-base font-medium">{p.id}</div>
                    </div>
                    <div className="flex gap-2">
                      <button onClick={() => navigate(`/pacientes/${p.id}`)} className="rounded border px-3 py-1">Editar</button>
                      <button onClick={() => navigate(`/consultas?paciente=${p.id}`)} className="rounded bg-blue-600 text-white px-3 py-1">Agendar</button>
                      <button onClick={() => handleDelete(p.id)} className="rounded border border-red-600 text-red-700 px-3 py-1">Excluir</button>
                    </div>
                  </div>
                  <div className="mt-2 grid grid-cols-2 gap-2">
                    <div>
                      <div className="text-sm text-slate-500">Nome</div>
                      <div className="text-sm">{p.nome}</div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-500">Telefone</div>
                      <div className="text-sm">{p.telefone || '-'}</div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-500">Canal</div>
                      <div className="text-sm">{p.canalPreferido || '-'}</div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-500">Cuidador</div>
                      <div className="text-sm">{p.cuidadorNome || '-'}</div>
                    </div>
                    <div>
                      <div className="text-sm text-slate-500">Tel. cuidador</div>
                      <div className="text-sm">{p.cuidadorTelefone || '-'}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>

            <div className="overflow-x-auto mt-4 hidden md:block">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-sm font-medium">ID</th>
                    <th className="px-3 py-2 text-left text-sm font-medium">Nome</th>
                    <th className="px-3 py-2 text-left text-sm font-medium">Telefone</th>
                    <th className="px-3 py-2 text-left text-sm font-medium">Canal</th>
                    <th className="px-3 py-2 text-left text-sm font-medium">Cuidador</th>
                    <th className="px-3 py-2 text-left text-sm font-medium">Tel. cuidador</th>
                    <th className="px-3 py-2 text-right text-sm font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {pagina.map((p, i) => (
                    <tr key={p.id ?? `${p.nome || 'sem-nome'}-${i}` }>
                      <td className="px-3 py-2 text-sm">{p.id}</td>
                      <td className="px-3 py-2 text-sm">{p.nome}</td>
                      <td className="px-3 py-2 text-sm">{p.telefone || "-"}</td>
                      <td className="px-3 py-2 text-sm">{p.canalPreferido || "-"}</td>
                      <td className="px-3 py-2 text-sm">{p.cuidadorNome || '-'}</td>
                      <td className="px-3 py-2 text-sm">{p.cuidadorTelefone || '-'}</td>
                      <td className="px-3 py-2 text-sm text-right space-x-2">
                        <button onClick={() => navigate(`/pacientes/${p.id}`)} className="rounded border px-3 py-1">Editar</button>
                        <button onClick={() => navigate(`/consultas?paciente=${p.id}`)} className="rounded bg-blue-600 text-white px-3 py-1">Agendar</button>
                        <button onClick={() => handleDelete(p.id)} className="rounded border border-red-600 text-red-700 px-3 py-1">Excluir</button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="mt-4 flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="text-sm text-slate-600">
                Mostrando {total === 0 ? 0 : start + 1}–{end} de {total}
              </div>
              <div className="flex items-center gap-2">
                <button
                  className="rounded border px-3 py-1 disabled:opacity-50"
                  onClick={() => setPage((p) => Math.max(1, p - 1))}
                  disabled={currentPage <= 1}
                >Anterior</button>
                <div className="text-sm">
                  Página {currentPage} de {totalPages}
                </div>
                <button
                  className="rounded border px-3 py-1 disabled:opacity-50"
                  onClick={() => setPage((p) => Math.min(totalPages, p + 1))}
                  disabled={currentPage >= totalPages}
                >Próxima</button>
                <select
                  className="ml-2 rounded border px-2 py-1 text-sm"
                  value={pageSize}
                  onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}
                >
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
              </div>
            </div>
          </>
        )}
      </div>
    </div>
  );
}