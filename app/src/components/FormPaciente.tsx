import { useState } from "react";
import type { IPaciente, CanalPreferido } from "../types/paciente";

type Props = {
  initial?: Partial<IPaciente>;
  onCancel?: () => void;
  onSave: (payload: Partial<IPaciente>) => Promise<void> | void;
};

export default function FormPaciente({ initial = {}, onCancel, onSave }: Props) {
  const [nome, setNome] = useState(initial.nome || "");
  const [telefone, setTelefone] = useState(initial.telefone || "");
  const [canal, setCanal] = useState<CanalPreferido | "">(initial.canalPreferido || "");
  const [temCuidador, setTemCuidador] = useState(!!(initial.cuidadorNome || initial.cuidadorTelefone));
  const [cuidadorNome, setCuidadorNome] = useState(initial.cuidadorNome || "");
  const [cuidadorTelefone, setCuidadorTelefone] = useState(initial.cuidadorTelefone || "");
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({
        nome,
        telefone,
        canalPreferido: canal || undefined,
        cuidadorNome: temCuidador ? (cuidadorNome || undefined) : undefined,
        cuidadorTelefone: temCuidador ? (cuidadorTelefone || undefined) : undefined,
      });
    } finally {
      setSaving(false);
    }
  }

  return (
    <form onSubmit={submit} className="space-y-3">
      <div>
        <label className="block text-sm font-medium">Nome</label>
        <input value={nome} onChange={(e) => setNome(e.target.value)} required className="mt-1 block w-full rounded border px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm font-medium">Telefone</label>
        <input value={telefone} onChange={(e) => setTelefone(e.target.value)} className="mt-1 block w-full rounded border px-3 py-2" />
      </div>
      <div>
        <label className="block text-sm font-medium">Canal preferido</label>
        <select value={canal} onChange={(e) => setCanal(e.target.value as any)} className="mt-1 block w-full rounded border px-3 py-2">
          <option value="">-</option>
          <option value="WHATSAPP">WHATSAPP</option>
          <option value="SMS">SMS</option>
          <option value="LIGACAO">LIGAÇÃO</option>
        </select>
      </div>

      {/* Cuidador (opcional) */}
      <fieldset className="mt-4 rounded border p-3">
        <legend className="px-1 text-sm font-medium">Cuidador (opcional)</legend>
        <label className="mb-2 flex items-center gap-2 text-sm">
          <input type="checkbox" checked={temCuidador} onChange={(e) => setTemCuidador(e.target.checked)} />
          Este paciente tem cuidador
        </label>
        <div className="mt-2 grid gap-3 md:grid-cols-2">
          <div>
            <label className="block text-sm font-medium">Nome do cuidador</label>
            <input
              value={cuidadorNome}
              onChange={(e) => setCuidadorNome(e.target.value)}
              className="mt-1 block w-full rounded border px-3 py-2"
              disabled={!temCuidador}
              placeholder="Ex.: Maria da Silva"
            />
          </div>
          <div>
            <label className="block text-sm font-medium">Telefone do cuidador</label>
            <input
              value={cuidadorTelefone}
              onChange={(e) => setCuidadorTelefone(e.target.value)}
              className="mt-1 block w-full rounded border px-3 py-2"
              disabled={!temCuidador}
              placeholder="(11) 99999-9999"
            />
          </div>
        </div>
      </fieldset>

      <div className="flex gap-2">
        <button type="submit" disabled={saving} className="rounded bg-blue-600 text-white px-4 py-2">{saving ? "Salvando..." : "Salvar"}</button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="rounded border px-4 py-2">Cancelar</button>
        )}
      </div>
    </form>
  );
}
