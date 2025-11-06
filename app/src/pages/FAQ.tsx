import { Link } from "react-router-dom";
import Accordion from "../components/Accordion";
import Badge from "../components/Badge";

type Item = { id: string; title: string; content: React.ReactNode };

const items: Item[] = [
  {
    id: "o-que-e",
    title: "O que é o projeto TELECARE+?",
    content: <>Um sistema pensado para conectar pessoas a serviços de cuidado digital de forma intuitiva e acessível.</>,
  },
  {
    id: "tecnologias",
    title: "Vocês utilizam alguma tecnologia específica?",
    content: (
      <>
        Nesta Sprint usamos <strong>React + Vite + TypeScript</strong> e <strong>TailwindCSS</strong>.
        (Na Sprint anterior, o protótipo foi feito com HTML5, CSS3 e JavaScript puro.)
      </>
    ),
  },
  {
    id: "mobile",
    title: "O projeto é compatível com dispositivos móveis?",
    content: (
      <>
        Sim. O layout segue abordagem <strong>mobile-first</strong> e é totalmente responsivo (XS→XL).
      </>
    ),
  },
  {
    id: "o-que-a-ferramenta-faz",
    title: "O que a nossa ferramenta faz?",
    content: (
      <>
        A plataforma ajuda a reduzir o absenteísmo em consultas através de:
        <ul className="mt-2 list-disc pl-6">
          <li>Agendamento e gestão de consultas com indicação de <strong>risco de falta</strong>.</li>
          <li>Envio de <strong>notificações multicanal</strong> (WhatsApp, SMS, e‑mail, ligação, voz).</li>
          <li>Fluxo de <strong>pré-consulta</strong> com checagem de câmera, microfone e conexão.</li>
          <li>Lista de <strong>alto risco</strong> para priorizar ações preventivas.</li>
        </ul>
      </>
    ),
  },
  {
    id: "como-usar-pre-consulta",
    title: "Como o paciente faz a pré-consulta?",
    content: (
      <>
        Acesse a página de <strong>Pré-consulta</strong> pelo atalho na lista de consultas ou diretamente em
        {" "}<code>/pre-consulta/:id</code>. O paciente realiza três testes: câmera, microfone e conexão. O envio salva o resultado e atualiza a equipe.
      </>
    ),
  },
  {
    id: "saber-o-que-falhou",
    title: "Como sei o que falhou na pré-consulta?",
    content: (
      <>
        Na tela de <Link to="/consultas" className="underline">Consultas</Link> há uma coluna <em>Pré-teste</em>:
        <ul className="mt-2 list-disc pl-6">
          <li><span className="rounded bg-green-100 px-1">OK</span> quando tudo passou;</li>
          <li><span className="rounded bg-red-100 px-1">Falhou</span> com etiquetas indicando <strong>Câmera</strong>, <strong>Microfone</strong> e/ou <strong>Conexão</strong>;</li>
          <li><span className="rounded bg-slate-100 px-1">Pendente</span> quando o paciente ainda não testou.</li>
        </ul>
      </>
    ),
  },
  {
    id: "confirmar-consulta",
    title: "Como confirmar uma consulta?",
    content: (
      <>
        Vá em <Link to="/consultas" className="underline">Consultas</Link> e use o botão <strong>Confirmar</strong> na linha desejada. O status muda para <em>CONFIRMADA</em>.
      </>
    ),
  },
  {
    id: "enviar-notificacao",
    title: "Como envio uma notificação ao paciente?",
    content: (
      <>
        Na lista de consultas, clique em <strong>Notificar</strong>, escolha o canal (ex.: WhatsApp) e confirme. Isso ajuda a reduzir faltas e orientar o paciente.
      </>
    ),
  },
  {
    id: "interpretar-risco",
    title: "Como interpretar o indicador de risco?",
    content: (
      <>
        O <strong>Risco</strong> indica a probabilidade de ausência. Valores mais altos pedem prioridade para contato e confirmação. A seção <em>Alto risco</em> na Home lista os principais casos.
      </>
    ),
  },
  {
    id: "acessibilidade",
    title: "Há recursos de acessibilidade e usabilidade?",
    content: (
      <>
        Sim. Priorizamos textos claros, contraste adequado, botões grandes em mobile e fluxos guiados. O chatbot (quando habilitado) usa linguagem simples e objetiva.
      </>
    ),
  },
  {
    id: "privacidade-seguranca",
    title: "Como ficam privacidade e segurança?",
    content: (
      <>
        Dados são tratados apenas para fins de cuidado e comunicação com o paciente. Integrações com a API seguem práticas de segurança; evite compartilhar informações sensíveis fora do sistema.
      </>
    ),
  },
  {
    id: "solucao-problemas",
    title: "Problemas comuns (câmera/microfone/conexão)",
    content: (
      <>
        Se a câmera ou microfone falhar, verifique permissões do navegador e feche outros apps que utilizem os dispositivos. Para conexão, teste outra rede ou dados móveis e tente novamente.
      </>
    ),
  },
];

export default function FAQ() {
  return (
    <main className="bg-gradient-to-b from-slate-50 to-white">
      <section aria-labelledby="faq-title" className="mx-auto max-w-5xl px-4 py-16 sm:px-6 lg:px-8">
        <header className="mb-8 text-center">
          <h1 id="faq-title" className="text-3xl font-extrabold tracking-tight text-slate-900 sm:text-4xl">
            FAQ
            <span className="ml-2 align-middle"><Badge variant="publico">Público</Badge></span>
          </h1>
          <p className="mt-3 text-slate-600">Perguntas rápidas sobre o projeto.</p>
        </header>

        <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm sm:p-6">
          <Accordion items={items} />
        </div>

        <footer className="mt-8 text-center text-sm text-slate-500">
          Precisa de mais detalhes? Veja{" "}
          <Link to="/sobre" className="underline hover:text-sky-700">Sobre o Projeto</Link>{" "}
          ou{" "}
          <Link to="/contato" className="underline hover:text-sky-700">Contato</Link>.
        </footer>
      </section>
    </main>
  );
}