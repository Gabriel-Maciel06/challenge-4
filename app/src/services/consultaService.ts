import { request, listarConsultas as _listAll, listarConsultasAltoRisco as _listHigh, mapConsulta, confirmarConsulta as _confirmApi } from "./api";
import type { IConsulta, IConsultaComPaciente } from "../types/consulta";

const PREFIX = "/api/consultas";

export async function listar(query?: { data?: string }): Promise<IConsultaComPaciente[]> {
  const params = query?.data ? `?data=${encodeURIComponent(query.data)}` : "";
  return request<IConsultaComPaciente[]>(`${PREFIX}${params}`);
}

export async function buscarPorId(id: number): Promise<IConsulta> {
  return request<IConsulta>(`${PREFIX}/${id}`);
}

export async function criar(payload: Partial<IConsulta>): Promise<IConsulta> {
  // Normaliza data-hora para um formato aceito pelo backend (LocalDateTime)
  const raw = payload.dataHora || "";
  const normalized = raw && raw.length === 16 && raw.includes("T") ? `${raw}:00` : raw; // YYYY-MM-DDTHH:mm -> +:ss

  // Envia ambas convenções de nomes (camelCase e snake_case)
  const body: Record<string, unknown> = {
    // nomes usados no front
    pacienteId: payload.pacienteId,
    medicoId: payload.medicoId,
    dataHora: normalized,
    status: payload.status ?? "AGENDADA",
    riscoAbsenteismo: payload.riscoAbsenteismo ?? 0,

    // nomes esperados pelo backend Java (camelCase)
    idPaciente: payload.pacienteId,
    idMedico: payload.medicoId,
    dtConsulta: normalized,
    dsTipo: (payload as any).dsTipo ?? "ONLINE",
    stConsulta: payload.status ?? "AGENDADA",
    vlRiscoAbs: payload.riscoAbsenteismo ?? 0,

    // snake_case
    id_paciente: payload.pacienteId,
    id_medico: payload.medicoId,
    dt_consulta: normalized,
    ds_tipo: (payload as any).dsTipo ?? "ONLINE",
    st_consulta: payload.status ?? "AGENDADA",
    vl_risco_abs: payload.riscoAbsenteismo ?? 0,
  };

  return request<IConsulta>(`${PREFIX}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export async function atualizar(id: number, payload: Partial<IConsulta>): Promise<IConsulta> {
  // Para compatibilidade com backend Java, mapeia nomes alternativos quando possível
  const raw = payload.dataHora || "";
  const normalized = raw && raw.length >= 16 && raw.includes("T") && raw.length <= 19 ? (raw.length === 16 ? `${raw}:00` : raw) : raw;
  const body: Record<string, unknown> = {
    // nomes do front
    pacienteId: payload.pacienteId,
    medicoId: payload.medicoId,
    dataHora: normalized ?? payload.dataHora,
    status: payload.status,
    riscoAbsenteismo: payload.riscoAbsenteismo,

    // camelCase esperados no Java
    idPaciente: payload.pacienteId,
    idMedico: payload.medicoId,
    dtConsulta: normalized ?? payload.dataHora,
    dsTipo: (payload as any).dsTipo,
    stConsulta: payload.status,
    vlRiscoAbs: payload.riscoAbsenteismo,

    // snake_case
    id_paciente: payload.pacienteId,
    id_medico: payload.medicoId,
    dt_consulta: normalized ?? payload.dataHora,
    ds_tipo: (payload as any).dsTipo,
    st_consulta: payload.status,
    vl_risco_abs: payload.riscoAbsenteismo,
  };
  return request<IConsulta>(`${PREFIX}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

export async function excluir(id: number): Promise<void> {
  return request<void>(`${PREFIX}/${id}`, { method: "DELETE" });
}

export async function listarAltoRisco() {
  const res = await _listHigh();
  return res.map(mapConsulta);
}

export async function listarTudo() {
  const res = await _listAll();
  return res.map(mapConsulta);
}

export async function confirmar(c: IConsulta | IConsultaComPaciente) {
  // Preferimos o novo endpoint do backend: POST /api/consultas/{id}/confirmar
  try {
    const updated = await _confirmApi(c.id);
    // Tenta mapear usando mapConsulta (formato esperado) ou um normalizador tolerante
    try {
      return mapConsulta(updated as any);
    } catch {
      return mapAnyConsulta(updated as any);
    }
  } catch (e) {
    // Fallback: PUT /api/consultas/{id} com status CONFIRMADA
    const raw = c.dataHora || "";
    const normalized = raw && raw.length === 16 && raw.includes("T") ? `${raw}:00` : raw;
    const body: Partial<IConsulta> & any = {
      pacienteId: c.pacienteId,
      medicoId: c.medicoId,
      dataHora: normalized || c.dataHora,
      status: "CONFIRMADA",
      riscoAbsenteismo: c.riscoAbsenteismo ?? 0,
      dsTipo: (c as any).dsTipo ?? "ONLINE",
    };
    return atualizar(c.id, body);
  }
}

// Normalizador tolerante a diferentes convenções de campo (idConsulta/id_consulta etc.)
function mapAnyConsulta(c: any): IConsultaComPaciente {
  const norm: Record<string, any> = {};
  Object.keys(c || {}).forEach((k) => (norm[k.replace(/_/g, "").toLowerCase()] = c[k]));
  // Alguns backends retornam paciente embutido com chaves variadas; preserva se vier
  const paciente = c?.paciente ?? c?.Paciente ?? c?.PACIENTE;
  return {
    id: norm["id"] ?? norm["idconsulta"] ?? c?.id ?? c?.idConsulta,
    pacienteId: norm["pacienteid"] ?? norm["idpaciente"] ?? c?.pacienteId ?? c?.idPaciente,
    medicoId: norm["medicoid"] ?? norm["idmedico"] ?? c?.medicoId ?? c?.idMedico,
    dataHora: norm["datahora"] ?? norm["dtconsulta"] ?? c?.dataHora ?? c?.dtConsulta,
    status: (norm["status"] ?? norm["stconsulta"] ?? c?.status ?? c?.stConsulta) as any,
    riscoAbsenteismo: norm["riscoabsenteismo"] ?? norm["vlriscoabs"] ?? c?.riscoAbsenteismo ?? c?.vlRiscoAbs ?? 0,
    paciente,
  } as IConsultaComPaciente;
}

export default { listar, buscarPorId, criar, atualizar, excluir, listarAltoRisco, listarTudo, confirmar };
