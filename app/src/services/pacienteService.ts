import { request } from "./api";
import type { IPaciente, PacienteCreate } from "../types/paciente";

// Endpoints expostos pelo backend Java
const PREFIX = "/api/pacientes";

// Tipagem da API Java (snake_case vindo do DAO/Controller)
type PacienteApi = {
  id_paciente: number;
  nm_paciente: string;
  ds_telefone?: string | null;
  ds_canal_pref?: "WHATSAPP" | "SMS" | "LIGACAO" | null;
  nm_cuidador?: string | null;
  ds_tel_cuidador?: string | null;
  vl_total_faltas?: number | null;
};

// Variante camelCase caso o backend serialize getters Java (ex.: getIdPaciente)
type PacienteApiCamel = {
  idPaciente: number;
  nmPaciente: string;
  dsTelefone?: string | null;
  dsCanalPref?: "WHATSAPP" | "SMS" | "LIGACAO" | null;
  nmCuidador?: string | null;
  dsTelCuidador?: string | null;
  vlTotalFaltas?: number | null;
};

// Converte PacienteApi -> IPaciente (formato usado no front)
function mapFromApi(p: PacienteApi | PacienteApiCamel | Record<string, any>): IPaciente {
  // Normaliza chaves removendo underscores e lower-case para mapear diferentes convenções
  const norm: Record<string, any> = {};
  Object.keys(p || {}).forEach((k) => {
    norm[k.replace(/_/g, "").toLowerCase()] = (p as any)[k];
  });

  const id = norm["idpaciente"] ?? norm["id"] ?? (p as any).id_paciente ?? (p as any).idPaciente;
  const nome = norm["nmpaciente"] ?? norm["nome"] ?? (p as any).nm_paciente ?? (p as any).nmPaciente;
  const telefone = norm["dstelefone"] ?? norm["telefone"] ?? (p as any).ds_telefone ?? (p as any).dsTelefone;
  const canal = norm["dscanalpref"] ?? norm["canalpreferido"] ?? norm["canal"] ?? (p as any).ds_canal_pref ?? (p as any).dsCanalPref;
  const cuidadorNome = norm["nmcuidador"] ?? (p as any).nm_cuidador ?? (p as any).nmCuidador;
  const cuidadorTelefone = norm["dstelcuidador"] ?? (p as any).ds_tel_cuidador ?? (p as any).dsTelCuidador;

  return {
    id,
    nome,
    telefone: telefone || undefined,
    canalPreferido: (canal || undefined) as IPaciente["canalPreferido"],
    cuidadorNome: cuidadorNome || undefined,
    cuidadorTelefone: cuidadorTelefone || undefined,
  };
}

// Converte payload do front -> formato esperado pelo backend Java
function mapToApi(payload: Partial<PacienteCreate>) {
  // Envia os dois formatos (snake_case e camelCase) para compatibilidade com diferentes serializadores Java
  const body: Record<string, unknown> = {
    // snake_case
    nm_paciente: payload.nome,
    ds_telefone: payload.telefone ?? null,
    ds_canal_pref: payload.canalPreferido ?? null,
  nm_cuidador: payload.cuidadorNome ?? null,
  ds_tel_cuidador: payload.cuidadorTelefone ?? null,
    vl_total_faltas: 0,

    // camelCase
    nmPaciente: payload.nome,
    dsTelefone: payload.telefone ?? null,
    dsCanalPref: payload.canalPreferido ?? null,
  nmCuidador: payload.cuidadorNome ?? null,
  dsTelCuidador: payload.cuidadorTelefone ?? null,
    vlTotalFaltas: 0,
  };
  return body;
}

export async function listar(): Promise<IPaciente[]> {
  const data = await request<any>(`${PREFIX}`);
  const arr: any[] = Array.isArray(data) ? data : (data?.content ?? data?.items ?? []);
  return (arr || []).map(mapFromApi);
}

export async function buscarPorId(id: number): Promise<IPaciente> {
  const d = await request<PacienteApi | PacienteApiCamel>(`${PREFIX}/${id}`);
  return mapFromApi(d);
}

export async function criar(payload: PacienteCreate): Promise<IPaciente> {
  const body = mapToApi(payload);
  const created = await request<PacienteApi>(`${PREFIX}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return mapFromApi(created);
}

export async function atualizar(id: number, payload: Partial<PacienteCreate>): Promise<IPaciente> {
  const body = mapToApi(payload);
  const updated = await request<PacienteApi>(`${PREFIX}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return mapFromApi(updated);
}

export async function excluir(id: number): Promise<void> {
  return request<void>(`${PREFIX}/${id}`, { method: "DELETE" });
}

export default { listar, buscarPorId, criar, atualizar, excluir };
