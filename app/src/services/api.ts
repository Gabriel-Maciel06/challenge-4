// API genérica pronta para integração com backend Java
export const API_BASE_URL = (import.meta.env.VITE_API_URL as string) || "http://localhost:8080";

export async function request<T>(path: string, opts: RequestInit = {}): Promise<T> {
  const url = `${API_BASE_URL}${path}`;
  try {
    const res = await fetch(url, opts);
    const text = await res.text();
    let body: any = null;
    try { body = text ? JSON.parse(text) : null; } catch { body = text; }
    if (!res.ok) {
      const message = (body && (typeof body === "string" ? body : body.message)) || body || res.statusText;
      const pretty = typeof message === "string" ? message : JSON.stringify(message);
      throw new Error(`${res.status} ${res.statusText} - ${pretty}`);
    }
    return body as T;
  } catch (err) {
    // rethrow para o consumer tratar
    throw err;
  }
}

// Integração com 'integrantes' via API removida: usamos apenas o arquivo local integrantes.json

// Consultas
export async function listarConsultas() {
  return request<import("../types/consulta").ConsultaApi[]>("/api/consultas");
}

export async function listarConsultasAltoRisco() {
  return request<import("../types/consulta").ConsultaApi[]>("/api/consultas/alto-risco");
}

export async function confirmarConsulta(id: number) {
  // Novo contrato do backend: POST /api/consultas/{id}/confirmar retorna a consulta atualizada
  return request<import("../types/consulta").ConsultaApi>(`/api/consultas/${id}/confirmar`, { method: "POST" });
}

// Notificações
export async function enviarNotificacao(payload: {
  consultaId: number;
  canal: "WHATSAPP" | "SMS" | "EMAIL" | "VOZ" | "LIGACAO";
  paraCuidador?: boolean;
}) {
  // Backend Java validou idConsulta e dsCanal; enviamos todas as convenções
  const body: Record<string, unknown> = {
    // nomes já usados no front
    consultaId: payload.consultaId,
    canal: payload.canal,
    paraCuidador: payload.paraCuidador ?? false,

    // camelCase esperado pelo backend
    idConsulta: payload.consultaId,
    dsCanal: payload.canal,

    // snake_case de fallback
    id_consulta: payload.consultaId,
    ds_canal: payload.canal,
  };

  return request<{ ok: true }>(`/api/notificacoes`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

// Device-check
export async function enviarDeviceCheck(payload: {
  consultaId: number;
  cameraOk: boolean;
  microfoneOk: boolean;
  redeOk: boolean;
}) {
  // Backend espera campos como idConsulta / id_consulta e flags 'S'/'N' para os checks
  const yesNo = (v: boolean) => (v ? 'S' : 'N');
  const body: Record<string, unknown> = {
    // front-friendly
    consultaId: payload.consultaId,
    cameraOk: payload.cameraOk,
    microfoneOk: payload.microfoneOk,
    redeOk: payload.redeOk,

    // camelCase expected by some backends
    idConsulta: payload.consultaId,
    stCameraOk: yesNo(payload.cameraOk),
    stMicrofoneOk: yesNo(payload.microfoneOk),
    stConexaoOk: yesNo(payload.redeOk),

    // snake_case fallback
    id_consulta: payload.consultaId,
    st_camera_ok: yesNo(payload.cameraOk),
    st_microfone_ok: yesNo(payload.microfoneOk),
    st_conexao_ok: yesNo(payload.redeOk),

    // dt_teste: backend pode gerar por conta própria; incluímos timestamp como fallback
    dtTeste: new Date().toISOString(),
    dt_teste: new Date().toISOString(),
  };

  return request<{ ok: true; novoRisco?: number }>(`/api/device-check`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
}

// Mapper tolerante para converter objetos de consulta vindos do backend
// Aceita diferentes convenções de nomes (idConsulta/id_consulta, dtConsulta, stConsulta, vlRiscoAbs, risco_absenteismo, etc.)
export function mapConsulta(c: any): import("../types/consulta").IConsultaComPaciente {
  const norm: Record<string, any> = {};
  Object.keys(c || {}).forEach((k) => (norm[k.replace(/_/g, "").toLowerCase()] = (c as any)[k]));

  const id = norm["id"] ?? norm["idconsulta"] ?? c?.id ?? c?.idConsulta;
  const pacienteId = norm["pacienteid"] ?? norm["idpaciente"] ?? c?.pacienteId ?? c?.idPaciente;
  const medicoId = norm["medicoid"] ?? norm["idmedico"] ?? c?.medicoId ?? c?.idMedico;
  const dataHora = norm["datahora"] ?? norm["dtconsulta"] ?? c?.dataHora ?? c?.dtConsulta;
  const status = norm["status"] ?? norm["stconsulta"] ?? c?.status ?? c?.stConsulta;
  const risco = norm["riscoabsenteismo"] ?? norm["vlriscoabs"] ?? (c as any)?.risco_absenteismo ?? c?.riscoAbsenteismo ?? 0;
  const paciente = c?.paciente; // caso venha aninhado

  return {
    id,
    pacienteId,
    medicoId,
    dataHora,
    status,
    riscoAbsenteismo: typeof risco === "number" ? risco : Number(risco) || 0,
    paciente,
  } as import("../types/consulta").IConsultaComPaciente;
}

export default { API_BASE_URL, request };
