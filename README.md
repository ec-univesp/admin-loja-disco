<h1 align="center">Admin Loja de Discos</h1>

<p align="center">
  Painel administrativo para uma loja de discos de vinil — estoque, vendas, compras, clientes, entregas e relatórios financeiros.
</p>

<p align="center">
  <img src="https://img.shields.io/badge/Next.js-16-black?logo=next.js" alt="Next.js 16" />
  <img src="https://img.shields.io/badge/React-19-61DAFB?logo=react&logoColor=white" alt="React 19" />
  <img src="https://img.shields.io/badge/TypeScript-5.9-3178C6?logo=typescript&logoColor=white" alt="TypeScript 5.9" />
  <img src="https://img.shields.io/badge/Tailwind_CSS-4-06B6D4?logo=tailwindcss&logoColor=white" alt="Tailwind CSS 4" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/TanStack_Query-5-FF4154?logo=reactquery&logoColor=white" alt="TanStack Query 5" />
  <img src="https://img.shields.io/badge/Zod-4-3E67B1?logo=zod&logoColor=white" alt="Zod 4" />
  <img src="https://img.shields.io/badge/react--hook--form-7-EC5990?logo=reacthookform&logoColor=white" alt="react-hook-form 7" />
  <img src="https://img.shields.io/badge/MSW-2-FF6A33?logo=mockserviceworker&logoColor=white" alt="MSW 2" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/tests-15_files_/_107_cases-2EA44F?logo=testinglibrary&logoColor=white" alt="Tests" />
  <img src="https://img.shields.io/badge/statements-93%25-2EA44F" alt="Statements 93%" />
  <img src="https://img.shields.io/badge/branches-96%25-2EA44F" alt="Branches 96%" />
  <img src="https://img.shields.io/badge/functions-98%25-2EA44F" alt="Functions 98%" />
  <img src="https://img.shields.io/badge/zero_any_/_zero_as-2EA44F" alt="Zero any / Zero as" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/ESLint-9-4B32C3?logo=eslint&logoColor=white" alt="ESLint 9" />
  <img src="https://img.shields.io/badge/Prettier-3-F7B93E?logo=prettier&logoColor=black" alt="Prettier 3" />
  <img src="https://img.shields.io/badge/licença-GPL--3.0-blue" alt="GPL-3.0" />
  <img src="https://img.shields.io/badge/status-em_desenvolvimento-yellow" alt="Status" />
</p>

---

## Sobre

