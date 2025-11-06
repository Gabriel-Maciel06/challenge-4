export type CanalPreferido = "WHATSAPP" | "SMS" | "LIGACAO";

export interface IPaciente {
  id: number;
  nome: string;
  telefone?: string;
  canalPreferido?: CanalPreferido;
  cuidadorNome?: string;
  cuidadorTelefone?: string;
}

export type PacienteCreate = Omit<IPaciente, "id">;
