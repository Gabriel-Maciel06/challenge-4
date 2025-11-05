import { request, enviarNotificacao as _send } from "./api";
import type { INotificacao } from "../types/notificacao";

const PREFIX = "/api/notificacoes";

export async function listar(): Promise<INotificacao[]> {
  return request<INotificacao[]>(`${PREFIX}`);
}

export async function buscarPorId(id: number): Promise<INotificacao> {
  return request<INotificacao>(`${PREFIX}/${id}`);
}

export async function criar(payload: Partial<INotificacao>): Promise<INotificacao> {
  return request<INotificacao>(`${PREFIX}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function atualizar(id: number, payload: Partial<INotificacao>): Promise<INotificacao> {
  return request<INotificacao>(`${PREFIX}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function excluir(id: number): Promise<void> {
  return request<void>(`${PREFIX}/${id}`, { method: "DELETE" });
}

export const enviarNotificacao = _send;

export default { listar, buscarPorId, criar, atualizar, excluir, enviarNotificacao };
