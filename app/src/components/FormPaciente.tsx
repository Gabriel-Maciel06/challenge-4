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
  const [saving, setSaving] = useState(false);

  async function submit(e: React.FormEvent) {
    e.preventDefault();
    setSaving(true);
    try {
      await onSave({ nome, telefone, canalPreferido: canal || undefined });
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

      <div className="flex gap-2">
        <button type="submit" disabled={saving} className="rounded bg-blue-600 text-white px-4 py-2">{saving ? "Salvando..." : "Salvar"}</button>
        {onCancel && (
          <button type="button" onClick={onCancel} className="rounded border px-4 py-2">Cancelar</button>
        )}
      </div>
    </form>
  );
}
