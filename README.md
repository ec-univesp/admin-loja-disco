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
  <img src="https://img.shields.io/badge/testes-poku-green" alt="Testes" />
  &nbsp;&nbsp;
  <img src="https://img.shields.io/badge/linter-ESLint_9-4B32C3?logo=eslint&logoColor=white" alt="ESLint" />
  &nbsp;&nbsp;
  <img src="https://img.shields.io/badge/formatter-Prettier-F7B93E?logo=prettier&logoColor=black" alt="Prettier" />
</p>

<p align="center">
  <img src="https://img.shields.io/badge/licença-MIT-blue" alt="Licença MIT" />
  &nbsp;&nbsp;
  <img src="https://img.shields.io/badge/status-em_desenvolvimento-yellow" alt="Status" />
</p>

---

## Sobre o projeto

Aplicação **Next.js 16 + TypeScript** com App Router que simula o backend via **localStorage** (sem banco de dados externo). Desenvolvida como projeto de estudo para a UNIVESP, cobrindo os principais fluxos de uma loja de discos de vinil:

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
| **Estoque** | CRUD de discos e gêneros musicais |
| **Nova Venda** | Formulário com múltiplos discos, canal de venda e cálculo automático do total |
| **Nova Compra** | Formulário com múltiplos discos e custo por disco (`custoDisco`) |
| **Lista de Vendas** | Histórico de vendas com canais de venda |
| **Entregas** | Listagem por status (todas / pendentes / concluídas) |
| **Clientes** | Cadastro de clientes e endereços vinculados |
| **Relatório Financeiro** | Receita, despesas, lucro, canal de venda e top discos — filtráveis por Ano e Mês |

---

## Stack

- **Framework:** Next.js 16 (App Router, output export)
- **Linguagem:** TypeScript 5.9
- **Estilo:** Tailwind CSS 4
- **Estado global:** Zustand 5 com `persist` (localStorage)
- **Formulários:** react-hook-form 7 + react-number-format
- **Gráficos:** ApexCharts via react-apexcharts
- **Calendário:** FullCalendar 6
- **Exportação:** ExcelJS
- **Testes:** Poku
- **Linter / Formatter:** ESLint 9 + Prettier 3

---

## Como rodar

### Pré-requisitos

- Node.js >= 18
- npm >= 9

### Instalação

```bash
# Clone o repositório
git clone git@github.com:ec-univesp/admin-loja-disco.git
cd admin-loja-disco

# Instale as dependências
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

> O projeto usa `output: "export"` — gera arquivos estáticos na pasta `out/`.

---

## Testes

```bash
# Executa todos os testes
npm test

# Modo watch
npm run test:watch
```

Os testes ficam em `src/test/` e são executados pelo **Poku** com concorrência paralela.

---

## Lint e formatação

```bash
# Verifica lint
npm run lint

# Formata o código
npm run format

# Verifica formatação sem alterar
npm run format:check
```

---

## Estrutura de pastas relevante

```
src/
├── app/
│   └── (admin)/
│       └── (others-pages)/   # Páginas do painel (estoque, faturamento, etc.)
├── components/
│   ├── form/                  # Formulários (vendas, compras)
│   ├── ecommerce/             # Componentes de métricas e gráficos
│   └── tables/                # Tabelas reutilizáveis
├── services/
│   ├── api.ts                 # Simulação de backend via localStorage
│   └── exportExcel.ts         # Exportação de relatórios Excel
├── store/
│   └── appStore.ts            # Estado global com Zustand
├── types/
│   ├── models.ts              # Barrel re-exporter
│   ├── vendaModel.ts
│   ├── discoModel.ts
│   ├── clienteModel.ts
│   ├── compraModel.ts
│   ├── canalVendaModel.ts
│   ├── artistaModel.ts
│   ├── generoMusicalModel.ts
│   └── appStateModel.ts
└── test/                      # Testes com Poku
```

---

## Licença

Distribuído sob a licença **MIT**. Veja [LICENSE](LICENSE) para mais informações.
