import { useEffect, useState } from "react";
import consultaService from "../services/consultaService";
import notificacaoService from "../services/notificacaoService";
import type { IConsultaComPaciente } from "../types/consulta";
import Loading from "../components/Loading";
import Alert from "../components/Alert";
import FormConsulta from "../components/FormConsulta";
import RiskBadge from "../components/RiskBadge";
import { formatDateTime } from "../utils/formatters";
import { Link, useSearchParams } from "react-router-dom";
import { useToast } from "../components/Toast";

export default function Consultas() {
  const [consultas, setConsultas] = useState<IConsultaComPaciente[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [showForm, setShowForm] = useState(false);
  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(5);
  const [searchParams, setSearchParams] = useSearchParams();

  // Modal de notificação
  const [notifyOpen, setNotifyOpen] = useState(false);
  const [notifyConsulta, setNotifyConsulta] = useState<IConsultaComPaciente | null>(null);
  const [notifyChannel, setNotifyChannel] = useState<"WHATSAPP" | "SMS" | "EMAIL" | "VOZ" | "LIGACAO">("WHATSAPP");
  const [notifyCuidador, setNotifyCuidador] = useState(false);
  const { success, error: errorToast } = useToast();

  async function load() {
    setLoading(true);
    setError(null);
    try {
      const data = await consultaService.listarTudo();
      setConsultas(data || []);
      setPage(1);
    } catch (err) {
      console.error(err);
      setError("Não foi possível carregar consultas");
      errorToast("Não foi possível carregar consultas");
    } finally {
      setLoading(false);
    }
  }

  useEffect(() => { load(); }, []);

  // Abre formulário se vier com paciente selecionado via query string
  useEffect(() => {
    const p = searchParams.get("paciente");
    if (p) {
      setShowForm(true);
    }
  }, [searchParams]);

  async function handleCreate(payload: any) {
    try {
      await consultaService.criar(payload);
      await load(); // recarrega para refletir IDs e mapeamentos
      setShowForm(false);
      success("Consulta agendada com sucesso!");
      // Limpa query param de paciente após criar
      if (searchParams.get("paciente")) {
        searchParams.delete("paciente");
        setSearchParams(searchParams, { replace: true });
      }
    } catch (err) {
      console.error(err);
      const msg = (err as any)?.message || "Erro ao agendar consulta";
      setError(msg);
      errorToast(msg);
    }
  }

  function abrirNotificacao(consulta: IConsultaComPaciente) {
    setNotifyConsulta(consulta);
    const canalPref = consulta.paciente?.canalPreferido;
    setNotifyChannel((canalPref as any) || "WHATSAPP");
    setNotifyCuidador(false);
    setNotifyOpen(true);
  }

  async function confirmarNotificacao() {
    if (!notifyConsulta) return;
    try {
      await notificacaoService.enviarNotificacao({
        consultaId: notifyConsulta.id,
        canal: notifyChannel,
        paraCuidador: notifyCuidador,
      });
      setNotifyOpen(false);
      setNotifyConsulta(null);
      success("Notificação enviada!");
    } catch (err) {
      console.error(err);
      const msg = (err as any)?.message || "Erro ao enviar notificação";
      setError(msg);
      errorToast(msg);
    }
  }

  async function handleConfirmar(consulta: IConsultaComPaciente) {
    try {
      await consultaService.confirmar(consulta);
      await load(); // Recarrega a lista
      success("Consulta confirmada!");
    } catch (err) {
      console.error(err);
      const msg = (err as any)?.message || "Erro ao confirmar consulta";
      setError(msg);
      errorToast(msg);
    }
  }

  // Paginação client-side
  const total = consultas.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const currentPage = Math.min(page, totalPages);
  const start = (currentPage - 1) * pageSize;
  const end = Math.min(start + pageSize, total);
  const pagina = consultas.slice(start, end);

  return (
    <div>
      <div className="flex items-center justify-between">
        <h1 className="text-2xl font-semibold">Consultas</h1>
        <div className="flex gap-2">
          <button onClick={() => setShowForm((s) => !s)} className="rounded bg-blue-600 text-white px-4 py-2">{showForm ? "Fechar" : "Agendar"}</button>
        </div>
      </div>

      <div className="mt-4">
        {/* Erros críticos da página (opcional exibir também como banner) */}
        {error && <Alert tipo="error" mensagem={error} />}

        {showForm && (
          <div className="mb-4 rounded border bg-white p-4">
            <FormConsulta 
              onSave={handleCreate} 
              onCancel={() => setShowForm(false)} 
              initial={{ pacienteId: searchParams.get("paciente") ? Number(searchParams.get("paciente")) : undefined }}
            />
          </div>
        )}

        {loading && <Loading />}

        {!loading && !error && (
          <>
            {/* Mobile: cards */}
            <div className="mt-4 space-y-3 md:hidden">
              {pagina.map((c) => (
                <div key={c.id} className="rounded border bg-white p-3 shadow-sm">
                  <div className="flex items-center justify-between">
                    <div className="font-medium">#{c.id} • {c.paciente?.nome ?? c.pacienteId}</div>
                    <RiskBadge value={c.riscoAbsenteismo ?? 0} />
                  </div>
                  <div className="mt-1 text-sm text-slate-600">{formatDateTime(c.dataHora)}</div>
                  <div className="mt-1 text-sm">Status: {c.status}</div>
                  <div className="mt-2 flex flex-wrap gap-2">
                    <button className="rounded bg-blue-500 px-2 py-1 text-xs text-white hover:bg-blue-600" onClick={() => abrirNotificacao(c)}>Notificar</button>
                    <div className="flex gap-2">
                      <Link className="rounded bg-green-500 px-2 py-1 text-xs text-white hover:bg-green-600" to={`/pre-consulta/${c.id}`}>Pré-teste</Link>
                      <button
                        className="rounded border px-2 py-1 text-xs"
                        onClick={() => navigator.clipboard?.writeText(`${window.location.origin}/pre-consulta/${c.id}`)}
                        title="Copiar link para enviar ao paciente"
                      >Copiar link</button>
                    </div>
                    {c.status !== "CONFIRMADA" && (
                      <button className="rounded bg-purple-500 px-2 py-1 text-xs text-white hover:bg-purple-600" onClick={() => handleConfirmar(c)}>Confirmar</button>
                    )}
                  </div>
                </div>
              ))}
            </div>

            {/* Desktop: tabela */}
            <div className="overflow-x-auto mt-4 hidden md:block">
              <table className="min-w-full divide-y divide-slate-200">
                <thead className="bg-slate-50">
                  <tr>
                    <th className="px-3 py-2 text-left text-sm font-medium">ID</th>
                    <th className="px-3 py-2 text-left text-sm font-medium">Paciente</th>
                    <th className="px-3 py-2 text-left text-sm font-medium">Data/Hora</th>
                    <th className="px-3 py-2 text-left text-sm font-medium">Status</th>
                    <th className="px-3 py-2 text-left text-sm font-medium">Risco</th>
                    <th className="px-3 py-2 text-left text-sm font-medium">Ações</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-100 bg-white">
                  {pagina.map((c) => (
                    <tr key={c.id}>
                      <td className="px-3 py-2 text-sm">{c.id}</td>
                      <td className="px-3 py-2 text-sm">{c.paciente?.nome ?? c.pacienteId}</td>
                      <td className="px-3 py-2 text-sm">{formatDateTime(c.dataHora)}</td>
                      <td className="px-3 py-2 text-sm">{c.status}</td>
                      <td className="px-3 py-2 text-sm">
                        <RiskBadge value={c.riscoAbsenteismo ?? 0} />
                      </td>
                      <td className="px-3 py-2 text-sm">
                        <div className="flex gap-2">
                          <button 
                            className="rounded bg-blue-500 px-2 py-1 text-xs text-white hover:bg-blue-600"
                            onClick={() => abrirNotificacao(c)}
                          >
                            Notificar
                          </button>
                          <div className="flex items-center gap-2">
                            <Link 
                            className="rounded bg-green-500 px-2 py-1 text-xs text-white hover:bg-green-600"
                            to={`/pre-consulta/${c.id}`}
                            >
                              Pré-teste
                            </Link>
                            <button
                              className="rounded border px-2 py-1 text-xs"
                              onClick={() => navigator.clipboard?.writeText(`${window.location.origin}/pre-consulta/${c.id}`)}
                              title="Copiar link para enviar ao paciente"
                            >Copiar link</button>
                          </div>
                          {c.status !== "CONFIRMADA" && (
                            <button 
                              className="rounded bg-purple-500 px-2 py-1 text-xs text-white hover:bg-purple-600"
                              onClick={() => handleConfirmar(c)}
                            >
                              Confirmar
                            </button>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            {/* Controles de paginação */}
            <div className="mt-4 flex flex-col md:flex-row items-center justify-between gap-3">
              <div className="text-sm text-slate-600">
                Mostrando {total === 0 ? 0 : start + 1}–{end} de {total}
              </div>
              <div className="flex items-center gap-2">
                <button className="rounded border px-3 py-1 disabled:opacity-50" onClick={() => setPage((p) => Math.max(1, p - 1))} disabled={currentPage <= 1}>Anterior</button>
                <div className="text-sm">Página {currentPage} de {totalPages}</div>
                <button className="rounded border px-3 py-1 disabled:opacity-50" onClick={() => setPage((p) => Math.min(totalPages, p + 1))} disabled={currentPage >= totalPages}>Próxima</button>
                <select className="ml-2 rounded border px-2 py-1 text-sm" value={pageSize} onChange={(e) => { setPageSize(Number(e.target.value)); setPage(1); }}>
                  <option value={5}>5</option>
                  <option value={10}>10</option>
                  <option value={20}>20</option>
                </select>
              </div>
            </div>
          </>
        )}
      </div>

      {/* Modal de seleção de canal de notificação */}
      {notifyOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40 p-4">
          <div className="w-full max-w-md rounded bg-white p-4 shadow-lg">
            <h3 className="text-lg font-semibold">Enviar notificação</h3>
            <p className="mt-1 text-sm text-slate-600">Selecione o canal antes de enviar. Em alguns casos, o backend exige LIGAÇÃO.</p>
            <div className="mt-3 space-y-3">
              <div>
                <label className="block text-sm font-medium">Canal</label>
                <select
                  className="mt-1 w-full rounded border px-3 py-2"
                  value={notifyChannel}
                  onChange={(e) => setNotifyChannel(e.target.value as any)}
                >
                  <option value="WHATSAPP">WHATSAPP</option>
                  <option value="SMS">SMS</option>
                  <option value="EMAIL">EMAIL</option>
                  <option value="LIGACAO">LIGAÇÃO</option>
                  <option value="VOZ">VOZ (URA)</option>
                </select>
              </div>
              <label className="flex items-center gap-2 text-sm">
                <input type="checkbox" checked={notifyCuidador} onChange={(e) => setNotifyCuidador(e.target.checked)} />
                Notificar cuidador (se houver)
              </label>
            </div>
            <div className="mt-4 flex justify-end gap-2">
              <button className="rounded border px-4 py-2" onClick={() => { setNotifyOpen(false); setNotifyConsulta(null); }}>Cancelar</button>
              <button className="rounded bg-blue-600 px-4 py-2 text-white" onClick={confirmarNotificacao}>Enviar</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
