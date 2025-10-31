import type { Integrante } from "../types/integrante";

const BASE = (import.meta.env.VITE_API_BASE_URL as string) || "https://api-java.example.com";
const PREFIX = "/integrantes"; // endpoint prefix; ajuste conforme a API Java

async function request<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const url = `${BASE}${path}`;
  const res = await fetch(url, opts);
  const text = await res.text();
  let body: any = null;
  try { body = text ? JSON.parse(text) : null; } catch { body = text; }
  if (!res.ok) {
    const message = (body && body.message) || body || res.statusText;
    throw new Error(`${res.status} ${res.statusText} - ${message}`);
  }
  return body as T;
}

export async function listIntegrantes(): Promise<Integrante[]> {
  return request<Integrante[]>(`${PREFIX}`);
}

export async function getIntegrante(rm: string): Promise<Integrante> {
  return request<Integrante>(`${PREFIX}/${encodeURIComponent(rm)}`);
}

export async function createIntegrante(payload: Partial<Integrante>): Promise<Integrante> {
  return request<Integrante>(`${PREFIX}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function updateIntegrante(rm: string, payload: Partial<Integrante>): Promise<Integrante> {
  return request<Integrante>(`${PREFIX}/${encodeURIComponent(rm)}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
}

export async function deleteIntegrante(rm: string): Promise<void> {
  await request<void>(`${PREFIX}/${encodeURIComponent(rm)}`, {
    method: "DELETE",
  });
}

export default {
  listIntegrantes,
  getIntegrante,
  createIntegrante,
  updateIntegrante,
  deleteIntegrante,
};
