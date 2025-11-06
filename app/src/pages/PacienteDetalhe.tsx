import { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import pacienteService from "../services/pacienteService";
import type { IPaciente } from "../types/paciente";
import Loading from "../components/Loading";
import Alert from "../components/Alert";
import FormPaciente from "../components/FormPaciente";
import { useToast } from "../components/Toast";

export default function PacienteDetalhe() {
  const { id } = useParams();
  const [paciente, setPaciente] = useState<IPaciente | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const { success, error: errorToast } = useToast();

  useEffect(() => {
    if (!id) return;
    async function load() {
      setLoading(true);
      setError(null);
      try {
        const data = await pacienteService.buscarPorId(Number(id));
        setPaciente(data);
      } catch (err) {
        console.error(err);
        setError("Não foi possível carregar o paciente");
        errorToast("Não foi possível carregar o paciente");
      } finally {
        setLoading(false);
      }
    }
    load();
  }, [id]);

  async function handleSave(payload: Partial<IPaciente>) {
    if (!paciente) return;
    try {
      const updated = await pacienteService.atualizar(paciente.id, payload);
      setPaciente(updated);
      success("Paciente atualizado com sucesso!");
      navigate("/pacientes");
    } catch (err) {
      console.error(err);
      const msg = (err as any)?.message || "Erro ao atualizar paciente";
      setError(msg);
      errorToast(msg);
    }
  }

  return (
    <div>
      <h1 className="text-2xl font-semibold">Detalhe do Paciente</h1>
      <div className="mt-4">
        {loading && <Loading />}
        {error && <Alert tipo="error" mensagem={error} />}
        {paciente && (
          <div className="rounded border bg-white p-4">
            <FormPaciente initial={paciente} onSave={handleSave} onCancel={() => navigate(-1)} />
          </div>
        )}
      </div>
    </div>
  );
}
