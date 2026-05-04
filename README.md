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
  <img src="https://img.shields.io/badge/testes-Poku_4_+_%40pokujs%2Freact-9F4DCC" alt="Testes" />
  &nbsp;&nbsp;
  <img src="https://img.shields.io/badge/integração-MSW_2-FF6A33?logo=mockserviceworker&logoColor=white" alt="MSW" />
  &nbsp;&nbsp;
  <img src="https://img.shields.io/badge/services_API-100%25-2EA44F" alt="Cobertura services" />
  &nbsp;&nbsp;
  <img src="https://img.shields.io/badge/utils-100%25-2EA44F" alt="Cobertura utils" />
  &nbsp;&nbsp;
  <img src="https://img.shields.io/badge/cobertura_global-11.26%25-orange" alt="Cobertura global" />
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
- **Testes:** Poku 4 + `@pokujs/react` + happy-dom + MSW 2 (mock de rede) + `@pokujs/c8`/`@pokujs/monocart` (cobertura)
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

Stack: **Poku 4** + **@pokujs/react** + **happy-dom** + **MSW 2** (intercepta `fetch` no nível do Node) + **@pokujs/c8** (cobertura V8). Os testes vivem em pastas `__tests__/` ao lado do código que validam, e a infra fica em [`src/test/`](./src/test/).

### Comandos

```bash
npm test                  # roda toda a suíte
npm run test:watch        # modo watch
npm test -- --coverage    # com relatório de cobertura
```

Configuração em [`poku.config.js`](./poku.config.js).

### Cobertura

> Cobertura medida via `c8 --all` para incluir arquivos não importados. O plugin de cobertura do Poku (`@pokujs/c8`) atualmente ignora `all: true` e só conta arquivos efetivamente importados pelos testes — o número global abaixo é o real, obtido pelo CLI do `c8` (workaround na seção mais abaixo).

| Área | Statements | Branches | Functions |
|---|---:|---:|---:|
| `shared/services/api/` (8 services + client) | **100%** | **98.75%** | **100%** |
| `shared/utils/` (currency, notify) | **100%** | **100%** | **100%** |
| Modais de itens (`SaleDetailsModal`, `PurchaseDetailsModal`) | **100%** | **66.66%** | **100%** |
| `_dashboard/StoreMetrics.tsx` | **100%** | **82.35%** | **100%** |
| **Global do `src/`** | **11.26%** | **68.33%** | **34.65%** |

15 arquivos de teste · ~80 casos · execução total < 1.5s.

> A cobertura global é baixa porque ainda faltam testes para a maior parte das páginas e dos formulários (`AddRecordForm`, `SalesForm`, `PurchaseForm`, etc.). Os pontos críticos do contrato com o backend (todos os endpoints do Swagger) já estão **100% cobertos** pelos testes de integração que sobem o MSW e validam GET/POST/PUT/DELETE com respostas e erros (`ApiError`, 404, propagação de status).

### O que é testado hoje

- **Contrato com a API**: cada um dos 9 controllers do backend (artistas, gêneros, endereços, clientes, canais de venda, discos, vendas, compras, relatórios) tem teste validando lista, busca por id, criar, atualizar, remover e cenários de erro.
- **Endpoint novo `discos/lista-filtrada/{tipo}`**: verifica que `tipo=1` retorna apenas `DISPONIVEL` e `tipo=2` apenas `VENDIDO`.
- **Cliente HTTP**: `apiClient` (GET/POST/PUT/DELETE), serialização de query params, parsing JSON com fallback para texto, propagação de `ApiError` com `status` e `body`.
- **Utils**: formatação BRL (positivos, negativos, zero, `null`/`undefined`/`NaN`) e parsing reverso, mais notificações via `sonner` (sucesso e erro com `ApiError`/`Error`/desconhecido).
- **Modais de detalhe** (vendas e compras): render condicional, listagem de itens, total agregado, estados vazios, fechamento.
- **Métricas do dashboard**: `StoreMetrics` calcula corretamente discos em estoque, receita do mês (apenas vendas concluídas), contagem de vendas no mês corrente.

### Como medir cobertura honesta (workaround do `--all`)

Por enquanto o `--coverage` do plugin não inclui arquivos não importados (ver bug acima). Para ver a cobertura real:

```bash
rm -rf /tmp/cov && mkdir /tmp/cov
NODE_V8_COVERAGE=/tmp/cov npx poku
npx c8 report \
  --reporter=text-summary \
  --include='src/**/*.ts' --include='src/**/*.tsx' \
  --exclude='src/**/__tests__/**' --exclude='src/test/**' \
  --exclude='src/**/*.d.ts' --exclude='src/app/layout.tsx' \
  --exclude='src/app/not-found.tsx' --exclude='src/shared/icons/**' \
  --extension=.ts --extension=.tsx \
  --all --src=src \
  --temp-directory=/tmp/cov
```

---

## Lint e formatação

```bash
npm run lint              # verifica lint
npm run format            # formata o código
npm run format:check      # apenas verifica
```

---

## Próximos passos

### Backend e dados
- [ ] Substituir o `localStorage` por uma API real (NestJS / Express / Fastify a definir)
- [ ] Migrar `src/shared/services/api.ts` para chamadas HTTP reais
- [ ] Adicionar variáveis de ambiente (`.env`) para `NEXT_PUBLIC_API_URL`
- [ ] Mover `src/features/faturamento/mocks/` para o BE assim que houver dados reais

### Conteúdo do domínio
- [ ] Atualizar opções dos `<select>` em `AddDiscoForm`: **Prensagem**, **Encarte**, **Condição da Capa**, **Condição do Disco** (lista a definir com o time)
- [ ] Permitir upload de capa do disco
- [ ] Adicionar filtro por artista/álbum no estoque

### Testes
- [x] Configurar suíte de integração (Poku + `@pokujs/react` + MSW)
- [x] Cobrir 100% dos services da API (todos os endpoints do Swagger)
- [x] Cobrir 100% dos utils (`currency`, `notify`)
- [x] Cobrir os modais novos (`SaleDetailsModal`, `PurchaseDetailsModal`) e o widget `StoreMetrics`
- [ ] Cobrir páginas (`inventory`, `sales`, `purchases`, `deliveries`, `revenue`) — incluindo stub do `next/navigation`
- [ ] Cobrir formulários (`AddRecordForm`, `SalesForm`, `PurchaseForm`, `CustomerAddressForm`, `SalesChannelForm`)
- [ ] Cobrir `MultiSelect` e demais componentes de UI compartilhados
- [ ] Atingir **80%** de cobertura global (atual: 11.26%)
- [ ] Configurar pipeline de CI publicando o relatório de cobertura

### Refatorações pendentes
- [ ] Mover modelos de domínio de `shared/types/` para a feature correspondente quando fizer sentido (ex.: `Venda` → `features/vendas/types/`)
- [ ] Avaliar substituir `react-hook-form` + `useWatch` por `Controller` em `SalesForm` para eliminar o aviso do React Compiler de forma definitiva

### Deploy / DX
- [ ] Configurar pipeline de CI (lint + build em PRs)
- [ ] Adicionar pre-commit hook (`husky` + `lint-staged`) para rodar prettier/eslint antes do commit
- [ ] Habilitar `next/image` para otimização de assets quando houver imagens reais

---

## Licença

Distribuído sob a licença **GNU GPL v3.0**. Veja [LICENSE](LICENSE) para o texto completo.
