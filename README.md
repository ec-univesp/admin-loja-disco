<h1 align="center">Admin Loja de Discos</h1>

<p align="center">
  Painel administrativo para gestão de uma loja de discos de vinil —
  controle de estoque, vendas, compras, clientes e relatório financeiro.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js" />
  &nbsp;&nbsp;
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React" />
  &nbsp;&nbsp;
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white" alt="TypeScript" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS" />
  &nbsp;&nbsp;
  <img src="https://img.shields.io/badge/Zustand-5-orange" alt="Zustand" />
  &nbsp;&nbsp;
  <img src="https://img.shields.io/badge/react--hook--form-7-EC5990?logo=reacthookform&logoColor=white" alt="react-hook-form" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/testes-Poku_+_%40pokujs%2Freact-yellow" alt="Testes" />
  &nbsp;&nbsp;
  <img src="https://img.shields.io/badge/cobertura-pendente-lightgrey" alt="Cobertura" />
  &nbsp;&nbsp;
  <img src="https://img.shields.io/badge/linter-ESLint_9-4B32C3?logo=eslint&logoColor=white" alt="ESLint" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/licença-MIT-blue" alt="Licença MIT" />
  &nbsp;&nbsp;
  <img src="https://img.shields.io/badge/status-em_desenvolvimento-yellow" alt="Status" />
</p>

---

## Sobre o projeto

Aplicação **Next.js 16 + TypeScript** com App Router que simula o backend via **localStorage**. Desenvolvida como projeto de estudo para a UNIVESP, cobrindo os principais fluxos de uma loja de discos de vinil:

- Cadastro e gerenciamento de discos (estoque)
- Registro de vendas e compras com suporte a múltiplos discos por transação
- Controle de clientes e endereços de entrega
- Acompanhamento de entregas por status
- Relatório financeiro com filtros por Ano e Mês

---

## Funcionalidades

| Módulo | Descrição |
|---|---|
| **Dashboard** | Métricas de vendas, gráficos e resumo de atividades |
| **Estoque** | CRUD de discos, gêneros musicais e artistas |
| **Nova Venda** | Formulário com múltiplos discos, canal de venda e cálculo automático do total |
| **Nova Compra** | Formulário com múltiplos discos e custo por disco; cadastro inline de novo disco |
| **Lista de Vendas** | Histórico de vendas com gestão de canais e clientes |
| **Entregas** | Listagem por status (todas / pendentes / concluídas) |
| **Relatório Financeiro** | Receita, despesas, lucro e análise por dimensão — filtráveis por Ano e Mês |

---

## Stack

- **Framework:** Next.js 16 (App Router)
- **Linguagem:** TypeScript 5.9
- **Estilo:** Tailwind CSS 4
- **Estado global:** Zustand 5 com `persist` (localStorage)
- **Formulários:** react-hook-form 7 + react-number-format
- **Gráficos:** ApexCharts via react-apexcharts
- **Exportação:** ExcelJS
- **Testes:** Poku 4 + `@pokujs/react` + happy-dom *(infra pronta, suíte a ser escrita após integração com o BE)*
- **Linter / Formatter:** ESLint 9 + Prettier 3

---

## Arquitetura

O projeto segue uma arquitetura por **features** (domínios de negócio) com infraestrutura compartilhada em **shared**:

```
src/
├── app/                          # Rotas Next.js (page.tsx + layout root)
│   ├── compras/ · entregas/ · estoque/ · faturamento/
│   ├── nova-compra/ · nova-venda/ · vendas/
│   ├── layout.tsx                # Root layout (providers + AppShell)
│   └── page.tsx                  # Dashboard
│
├── features/                     # Módulos de negócio (componentes e mocks por domínio)
│   ├── dashboard/components/     # MetricasLoja, VendasMensaisChart, VendasRecentes
│   ├── estoque/components/       # AddDiscoForm, EditDiscoModal
│   ├── vendas/components/        # SalesForm, ClienteEnderecoModal, CanalVendaModal
│   ├── compras/components/       # PurchaseForm
│   └── faturamento/{components,mocks}/
│
└── shared/                       # Tudo reutilizável entre features
    ├── components/
    │   ├── ui/                   # Button, Badge, Modal, Dropdown, Table
    │   ├── form/                 # Form, Label, ControlledInput, CurrencyInput, TextArea
    │   └── layout/               # AppShell, AppHeader, AppSidebar, Logo, etc.
    ├── context/                  # SidebarContext, ThemeContext
    ├── hooks/                    # useModal, useGoBack
    ├── icons/                    # SVGs como componentes React
    ├── services/                 # api.ts (localStorage), exportExcel.ts
    ├── store/                    # appStore (Zustand) + useStore (selectors) + AppStoreInitializer
    ├── types/                    # Modelos do domínio (Disco, Venda, Cliente...)
    └── utils/                    # currency.ts (formatBRL, parseBRL)
```

**Regra de ouro:** componentes em `features/<x>/` só podem importar de outras `features/<x>/` (a mesma) e de `shared/`. Nunca uma feature importa outra.

---

## Como rodar

### Pré-requisitos

- Node.js >= 20
- npm >= 9

### Instalação

```bash
git clone git@github.com:ec-univesp/admin-loja-disco.git
cd admin-loja-disco
npm install
```

### Desenvolvimento

```bash
npm run dev
```

Acesse [http://localhost:3000](http://localhost:3000).

### Build de produção

```bash
npm run build
npm run start
```

---

## Testes

> **Status:** infraestrutura configurada (Poku + `@pokujs/react` + happy-dom), suíte a ser implementada após a integração com o backend.

```bash
npm test                  # roda toda a suíte (quando existir)
npm run test:watch        # modo watch
```

Configuração em [`poku.config.mjs`](./poku.config.mjs). Os testes deverão viver em pastas `__tests__/` ao lado do código que validam.

> ⚠️ **Bug conhecido** ao executar testes `.tsx` com `tsx` + `@pokujs/react`: ver [`docs/issues/`](./docs/issues) (a ser criado quando os testes forem retomados).

---

## Lint e formatação

```bash
npm run lint              # verifica lint
npm run format            # formata o código
npm run format:check      # apenas verifica
```

---

## Licença

Distribuído sob a licença **MIT**. Veja [LICENSE](LICENSE) para mais informações.
