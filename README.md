# KILE Service Sheet

PWA para preencher a folha de serviço diária da **KILE Gebäudereinigung** pelo celular e gerar um **PDF pronto para impressão em A4**, praticamente idêntico à folha de papel original.

- ✅ Funciona **offline** (após o primeiro acesso)
- ✅ **Instalável** no Android (tela cheia, ícone próprio)
- ✅ **Sem login, sem banco de dados, sem API** — roda 100% no navegador
- ✅ Rascunho salvo automaticamente no dispositivo

## Tecnologias

- Next.js 15 (App Router) + React 19
- TypeScript
- Tailwind CSS v4
- PWA (manifest + service worker)

## Como rodar

```bash
npm install
npm run dev      # desenvolvimento em http://localhost:3000
npm run build    # build de produção
npm run start    # servir a build de produção
```

> O funcionamento offline (service worker) só é ativado na build de **produção** (`build` + `start`).

## Como usar

1. Abra o app no celular e preencha os campos.
2. Toque em **Gerar PDF**.
3. Na caixa de impressão do navegador, escolha **Salvar como PDF** (papel **A4**).
4. Use **Limpar** para começar uma nova folha.

## Instalar como app (Android)

1. Abra o app no Chrome.
2. Menu → **Instalar aplicativo / Adicionar à tela inicial**.
3. O app abre em tela cheia com ícone próprio e funciona offline.

## Estrutura

```
app/            Rotas e layout (App Router)
components/     Componentes de UI reutilizáveis + documento de impressão
lib/            Tipos e constantes (dados da empresa, estado inicial)
utils/          Helpers (impressão/PDF, formatação, persistência offline)
styles/         CSS global e estilos do documento A4 (print.css)
public/         Logo, manifest e ícones do PWA, service worker
```

## Geração do PDF

O PDF é produzido pela impressão nativa do navegador (**Salvar como PDF**), usando
um documento em `components/PrintDocument.tsx` construído inteiramente em HTML/CSS
(`styles/print.css`), dimensionado em A4 (210×297 mm). Não há imagem de fundo:
o layout — cabeçalho com logo, faixa de seções, painel "Lista de Serviços",
tabela Von/Bis/Gesamt e área de Informações — é totalmente vetorial e nítido na impressão.
