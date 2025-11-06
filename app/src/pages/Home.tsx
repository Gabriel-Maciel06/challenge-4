import { Link } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";
import CardIndicador from "../components/CardIndicador";
import RiskBadge from "../components/RiskBadge";
import { listarConsultasAltoRisco, mapConsulta } from "../services/api";
import consultaService from "../services/consultaService";
import { useToast } from "../components/Toast";
import type { IConsultaComPaciente } from "../types/consulta";
import Loading from "../components/Loading";
import { formatDateTime } from "../utils/formatters";
import Badge from "../components/Badge";

// IMPORTS das imagens (se elas estão em src/assets/img)
import javaPng from "../assets/img/java.png";
import pythonPng from "../assets/img/python.png";
import chatbotPng from "../assets/img/chatbot.png";

type CardProps = {
  img: string;
  alt: string;
  title: string;
  children: React.ReactNode;
};

function Card({ img, alt, title, children }: CardProps) {
  return (
    <article
      className="rounded-2xl border border-black/5 bg-white p-8 text-center shadow-[0_12px_32px_rgba(0,0,0,0.06)] transition-all hover:-translate-y-1 hover:shadow-[0_24px_48px_rgba(0,0,0,0.08)]"
      role="listitem"
    >
      <img
        src={img}
        alt={alt}
        loading="lazy"
        decoding="async"
        className="mx-auto mb-5 h-[130px] w-[130px] rounded-xl object-contain p-2 shadow-inner"
      />
      <h3 className="mb-2 text-lg font-semibold text-sky-900">{title}</h3>
      <p className="text-[15px] leading-relaxed text-slate-600">{children}</p>
    </article>
  );
}

