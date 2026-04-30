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
  <img src="https://img.shields.io/badge/licença-GPL--3.0-blue" alt="Licença GPL-3.0" />
  &nbsp;&nbsp;
  <img src="https://img.shields.io/badge/status-em_desenvolvimento-yellow" alt="Status" />
</p>

---

## Sobre o projeto

Aplicação **Next.js 16 + TypeScript** com App Router, integrada ao backend Java/Spring [`loja-discos-api`](https://github.com/ec-univesp/loja-discos-api). Desenvolvida como projeto de estudo para a UNIVESP, cobrindo os principais fluxos de uma loja de discos de vinil:

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
- **Data fetching:** TanStack React Query 5
- **Formulários:** react-hook-form 7 + react-number-format
- **Gráficos:** ApexCharts via react-apexcharts
- **Exportação:** ExcelJS
- **Testes:** Poku 4 + `@pokujs/react` + happy-dom *(infra pronta, suíte a ser escrita)*
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

---

## Como rodar

### Pré-requisitos

- Node.js >= 20
- npm >= 9
- Backend [`loja-discos-api`](https://github.com/ec-univesp/loja-discos-api) rodando localmente em `http://localhost:8080`

### 1. Suba o backend

Em outro terminal, na raiz do repositório do backend:

```bash
./mvnw spring-boot:run
```

Verifique se a documentação Swagger está disponível em [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html).

### 2. Instale as dependências do front

```bash
git clone git@github.com:ec-univesp/admin-loja-disco.git
cd admin-loja-disco
npm install
```

### 3. (Opcional) Configure variáveis de ambiente

Por padrão o front aponta para `http://localhost:8080`. Para usar outro endereço, crie um arquivo `.env.local` na raiz:

```bash
NEXT_PUBLIC_API_BASE_URL=http://localhost:8080
```

### 4. Rode o servidor de desenvolvimento

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

---

## Lint e formatação

```bash
npm run lint              # verifica lint
npm run format            # formata o código
npm run format:check      # apenas verifica
```
---

## Licença

Distribuído sob a licença **GNU GPL v3.0**. Veja [LICENSE](LICENSE) para o texto completo.
