export default function Sobre() {
  return (
    <main className="bg-gradient-to-b from-slate-50 to-white">
      <section className="mx-auto max-w-6xl px-4 py-16 sm:px-6 lg:px-8">
        {/* Cabeçalho */}
        <header className="text-center">
          <h1 className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            Nossa Solução
          </h1>
          <p className="mt-4 text-lg text-slate-600 max-w-2xl mx-auto">
            Transformamos um desafio real em uma solução intuitiva e poderosa — pensada para quem mais importa: o usuário.
          </p>
        </header>

        {/* Cards */}
        <div className="mt-12 grid grid-cols-1 gap-8 md:grid-cols-2 lg:grid-cols-3">
          {/* Sistema de enquadramento */}
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
            <img
              src="src/assets/img/facial.png"
              alt="Sistema de enquadramento"
              className="mx-auto mb-4 h-28 w-28 rounded-xl object-contain p-2 shadow-inner"
              loading="lazy"
              decoding="async"
            />
            <h2 className="text-lg font-semibold text-slate-900">Sistema de enquadramento</h2>
            <p className="mt-2 text-slate-600 text-sm leading-relaxed">
              O sistema de enquadramento da TeleCare usa visão computacional para ajudar o paciente idoso a se
              posicionar corretamente na frente da câmera, garantindo uma teleconsulta mais eficiente e sem
              complicações.
            </p>
          </article>

          {/* Gestão Inteligente */}
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
            <img
              src="src/assets/img/gestao.png"
              alt="Gestão Inteligente"
              className="mx-auto mb-4 h-28 w-28 rounded-xl object-contain p-2 shadow-inner"
              loading="lazy"
              decoding="async"
            />
            <h2 className="text-lg font-semibold text-slate-900">Gestão Inteligente</h2>
            <p className="mt-2 text-slate-600 text-sm leading-relaxed">
              O sistema de enquadramento da TeleCare usa visão computacional para ajudar o paciente idoso a se
              posicionar corretamente na frente da câmera, garantindo uma teleconsulta mais eficiente e sem
              complicações.
            </p>
          </article>

          {/* Chatbot */}
          <article className="rounded-2xl border border-slate-200 bg-white p-6 shadow-sm hover:shadow-md transition">
            <img
              src="src/assets/img/chatbot.png"
              alt="Chatbot"
              className="mx-auto mb-4 h-28 w-28 rounded-xl object-contain p-2 shadow-inner"
              loading="lazy"
              decoding="async"
            />
            <h2 className="text-lg font-semibold text-slate-900">Chatbot</h2>
            <p className="mt-2 text-slate-600 text-sm leading-relaxed">
              O chatbot da TeleCare lembra, orienta e acompanha o paciente idoso antes, durante e após a teleconsulta
              para reduzir faltas e facilitar o atendimento.
            </p>
          </article>
        </div>
      </section>

    </main>
  );
}