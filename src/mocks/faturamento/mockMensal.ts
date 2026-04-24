/**
 * Dados financeiros mensais simulados por ano.
 * Usados como fallback quando não há vendas reais cadastradas no período.
 * Todos os valores são em R$.
 */

export interface EntradaMensal {
  mes: string;
  receita: number;
  despesas: number;
  lucro: number;
}

export const mockMensal: Record<number, EntradaMensal[]> = {
  2026: [
    { mes: 'Jan', receita: 41200, despesas: 18400, lucro: 22800 },
    { mes: 'Fev', receita: 38700, despesas: 16900, lucro: 21800 },
    { mes: 'Mar', receita: 45600, despesas: 19200, lucro: 26400 },
    { mes: 'Abr', receita: 50200, despesas: 21000, lucro: 29200 },
  ],
  2025: [
    { mes: 'Jan', receita: 32100, despesas: 14500, lucro: 17600 },
    { mes: 'Fev', receita: 28400, despesas: 12800, lucro: 15600 },
    { mes: 'Mar', receita: 35600, despesas: 15200, lucro: 20400 },
    { mes: 'Abr', receita: 40100, despesas: 17300, lucro: 22800 },
    { mes: 'Mai', receita: 38900, despesas: 16900, lucro: 22000 },
    { mes: 'Jun', receita: 42300, despesas: 18100, lucro: 24200 },
    { mes: 'Jul', receita: 39700, despesas: 17200, lucro: 22500 },
    { mes: 'Ago', receita: 44500, despesas: 19000, lucro: 25500 },
    { mes: 'Set', receita: 47200, despesas: 20100, lucro: 27100 },
    { mes: 'Out', receita: 51800, despesas: 22000, lucro: 29800 },
    { mes: 'Nov', receita: 62400, despesas: 25900, lucro: 36500 },
    { mes: 'Dez', receita: 70100, despesas: 29500, lucro: 40600 },
  ],
  2024: [
    { mes: 'Jan', receita: 24300, despesas: 11200, lucro: 13100 },
    { mes: 'Fev', receita: 21800, despesas:  9800, lucro: 12000 },
    { mes: 'Mar', receita: 27500, despesas: 12100, lucro: 15400 },
    { mes: 'Abr', receita: 30200, despesas: 13400, lucro: 16800 },
    { mes: 'Mai', receita: 29100, despesas: 12900, lucro: 16200 },
    { mes: 'Jun', receita: 33400, despesas: 14700, lucro: 18700 },
    { mes: 'Jul', receita: 31200, despesas: 13800, lucro: 17400 },
    { mes: 'Ago', receita: 35800, despesas: 15600, lucro: 20200 },
    { mes: 'Set', receita: 38100, despesas: 16500, lucro: 21600 },
    { mes: 'Out', receita: 41300, despesas: 17800, lucro: 23500 },
    { mes: 'Nov', receita: 49600, despesas: 21200, lucro: 28400 },
    { mes: 'Dez', receita: 56200, despesas: 24100, lucro: 32100 },
  ],
  2023: [
    { mes: 'Jan', receita: 18600, despesas:  8700, lucro:  9900 },
    { mes: 'Fev', receita: 16200, despesas:  7500, lucro:  8700 },
    { mes: 'Mar', receita: 20400, despesas:  9200, lucro: 11200 },
    { mes: 'Abr', receita: 23100, despesas: 10400, lucro: 12700 },
    { mes: 'Mai', receita: 22300, despesas: 10100, lucro: 12200 },
    { mes: 'Jun', receita: 25800, despesas: 11600, lucro: 14200 },
    { mes: 'Jul', receita: 24100, despesas: 10900, lucro: 13200 },
    { mes: 'Ago', receita: 27400, despesas: 12200, lucro: 15200 },
    { mes: 'Set', receita: 29600, despesas: 13100, lucro: 16500 },
    { mes: 'Out', receita: 32100, despesas: 14200, lucro: 17900 },
    { mes: 'Nov', receita: 38700, despesas: 16800, lucro: 21900 },
    { mes: 'Dez', receita: 44200, despesas: 19100, lucro: 25100 },
  ],
  2022: [
    { mes: 'Jan', receita: 12400, despesas:  5900, lucro:  6500 },
    { mes: 'Fev', receita: 10900, despesas:  5200, lucro:  5700 },
    { mes: 'Mar', receita: 14200, despesas:  6700, lucro:  7500 },
    { mes: 'Abr', receita: 16100, despesas:  7600, lucro:  8500 },
    { mes: 'Mai', receita: 15400, despesas:  7300, lucro:  8100 },
    { mes: 'Jun', receita: 17800, despesas:  8400, lucro:  9400 },
    { mes: 'Jul', receita: 16600, despesas:  7900, lucro:  8700 },
    { mes: 'Ago', receita: 19200, despesas:  9100, lucro: 10100 },
    { mes: 'Set', receita: 20800, despesas:  9800, lucro: 11000 },
    { mes: 'Out', receita: 22600, despesas: 10600, lucro: 12000 },
    { mes: 'Nov', receita: 27100, despesas: 12400, lucro: 14700 },
    { mes: 'Dez', receita: 31400, despesas: 14200, lucro: 17200 },
  ],
};

/**
 * Retorna o resumo mensal filtrado por ano e mês.
 * Se mesFiltro = 0, retorna todos os meses do ano.
 */
export function getMockMensal(ano: number, mes: number): EntradaMensal[] {
  const base = mockMensal[ano] ?? mockMensal[2025];
  if (mes === 0) return base;
  const entrada = base[mes - 1];
  return entrada ? [entrada] : [];
}

