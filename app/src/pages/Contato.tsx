import { useForm } from "react-hook-form";
import type { SubmitHandler } from 'react-hook-form';
import { useState } from "react";
import Input from "../components/Input";
import Textarea from "../components/Textarea";
import Button from "../components/Button";

type FormContato = {
  nome: string;
  email: string;
  assunto?: string;
  mensagem: string;
  website?: string;
};

export default function Contato() {
  const [sent, setSent] = useState(false);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting, isSubmitSuccessful },
    reset,
  } = useForm<FormContato>({ mode: "onTouched" });

  const onSubmit: SubmitHandler<FormContato> = async (data) => {
    // bloqueia envio se o honeypot tiver sido preenchido
    if (data.website) return;
    // simula envio
    await new Promise((r) => setTimeout(r, 500));
    setSent(true);
    reset({ nome: "", email: "", assunto: "", mensagem: "", website: "" });
  };

  return (
    <main className="bg-gradient-to-b from-slate-50 to-white">
      <section className="container mx-auto max-w-screen-xl px-4 sm:px-6 lg:px-8 py-10">
        <header className="mb-6">
          <h1 className="text-3xl font-bold tracking-tight text-slate-900">Contato</h1>
          <p className="mt-1 text-slate-600">Fale com a equipe do projeto.</p>
        </header>

        {sent && isSubmitSuccessful && (
          <div
            role="status"
            className="mb-6 rounded-xl border border-emerald-200 bg-emerald-50 px-4 py-3 text-emerald-900"
          >
            ✅ Mensagem enviada com sucesso!
          </div>
        )}

        <form
          onSubmit={handleSubmit(onSubmit)}
          noValidate
          className="grid max-w-xl gap-4 rounded-2xl border border-slate-200 bg-white p-6 shadow-sm"
        >
          {/* Honeypot (oculto para humanos) */}
          <input
            type="text"
            tabIndex={-1}
            autoComplete="off"
            {...register("website")}
            className="hidden"
          />

          {/* Nome */}
          <div>
            {(() => {
              const { ref: nomeRef, ...nomeReg } = register("nome", {
                required: "Informe seu nome.",
                minLength: { value: 3, message: "Mínimo de 3 caracteres." },
              });
              return (
                <Input
                  id="nome"
                  type="text"
                  label="Nome"
                  required
                  placeholder="Seu nome completo"
                  error={errors.nome?.message}
                  inputRef={nomeRef}
                  {...nomeReg}
                />
              );
            })()}
          </div>

          {/* Email */}
          <div>
            {(() => {
              const { ref: emailRef, ...emailReg } = register("email", {
                required: "Informe seu e-mail.",
                pattern: {
                  value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                  message: "E-mail inválido.",
                },
              });
              return (
                <Input
                  id="email"
                  type="email"
                  label="E-mail"
                  required
                  placeholder="voce@exemplo.com"
                  error={errors.email?.message}
                  inputRef={emailRef}
                  {...emailReg}
                />
              );
            })()}
          </div>

          {/* Assunto (opcional) */}
          <div>
            {(() => {
              const { ref: assuntoRef, ...assuntoReg } = register("assunto");
              return (
                <Input
                  id="assunto"
                  type="text"
                  label="Assunto"
                  placeholder="Assunto da mensagem"
                  inputRef={assuntoRef}
                  {...assuntoReg}
                />
              );
            })()}
          </div>

          {/* Mensagem */}
          <div>
            {(() => {
              const { ref: msgRef, ...msgReg } = register("mensagem", {
                required: "Descreva sua mensagem.",
                minLength: { value: 10, message: "Mínimo de 10 caracteres." },
              });
              return (
                <Textarea
                  id="mensagem"
                  label="Mensagem"
                  required
                  placeholder="Como podemos ajudar?"
                  rows={5}
                  error={errors.mensagem?.message}
                  textareaRef={msgRef}
                  {...msgReg}
                />
              );
            })()}
          </div>

          {/* Ações */}
          <div className="mt-2 flex items-center gap-3">
            <Button type="submit" variant="primary" loading={isSubmitting} loadingText="Enviando...">
              Enviar
            </Button>
            <Button type="button" variant="secondary" onClick={() => reset()}>
              Limpar
            </Button>
          </div>

          <p className="text-xs text-slate-500">
            <span className="text-rose-600">*</span> campos obrigatórios.
          </p>
        </form>
      </section>
    </main>
  );
}