import { request } from "./api";
import type { IMedico, MedicoCreate } from "../types/medico";

// Permite sobrescrever a rota via env (por exemplo, VITE_MEDICOS_PATH=/medicos)
const ENV_PATH = (import.meta as any).env?.VITE_MEDICOS_PATH as string | undefined;
const CANDIDATES = (
  ENV_PATH && ENV_PATH.trim()
    ? [ENV_PATH.trim()]
    : [
        "/api/medicos",
        "/medicos",
        "/api/medicos/list",
        "/medicos/list",
      ]
);

function mapFromApi(m: any): IMedico {
  const norm: Record<string, any> = {};
  Object.keys(m || {}).forEach((k) => (norm[k.replace(/_/g, "").toLowerCase()] = m[k]));
  return {
    id: norm["idmedico"] ?? norm["id"],
    nome: norm["nmedico"] ?? norm["nome"],
    especialidade: norm["dsespecialidade"] ?? norm["especialidade"],
  } as IMedico;
}

async function tryList(paths: string[]): Promise<any[]> {
  let lastErr: any;
  for (const p of paths) {
    try {
      const data: any = await request<any>(p);
      if (Array.isArray(data)) return data;
      if (Array.isArray(data?.content)) return data.content;
      if (Array.isArray(data?.items)) return data.items;
      // Se vier objeto único por engano, embrulha em array
      if (data && typeof data === "object") return [data];
      return [];
    } catch (e) {
      lastErr = e;
    }
  }
  throw lastErr;
}

export async function listar(): Promise<IMedico[]> {
  const arr = await tryList(CANDIDATES);
  return (arr || []).map(mapFromApi).filter((m) => m?.id != null && m?.nome);
}

// Mantém os demais métodos apontando para o primeiro candidato ou ENV (quando aplicável)
const BASE = CANDIDATES[0] || "/api/medicos";

export async function buscarPorId(id: number): Promise<IMedico> {
  const d = await request<any>(`${BASE}/${id}`);
  return mapFromApi(d);
}

export async function criar(payload: MedicoCreate): Promise<IMedico> {
  const body: Record<string, unknown> = {
    // padrão front
    nome: payload.nome,
    especialidade: payload.especialidade ?? null,
    // camelCase (Java getters)
    nmMedico: payload.nome,
    dsEspecialidade: payload.especialidade ?? null,
    // snake_case
    nm_medico: payload.nome,
    ds_especialidade: payload.especialidade ?? null,
  };
  const created = await request<any>(`${BASE}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return mapFromApi(created);
}

export async function atualizar(id: number, payload: Partial<MedicoCreate>): Promise<IMedico> {
  const body: Record<string, unknown> = {
    nome: payload.nome,
    especialidade: payload.especialidade ?? null,
    nmMedico: payload.nome,
    dsEspecialidade: payload.especialidade ?? null,
    nm_medico: payload.nome,
    ds_especialidade: payload.especialidade ?? null,
  };
  const updated = await request<any>(`${BASE}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  return mapFromApi(updated);
}

export async function excluir(id: number): Promise<void> {
  await request<void>(`${BASE}/${id}`, { method: "DELETE" });
}

export default { listar, buscarPorId, criar, atualizar, excluir };
