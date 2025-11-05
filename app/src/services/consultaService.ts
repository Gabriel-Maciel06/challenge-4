import { request, listarConsultas as _listAll, listarConsultasAltoRisco as _listHigh, confirmarConsulta as _confirm, mapConsulta } from "./api";
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
  return request<IConsulta>(`${PREFIX}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function atualizar(id: number, payload: Partial<IConsulta>): Promise<IConsulta> {
  return request<IConsulta>(`${PREFIX}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
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

export async function confirmar(id: number) {
  return _confirm(id);
}

export default { listar, buscarPorId, criar, atualizar, excluir, listarAltoRisco, listarTudo, confirmar };
