export interface MonthlyEntry {
  month: string;
  revenue: number;
  expenses: number;
  profit: number;
}

export const mockMonthly: Record<number, MonthlyEntry[]> = {
  2026: [
    { month: 'Jan', revenue: 41200, expenses: 18400, profit: 22800 },
    { month: 'Fev', revenue: 38700, expenses: 16900, profit: 21800 },
    { month: 'Mar', revenue: 45600, expenses: 19200, profit: 26400 },
    { month: 'Abr', revenue: 50200, expenses: 21000, profit: 29200 },
  ],
  2025: [
    { month: 'Jan', revenue: 32100, expenses: 14500, profit: 17600 },
    { month: 'Fev', revenue: 28400, expenses: 12800, profit: 15600 },
    { month: 'Mar', revenue: 35600, expenses: 15200, profit: 20400 },
    { month: 'Abr', revenue: 40100, expenses: 17300, profit: 22800 },
    { month: 'Mai', revenue: 38900, expenses: 16900, profit: 22000 },
    { month: 'Jun', revenue: 42300, expenses: 18100, profit: 24200 },
    { month: 'Jul', revenue: 39700, expenses: 17200, profit: 22500 },
    { month: 'Ago', revenue: 44500, expenses: 19000, profit: 25500 },
    { month: 'Set', revenue: 47200, expenses: 20100, profit: 27100 },
    { month: 'Out', revenue: 51800, expenses: 22000, profit: 29800 },
    { month: 'Nov', revenue: 62400, expenses: 25900, profit: 36500 },
    { month: 'Dez', revenue: 70100, expenses: 29500, profit: 40600 },
  ],
  2024: [
    { month: 'Jan', revenue: 24300, expenses: 11200, profit: 13100 },
    { month: 'Fev', revenue: 21800, expenses:  9800, profit: 12000 },
    { month: 'Mar', revenue: 27500, expenses: 12100, profit: 15400 },
    { month: 'Abr', revenue: 30200, expenses: 13400, profit: 16800 },
    { month: 'Mai', revenue: 29100, expenses: 12900, profit: 16200 },
    { month: 'Jun', revenue: 33400, expenses: 14700, profit: 18700 },
    { month: 'Jul', revenue: 31200, expenses: 13800, profit: 17400 },
    { month: 'Ago', revenue: 35800, expenses: 15600, profit: 20200 },
    { month: 'Set', revenue: 38100, expenses: 16500, profit: 21600 },
    { month: 'Out', revenue: 41300, expenses: 17800, profit: 23500 },
    { month: 'Nov', revenue: 49600, expenses: 21200, profit: 28400 },
    { month: 'Dez', revenue: 56200, expenses: 24100, profit: 32100 },
  ],
  2023: [
    { month: 'Jan', revenue: 18600, expenses:  8700, profit:  9900 },
    { month: 'Fev', revenue: 16200, expenses:  7500, profit:  8700 },
    { month: 'Mar', revenue: 20400, expenses:  9200, profit: 11200 },
    { month: 'Abr', revenue: 23100, expenses: 10400, profit: 12700 },
    { month: 'Mai', revenue: 22300, expenses: 10100, profit: 12200 },
    { month: 'Jun', revenue: 25800, expenses: 11600, profit: 14200 },
    { month: 'Jul', revenue: 24100, expenses: 10900, profit: 13200 },
    { month: 'Ago', revenue: 27400, expenses: 12200, profit: 15200 },
    { month: 'Set', revenue: 29600, expenses: 13100, profit: 16500 },
    { month: 'Out', revenue: 32100, expenses: 14200, profit: 17900 },
    { month: 'Nov', revenue: 38700, expenses: 16800, profit: 21900 },
    { month: 'Dez', revenue: 44200, expenses: 19100, profit: 25100 },
  ],
  2022: [
    { month: 'Jan', revenue: 12400, expenses:  5900, profit:  6500 },
    { month: 'Fev', revenue: 10900, expenses:  5200, profit:  5700 },
    { month: 'Mar', revenue: 14200, expenses:  6700, profit:  7500 },
    { month: 'Abr', revenue: 16100, expenses:  7600, profit:  8500 },
    { month: 'Mai', revenue: 15400, expenses:  7300, profit:  8100 },
    { month: 'Jun', revenue: 17800, expenses:  8400, profit:  9400 },
    { month: 'Jul', revenue: 16600, expenses:  7900, profit:  8700 },
    { month: 'Ago', revenue: 19200, expenses:  9100, profit: 10100 },
    { month: 'Set', revenue: 20800, expenses:  9800, profit: 11000 },
    { month: 'Out', revenue: 22600, expenses: 10600, profit: 12000 },
    { month: 'Nov', revenue: 27100, expenses: 12400, profit: 14700 },
    { month: 'Dez', revenue: 31400, expenses: 14200, profit: 17200 },
  ],
};

export function getMockMonthly(year: number, month: number): MonthlyEntry[] {
  const data = mockMonthly[year] ?? mockMonthly[2025];
  if (month === 0) return data;
  const entry = data[month - 1];
  return entry ? [entry] : [];
}
