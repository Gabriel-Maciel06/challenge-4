git commit -m "Ajustes e melhorias no README"
git push
# TELECARE+ — Challenge 1TDS Fevereiro (Front-end)

Projeto front-end construído conforme o enunciado "1TDS Fevereiro - Challenge 2025 - 2º Semestre".

IMPORTANTE: Este repositório contém a implementação front-end (React + Vite + TypeScript) e consumirá uma API Java externa via fetch. Antes do deploy/uso, configure a variável de ambiente VITE_API_BASE_URL para apontar à API Java fornecida.

## Tecnologias
- React (Vite)
- TypeScript
- Tailwind CSS (estilização usada em todo o projeto)
- react-router-dom (rotas SPA)

OBS: Não foram usadas bibliotecas de UI externas (Bootstrap, componentes prontos, CDNs, Axios etc.). Todas as chamadas HTTP usam fetch nativo.

## Integrantes
- Gabriel Maciel — RM: 562795 — Turma: 1TDSR
- Matheus Molina — RM: 563399 — Turma: 1TDSR
- Thomas Fontes — RM: 562254 — Turma: 1TDSR

> Cada integrante deve garantir que seu usuário no GitHub possua pelo menos 5 commits no repositório; o repositório completo deve ter ao menos 15 commits no total (conforme instruções do enunciado).

## Estrutura de pastas (resumo)

```
app/
   src/
      assets/          # imagens e recursos estáticos
      components/      # componentes reutilizáveis (Navbar, Footer, CardIntegrante...)
      data/            # dados locais (integrantes.json usado como fallback)
      pages/           # páginas (Home, Integrantes, Sobre, FAQ, Contato, IntegranteDetalhe)
      routes/          # rotas (arquivo index.tsx com as rotas da SPA)
      services/        # serviços para consumo da API (api.ts com CRUD via fetch)
      styles/          # Tailwind / CSS global
      types/           # tipos TypeScript (Integrante)
   index.html
   package.json
   vite.config.ts

README.md
```

## Funcionalidades implementadas (front-end)
- SPA com rotas: Início, Integrantes, Sobre, FAQ, Contato.
- Página Integrantes: lista, busca, ordenação, aviso de campos faltando.
- CRUD de integrantes consumindo API Java remota via fetch (GET, POST, PUT, DELETE).
- Formulário para cadastro/edição em modal.
- Exclusão com confirmação.
- Tailwind CSS usado em todas as páginas.

## Como configurar a API (variável de ambiente)

Defina a variável de ambiente VITE_API_BASE_URL para apontar à API Java (base URL). Exemplo para desenvolvimento em `.env` na raiz do projeto (Vite):

```
VITE_API_BASE_URL=https://api-java-exemplo.com
```

O arquivo `src/services/api.ts` fará requisições para `${VITE_API_BASE_URL}/integrantes` (ajuste se necessário conforme a API Java).

## Deploy na Vercel

O projeto está pronto para deploy na Vercel. Após conectar o repositório na Vercel configure a variável de ambiente `VITE_API_BASE_URL` nas Settings do projeto na Vercel.

Adicione aqui a URL funcional da Vercel quando deployada:

Vercel URL: https://<SEU-PROJETO>.vercel.app

### Guia rápido de publicação (monorepo com diretório `app/`)

1. Crie o repositório no GitHub e faça `git push` de toda a raiz (onde está este README, `vercel.json` e a pasta `app/`).
2. Acesse o painel da Vercel e clique em "New Project" → selecione o repositório.
3. Em "Root Directory" escolha `app` (já que o `package.json` está dentro de `app/`).
4. Confirme ou ajuste as configurações:
   - Build Command: `npm run build`
   - Install Command: `npm install`
   - Output Directory: `dist`
   - Framework Preset: `Vite`
5. Em Environment Variables, adicione:
   - `VITE_API_BASE_URL=https://SUA-API-JAVA.EXEMPLO` (troque pelo endpoint real)
6. Deploy.
7. Teste a URL gerada e valide chamadas à API (abra o DevTools → Network). Se falhar por CORS, ajuste o backend.

### Arquivo `vercel.json`