Aplicação **Next.js 16 + TypeScript** com App Router que consome o backend Java/Spring [`loja-discos-api`](https://github.com/ec-univesp/loja-discos-api). Projeto da UNIVESP cobrindo o fluxo completo de uma loja de vinil:

- Cadastro e edição de discos, artistas, gêneros musicais
- Registro de **vendas** e **compras** com múltiplos itens por transação
- Cadastro de clientes com CEP via [BrasilAPI](https://brasilapi.com.br)
- Acompanhamento de entregas por status
- Relatório financeiro com filtros por ano/mês (4 views: receita detalhada, receita × despesa, receita por canal, lucro por item)
- Exportação para Excel (vendas, compras, lucro por item, backup completo)

---

## Stack

| Camada | Tecnologia |
|---|---|
| Framework | Next.js 16 (App Router, Webpack) |
| Linguagem | TypeScript 5.9 (strict) |
| UI | Tailwind CSS 4, lucide-react, ApexCharts |
| Data fetching | TanStack Query 5 |
| Forms | react-hook-form 7 + `@hookform/resolvers` |
| Validação | **Zod 4** (DTOs, enums, forms, responses no boundary) |
| Mocks de rede (tests) | MSW 2 |
| Testes | Poku 4 + `@pokujs/react` + happy-dom |
| Cobertura | monocart-coverage-reports (V8) |
| Lint / Format | ESLint 9 + Prettier 3 |

---

## Arquitetura

Organização por **feature** (pasta da rota) com uma camada `shared/` para infraestrutura. Cada feature tem:

- `page.tsx` — a rota (Next App Router)
- `components/` — UI específica
- `model/` — hooks que combinam TanStack Query + service

```
src/
├── app/                         # Rotas Next.js (App Router)
│   ├── inventory/               # Estoque (discos, artistas, gêneros)
│   ├── sales/                   # Vendas + clientes + canais
│   ├── purchases/               # Compras + fornecedores
│   ├── deliveries/              # Entregas (por status)
│   ├── revenue/                 # Relatórios + Backup
│   └── _dashboard/              # Widgets do dashboard
│
├── shared/
│   ├── services/api/
│   │   ├── client.ts            # apiClient (fetch + zod.parse no response)
│   │   ├── schemas.ts           # Zod schemas dos DTOs do Swagger
│   │   ├── form-schemas.ts      # Zod schemas dos forms
│   │   ├── types.ts             # Types derivados via z.infer
│   │   └── *.service.ts         # 8 services (artistas, gêneros, …)
│   ├── components/{ui,form,layout}
│   ├── context/                 # ThemeContext, SidebarContext
│   ├── hooks/                   # useModal, useGoBack
│   ├── utils/                   # currency, notify (toast com Zod fallback)
│   └── types/enums.ts           # OrderStatus, RecordStatus (Zod enums)
│
└── test/
    ├── setup/                   # MSW server, db in-memory, lifecycle, toast spy
    └── factories/               # Builders para os DTOs
```

### Fluxo de dados (request → render)

```
Form (RHF + zodResolver)  →  useMutation/useQuery (TanStack)
                                     │
                                     ▼
                             apiClient.{get|post|put|delete}
                                     │   ↓ schema.parse() no boundary
                                     ▼
                             backend Spring (Swagger contract)
```

### Princípios

- **Zero `as`**: sem type assertions em `src/`. Onde houve necessidade, foi substituído por `instanceof`, `z.parse`, ou guard explícito.
- **Validação no boundary**: toda resposta da API é validada via Zod antes de chegar à UI. Resposta inesperada → `ApiError`.
- **Forms = schema-driven**: o mesmo schema Zod define a validação do form *e* o tipo do input.
- **PT-BR no domínio**: nomes de campos e enums seguem o backend (`OrderStatus.ENTREGUE`, `RecordStatus.DISPONIVEL`).

---

## Como rodar

### Pré-requisitos

- Node.js ≥ 20 e npm ≥ 9
- Backend [`loja-discos-api`](https://github.com/ec-univesp/loja-discos-api) rodando em `http://localhost:8080`
- MySQL 8 (usado pelo backend)

### 1. Banco de dados (MySQL local)

Suba um MySQL com Docker — schema `discosgranel` é criado automaticamente pelo backend (Flyway/JPA):

```bash
docker run -d --name discos-mysql \
  -e MYSQL_ROOT_PASSWORD=root \
  -e MYSQL_DATABASE=discosgranel \
  -p 3306:3306 \
  mysql:8
```

Verifique que está rodando:

```bash
docker logs discos-mysql | tail -5
```

> **Importante**: a view `vlucroporitem` (usada pelo endpoint `/relatorios/lucroporitem`) precisa estar criada no schema. Se aparecer erro `Table 'discosgranel.vlucroporitem' doesn't exist` ao exportar Excel, rode a migration correspondente do backend.

### 2. Backend (Spring Boot)

Em outro terminal, na raiz do repositório [`loja-discos-api`](https://github.com/ec-univesp/loja-discos-api):

```bash
./mvnw spring-boot:run
```

Confirme em [http://localhost:8080/swagger-ui/index.html](http://localhost:8080/swagger-ui/index.html).

### 3. Frontend

```bash
git clone git@github.com:ec-univesp/admin-loja-disco.git
cd admin-loja-disco
npm install
npm run dev
```

Abra [http://localhost:3000](http://localhost:3000).

> O `dev` usa Webpack (`next dev --webpack`) porque o binário nativo do Turbopack não está disponível em todas as plataformas. Build de produção também usa Webpack.

### Variável de ambiente (opcional)

Por padrão o front aponta para `http://localhost:8080`. Para mudar, crie `.env.local`:

```bash
NEXT_PUBLIC_API_BASE_URL=https://api.exemplo.com
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