export default function Home() {
  // palavras para o efeito
  const words = useRef<string[]>(["dia a dia", "sucesso", "bem-estar"]);
  const [typed, setTyped] = useState("");
  const [wIndex, setWIndex] = useState(0);
  const [phase, setPhase] = useState<"typing" | "pausing" | "deleting">("typing");
  const T_SPEED = 70;
  const D_SPEED = 40;
  const PAUSE = 1000;

  // Estado para consultas de alto risco
  const [altoRisco, setAltoRisco] = useState<IConsultaComPaciente[]>([]);
  const [loadingAltoRisco, setLoadingAltoRisco] = useState(false);

  // Indicadores (dados reais)
  const [loadingIndicadores, setLoadingIndicadores] = useState(false);
  const [totalConsultas, setTotalConsultas] = useState<number>(0);
  const [totalConfirmadas, setTotalConfirmadas] = useState<number>(0);
  const { error: errorToast } = useToast();

  useEffect(() => {
    const current = words.current[wIndex] || "";

    if (phase === "typing") {
      if (typed.length < current.length) {
        const t = setTimeout(() => setTyped(current.slice(0, typed.length + 1)), T_SPEED);
        return () => clearTimeout(t);
      }
      const t = setTimeout(() => setPhase("pausing"), PAUSE);
      return () => clearTimeout(t);
    }

    if (phase === "deleting") {
      if (typed.length > 0) {
        const t = setTimeout(() => setTyped(current.slice(0, typed.length - 1)), D_SPEED);
        return () => clearTimeout(t);
      }
      // palavra apagada -> próxima
      setWIndex((i) => (i + 1) % words.current.length);
      setPhase("typing");
      return;
    }

    // pausing
    const t = setTimeout(() => setPhase("deleting"), PAUSE);
    return () => clearTimeout(t);
  }, [typed, phase, wIndex]);

  useEffect(() => {
    // Carrega alto risco (lista)
    setLoadingAltoRisco(true);
    listarConsultasAltoRisco()
      .then((r) => setAltoRisco(r.map(mapConsulta)))
      .catch((e) => {
        console.error(e);
        errorToast("Não foi possível carregar consultas de alto risco");
      })
      .finally(() => setLoadingAltoRisco(false));
  }, []);

  useEffect(() => {
    // Carrega todas as consultas e calcula totais
    async function loadIndicadores() {
      setLoadingIndicadores(true);
      try {
        const todas = await consultaService.listarTudo();
        const arr = todas || [];
        setTotalConsultas(arr.length);
        setTotalConfirmadas(arr.filter((c) => c.status === "CONFIRMADA").length);
      } catch (e) {
        console.error(e);
        errorToast("Não foi possível carregar os indicadores");
      } finally {
        setLoadingIndicadores(false);
      }
    }
    loadIndicadores();
  }, []);

  return (
    <main className="bg-slate-50">
      {/* HERO */}
      <section
        aria-label="Apresentação"
        className="relative overflow-hidden bg-gradient-to-br from-sky-500 via-sky-600 to-indigo-700 text-white"
      >
        <div className="mx-auto max-w-7xl px-4 py-20 text-center sm:px-6 lg:px-8">
          <h1 className="mx-auto max-w-4xl text-balance text-[clamp(2rem,7vw,3.2rem)] font-extrabold leading-tight tracking-tight">
            A nova forma de cuidar, para seu
            <br />
            <span className="align-middle">
              <span className="text-white">{typed}</span>
              <span
                aria-hidden="true"
                className="ml-0.5 inline-block w-[1px] animate-pulse bg-white align-middle"
                style={{ height: "1.1em" }}
              />
            </span>
          </h1>

          <p className="mx-auto mt-4 max-w-xl text-lg text-white/90">
            Uma solução intuitiva, acessível e centrada no usuário.
          </p>

          <div className="mt-3">
            <Badge variant="publico">Público</Badge>
          </div>

          <div className="mt-8">
            <Link
              to="/Sobre"
              className="relative inline-flex items-center justify-center rounded-full px-7 py-3 font-semibold text-indigo-700 transition hover:scale-[1.02] focus:outline-none focus-visible:ring-2 focus-visible:ring-white/60"
            >
              <span className="absolute inset-0 rounded-full bg-gradient-to-r from-purple-600 to-indigo-600" />
              <span className="absolute inset-[2px] rounded-full bg-white" />
              <span className="relative">Conheça o Projeto</span>
            </Link>
          </div>
        </div>
      </section>

      {/* INDICADORES */}
      <section className="mt-8">
        <div className="mx-auto max-w-6xl px-4">
          <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
            <CardIndicador title="Total de consultas" value={totalConsultas} loading={loadingIndicadores} />
            <CardIndicador title="Confirmadas" value={totalConfirmadas} loading={loadingIndicadores} />
            <CardIndicador title="Risco alto (total)" value={altoRisco.length} loading={loadingAltoRisco} />
          </div>
          
          {/* Lista de consultas de alto risco */}
          <div className="mt-6 rounded-lg bg-white p-4 shadow-md">
            <div className="mb-3 flex items-center justify-between">
              <h3 className="text-lg font-semibold text-gray-800">
                Consultas de Alto Risco
              </h3>
              <Link to="/consultas" className="text-xs font-medium text-sky-700 hover:text-sky-800">
                Ver todas
              </Link>
            </div>
            {loadingAltoRisco ? (
              <Loading size={3} />
            ) : altoRisco.length === 0 ? (
              <p className="text-sm text-slate-600">Nenhuma consulta de alto risco no momento.</p>
            ) : (
              <div className="space-y-2">
                {altoRisco.slice(0, 5).map((consulta) => (
                  <div key={consulta.id} className="flex items-center justify-between border-b border-gray-100 py-2">
                    <div className="flex items-center gap-3">
                      <span className="text-sm text-gray-700">
                        {consulta.paciente?.nome || `Paciente ID: ${consulta.pacienteId}`}
                      </span>
                      <RiskBadge value={consulta.riscoAbsenteismo ?? 0} />
                      <span className="text-xs text-slate-500 hidden sm:inline">{formatDateTime(consulta.dataHora)}</span>
                    </div>
                    <Link
                      to={`/pre-consulta/${consulta.id}`}
                      className="text-xs font-medium text-sky-700 hover:text-sky-800"
                    >
                      Pré-teste
                    </Link>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </section>

      {/* DESTAQUES */}
      <section
        aria-labelledby="destaques-title"
        className="bg-gradient-to-b from-slate-50 to-slate-100"
      >
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2
            id="destaques-title"
            className="mb-10 text-center text-2xl font-semibold text-sky-900"
          >
            Destaques
          </h2>

          <div role="list" className="grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
            <Card img={javaPng} alt="Ícone Java" title="Funcionalidade 1">
              Nosso backend em Java oferece endpoints seguros e inteligentes para
              integração com assistentes, posicionamento e validação de profissionais.
            </Card>

            <Card img={pythonPng} alt="Ícone Python" title="Funcionalidade 2">
              Com Python, criamos protótipos funcionais de agendamento e chatbot
              para reduzir o absenteísmo e aumentar a acessibilidade.
            </Card>

            <Card img={chatbotPng} alt="Ícone ChatBot" title="Funcionalidade 3">
              Nosso chatbot foi desenvolvido com foco na inclusão digital, oferecendo uma
              interface simples e intuitiva para idosos. Ele envia lembretes, orientações
              e tira dúvidas de forma clara, contribuindo diretamente para a redução do absenteísmo.
            </Card>
          </div>
        </div>
      </section>

      {/* PERFIS DE USUÁRIO */}
      <section aria-labelledby="perfis-title" className="bg-white">
        <div className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
          <h2 id="perfis-title" className="mb-10 text-center text-2xl font-semibold text-sky-900">
            Quem usa a plataforma
          </h2>
          <div role="list" className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            <article
              className="rounded-2xl border border-black/5 bg-white p-6 shadow-[0_12px_32px_rgba(0,0,0,0.05)]"
              role="listitem"
            >
              <div className="mb-3 flex items-center gap-2">
                <span className="text-2xl" aria-hidden>🩺</span>
                <h3 className="text-lg font-semibold text-slate-900">Equipe da clínica</h3>
                <span className="ml-auto"><Badge variant="equipe">Perfil</Badge></span>
              </div>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
                <li>Lista e agenda consultas</li>
                <li>Confirma presença e acompanha risco de absenteísmo</li>
                <li>Envia notificações (WhatsApp, SMS, E-mail, Ligação) — inclusive ao cuidador</li>
              </ul>
              <div className="mt-4">
                <Link to="/consultas" className="text-sm font-medium text-sky-700 hover:text-sky-800">Ir para Consultas →</Link>
              </div>
            </article>

            <article
              className="rounded-2xl border border-black/5 bg-white p-6 shadow-[0_12px_32px_rgba(0,0,0,0.05)]"
              role="listitem"
            >
              <div className="mb-3 flex items-center gap-2">
                <span className="text-2xl" aria-hidden>👵</span>
                <h3 className="text-lg font-semibold text-slate-900">Pacientes</h3>
                <span className="ml-auto"><Badge variant="paciente">Perfil</Badge></span>
              </div>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
                <li>Realizam o pré-teste da teleconsulta (câmera, microfone e conexão)</li>
                <li>Recebem lembretes e orientações do atendimento</li>
              </ul>
              <div className="mt-4">
                <span className="text-xs text-slate-500">Acesso via link da consulta</span>
              </div>
            </article>

            <article
              className="rounded-2xl border border-black/5 bg-white p-6 shadow-[0_12px_32px_rgba(0,0,0,0.05)]"
              role="listitem"
            >
              <div className="mb-3 flex items-center gap-2">
                <span className="text-2xl" aria-hidden>🧑‍🤝‍🧑</span>
                <h3 className="text-lg font-semibold text-slate-900">Cuidadores</h3>
                <span className="ml-auto"><Badge variant="warning">Opcional</Badge></span>
              </div>
              <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
                <li>Podem receber notificações e lembretes</li>
                <li>Apoiam o paciente na preparação e comparecimento</li>
              </ul>
              <div className="mt-4">
                <Link to="/consultas" className="text-sm font-medium text-sky-700 hover:text-sky-800">Configurar notificação →</Link>
              </div>
            </article>
          </div>
        </div>
      </section>
    </main>
  );
}