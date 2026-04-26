/**
 * Proporções de receita por dimensão de análise.
 *
 * Os valores são armazenados como PROPORÇÕES (0.0 – 1.0) para que o
 * gráfico de Análise de Receita sempre respeite o totalReceita do período,
 * independentemente do ano ou mês selecionado.
 *
 * Uso: multiplique `proporcao * totalReceita` para obter o valor absoluto.
 * Garantia: a soma das proporções de cada dimensão = 1.00 (100%).
 */

import type { Dimensao } from './types';

export interface DimensaoProporcao {
  label: string;
  /** Proporção da receita total (0.0 a 1.0). Soma = 1.00 por dimensão. */
  proporcao: number;
}

/** Proporções por dimensão de análise e canal fixo (Gráfico 1) */
export const mockDimensoesProporcoes: Record<Dimensao | 'canal_fixo', DimensaoProporcao[]> = {
  // ── Gráfico 1 — Canal de Venda (fixo, sempre visível) ─────────────────────
  canal_fixo: [
    { label: 'Instagram',   proporcao: 0.37 },
    { label: 'Shopee',      proporcao: 0.28 },
    { label: 'Loja Física', proporcao: 0.22 },
    { label: 'WhatsApp',    proporcao: 0.13 },
    // soma = 1.00
  ],

  // ── Gráfico 2 — Análise Dinâmica ──────────────────────────────────────────
  canal: [
    { label: 'Instagram',   proporcao: 0.37 },
    { label: 'Shopee',      proporcao: 0.28 },
    { label: 'Loja Física', proporcao: 0.22 },
    { label: 'WhatsApp',    proporcao: 0.13 },
    // soma = 1.00
  ],
  genero: [
    { label: 'Rock',      proporcao: 0.42 },
    { label: 'Jazz',      proporcao: 0.25 },
    { label: 'MPB',       proporcao: 0.18 },
    { label: 'Blues',     proporcao: 0.10 },
    { label: 'Clássico',  proporcao: 0.05 },
    // soma = 1.00
  ],
  artista: [
    { label: 'Led Zeppelin',  proporcao: 0.32 },
    { label: 'Miles Davis',   proporcao: 0.24 },
    { label: 'Elis Regina',   proporcao: 0.19 },
    { label: 'Pink Floyd',    proporcao: 0.15 },
    { label: 'Chico Buarque', proporcao: 0.10 },
    // soma = 1.00
  ],
  estado: [
    { label: 'SP', proporcao: 0.44 },
    { label: 'RJ', proporcao: 0.25 },
    { label: 'MG', proporcao: 0.16 },
    { label: 'RS', proporcao: 0.09 },
    { label: 'PR', proporcao: 0.06 },
    // soma = 1.00
  ],
  pagamento: [
    { label: 'Cartão de Crédito', proporcao: 0.42 },
    { label: 'PIX',               proporcao: 0.33 },
    { label: 'Boleto',            proporcao: 0.15 },
    { label: 'Dinheiro',          proporcao: 0.10 },
    // soma = 1.00
  ],
};

/**
 * Converte proporções em valores absolutos escalados pela receita total.
 * Garante que a soma dos valores = totalReceita (dentro do arredondamento).
 */
export function escalarDimensao(
  proporcoes: DimensaoProporcao[],
  totalReceita: number,
): { label: string; total: number; percentual: number }[] {
  return proporcoes
    .map((p) => ({
      label:      p.label,
      total:      parseFloat((p.proporcao * totalReceita).toFixed(2)),
      percentual: Math.round(p.proporcao * 100),
    }))
    .sort((a, b) => b.total - a.total);
}

