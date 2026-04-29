import type { Dimension } from './types';

export interface DimensionProportion {
  label: string;
  proportion: number;
}

export const mockDimensionProportions: Record<Dimension | 'canal_fixo', DimensionProportion[]> = {
  canal_fixo: [
    { label: 'Instagram',   proportion: 0.37 },
    { label: 'Shopee',      proportion: 0.28 },
    { label: 'Loja Física', proportion: 0.22 },
    { label: 'WhatsApp',    proportion: 0.13 },
  ],
  canal: [
    { label: 'Instagram',   proportion: 0.37 },
    { label: 'Shopee',      proportion: 0.28 },
    { label: 'Loja Física', proportion: 0.22 },
    { label: 'WhatsApp',    proportion: 0.13 },
  ],
  genero: [
    { label: 'Rock',      proportion: 0.42 },
    { label: 'Jazz',      proportion: 0.25 },
    { label: 'MPB',       proportion: 0.18 },
    { label: 'Blues',     proportion: 0.10 },
    { label: 'Clássico',  proportion: 0.05 },
  ],
  artista: [
    { label: 'Led Zeppelin',  proportion: 0.32 },
    { label: 'Miles Davis',   proportion: 0.24 },
    { label: 'Elis Regina',   proportion: 0.19 },
    { label: 'Pink Floyd',    proportion: 0.15 },
    { label: 'Chico Buarque', proportion: 0.10 },
  ],
  estado: [
    { label: 'SP', proportion: 0.44 },
    { label: 'RJ', proportion: 0.25 },
    { label: 'MG', proportion: 0.16 },
    { label: 'RS', proportion: 0.09 },
    { label: 'PR', proportion: 0.06 },
  ],
  pagamento: [
    { label: 'Cartão de Crédito', proportion: 0.42 },
    { label: 'PIX',               proportion: 0.33 },
    { label: 'Boleto',            proportion: 0.15 },
    { label: 'Dinheiro',          proportion: 0.10 },
  ],
};

export function scaleDimension(
  proportions: DimensionProportion[],
  totalRevenue: number,
): { label: string; total: number; percentual: number }[] {
  return proportions
    .map((p) => ({
      label:      p.label,
      total:      parseFloat((p.proportion * totalRevenue).toFixed(2)),
      percentual: Math.round(p.proportion * 100),
    }))
    .sort((a, b) => b.total - a.total);
}
