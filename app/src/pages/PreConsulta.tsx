import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { enviarDeviceCheck } from "../services/api";

export default function PreConsulta() {
  const { id } = useParams();
  const [cameraOk, setCameraOk] = useState(false);
  const [microfoneOk, setMicrofoneOk] = useState(false);
  const [redeOk, setRedeOk] = useState(true);
  const [msg, setMsg] = useState<string | null>(null);

  useEffect(() => {
    navigator.mediaDevices?.getUserMedia({ video: true, audio: true })
      .then(stream => { 
        setCameraOk(true); 
        setMicrofoneOk(true); 
        stream.getTracks().forEach(t => t.stop()); 
      })
      .catch(() => { 
        /* usuário pode marcar manualmente */ 
      });
  }, []);

  async function enviar() {
    try {
      const result = await enviarDeviceCheck({
        consultaId: Number(id),
        cameraOk, 
        microfoneOk, 
        redeOk
      });
      setMsg(`Pronto para acessar o HC${result?.novoRisco !== undefined ? ` — novo risco: ${result.novoRisco}%` : ""}`);
    } catch (e) {
      setMsg(`Erro: ${String(e)}`);
    }
  }

  return (
    <div className="mx-auto max-w-2xl p-6">
      <div className="space-y-4">
        <h1 className="text-2xl font-bold">Pré-consulta #{id}</h1>
        
        <div className="rounded-lg bg-white p-6 shadow-md">
          <h2 className="mb-4 text-lg font-semibold text-gray-800">Verificação de Dispositivos</h2>
          
          <div className="space-y-4">
            <label className="flex items-center gap-3">
              <input 
                type="checkbox" 
                checked={cameraOk} 
                onChange={e => setCameraOk(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Câmera OK</span>
            </label>
            
            <label className="flex items-center gap-3">
              <input 
                type="checkbox" 
                checked={microfoneOk} 
                onChange={e => setMicrofoneOk(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Microfone OK</span>
            </label>
            
            <label className="flex items-center gap-3">
              <input 
                type="checkbox" 
                checked={redeOk} 
                onChange={e => setRedeOk(e.target.checked)}
                className="h-4 w-4 rounded border-gray-300 text-blue-600 focus:ring-blue-500"
              />
              <span className="text-sm text-gray-700">Conexão OK</span>
            </label>
          </div>
          
          <button 
            className="mt-6 w-full rounded-lg bg-blue-600 px-4 py-2 text-white font-medium hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2"
            onClick={enviar}
          >
            Enviar device-check
          </button>
          
          {msg && (
            <div className="mt-4 rounded-lg border border-gray-200 bg-gray-50 p-3 text-sm text-gray-700">
              {msg}
            </div>
          )}
        </div>
      </div>
    </div>
  );
}