Incluímos um `vercel.json` simplificado na raiz. Em alguns casos de monorepo ele pode ser ignorado se você define o root diretamente no painel. Se quiser remover, basta excluir e configurar manualmente.

### Ambiente local

Crie `.env` na pasta `app/` copiando de `.env.example` e ajuste o valor real de `VITE_API_BASE_URL`.

### Erros comuns

- 404 após deploy: verifique se o "Root Directory" está em `app`, não na raiz.
- API não responde: confirme se a URL base está correta e sem barra final duplicada.
- Problemas de CORS: adicione os cabeçalhos de CORS no backend (Access-Control-Allow-Origin: *) durante desenvolvimento.
- Variável de ambiente não aplicada: redeploy após criar/alterar e confira em `window.import.meta.env` via console.
- Imagens retornando 404 (ex.: `/src/assets/img/user1.jpg`): não use caminhos absolutos começando com `/src`. Em vez disso, importe a imagem em componentes ou resolva dinamicamente. Este projeto agora usa `resolveAvatar()` em `src/utils/assets.ts` para transformar o nome do arquivo em URL gerada pelo Vite. No JSON (`integrantes.json`) você pode deixar `"/src/assets/img/user1.jpg"` ou apenas `"user1.jpg"`; ambos funcionarão.

### Pré-visualização local (build)

```bash
cd app
npm install
npm run build
npm run preview
```

### Próximos passos opcionais

- Adicionar um step de CI (GitHub Actions) para rodar `npm run build` em PRs.
- Criar variáveis separadas para ambiente de produção e preview (`VITE_API_BASE_URL` diferente em cada). 
- Adicionar monitoramento de erros (ex.: Sentry) antes do deploy público.
- Movimentar imagens para `public/` se quiser referenciá-las por caminho fixo (`/img/...`) sem import; atualmente preferimos import.meta.glob para hashing e cache ideal.

## Link do GitHub

Coloque aqui o link do repositório no GitHub (obrigatório):

GitHub: https://github.com/<SEU_USUARIO>/<SEU_REPO>

## Vídeo de demonstração (YouTube)

Campo para o vídeo (até 3 minutos):

YouTube: https://youtu.be/<ID_DO_VIDEO>

## Instruções para gerar o arquivo .zip para entrega (sem node_modules, com histórico)

O enunciado pede que a entrega contenha o histórico de versionamento e não contenha `node_modules`.

Exemplo de passos para gerar o .zip de entrega a partir do repositório remoto:

1) Clone o repositório (cópia de trabalho com histórico):

```bash
git clone https://github.com/<SEU_USUARIO>/<SEU_REPO>.git deliverable-copy
cd deliverable-copy
git checkout main
```

2) Remova dependências e gere o zip:

```bash
rm -rf node_modules
rm -f .env
cd ..
zip -r deliverable.zip deliverable-copy
```

Se for obrigatório fornecer o histórico em formato separado (bare), você pode também gerar um clone bare:

```bash
git clone --mirror https://github.com/<SEU_USUARIO>/<SEU_REPO>.git deliverable-mirror.git
zip -r deliverable-with-history.zip deliverable-copy deliverable-mirror.git
```

Inclua os arquivos `deliverable.zip` (ou `deliverable-with-history.zip`) na entrega.

## Observações e pendências manuais (o que você ainda precisa preencher)

1. Definir e configurar a URL real da API Java em `VITE_API_BASE_URL` (no Vercel e em `.env` para desenvolvimento).
2. Subir o repositório real para o GitHub e colocar o link no README.
3. Fazer o deploy na Vercel e colocar a URL final no README.
4. Gravar o vídeo de demonstração (máx. 3 min) e colocar o link do YouTube no README.
5. Conferir commits: cada integrante deve ter pelo menos 5 commits no repositório e o total deve ser >= 15.

## Observância do enunciado
- Estilização feita exclusivamente com Tailwind CSS.
- Chamadas HTTP feitas com fetch nativo.
- Não foram usadas bibliotecas de UI externas proibidas.

---

Se quiser, eu posso ajudar a:
- Ajustar o arquivo `.env` e variáveis para desenvolvimento.
- Preparar os passos exatos para deploy na Vercel.
- Ajudar a gerar o .zip final com histórico.
