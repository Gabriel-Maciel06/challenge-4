import { Link } from "react-router-dom";
import React, { useEffect, useRef, useState } from "react";

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
    </main>
  );
}