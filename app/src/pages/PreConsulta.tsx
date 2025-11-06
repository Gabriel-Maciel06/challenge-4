import { useEffect, useRef, useState } from "react";
import { Link, useParams } from "react-router-dom";
import { API_BASE_URL, enviarDeviceCheck } from "../services/api";
import consultaService from "../services/consultaService";
import { useToast } from "../components/Toast";
import Loading from "../components/Loading";
import Badge from "../components/Badge";

export default function PreConsulta() {
  const { id } = useParams();
  const [cameraOk, setCameraOk] = useState(false);
  const [microfoneOk, setMicrofoneOk] = useState(false);
  const [redeOk, setRedeOk] = useState<boolean | null>(null);
  const [msg, setMsg] = useState<string | null>(null);
  const [testingCamera, setTestingCamera] = useState(false);
  const [testingMic, setTestingMic] = useState(false);
  const [testingNet, setTestingNet] = useState(false);
  const [sending, setSending] = useState(false);
  const [cameraError, setCameraError] = useState<string | null>(null);
  const [micError, setMicError] = useState<string | null>(null);
  const [netError, setNetError] = useState<string | null>(null);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const camStreamRef = useRef<MediaStream | null>(null);
  const micStreamRef = useRef<MediaStream | null>(null);
  const { success, error: errorToast } = useToast();
  // Áudio (medição de nível)
  const [micLevel, setMicLevel] = useState(0); // 0..1
  const [micMeasuring, setMicMeasuring] = useState(false);
  const audioCtxRef = useRef<any>(null);
  const analyserRef = useRef<AnalyserNode | null>(null);
  const rafRef = useRef<number | null>(null);

  useEffect(() => {
    // Tenta checar permissões rapidamente ao entrar (silencioso)
    if (!navigator.mediaDevices?.getUserMedia) return;
    const silentCheck = async () => {
      try {
        const s = await navigator.mediaDevices.getUserMedia({ video: true, audio: true });
        // marca ambos ok, mas também libera preview se possível
        setCameraOk(true);
        setMicrofoneOk(true);
        // Mantém stream de câmera para o preview
        camStreamRef.current = s;
        if (videoRef.current) {
          videoRef.current.srcObject = s;
          videoRef.current.muted = true;
          await videoRef.current.play().catch(() => {});
        }
      } catch {
        // Sem permissões — usuário pode testar manualmente
      }
    };
    silentCheck();

    return () => {
      // Cleanup streams ao sair
      camStreamRef.current?.getTracks().forEach((t) => t.stop());
      micStreamRef.current?.getTracks().forEach((t) => t.stop());
      stopMicAnalysis();
    };
  }, []);

  async function testarCamera() {
    if (!navigator.mediaDevices?.getUserMedia) {
      setCameraError("Navegador não suporta getUserMedia");
      setCameraOk(false);
      return;
    }
    setTestingCamera(true);
    setCameraError(null);
    try {
      // Fecha stream anterior
      camStreamRef.current?.getTracks().forEach((t) => t.stop());
      const s = await navigator.mediaDevices.getUserMedia({ video: { width: 640, height: 360 } });
      camStreamRef.current = s;
      if (videoRef.current) {
        videoRef.current.srcObject = s;
        videoRef.current.muted = true;
        await videoRef.current.play().catch(() => {});
      }
      setCameraOk(true);
    } catch (e: any) {
      setCameraOk(false);
      setCameraError(e?.message || "Não foi possível acessar a câmera");
    } finally {
      setTestingCamera(false);
    }
  }

  async function testarMic() {
    if (!navigator.mediaDevices?.getUserMedia) {
      setMicError("Navegador não suporta getUserMedia");
      setMicrofoneOk(false);
      return;
    }
    setTestingMic(true);
    setMicError(null);
    try {
      // Fecha stream anterior
      micStreamRef.current?.getTracks().forEach((t) => t.stop());
      stopMicAnalysis();
      const s = await navigator.mediaDevices.getUserMedia({ audio: true });
      micStreamRef.current = s;
      setMicrofoneOk(true);
      startMicAnalysis(s);
      // Para não prender o microfone por muito tempo, encerramos automaticamente após alguns segundos
      window.setTimeout(() => {
        stopMicAnalysis();
      }, 10000);
    } catch (e: any) {
      setMicrofoneOk(false);
      setMicError(e?.message || "Não foi possível acessar o microfone");
    } finally {
      setTestingMic(false);
    }
  }

  function startMicAnalysis(stream: MediaStream) {
    try {
      const AudioCtx: any = (window as any).AudioContext || (window as any).webkitAudioContext;
      if (!AudioCtx) return;
      const audioCtx = new AudioCtx();
      audioCtxRef.current = audioCtx;
      const source = audioCtx.createMediaStreamSource(stream);
      const analyser = audioCtx.createAnalyser();
      analyser.fftSize = 512;
      analyserRef.current = analyser;
      source.connect(analyser);
      const data = new Uint8Array(analyser.frequencyBinCount);
      setMicMeasuring(true);
      const loop = () => {
        if (!analyserRef.current) return;
        analyserRef.current.getByteTimeDomainData(data);
        // Calcula RMS do sinal (0..1)
        let sum = 0;
        for (let i = 0; i < data.length; i++) {
          const v = (data[i] - 128) / 128; // -1..1
          sum += v * v;
        }
        const rms = Math.sqrt(sum / data.length);
        // Suaviza um pouco
        setMicLevel((prev) => prev * 0.6 + rms * 0.4);
        rafRef.current = requestAnimationFrame(loop);
      };
      rafRef.current = requestAnimationFrame(loop);
    } catch {
      // ignora falhas na análise
    }
  }

  function stopMicAnalysis() {
    if (rafRef.current) {
      cancelAnimationFrame(rafRef.current);
      rafRef.current = null;
    }
    try {
      analyserRef.current?.disconnect();
    } catch {}
    analyserRef.current = null;
    try {
      audioCtxRef.current?.close?.();
    } catch {}
    audioCtxRef.current = null;
    setMicMeasuring(false);
    setMicLevel(0);
    // Encerra o stream também
    if (micStreamRef.current) {
      micStreamRef.current.getTracks().forEach((t) => t.stop());
      micStreamRef.current = null;
    }
  }

  async function testarRede() {
    setTestingNet(true);
    setNetError(null);
    try {
      // Faz um ping rápido à API; qualquer resposta (mesmo 4xx/5xx) indica conexão OK
      const controller = new AbortController();
      const to = setTimeout(() => controller.abort(), 3500);
      try {
        const res = await fetch(`${API_BASE_URL}/api/consultas`, { method: "GET", signal: controller.signal });
        setRedeOk(true);
        if (!res.ok && res.status === 0) {
          // status 0 geralmente é CORS/network
          setRedeOk(false);
          setNetError("Não foi possível alcançar a API");
        }
      } finally {
        clearTimeout(to);
      }
    } catch (e: any) {
      setRedeOk(false);
      setNetError("Falha de conexão com a API");
    } finally {
      setTestingNet(false);
    }
  }

  async function enviar() {
    try {
      setSending(true);
      const result = await enviarDeviceCheck({
        consultaId: Number(id),
        cameraOk,
        microfoneOk,
        redeOk: !!redeOk,
      });
      // Após o envio, buscamos a consulta no backend para refletir o risco persistido (opção 1)
      let persistedRisk: number | undefined = undefined;
      try {
        const c = await consultaService.buscarPorId(Number(id));
        persistedRisk = (c as any)?.riscoAbsenteismo ?? undefined;
      } catch {
        // Se a API não persistiu ainda mas retornou novoRisco, aplicamos um PATCH de compatibilidade
        if (typeof result?.novoRisco === "number") {
          try {
            await consultaService.atualizar(Number(id), { riscoAbsenteismo: result.novoRisco } as any);
            persistedRisk = result.novoRisco;
          } catch {}
        }
      }

      const effective = persistedRisk ?? result?.novoRisco;
      setMsg(`Pronto para acessar o HC${effective !== undefined ? ` — risco atualizado: ${effective}%` : ""}`);
      success("Pré-consulta enviada!");
      // Persistência local simples
      try {
        const key = `precheck-${id}`;
        const status = cameraOk && microfoneOk && !!redeOk
          ? "OK"
          : (cameraOk === false || microfoneOk === false || redeOk === false)
            ? "FALHOU"
            : "PENDENTE";
        localStorage.setItem(key, JSON.stringify({ status, cameraOk, microfoneOk, redeOk: !!redeOk, at: Date.now() }));
      } catch {}
    } catch (e) {
      const msg = `Erro: ${String(e)}`;
      setMsg(msg);
      errorToast("Falha ao enviar device-check");
    } finally {
      setSending(false);
    }
  }

  return (
    <div className="mx-auto max-w-5xl p-6">
      <div className="flex flex-col gap-4 lg:flex-row">
        <div className="flex-1 space-y-4">
          <h1 className="text-2xl font-bold">
            Pré-consulta #{id}
            <span className="ml-2 align-middle"><Badge variant="paciente">Perfil: Paciente</Badge></span>
          </h1>

          {/* Ajuda */}
          <details className="rounded-md border bg-white p-4 shadow-sm">
            <summary className="cursor-pointer select-none text-sm font-medium text-slate-800">Problemas com câmera/microfone?</summary>
            <div className="mt-2 text-sm text-slate-600">
              Autorize o navegador a acessar a câmera e o microfone. Você pode revisar em Configurações do site → Permissões.
              Se estiver no celular, verifique se outros apps não estão usando a câmera. Atualize a página após permitir.
            </div>
          </details>

          {/* Teste de câmera */}
          <div className="rounded-lg bg-white p-4 shadow">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">Câmera</h2>
              <span className={`rounded-full px-3 py-1 text-xs ${cameraOk ? "bg-green-100 text-green-800" : cameraError ? "bg-red-100 text-red-800" : "bg-slate-100 text-slate-700"}`}>
                {cameraOk ? "OK" : cameraError ? "Falhou" : "Pendente"}
              </span>
            </div>
            <div className="mt-3 grid gap-4 md:grid-cols-2">
              <div>
                <div className="aspect-video w-full overflow-hidden rounded border bg-black/60">
                  <video ref={videoRef} playsInline className="h-full w-full object-contain" />
                </div>
              </div>
              <div className="flex flex-col justify-between">
                <p className="text-sm text-slate-600">Clique em “Testar câmera” para iniciar a pré-visualização. Se não aparecer imagem, verifique permissões.</p>
                <div className="mt-3 flex gap-2">
                  <button onClick={testarCamera} className="rounded bg-blue-600 px-3 py-2 text-white disabled:opacity-60" disabled={testingCamera}>
                    {testingCamera ? "Testando…" : "Testar câmera"}
                  </button>
                  {testingCamera && <Loading size={2} />}
                </div>
                {/* Mensagem detalhada de erro suprimida conforme solicitado */}
              </div>
            </div>
          </div>

          {/* Teste de microfone */}
          <div className="rounded-lg bg-white p-4 shadow">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">Microfone</h2>
              <span className={`rounded-full px-3 py-1 text-xs ${microfoneOk ? "bg-green-100 text-green-800" : micError ? "bg-red-100 text-red-800" : "bg-slate-100 text-slate-700"}`}>
                {microfoneOk ? "OK" : micError ? "Falhou" : "Pendente"}
              </span>
            </div>
            <div className="mt-2 text-sm text-slate-600">Clique em “Testar microfone”. Pode aparecer um pedido de permissão do navegador.</div>
            <div className="mt-3 flex items-center gap-2">
              <button onClick={testarMic} className="rounded bg-blue-600 px-3 py-2 text-white disabled:opacity-60" disabled={testingMic}>
                {testingMic ? "Testando…" : "Testar microfone"}
              </button>
              {testingMic && <Loading size={2} />}
              {micMeasuring && (
                <span className="text-xs text-slate-600">Medindo…</span>
              )}
            </div>
            {/* Mensagem detalhada de erro suprimida conforme solicitado */}
            {/* Barra de nível do microfone */}
            <div className="mt-3">
              <div className="mb-1 text-xs text-slate-600">Nível de áudio</div>
              <div className="h-3 w-full rounded bg-slate-200">
                <div
                  className="h-3 rounded bg-gradient-to-r from-emerald-500 via-yellow-400 to-red-500"
                  style={{ width: `${Math.min(100, Math.round(micLevel * 100))}%`, transition: "width 80ms linear" }}
                />
              </div>
            </div>
          </div>

          {/* Teste de conexão */}
          <div className="rounded-lg bg-white p-4 shadow">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-semibold text-gray-800">Conexão</h2>
              <span className={`rounded-full px-3 py-1 text-xs ${redeOk ? "bg-green-100 text-green-800" : redeOk === false ? "bg-red-100 text-red-800" : "bg-slate-100 text-slate-700"}`}>
                {redeOk ? "OK" : redeOk === false ? "Falhou" : "Pendente"}
              </span>
            </div>
            <div className="mt-2 text-sm text-slate-600">Fazemos um teste rápido com a API para verificar conectividade. Rede móvel pode variar.</div>
            <div className="mt-3 flex items-center gap-2">
              <button onClick={testarRede} className="rounded bg-blue-600 px-3 py-2 text-white disabled:opacity-60" disabled={testingNet}>
                {testingNet ? "Testando…" : "Testar conexão"}
              </button>
              {testingNet && <Loading size={2} />}
            </div>
            {netError && <div className="mt-2 rounded border border-red-200 bg-red-50 p-2 text-xs text-red-800">{netError}</div>}
          </div>
        </div>

        {/* Resumo e envio */}
        <aside className="w-full lg:w-80">
          <div className="sticky top-20 rounded-lg border bg-white p-4 shadow">
            <h3 className="text-base font-semibold text-slate-900">Resumo</h3>
            <ul className="mt-3 space-y-2 text-sm">
              <li className="flex items-center justify-between">
                <span>Câmera</span>
                <span className={`rounded px-2 py-0.5 text-xs ${cameraOk ? "bg-green-100 text-green-800" : (cameraError ? "bg-red-100 text-red-800" : "bg-slate-100 text-slate-700")}`}>
                  {cameraOk ? "OK" : (cameraError ? "Falhou" : "Pendente")}
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span>Microfone</span>
                <span className={`rounded px-2 py-0.5 text-xs ${microfoneOk ? "bg-green-100 text-green-800" : (micError ? "bg-red-100 text-red-800" : "bg-slate-100 text-slate-700")}`}>
                  {microfoneOk ? "OK" : (micError ? "Falhou" : "Pendente")}
                </span>
              </li>
              <li className="flex items-center justify-between">
                <span>Conexão</span>
                <span className={`rounded px-2 py-0.5 text-xs ${redeOk ? "bg-green-100 text-green-800" : redeOk === false ? "bg-red-100 text-red-800" : "bg-slate-100 text-slate-700"}`}>{redeOk ? "OK" : redeOk === false ? "Falhou" : "Pendente"}</span>
              </li>
            </ul>
            <button
              className="mt-4 w-full rounded-lg bg-blue-600 px-4 py-2 font-medium text-white disabled:opacity-60"
              onClick={enviar}
              disabled={sending || testingCamera || testingMic || testingNet}
            >
              {sending ? "Enviando…" : "Enviar device-check"}
            </button>
            {msg && (
              <div className="mt-3 rounded-lg border border-gray-200 bg-gray-50 p-3 text-xs text-gray-700">
                {msg}
              </div>
            )}
            <div className="mt-3 text-right">
              <Link to="/consultas" className="text-xs text-sky-700 hover:underline">Voltar para consultas</Link>
            </div>
          </div>
        </aside>
      </div>
    </div>
  );
}