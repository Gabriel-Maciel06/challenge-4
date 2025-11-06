import { useEffect, useState } from "react";
import type { IConsulta } from "../types/consulta";
import pacienteService from "../services/pacienteService";
import medicoService from "../services/medicoService";
import type { IPaciente } from "../types/paciente";
import type { IMedico } from "../types/medico";

type Props = {
  initial?: Partial<IConsulta>;
  onCancel?: () => void;
  onSave: (payload: Partial<IConsulta>) => Promise<void> | void;
};

export default function FormConsulta({ initial = {}, onCancel, onSave }: Props) {
  const [pacienteId, setPacienteId] = useState<number | "">(initial.pacienteId ?? "");
  const [medicoId, setMedicoId] = useState<number | "">(initial.medicoId ?? "");
  const [dataHora, setDataHora] = useState(initial.dataHora || "");
  const [saving, setSaving] = useState(false);
  const [loadingLists, setLoadingLists] = useState(false);
  const [pacientes, setPacientes] = useState<IPaciente[]>([]);
  const [medicos, setMedicos] = useState<IMedico[]>([]);
  

  useEffect(() => {
    if (initial.pacienteId) setPacienteId(initial.pacienteId);
    if (initial.medicoId) setMedicoId(initial.medicoId);
    if (initial.dataHora) setDataHora(initial.dataHora);
  }, [initial]);

  useEffect(() => {
    async function loadLists() {
      setLoadingLists(true);
      try {
        const [ps, ms] = await Promise.all([
          pacienteService.listar().catch(() => []),
          medicoService.listar().catch(() => []),
        ]);
        setPacientes(ps || []);
        setMedicos(ms || []);
        // Pré-seleciona primeiro médico caso não tenha nenhum definido
        if (!initial.medicoId && (ms?.length ?? 0) > 0) {
          setMedicoId(ms[0].id);
        }
      } finally {
        setLoadingLists(false);
      }
    }
    loadLists();
  }, [initial.medicoId]);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      // dataHora vem de input type=datetime-local no formato YYYY-MM-DDTHH:mm
      const normalized = dataHora && dataHora.length === 16 ? `${dataHora}:00` : dataHora;
      await onSave({ pacienteId: Number(pacienteId), medicoId: Number(medicoId), dataHora: normalized, status: "AGENDADA", riscoAbsenteismo: 0 } as any);
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <label className="block text-sm font-medium">Paciente</label>
        <select
          value={pacienteId === "" ? "" : String(pacienteId)}
          onChange={(e) => setPacienteId(e.target.value === "" ? "" : Number(e.target.value))}
          required
          className="mt-1 block w-full rounded border px-3 py-2"
          disabled={loadingLists}
        >
          <option value="">Selecione…</option>
          {(pacientes || []).map((p) => (
            <option key={p.id} value={p.id}>
              {p.nome} #{p.id}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium">Médico</label>
        <select
          value={medicoId === "" ? "" : String(medicoId)}
          onChange={(e) => setMedicoId(e.target.value === "" ? "" : Number(e.target.value))}
          required
          className="mt-1 block w-full rounded border px-3 py-2"
          disabled={loadingLists}
        >
          <option value="">Selecione…</option>
          {(medicos || []).map((m) => (
            <option key={m.id} value={m.id}>
              {m.nome} {m.especialidade ? `— ${m.especialidade}` : ""} #{m.id}
            </option>
          ))}
        </select>
      </div>
      <div>
        <label className="block text-sm font-medium">Data e hora</label>
        <input type="datetime-local" value={dataHora} required onChange={(e) => setDataHora(e.target.value)} className="mt-1 block w-full rounded border px-3 py-2" />
      </div>
      <div className="flex gap-2">
        <button type="submit" disabled={saving} className="rounded bg-blue-600 text-white px-4 py-2">{saving ? "Salvando..." : "Salvar"}</button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="rounded border px-4 py-2">Cancelar</button>
        )}
      </div>
    </form>
  );
}
