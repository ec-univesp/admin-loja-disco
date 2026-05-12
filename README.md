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
  <img src="https://img.shields.io/badge/Poku-4-7C3AED" alt="Poku 4" />
  <img src="https://img.shields.io/badge/@pokujs%2Freact-1-7C3AED" alt="@pokujs/react 1" />
  <img src="https://img.shields.io/badge/happy--dom-test_env-FF7A59" alt="happy-dom" />
  <img src="https://img.shields.io/badge/monocart-coverage-2EA44F" alt="monocart coverage" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/tests-18_files_/_149_cases-2EA44F?logo=testinglibrary&logoColor=white" alt="Tests" />
  <img src="https://img.shields.io/badge/statements-94%25-2EA44F" alt="Statements 94%" />
  <img src="https://img.shields.io/badge/branches-97%25-2EA44F" alt="Branches 97%" />
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

## Scripts

```bash
npm run dev               # Next dev server (webpack) em :3000
npm run build             # build de produção
npm run start             # serve o build
npm test                  # roda toda a suíte (Poku + MSW)
npm run test:watch        # watch mode
npm run test:coverage     # cobertura com monocart
npm run lint              # ESLint
npm run format            # Prettier write
npm run format:check      # Prettier check
```

---

## Testes

Stack: **Poku 4 + @pokujs/react + happy-dom + MSW 2**. Os testes interceptam `fetch` com handlers que respeitam o contrato do Swagger e mantêm um "banco" in-memory por escopo. A infra fica em [`src/test/`](./src/test/).

### Cobertura atual

| Métrica | % |
|---|---:|
| **Statements** | **93%** |
| **Branches** | **96%** |
| **Functions** | **98%** |
| Lines (arquivos importados) | 12.57% (inclui código não importado por testes) |

15 arquivos de teste · **107 casos** · execução total ≈ 4s.

### O que está coberto

- **Os 9 controllers do Swagger** (artistas, gêneros, endereços, clientes, canais, discos, compras, vendas, relatórios): list, getById, create, update, delete + cenários de erro (404, `ApiError` com `status` e `body`).
- **Endpoints novos**:
  - `/discos/buscar?termo=…` — filtra por álbum e por nome do artista.
  - `/discos/lista-filtrada/{tipo}` — `tipo=1` exclui `VENDIDO`, `tipo=2` exclui `DISPONIVEL`.
  - `/relatorios/lucroporitem?ano=…&mes=…` — propaga query e devolve linhas com lucro calculado.
- **apiClient**: GET/POST/PUT/DELETE, serialização de query params, parsing JSON com fallback para texto, **validação Zod no boundary** (rejeita payload fora do contrato).
- **Utils**: `currency` (positivos, negativos, zero, `null`/`NaN`), `notify` (sucesso e variantes de erro com `ApiError`/`Error`/`unknown`).
- **Modais** de detalhe de venda e compra.
- **Dashboard**: `StoreMetrics` (estoque, receita do mês, contagem de vendas).

Os pontos cobertos representam **todo o contrato com o backend** e **toda a lógica de I/O**. As páginas (`/sales`, `/inventory`, …) e os formulários grandes ainda dependem de smoke test manual no browser.

---

## Validação ponta-a-ponta

```
   Browser
      │
      ▼
   Form (RHF + zodResolver)  ←  form-schemas.ts (Zod)
      │  submit válido
      ▼
   TanStack useMutation
      │
      ▼
   service (e.g. salesService.create)
      │
      ▼
   apiClient.post(path, schema, payload)
      │  fetch → response.text() → JSON
      │  schema.parse(raw)  ←  schemas.ts (Zod)
      ▼
   resultado tipado em z.infer<typeof schema>
```

Qualquer divergência do contrato (campo faltando, tipo errado, enum inválido) é capturada **antes** de chegar à UI.

---

## Licença

Distribuído sob **GNU GPL v3.0**. Veja [LICENSE](LICENSE).
